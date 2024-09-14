from flask import Blueprint, jsonify, request
from firebase_admin import firestore
from interceptor import authorize_user

tracking_records_blueprint = Blueprint("tracking_records", __name__)
db = firestore.client()

"""
    Retrieves a particular users tracking records.
    :param id: The unique user ID.
    :return: Returns all the user's tracking records
"""
@tracking_records_blueprint.route("/get-tracking-records/<string:user_id>", methods=["GET"])
@authorize_user
def get_tracking_records(user_id):
    try:
        docs = db.collection('Food_tracked_record').where('user_id',"==",user_id).stream()
        food_tracking_records = []
        # Transforming each object to dict individually and adding their ID.
        for doc in docs:
            temp_doc = doc.to_dict()
            temp_doc["id"] = doc.id
            food_tracking_records.append(temp_doc)
        return food_tracking_records, 201
    except Exception as error_message:
        return jsonify({"message":error_message}),500  


"""
    Adds a tracking record.
    :return: Returns a success message upon tracking record addition.
"""
@tracking_records_blueprint.route("/add-tracking-record", methods=["POST"])
@authorize_user
def add_tracking_record():
    try:
        payload = request.get_json()
        tracking_record = {
            'consumed_calories': payload['consumed_calories'],
            'consumption_time': payload['consumption_time'],
            'food_item_id': payload['food_item_id'],
            'food_item_name': payload['food_item_name'],
            'quantity_in_grams': payload['quantity_in_grams'],
            'user_id': payload['user_id']
        }
        db.collection('Food_tracked_record').add(tracking_record)
        return jsonify({"message":"Tracking record added successfully."}), 201
    except Exception as error_message:
        return jsonify({"message":error_message}),500  


"""
    Updates a tracking record.
    :return: Returns a success message upon tracking record updation.
"""
@tracking_records_blueprint.route("/update-tracking-record", methods=["PUT"])
@authorize_user
def update_tracking_record():
    try:
        payload = request.get_json()
        tracking_record = {
            'consumed_calories': payload['consumed_calories'],
            'consumption_time': payload['consumption_time'],
            'food_item_id': payload['food_item_id'],
            'food_item_name': payload['food_item_name'],
            'quantity_in_grams': payload['quantity_in_grams'],
            'user_id': payload['user_id']
        }
        db.collection('Food_tracked_record').document(payload['id']).update(tracking_record)
        return jsonify({"message":"Tracking record updated successfully."}), 201
    except Exception as error_message:
        return jsonify({"message":error_message}),500   


"""
    Deletes a particular tracking record.
    :param id: The unique record ID.
    :return: Returns a success message upon tracking record deletion.
"""
@tracking_records_blueprint.route("/delete-tracking-record/<string:record_id>", methods=["DELETE"])
@authorize_user
def delete_tracking_record(record_id):
    try:
        db.collection('Food_tracked_record').document(record_id).delete()
        return jsonify({"message":"Tracking record deleted successfully."}), 201
    except Exception as error_message:
        return jsonify({"message":error_message}),500          
    
 