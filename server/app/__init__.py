import os
import logging
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)

    # Enable Cross-Origin Resource Sharing for all client origins
    CORS(
        app,
        resources={r"/*": {"origins": "*"}},
        supports_credentials=True,
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization", "Accept", "Origin"]
    )

    if test_config:
        app.config.from_mapping(test_config)

    # Health check route
    @app.route("/health", methods=["GET"])
    @app.route("/api/v1/health", methods=["GET"])
    def health():
        from app.db import is_using_mock
        return jsonify({
            "status": "healthy",
            "service": "UniQuest API",
            "version": "v1",
            "database_driver": "mongomock (in-memory)" if is_using_mock() else "live MongoDB"
        }), 200

    # Register Blueprints
    from app.routes.bootcamps import bootcamps_bp
    app.register_blueprint(bootcamps_bp, url_prefix="/api/v1/bootcamps")

    # Global Error Handlers
    @app.errorhandler(404)
    def handle_not_found(e):
        return jsonify({"success": False, "error": "Endpoint or resource not found"}), 404

    @app.errorhandler(500)
    def handle_server_error(e):
        return jsonify({"success": False, "error": "Internal server error"}), 500

    # Ensure mongomock has seed data if running in fallback mode
    with app.app_context():
        from app.db import get_bootcamps_collection, is_using_mock
        col = get_bootcamps_collection()
        if col.count_documents({}) == 0:
            from app.models.bootcamp import SAMPLE_BOOTCAMPS
            col.insert_many([dict(b) for b in SAMPLE_BOOTCAMPS])
            logger.info("Initialized bootcamp collection with sample seed data.")

    return app
