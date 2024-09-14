from flask import Blueprint, jsonify, request
from firebase_admin import firestore
from interceptor import authorize_user

users_blueprint = Blueprint("users", __name__)
db = firestore.client()

"""
    Retrieves a particular users details.
    :param id: The unique user ID.
    :return: Returns all the user specific details
"""
@users_blueprint.route("/get-user/<string:id>", methods=["GET"])
@authorize_user
def get_user(id):
    try:
        user_ref = db.collection('User').document(id)
        user = user_ref.get().to_dict()
        user['id'] = id
        return user
    except Exception as error_message:
        return jsonify({"message":error_message}),500
    
"""
    Retrieves a particular users details based on email id.
    :param id: The unique user email.
    :return: Returns all the user specific details
"""
@users_blueprint.route("/get-user-from-email/<string:email>", methods=["GET"])
@authorize_user
def get_user_from_email(email):
    try:
        docs = db.collection('User').where('email',"==",email).stream()
        user = []
        for doc in docs:
            temp_doc = doc.to_dict()
            temp_doc["id"] = doc.id
            user.append(temp_doc)
        return user,201
    except Exception as error_message:
        return jsonify({"message":error_message}),500
    
"""
    Adds a user upon registraion
    :return: Returns a success message on user addition.
"""
@users_blueprint.route("/add-user", methods=["POST"])
@authorize_user
def add_user():
    try:
        payload = request.get_json()
        user = {
            'first_name': payload['first_name'],
            'last_name': payload['last_name'],
            'email': payload['email'],
            'phone': payload['phone'],
            'is_admin': payload['is_admin'],
            'height': payload['height'],
            'weight': payload['weight']
        }
        db.collection('User').add(user)
        return jsonify({"message":"User added successfully."}), 201
    except Exception as error_message:
        return jsonify({"message":error_message}),500  

"""
    Updates a user's details.
    :return: Returns a success message on user detail updation.
"""
@users_blueprint.route("/update-user", methods=["PUT"])
@authorize_user
def update_user():
    try:
        payload = request.get_json()
        user = {
            'first_name': payload['first_name'],
            'last_name': payload['last_name'],
            'email': payload['email'],
            'phone': payload['phone'],
            'is_admin': payload['is_admin'],
            'height': payload['height'],
            'weight': payload['weight']
        }
        db.collection('User').document(payload['id']).update(user)
        return jsonify({"message":"User updated successfully."}), 201
    except Exception as error_message:
        return jsonify({"message":error_message}),500     

                   


