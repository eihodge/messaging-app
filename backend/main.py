from flask import request, jsonify
from config import app, db
from models import User, Message, Conversation
from datetime import datetime, timezone

# USER ENDPOINTS

# Get all users
@app.route("/users", methods=["GET"])
def get_users():
    users = User.query.all() # list of all the different users as python objects
    json_users = list(map(lambda x: x.to_json(), users)) # maps python objects to list of json objects
    return jsonify({"users": json_users})

# Create a user
@app.route("/create_user", methods=["POST"])
def create_user():
    username = request.json.get("username")
    password = request.json.get("password")
    if not username or not password:  # return 400 if missing a field
        return jsonify({"message": "Failed to create user. A unique username and a password are required."}), 400
    new_user = User(
        username=username, 
        password=password
    )
    try:
        db.session.add(new_user)  # Add to DB session
        db.session.commit()       # Write anything in the session to DB
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    return jsonify({"message": "New user successfully created"}), 201

# Update a user with user_id (No longer in use)
# @app.route("/update_user/<int:user_id>", methods=["PATCH"])
# def update_user(user_id):
#     user = User.query.get(user_id)  # Find the user with the user_id
#     # Check if the user exists
#     if not user:
#         return jsonify({"message": "User not found"}), 404  
#     data = request.json
#     # If there is no username in data, keep the preexisting value for user.username
#     user.username = data.get("username", user.username)
#     user.password = data.get("password", user.password)
#     user.email = data.get("email", user.email)
#     db.session.commit()
#     return jsonify({"message": "User updated successfully."}), 200

# Deleting a user with user_id
@app.route("/delete_user/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get(user_id)  # Find the user with the user_id
    if not user: # Check if the user exists
        return jsonify({"message": "User not found."}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted."}), 200
    
# Get a user by their username
@app.route("/user/<string:username>", methods=["GET"])
def get_user_by_username(username):
    user = User.query.filter_by(username=username).first()  # database query by username
    if not user:   # Return 404 if the user does not exist
        return jsonify({"message": "User not found"}), 404
    return jsonify(user.to_json()), 200   # Return the user as JSON


# CONVERSATION ENDPOINTS

# Create a new conversation
@app.route("/create_conversation", methods=["POST"])
def create_conversation():
    user1_id = request.json.get("user1_id")
    user2_id = request.json.get("user2_id")

    if not user1_id or not user2_id:
        return jsonify({"message": "user1_id and user2_id are required to create a conversation."}), 400

    # Check if users exist
    user1 = User.query.get(user1_id)
    user2 = User.query.get(user2_id)

    if not user1 or not user2:
        return jsonify({"message": "One or both users do not exist."}), 404

    # Check if the conversation already exists
    conversation = Conversation.query.filter(
        ((Conversation.user1_id == user1_id) & (Conversation.user2_id == user2_id)) |
        ((Conversation.user1_id == user2_id) & (Conversation.user2_id == user1_id))
    ).first()

    if conversation:
        return jsonify({"message": "Conversation already exists.", "conversation_id": conversation.id}), 200

    # Create a new conversation
    new_conversation = Conversation(user1_id=user1_id, user2_id=user2_id)
    try:
        db.session.add(new_conversation)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    return jsonify({"message": "New conversation created successfully", "conversation": new_conversation.to_json()}), 201


# Get all conversations involving a specific user
@app.route("/conversations/<int:user_id>", methods=["GET"])
def get_conversations_by_user(user_id):
    # Query conversations involving the user as user1 or user2
    conversations = Conversation.query.filter(
        (Conversation.user1_id == user_id) | (Conversation.user2_id == user_id)
    ).all()

    json_conversations = [conversation.to_json() for conversation in conversations]
    return jsonify({"conversations": json_conversations}), 200


# MESSAGES ENDPOINTS

# Get all messages for a specific conversation
@app.route("/messages/<int:conversation_id>", methods=["GET"])
def get_messages_by_conversation(conversation_id):
    messages = Message.query.filter_by(conversation_id=conversation_id).order_by(Message.timestamp).all()
    messages_json = [message.to_json() for message in messages]
    return jsonify({"messages": messages_json}), 200

@app.route("/send_message", methods=["POST"])
def send_message():
    sender_id = request.json.get("sender_id")
    receiver_id = request.json.get("receiver_id")
    content = request.json.get("content")
    conversation_id = request.json.get("conversation_id")
    timestamp = datetime.now(timezone.utc)

    if not sender_id or not receiver_id or not content or not conversation_id:
        return jsonify({"message": "Sender ID, receiver ID, conversation ID, and content are required to send a message."}), 400

    # Check if conversation exists
    conversation = Conversation.query.get(conversation_id)
    if not conversation:
        return jsonify({"message": "Conversation not found."}), 404

    # Ensure that the sender and receiver are part of the conversation
    if sender_id not in [conversation.user1_id, conversation.user2_id] or receiver_id not in [conversation.user1_id, conversation.user2_id]:
        return jsonify({"message": "Sender and receiver must be part of the conversation."}), 400

    # Create a new message
    new_message = Message(sender_id=sender_id, receiver_id=receiver_id, content=content, conversation_id=conversation_id, timestamp=timestamp)

    try:
        db.session.add(new_message)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 500

    return jsonify({"message": "Message sent successfully", "message_data": new_message.to_json()}), 201



if __name__ == "__main__":
    with app.app_context():  # get context of application
        db.create_all()      # create all models defined in db
    app.run(debug=True)
