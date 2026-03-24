from flask import Blueprint, request, jsonify
from db.collections import items
from datetime import datetime
from bson import ObjectId
import cloudinary.uploader
import cloudinary_config
from db.collections import users

item_bp = Blueprint("item", __name__)


# Add a new item
@item_bp.route("/add", methods=["POST"])
def add_item():
    # Use request.form instead of get_json
    data = request.form

    required_fields = [
        "title", "description", "category", "type", "size",
        "condition", "brand", "color", "material", "points", "uploaderUid"
    ]

    # ✅ Validate form fields
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    try:
        # ✅ Handle images
        image_files = request.files.getlist("images")
        uploaded_image_urls = []

        for file in image_files:
            result = cloudinary.uploader.upload(file)
            uploaded_image_urls.append(result["secure_url"])

        # ✅ Parse tags if they are JSON stringified
        import json
        tags = []
        if data.get("tags"):
            try:
                tags = json.loads(data["tags"])
            except Exception:
                tags = []

        item = {
            "title": data["title"],
            "description": data["description"],
            "category": data["category"],
            "type": data["type"],
            "size": data["size"],
            "condition": data["condition"],
            "brand": data["brand"],
            "color": data["color"],
            "material": data["material"],
            "points": int(data["points"]),
            "tags": tags,
            "images": uploaded_image_urls,  # ✅ Cloudinary URLs
            "uploaderUid": data["uploaderUid"],
            "requiresPoints": True,
            "status": "available",
            "approved": False,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow(),
            "swapRequests": []
        }

        result = items.insert_one(item)
        points_earned = int(data.get("pointsEarned", 0))
        users.update_one(
            {"uid": data["uploaderUid"]},
            {"$inc": {"points": points_earned}}
        )
        return jsonify({"message": "Item added", "itemId": str(result.inserted_id)}), 201

    except Exception as e:
        return jsonify({"error": "Failed to add item", "details": str(e)}), 500


# Get all items uploaded by a specific user
@item_bp.route("/user", methods=["POST"])
def get_user_items():
    try:
        data = request.get_json()
        uid = data.get("uid")
        if not uid:
            return jsonify({"error": "uid is required"}), 400

        user_items = list(items.find(
            {"uploaderUid": uid},
            {
                "_id": 1,
                "title": 1,
                "points":1,
                "images": 1, 
            }
        ))

        for item in user_items:
            item["_id"] = str(item["_id"])
            if isinstance(item.get("createdAt"), datetime):
                item["createdAt"] = item["createdAt"].strftime("%d %b %Y")

        return jsonify(user_items), 200

    except Exception as e:
        return jsonify({"error": "Failed to fetch items", "details": str(e)}), 500




# Get all available items for general browsing
@item_bp.route("/available", methods=["GET"])
def get_available_items():
    try:
        available_items = list(items.find({
            "status": "available",
            # "approved": True
        }))  # No projection => return full item

        for item in available_items:
            item["_id"] = str(item["_id"])
            if isinstance(item.get("createdAt"), datetime):
                item["createdAt"] = item["createdAt"].strftime("%d %b %Y")
            if isinstance(item.get("updatedAt"), datetime):
                item["updatedAt"] = item["updatedAt"].strftime("%d %b %Y")

        return jsonify(available_items), 200

    except Exception as e:
        return jsonify({"error": "Failed to fetch available items", "details": str(e)}), 500




@item_bp.route("/detail/<item_id>", methods=["GET"])
def get_item_detail(item_id):
    try:
        item = items.find_one({"_id": ObjectId(item_id)})
        if not item:
            return jsonify({"error": "Item not found"}), 404

        item["_id"] = str(item["_id"])
        if isinstance(item["createdAt"], datetime):
            item["createdAt"] = item["createdAt"].strftime("%d %b %Y")

        return jsonify(item), 200

    except Exception as e:
        return jsonify({"error": "Invalid item ID", "details": str(e)}), 400




# Admin: Approve an item by ID
@item_bp.route("/approve/<item_id>", methods=["PATCH"])
def approve_item(item_id):
    try:
        result = items.update_one(
            {"_id": ObjectId(item_id)},
            {"$set": {"approved": True, "updatedAt": datetime.utcnow()}}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Item not found"}), 404

        return jsonify({"message": "Item approved"}), 200

    except Exception as e:
        return jsonify({"error": "Invalid item ID", "details": str(e)}), 400
    
    # Get featured items
@item_bp.route("/featured", methods=["GET"])
def get_featured_items():
    try:
        NUM_FEATURED = 4
        pipeline = [
            {"$match": {"status": "available"}},
            {"$sample": {"size": NUM_FEATURED}},
            {"$project": {
                "_id": 1,
                "title": 1,
                "points": 1,
                "images": 1
            }}
        ]

        featured_items = list(items.aggregate(pipeline))

        for item in featured_items:
            item["_id"] = str(item["_id"])
            item["image"] = item["images"][0] if item.get("images") else None
            del item["images"]

        return jsonify(featured_items), 200

    except Exception as e:
        return jsonify({"error": "Failed to fetch featured items", "details": str(e)}), 500


