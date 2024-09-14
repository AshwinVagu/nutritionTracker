from functools import wraps
from flask import abort,request
from firebase_admin import firestore
from firebase_admin import auth

db = firestore.client()

"""
A method that checks if requests coming from to access API's are authenticated via the google authentication token.
This method is used as a decorator for the API methods.
"""
def authorize_user(f):
    @wraps(f)
    def decorated_function(*args, **kws):
            if not 'Authorization' in request.headers:
                print("No header Authorization")
                abort(401)
            data = request.headers['Authorization']
            authToken = str(data)
            try:
                auth.verify_id_token(authToken)
            except Exception as identifier:
                print(identifier)
                abort(401)

            return f(*args, **kws)            
    return decorated_function