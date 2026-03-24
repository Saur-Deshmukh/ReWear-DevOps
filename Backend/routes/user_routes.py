from flask import Blueprint, request, jsonify
from utils.auth import verify_firebase_token
from db.collections import users
from datetime import datetime

user_bp = Blueprint("user", __name__)

@user_bp.route("/me", methods=["POST"])
@verify_firebase_token
def get_or_create_user():
    uid = request.user["uid"]
    email = request.user.get("email", "")
    name = request.json.get("name", "")

    # Check if user exists in MongoDB
    user = users.find_one({"uid": uid})

    if not user:
        # Create new user
        user_data = {
            "uid": uid,
            "email": email,
            "name": name,
            "points": 0,
            "role": "user",
            "createdAt": datetime.utcnow(),
            "stats": {
                "itemsUploaded": 0,
                "swapsCompleted": 0
            }
        }
        users.insert_one(user_data)
        user = user_data

    # Convert _id to string if exists
    user["_id"] = str(user["_id"])
    return jsonify(user), 200



@user_bp.route("/info", methods=["POST"])
def get_user_info_by_uid():
    data = request.get_json()
    uid = data.get("uid")

    if not uid:
        return jsonify({"error": "UID is required in body"}), 400

    user = users.find_one({"uid": uid}, {
        "_id": 0,
        "name": 1,
        "points": 1,
        "createdAt": 1,
        "email": 1
    })

    if not user:
        return jsonify({"error": "User not found"}), 404

    created_at = user.get("createdAt")
    if isinstance(created_at, datetime):
        user["createdAt"] = created_at.strftime("%B %Y")  # Example: "July 2025"
    else:
        user["createdAt"] = "Unknown"

    return jsonify(user), 200