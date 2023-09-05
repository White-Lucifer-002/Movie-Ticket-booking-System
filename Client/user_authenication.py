from flask import Flask, request, jsonify, render_template, redirect, session
from flask_cors import CORS, cross_origin
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
import json
import sys
import logging
from datetime import datetime 

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


app = Flask("Movie Booking", template_folder="Client/templates/", static_folder="Client/static/")
app.secret_key = '12345@RAM!'
cors = CORS(app)
bcrypt = Bcrypt(app)
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["REMEMBER_COOKIE_HTTPONLY "] = True

#creds for accessing mongo db
creds_file = open("Client/mongodb_creds.json")
credentials = json.load(creds_file)

user = credentials["user"]
password = credentials["password"]
db_name = "Movies_Ticketing_DB"
users_collection = connect_db(user, password, db_name, "users")
movies_collection = connect_db(user, password, db_name, "movies")


@app.route("/")
def homepage():
    return render_template("login.html")


@app.route("/register", methods=["GET","POST"])
def register():
    function = request.args.get("function")
    if function == "registerPage":
        return render_template("register.html")

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
        "lastLogin": "",
        "accountCreatedAt": datetime.now()
    }

    # Insert the user into the database
    users_collection.insert_one(new_user)

    return jsonify({"message": "User registered successfully", "code":201}), 201


@app.route("/login", methods=["GET","POST"])
# @cross_origin(origin='*')
def login():
    if "currentMovie" in session.keys():
        session.pop("currentMovie")

    # Get user data from the request
    function = request.args.get("function")
    if function == "loginPage":
        return render_template("login.html")

    data = request.get_json()
    email = data["email"]
    password = data["password"]

    # Find the user by email
    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"message": "User not found!! Please register..", "code":404})

    # Check the password
    if bcrypt.check_password_hash(user["password"], password):
        query = {"email": email}
        change = { "$set": {"lastLogin": datetime.now()}}
        users_collection.update_one(query, change)

        session["user_email"] = user["email"]
        return jsonify({"message": "Login successful", "code":200}), 200
    else:
        return jsonify({"message": "Invalid password", "code":401}), 401


@app.route("/login/movies", methods=["GET"])
def get_movies():
    if "currentMovie" in session.keys():
        session.pop("currentMovie")

    function = request.args.get("function")
    if function == "moviePage":
        return render_template("browsing_movies.html")

    movies = list(movies_collection.find({}, {"_id": 0}))
    return jsonify({"movies": movies, "user": session.get("user_email")})


@app.route("/login/movies/timeslot", methods=["GET", "POST"])
def get_timeslot():
    # Get user data from the request
    print("Session cookie:",session)
    function = request.args.get("function")
    if function == "timeslotPage":
        return render_template("timeslot.html")

    if request.method == "POST":
        data = request.get_json()
        session["currentMovie"] = data
        return data

    elif request.method == "GET":
        data = session.get("currentMovie")
        data["user"] = session.get("user_email")
        print("Selected movie data:",data)
        return data


@app.route("/logout", methods=["GET"])
def logout():
    session.pop('user_email', None)
    return render_template("login.html")


if __name__ == "__main__":
    app.run(debug=True, port=3000)
