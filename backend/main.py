from flask import request, jsonify
from config import app, db
from models import Contact

# Get all contacts
@app.route("/contacts", methods=["GET"])
def get_contacts():
    # list of all the different contacts as python objects
    contacts = Contact.query.all()
    # maps python objects to list of json objects
    json_contacts = list(map(lambda x: x.to_json(), contacts))
    return jsonify({"contacts": json_contacts})

# Create a contact
@app.route("/create_contact", methods=["POST"])
def create_contact():
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")
    email = request.json.get("email")

    # return 400 if missing a field
    if not first_name or not last_name or not email:
        return jsonify({"message": "Failed to create user. A first name, last name and email are required."}), 400

    # Create a new contact
    new_contact = Contact(
        first_name=first_name, 
        last_name=last_name, 
        email=email
    )
    try:
        db.session.add(new_contact)  # Add to DB session
        db.session.commit()          # Write anything in the session to DB
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    return jsonify({"message": "New user successfully created"}), 201

# Update a contact with user_id
@app.route("/update_contact/<int:user_id>", methods=["PATCH"])
def update_contact(user_id):
    contact = Contact.query.get(user_id)  # Find the user with the user_id

    # Check if the user exists
    if not contact:
        return jsonify({"message": "User not found"}), 404
    
    data = request.json
    # If there is no firstName in data, keep the preexisting value for contact.first_name
    contact.first_name = data.get("firstName", contact.first_name)
    contact.last_name = data.get("lastName", contact.last_name)
    contact.email = data.get("email", contact.email)

    db.session.commit()
    return jsonify({"message": "User updated successfully."}), 200

# Deleting a contact with user_id
@app.route("/delete_contact/<int:user_id>", methods=["DELETE"])
def delete_contact(user_id):
    contact = Contact.query.get(user_id)  # Find the user with the user_id

    # Check if the user exists
    if not contact:
        return jsonify({"message": "User not found."}), 404
    
    db.session.delete(contact)
    db.session.commit()
    return jsonify({"message": "User deleted."}), 200
    
if __name__ == "__main__":
    with app.app_context():  # get context of application
        db.create_all()      # create all models defined in db
    app.run(debug=True)
