from flask import Blueprint, request, jsonify
from db.collections import users, items, swaps
from bson import ObjectId
from datetime import datetime

swap_bp = Blueprint("swap", __name__)


@swap_bp.route("/redeem", methods=["POST"])
def redeem_item():
    data = request.get_json()
    uid = data.get("uid")
    item_id = data.get("itemId")

    if not uid or not item_id:
        return jsonify({"error": "uid and itemId are required"}), 400

    # Get user
    user = users.find_one({"uid": uid})
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Get item
    item = items.find_one({"_id": ObjectId(item_id)})
    if not item:
        return jsonify({"error": "Item not found"}), 404

    if item["status"] != "available":
        return jsonify({"error": "Item is not available for redemption"}), 400

    item_points = item.get("points", 0)
    user_points = user.get("points", 0)

    if user_points < item_points:
        return jsonify({"error": "Insufficient points"}), 400

    # Deduct points and update user
    users.update_one(
        {"uid": uid},
        {
            "$inc": {"points": -item_points},
            "$push": {
                "redeemedItems": {
                    "itemId": str(item["_id"]),
                    "title": item["title"],
                    "points": item_points,
                    "redeemedAt": datetime.utcnow()
                }
            }
        }
    )

    # Update item: mark as swapped and transfer ownership
    items.update_one(
        {"_id": ObjectId(item_id)},
        {
            "$set": {
                "status": "swapped",
                "uploaderUid": uid,
                "updatedAt": datetime.utcnow()
            }
        }
    )

    return jsonify({"message": "Item redeemed successfully"}), 200

@swap_bp.route("/request", methods=["POST"])
def request_swap():
    data = request.get_json()
    requester_uid = data.get("requesterUid")
    requested_item_id = data.get("requestedItemId")
    offered_item_id = data.get("offeredItemId")

    if not requester_uid or not requested_item_id or not offered_item_id:
        return jsonify({"error": "All fields are required"}), 400

    try:
        # Fetch both items
        requested_item = items.find_one({"_id": ObjectId(requested_item_id)})
        offered_item = items.find_one({"_id": ObjectId(offered_item_id)})

        if not requested_item or not offered_item:
            return jsonify({"error": "One or both items not found"}), 404

        # Check both are available 
        if requested_item["status"] != "available":
            return jsonify({"error": "Requested item is not available"}), 400

        if offered_item["status"] != "available":
            return jsonify({"error": "Offered item is not available"}), 400

        # Check if requester owns the offered item
        if offered_item["uploaderUid"] != requester_uid:
            return jsonify({"error": "You can only offer your own item"}), 403

        # Prevent self-swap
        if requested_item["uploaderUid"] == requester_uid:
            return jsonify({"error": "You cannot swap with your own item"}), 403

        # Store original owner of requested item
        original_owner_uid = requested_item["uploaderUid"]

        now = datetime.utcnow()

        # ✅ Swap uploaderUid of both items and update status
        items.update_one(
            {"_id": ObjectId(requested_item_id)},
            {
                "$set": {
                    "uploaderUid": requester_uid,
                    "status": "swapped",
                    "updatedAt": now
                }
            }
        )

        items.update_one(
            {"_id": ObjectId(offered_item_id)},
            {
                "$set": {
                    "uploaderUid": original_owner_uid,
                    "status": "swapped",
                    "updatedAt": now
                }
            }
        )

        # ✅ Insert swap log into swaps collection
        swaps.insert_one({
            "ownerUid": original_owner_uid,
            "requesterUid": requester_uid,
            "requestedItemId": str(requested_item["_id"]),
            "offeredItemId": str(offered_item["_id"]),
            "status": "completed",
            "timestamps": {
                "requestedAt": now,
                "completedAt": now
            }
        })

        return jsonify({"message": "Swap completed successfully"}), 200

    except Exception as e:
        return jsonify({"error": "Swap failed", "details": str(e)}), 500