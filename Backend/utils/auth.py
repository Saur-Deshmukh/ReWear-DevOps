from firebase_admin import auth
from flask import request
from functools import wraps

def verify_firebase_token(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", None)
        if not auth_header:
            return {"error": "Missing Authorization header"}, 401
        try:
            token = auth_header.split("Bearer ")[1]
            decoded_token = auth.verify_id_token(token)
            request.user = decoded_token
            return f(*args, **kwargs)
        except Exception as e:
            return {"error": "Unauthorized", "details": str(e)}, 403
    return decorated
