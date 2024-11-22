import pytest
from app import app as flask_app


@pytest.fixture
def app():
    """Provide a Flask application instance for testing."""
    # Enable testing mode
    flask_app.config["TESTING"] = True

    # Disable CSRF for tests
    flask_app.config["WTF_CSRF_ENABLED"] = False

    return flask_app


@pytest.fixture
def client(app):
    """Provide a test client for the application."""
    return app.test_client()
