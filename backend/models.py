from config import db
from datetime import datetime, timezone

# Database model for User
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
    
# Database model for Message
class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    # Foreign keys reference the User table
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "content": self.content,
            "timestamp": self.timestamp.isoformat(),
            "sender_id": self.sender_id,
            "receiver_id": self.receiver_id,
        }