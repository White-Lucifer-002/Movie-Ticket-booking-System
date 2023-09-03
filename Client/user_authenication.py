from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
import json

app = Flask(__name__)
bcrypt = Bcrypt(app)

# MongoDB configuration

#creds for accessing mongo db
creds_file = "./mongodb_creds.json"
credentials = json.load(creds_file)

user = credentials["user"]
password = credentials["password"]
db_name = "Movies_Ticketing_DB"

#connecting to mongodb
uri = f"mongodb+srv://{user}:{password}@cluster0.zzuht.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri)  
db = client[db_name] 
users_collection = db["users"]


@app.route("/register", methods=["POST"])
def register():
    # Get user data from the request
    data = request.get_json()
    email = data["email"]
    password = data["password"]

    # Check if the user already exists
    if users_collection.find_one({"email": email}):
        return jsonify({"message": "User already exists"}), 400

    # Hash the password before storing it
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    # Create a new user document
    new_user = {
        "email": email,
        "password": hashed_password,
    }

    # Insert the user into the database
    users_collection.insert_one(new_user)

    return jsonify({"message": "User registered successfully"}), 201


@app.route("/login", methods=["POST"])
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
        return jsonify({"message": "Login successful", "error_code":200}), 200
    else:
        return jsonify({"message": "Invalid password", "error_code":401}), 401


if __name__ == "__main__":
    app.run(debug=True)
