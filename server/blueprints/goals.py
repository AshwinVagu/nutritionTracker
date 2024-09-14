from flask import Blueprint, jsonify, request
from firebase_admin import firestore
from interceptor import authorize_user

goals_blueprint = Blueprint("goals", __name__)
db = firestore.client()


"""
    Retrieves a particular users goals.
    :param id: The unique user ID.
    :return: Returns all the user's goals.
"""
@goals_blueprint.route("/get-goals/<string:user_id>", methods=["GET"])
@authorize_user
def get_goals(user_id):
    try:
        docs = db.collection('Goal').where('user_id',"==",user_id).stream()
        goals = []
        # Transforming each object to dict individually and adding their ID.
        for doc in docs:
            temp_doc = doc.to_dict()
            temp_doc["id"] = doc.id
            goals.append(temp_doc)
        return goals, 201
    except Exception as error_message:
        return jsonify({"message":error_message}),500  


"""
    Adds a goal.
    :return: Returns a success message upon goal addition.
"""
@goals_blueprint.route("/add-goal", methods=["POST"])
@authorize_user
def add_goal():
    try:
        payload = request.get_json()
        goal = {
            'calorie_count': payload['calorie_count'],
            'start_date': payload['start_date'],
            'end_date': payload['end_date'],
            'user_id': payload['user_id']
        }
        db.collection('Goal').add(goal)
        return jsonify({"message":"Goal added successfully."}), 201
    except Exception as error_message:
        return jsonify({"message":error_message}),500  
    
"""
    Updates a goal.
    :return: Returns a success message upon goal updation.
"""
@goals_blueprint.route("/update-goal", methods=["PUT"])
@authorize_user
def update_goal():
    try:
        payload = request.get_json()
        goal = {
            'calorie_count': payload['calorie_count'],
            'start_date': payload['start_date'],
            'end_date': payload['end_date'],
            'user_id': payload['user_id']
        }
        db.collection('Goal').document(payload['id']).update(goal)
        return jsonify({"message":"Goal updated successfully."}), 201
    except Exception as error_message:
        return jsonify({"message":error_message}),500      
    
"""
    Deletes a particular goal.
    :param id: The unique record ID.
    :return: Returns a success message upon goal deletion.
"""
@goals_blueprint.route("/delete-goal/<string:goal_id>", methods=["DELETE"])
@authorize_user
def delete_goal(goal_id):
    try:
        db.collection('Goal').document(goal_id).delete()
        return jsonify({"message":"Goal deleted successfully."}), 201
    except Exception as error_message:
        return jsonify({"message":error_message}),500        
    
 