import apache_beam as beam
from apache_beam.options.pipeline_options import PipelineOptions
import firebase_admin
# from firebase_admin import firestore


# Initialize the Firebase Admin SDK
firebase_admin.initialize_app()

class UploadToFirestore(beam.DoFn):
    """
    A Beam DoFn to upload a batch of records to Firestore and publish a message.
    """
    def start_bundle(self):
        from google.cloud import firestore
        self.db = firestore.Client()
        
    def publish_message(self):
        """
        Publishes a message to Pub/Sub after processing the CSV.
        """
        from google.cloud import pubsub_v1
        publisher = pubsub_v1.PublisherClient()
        topic_name = 'projects/acs560-wellness-wise/topics/csv-upload'
        publisher.publish(topic_name, b'Nutrition CSV uploaded', spam='eggs')
        
    def process(self, batch):
        food_items_ref = self.db.collection('Food_item')
        for element in batch:
            print('In uploading food data', element.get('name'))
            if not food_items_ref.where('name', '==', element.get('name')).get():
                food_items_ref.add(element)
                print('Uploading food')
        
        # Publish a message to Pub/Sub
        self.publish_message()


    
class RuntimeOptions(PipelineOptions):
    @classmethod
    def _add_argparse_args(cls, parser):
        parser.add_value_provider_argument(
            '--input_file',
            type=str,
        help='Path to the input file to process')
        
def run():
    options = PipelineOptions(
        runner='DataflowRunner',
        project='acs560-wellness-wise',
        region='us-east1',
        temp_location='gs://wellness-wise-temp/temp',
        template_location='gs://wellness-wise-temp/templates/csv_processor_v2',
        staging_location='gs://wellness-wise-temp/staging',
        requirements_file='server/requirements.txt'
    )
    column_names = ["name", "serving_size", "calories", "total_fat", "saturated_fat", "cholesterol", "sodium", "choline",
    "folate", "folic_acid", "niacin", "pantothenic_acid", "riboflavin", "thiamin", "vitamin_a", "vitamin_a_rae",
    "carotene_alpha", "carotene_beta", "cryptoxanthin_beta", "lutein_zeaxanthin", "lucopene", "vitamin_b12",
    "vitamin_b6", "vitamin_c", "vitamin_d", "vitamin_e", "tocopherol_alpha", "vitamin_k", "calcium", "copper",
    "irom", "magnesium", "manganese", "phosphorous", "potassium", "selenium", "zink", "protein", "alanine",
    "arginine", "aspartic_acid", "cystine", "glutamic_acid", "glycine", "histidine", "hydroxyproline", "isoleucine",
    "leucine", "lysine", "methionine", "phenylalanine", "proline", "serine", "threonine", "tryptophan", "tyrosine",
    "valine", "carbohydrate", "fiber", "sugars", "fructose", "galactose", "glucose", "lactose", "maltose", "sucrose",
    "fat", "saturated_fatty_acids", "monounsaturated_fatty_acids", "polyunsaturated_fatty_acids",
    "fatty_acids_total_trans", "alcohol", "ash", "caffeine", "theobromine", "water"]
    runtime_options = options.view_as(RuntimeOptions)
    with beam.Pipeline(options=runtime_options) as pipeline:
        # Read the entire CSV file into a PCollection of dictionaries
        file_path = runtime_options.input_file
        csv_dicts = (pipeline
                     | 'Read CSV File' >> beam.io.ReadFromText(file_path)
                     | 'Convert to Dict' >> beam.Map(lambda line: dict(zip(column_names, line.split(',')))))

        # Batch the records to upload to Firestore in a single call
        batches = (csv_dicts
                   | 'Batch Elements' >> beam.BatchElements(min_batch_size=500, max_batch_size=1000))

        # Upload each batch to Firestore
        batches | 'Upload to Firestore' >> beam.ParDo(UploadToFirestore())


if __name__ == '__main__':
    run()
