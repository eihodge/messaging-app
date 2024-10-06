from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)

# CORS settings to allow requests from other origins
CORS(app)
#CORS(app, resources={r"/*": {"origins": "*"}})



# Configure the database URI and other settings
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydatabase.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

app.config['CORS_HEADERS'] = 'Content-Type'
app.config['DEBUG'] = True
app.config['ENV'] = 'development'


# Initialize SQLAlchemy with the Flask app
db = SQLAlchemy(app)

