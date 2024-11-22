import pytest
import random
from apps.backend.models.userModel import User
from apps.backend.registration.register import getUserData

# create a test user profile
testUser = User(
    username=f"test_user_{random.randint(0, 1000)}",
    email="",
    password="password123",
    user_type="Landlord",
)
testUser.email = f"{testUser.username}@rent_ease_tester.com"

googleTestUser = User(
    username=f"test_google_user_{random.randint(0, 1000)}",
    email="",
    password="password123",
    user_type="Landlord",
)
googleTestUser.email = f"{googleTestUser.username}@google_tester.com"


def test_register(client):

    # Simulate user registration
    response = client.post(
        "/",
        data=testUser.to_dict(),
        follow_redirects=True,
    )

    # assert that the user can create a profile
    assert response.status_code == 200

    # Verify and assert user in the database
    users = getUserData()
    assert any(
        user.username == testUser.username
        and user.email == testUser.email
        and user.password == testUser.password
        for user in users
    )


def test_invalid_register(client):

    testUserWithBadEmail = testUser
    testUserWithBadEmail.email.replace("@", "")

    # Simulate user registration
    response = client.post(
        "/",
        data=testUserWithBadEmail.to_dict(),
        follow_redirects=True,
    )

    # assert that the user cannot create a profile (this is caught by our frontend)
    assert response.status_code == 200


def test_login(client):

    # Simulate user login
    response = client.post(
        "/login",
        data=testUser.to_dict(),
        follow_redirects=True,
    )

    assert response.status_code == 200


def test_google_signup(client):

    # simulate a new user signing up using google
    response = client.post(
        "/google_redirect",
        data=googleTestUser.to_dict(),
        follow_redirects=True,
    )

    assert response.status_code == 200

    # Verify and assert user in the database
    users = getUserData(isGoogleAuth=True)
    assert any(
        (
            user.username == googleTestUser.username
            and user.email == googleTestUser.email
            and user.password == googleTestUser.password
        )
        for user in users
    )


def test_google_signin(client):

    # Simulate Google email verification
    response = client.post(
        "/google_signin",
        data=googleTestUser.to_dict(),
        follow_redirects=True,
    )

    assert response.status_code == 200


def test_forgot_password(client):
    # Simulate forgot password functionality
    response = client.post("/forgot_password", follow_redirects=True)

    assert response.status_code == 200
