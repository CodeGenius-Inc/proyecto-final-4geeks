import os
from flask import Flask
from flask_cors import CORS
from routes import pedidos_bp, auth_bp
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

allowed_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]

CORS(app, resources={r"/api/*": {"origins": allowed_origins}})

app.register_blueprint(pedidos_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=int(os.getenv("PORT", 5000)),
        debug=False
    )
