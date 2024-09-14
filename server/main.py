from flask import Flask
from flask_cors import CORS
import os
from firebase_admin import credentials, initialize_app
current_dir = os.path.dirname(__file__)
key_path = os.path.join(current_dir, "key.json")
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = key_path
cred = credentials.Certificate(key_path)
default_app = initialize_app(cred)
from blueprints.users import users_blueprint
from blueprints.food_items import food_items_blueprint
from blueprints.goals import goals_blueprint
from blueprints.tracking_records import tracking_records_blueprint


# The Flask app object is created here.
app = Flask(__name__)
# All the blueprints are registered here.
app.register_blueprint(users_blueprint, url_prefix="/users")
app.register_blueprint(food_items_blueprint, url_prefix="/food-items")
app.register_blueprint(goals_blueprint, url_prefix="/goals")
app.register_blueprint(tracking_records_blueprint, url_prefix="/tracking-records")
app.app_context().push()
 
"""
Header Details are updated here.
:return: The updated request header is returned.
"""
@app.after_request
def add_header(r):
    r.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    r.headers["X-Frame-Options"] = "SAMEORIGIN"
    if r.headers.get('Content-Type', '') == 'application/json': 
        r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    return r

@app.route("/hello", methods=["GET"])
def hello():
    return "HELLO" 
    
if __name__ == '__main__':
    CORS(app)
    app.run(debug=True)