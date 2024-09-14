import time
import json

import functions_framework

# Triggered by a change in a storage bucket
@functions_framework.cloud_event
def hello_gcs(cloud_event):
	from googleapiclient.discovery import build
	data = cloud_event.data

	bucket = data["bucket"]
	name = data["name"]

	print(f"Bucket: {bucket}")
	print(f"File: {name}")

	project = "acs560-wellness-wise"
	job = project + " " + str(time.time())
 
	#path of the dataflow template on google storage bucket
	template = "gs://wellness-wise-temp/templates/csv_processor_v2"


	# Define parameters for the Dataflow template
	job_parameters = {
		'input_file': f'gs://'+bucket+'/'+name
	}
	#tempLocation is the path on GCS to store temp files generated during the dataflow job
	environment = {'tempLocation': 'gs://wellness-wise-temp/temp/'}

	service = build('dataflow', 'v1b3', cache_discovery=False)
	#below API is used when we want to pass the location of the dataflow job
	request = service.projects().locations().templates().launch(
		projectId=project,
		gcsPath=template,
		location='us-east1',
		body={
			'jobName': job,
			'environment':environment,
            'parameters': job_parameters
		},
	)
	response = request.execute()
	print(str(response))
	return json.dumps({"message": "Function executed successfully"}), 200



