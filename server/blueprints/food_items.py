from flask import Blueprint, jsonify, request
from math import isnan
import json
import time
from firebase_admin import firestore
from interceptor import authorize_user

food_items_blueprint = Blueprint("food_items", __name__)
db = firestore.client()


"""
    Retrieves food items based on search string.
    :param id: The search string typed by the user.
    :return: Returns list of food items that match.
"""
@food_items_blueprint.route("/get-food-data/<string:search_string>", methods=["GET"])
@authorize_user
def get_food_data(search_string):
    try:
        search_string = search_string.capitalize()
        # Searching for any occurrence of search_string within the 'name' field
        docs = db.collection('Food_item').where('name', '>=', search_string).where('name', '<=', search_string + '\uf8ff').stream()
        food_items = []
        for doc in docs:
            temp_doc = doc.to_dict()
            temp_doc["id"] = doc.id
            for key, value in temp_doc.items():
                if isinstance(value, float) and isnan(value):
                    temp_doc[key] = None
            food_items.append(temp_doc)
        
        json_data = json.dumps(food_items)
        return json_data, 201
    except Exception as error_message:
        return jsonify({"message": error_message}), 500


"""
    Used to call the service for food uploading via an ETL process.
"""
@food_items_blueprint.route("/etl-data-upload", methods=["POST"])
@authorize_user
def etl_data_upload():
    try:
        """
        Reads a CSV file containing nutrition data, preprocesses it, and uploads it to a Firestore collection.

        Returns:
            dict: A dictionary containing a message indicating the status of the upload.
        """
        
        if 'etlFile' not in request.files:
            print('No file part')
            return 'No file part', 400

        file = request.files['etlFile']
        if file.filename == '':
            print('No file selected')
            return 'No selected file', 400

        if file:
            bucket_name = "wellnedsswise-csvs"
            source_file_name = file.filename 
            destination_blob_name = file.filename  + "_" + str(time.time())

            return upload_blob(bucket_name, source_file_name, destination_blob_name, file)
    except Exception as error_message:
        return jsonify({"message":error_message}),500      
    
from google.cloud import storage

def upload_blob(bucket_name, source_file_name, destination_blob_name, file):
    """Uploads a file to the bucket."""
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_string(
            file.read(), 
            content_type=file.content_type
        )

    print(f"File {source_file_name} uploaded to {destination_blob_name}.")
    return 'File uploaded successfully', 201