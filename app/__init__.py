from flask import Flask
from flask_cors import CORS
from app.routes.data import get_data

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    CORS(app)
    return app
