from flask import Flask, request, jsonify, render_template, redirect
from flask_cors import CORS, cross_origin
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
import json
import sys
import logging

def connect_db(user, password, db_name, collection_name):
    #connecting to mongodb
    uri = f"mongodb+srv://{user}:{password}@cluster0.zzuht.mongodb.net/?retryWrites=true&w=majority"

    try:
        client = MongoClient(uri)  
        client.admin.command('ping')
        print("Successfully connected to MongoDB")
    except:
        print("Error in connecting to MongoDB..")
        sys.exit()

    db = client[db_name] 
    collection = db[collection_name]
    return collection


app = Flask(__name__, template_folder="Interface/templates")
cors = CORS(app)
bcrypt = Bcrypt(app)
logger = logging

#creds for accessing mongo db
creds_file = open("Client/mongodb_creds.json")
credentials = json.load(creds_file)

user = credentials["user"]
password = credentials["password"]
db_name = "Movies_Ticketing_DB"
users_collection = connect_db(user, password, db_name, "users")
movies_collection = connect_db(user, password, db_name, "movies")


@app.route("/register", methods=["POST"])
def register():
    # Get user data from the request
    data = request.get_json()
    email = data["email"]
    password = data["password"]
    name = data["name"]

    # Check if the user already exists
    if users_collection.find_one({"email": email}):
        return jsonify({"message": "User already exists"}), 400

    # Hash the password before storing it
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    # Create a new user document
    new_user = {
        "email": email,
        "password": hashed_password,
        "in_session": False
    }

    # Insert the user into the database
    users_collection.insert_one(new_user)

    return jsonify({"message": "User registered successfully", "code":201}), 201


@app.route("/login", methods=["POST"])
# @cross_origin(origin='*')
def login():
    # Get user data from the request
    data = request.get_json()
    email = data["email"]
    password = data["password"]

    # Find the user by email
    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"message": "User not found", "error_code":404})

    # Check the password
    if bcrypt.check_password_hash(user["password"], password):
        query = {"email": email}
        change = { "$set": {"in_session": True}}
        users_collection.update_one(query, change)
        logger.debug("Login successful")
        return jsonify({"message": "Login successful", "error_code":200}), 200
    else:
        return jsonify({"message": "Invalid password", "error_code":401}), 401


@app.route("/login/movies", methods=["GET"])
def get_movies():
    # Get user data from the request
    data = request.get_json()
    email = data["email"]
    user = users_collection.find_one({"email": email})

    if user and user["in_session"]:
        # Retrieve movies from the database
        movies = list(movies_collection.find({}, {"_id": 0}))
        return jsonify({"movies": movies})
    else:
        return redirect("login.html")



if __name__ == "__main__":
    app.run(debug=True, use_reloader=False, port=3000)
