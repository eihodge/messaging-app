from config import db

# Database model represented as a python class
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # Max length of 80, cannot be null
    first_name = db.Column(db.String(80), unique=False, nullable=False)
    last_name = db.Column(db.String(80), unique=False, nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)

    # convert object to python dictionary to convert into json
    def to_json(self):
        return {
            "id": self.id,
            "firstName": self.first_name,
            "lastName": self.last_name,
            "email": self.email,
        }