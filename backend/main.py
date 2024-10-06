from flask import request, jsonify
from config import app, db
from models import User, Message
from datetime import datetime, timezone


# Get all users
@app.route("/users", methods=["GET"])
def get_users():
    # list of all the different users as python objects
    users = User.query.all()
    # maps python objects to list of json objects
    json_users = list(map(lambda x: x.to_json(), users))
    return jsonify({"users": json_users})

# Create a user
@app.route("/create_user", methods=["POST"])
def create_user():
    username = request.json.get("username")
    password = request.json.get("password")

    # return 400 if missing a field
    if not username or not password:
        return jsonify({"message": "Failed to create user. A unique username and a password are required."}), 400

    # Create a new user
    new_user = User(
        username=username, 
        password=password
    )
    try:
        db.session.add(new_user)  # Add to DB session
        db.session.commit()          # Write anything in the session to DB
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    return jsonify({"message": "New user successfully created"}), 201

# Update a user with user_id
@app.route("/update_user/<int:user_id>", methods=["PATCH"])
def update_user(user_id):
    user = User.query.get(user_id)  # Find the user with the user_id

    # Check if the user exists
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    data = request.json
    # If there is no username in data, keep the preexisting value for user.username
    user.username = data.get("username", user.username)
    user.password = data.get("password", user.password)
    user.email = data.get("email", user.email)

    db.session.commit()
    return jsonify({"message": "User updated successfully."}), 200

# Deleting a user with user_id
@app.route("/delete_user/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get(user_id)  # Find the user with the user_id

    # Check if the user exists
    if not user:
        return jsonify({"message": "User not found."}), 404
    
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted."}), 200
    
# Get a user by their username
@app.route("/user/<string:username>", methods=["GET"])
def get_user_by_username(username):
    # Query the database for a user with the given username
    user = User.query.filter_by(username=username).first()

    # Check if the user exists
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Return the user as JSON
    return jsonify(user.to_json()), 200


# MESSAGES ENDPOINTS BELOW



# # Get all messages between two users
# @app.route("/get_all_messages/<int:sender_id>/<int:receiver_id>", methods=["GET"])
# def get_all_messages(sender_id, receiver_id):
#     messages = Message.query.filter(
#         ((Message.sender_id == sender_id) & (Message.receiver_id == receiver_id)) |
#         ((Message.sender_id == receiver_id) & (Message.receiver_id == sender_id))
#     ).order_by(Message.timestamp).all()
    
#     return jsonify(), 200


# Get all messages between two users
@app.route("/get_all_messages/<int:sender_id>/<int:receiver_id>", methods=["GET"])
def get_all_messages(sender_id, receiver_id):
    messages = Message.query.filter(
        ((Message.sender_id == sender_id) & (Message.receiver_id == receiver_id)) |
        ((Message.sender_id == receiver_id) & (Message.receiver_id == sender_id))
    ).order_by(Message.timestamp).all()
    
    # Serialize messages to JSON format
    messages_json = [message.to_json() for message in messages]
    
    return jsonify(messages_json), 200




# Send a message
@app.route("/send_message", methods=["POST"])
def send_message():
    sender_id = request.json.get("sender_id")
    receiver_id = request.json.get("receiver_id")
    content = request.json.get("content")
    timestamp=datetime.now(timezone.utc)

    if not sender_id or not receiver_id or not content:
        return jsonify({"message": "Sender ID, receiver ID and message content required for request to be processed"}), 400

    # Create a new message
    message = Message(
        sender_id=sender_id, 
        receiver_id=receiver_id, 
        content=content, 
        timestamp=timestamp
    )

    db.session.add(message)
    db.session.commit()
    return jsonify({"message": "Message sent successfully"}), 201




    # messages = Message.query.filter(
    #     ((Message.sender_id == sender_id) & (Message.receiver_id == receiver_id)) |
    #     ((Message.sender_id == receiver_id) & (Message.receiver_id == sender_id))
    # ).order_by(Message.timestamp).all()

    # return jsonify([message.to_json() for message in messages]), 200













if __name__ == "__main__":
    with app.app_context():  # get context of application
        db.create_all()      # create all models defined in db
    app.run(debug=True)
