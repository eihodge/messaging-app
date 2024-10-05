from config import db

# Database model represented as a python class
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # Max length of 80, cannot be null
    username = db.Column(db.String(80), unique=False, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)

    # convert object to python dictionary to convert into json
    def to_json(self):
        return {
            "id": self.id,
            "username": self.username,
            "password": self.password,
        }