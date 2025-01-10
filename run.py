from app import create_app
from app.routes.data import data_bp

app = create_app()
app.register_blueprint(data_bp)

if __name__ == '__main__':
    app.run(debug=True)
