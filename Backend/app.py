from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials

import os


load_dotenv()

cred = credentials.Certificate("firebase_admin_config.json")
firebase_admin.initialize_app(cred)

from db.init_db import init_collections

from routes.user_routes import user_bp
from routes.item_routes import item_bp  
from routes.admin_routes import admin_bp
from routes.swap import swap_bp
from prometheus_client import Counter, generate_latest, CONTENT_TYPE_LATEST
app = Flask(__name__)
CORS(app)  

init_collections()
REQUEST_COUNT = Counter(
    'rewear_requests_total',
    'Total API Requests'
)
@app.before_request
def before_request():
    REQUEST_COUNT.inc()

@app.route("/metrics")
def metrics():
    return generate_latest(), 200, {'Content-Type': CONTENT_TYPE_LATEST}


app.register_blueprint(admin_bp, url_prefix="/api/admin")
app.register_blueprint(user_bp, url_prefix="/api/users")
app.register_blueprint(item_bp, url_prefix="/api/items") 
app.register_blueprint(swap_bp, url_prefix="/api/swap")

@app.route("/")
def index():
    return {
        "message": "ReWear Backend Running Successfully",
        "status": "OK"
    }, 200
@app.route('/test-cron', methods=['GET'])
def test_cron():
    return jsonify({
        "message": "Backend is running"
    }), 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Use Render's dynamic port if available
    app.run(host="0.0.0.0", port=port, debug=True)
