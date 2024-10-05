from flask import request, jsonify
from config import app, db
from models import User

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
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")
    email = request.json.get("email")

    # return 400 if missing a field
    if not first_name or not last_name or not email:
        return jsonify({"message": "Failed to create user. A first name, last name and email are required."}), 400

    # Create a new user
    new_user = User(
        first_name=first_name, 
        last_name=last_name, 
        email=email
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
    # If there is no firstName in data, keep the preexisting value for user.first_name
    user.first_name = data.get("firstName", user.first_name)
    user.last_name = data.get("lastName", user.last_name)
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
    
if __name__ == "__main__":
    with app.app_context():  # get context of application
        db.create_all()      # create all models defined in db
    app.run(debug=True)
