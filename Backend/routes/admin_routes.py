from flask import Blueprint, jsonify
from db.collections import users, items, swaps
from datetime import datetime

admin_bp = Blueprint("admin", __name__)


# 🧑‍💼 Route 1: Manage Users
@admin_bp.route("/manage-users", methods=["GET"])
def manage_users():
    try:
        user_list = list(users.find({}, {
            "_id": 0,
            "uid": 1,
            "name": 1,
            "points": 1,
            "createdAt": 1,
            "role": 1
        }))

        for user in user_list:
            if isinstance(user["createdAt"], datetime):
                user["createdAt"] = user["createdAt"].strftime("%b %Y")

        return jsonify(user_list), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch users", "details": str(e)}), 500


# 📦 Route 2: Manage Orders / Items
@admin_bp.route("/manage-orders", methods=["GET"])
def manage_orders():
    try:
        item_list = list(items.find({}, {
            "_id": 1,
            "title": 1,
            "uploaderUid": 1,
            "status": 1,
            "points": 1,
            "createdAt": 1
        }))

        for item in item_list:
            item["_id"] = str(item["_id"])
            if isinstance(item["createdAt"], datetime):
                item["createdAt"] = item["createdAt"].strftime("%b %Y")

        return jsonify(item_list), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch orders", "details": str(e)}), 500


# 🔁 Route 3: Manage Swaps
@admin_bp.route("/manage-swaps", methods=["GET"])
def manage_swaps():
    try:
        swap_list = list(swaps.find({}, {
            "_id": 0,
            "ownerUid": 1,
            "requesterUid": 1,
            "requestedItemId": 1,
            "offeredItemId": 1,
            "status": 1,
            "timestamps": 1
        }))

        for swap in swap_list:
            if "timestamps" in swap:
                if "requestedAt" in swap["timestamps"]:
                    swap["timestamps"]["requestedAt"] = swap["timestamps"]["requestedAt"].strftime("%d %b %Y")
                if "completedAt" in swap["timestamps"]:
                    swap["timestamps"]["completedAt"] = swap["timestamps"]["completedAt"].strftime("%d %b %Y")

        return jsonify(swap_list), 200
    except Exception as e:
        return jsonify({"error": "Failed to fetch swaps", "details": str(e)}), 500
