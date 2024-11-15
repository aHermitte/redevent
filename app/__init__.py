from flask import Flask
from .routes import data

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    return app
