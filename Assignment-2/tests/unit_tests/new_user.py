# test new user creation
import pytest
from apps.backend.models.userModel import User

# Create a new fake user
testUser = User(
    username="test_user_0",
    email="test_user_0@tester.com",
    password="abc123",
    user_type="Landlord",
)


def testCreateNewUser():
    """Unit Test: verify that a new user can be created correctly."""

    # Assert user properties are set properly
    assert testUser.username == "test_user_0"
    assert testUser.email == "test_user_0@tester.com"
    assert testUser.password == "abc123"
    assert testUser.user_type == "Landlord"
    print("\nPASSED: User properties set properly")


def testNewUserEmailFormat():
    """Unit Test: verify that a new user's email is formatted correctly."""

    # Assert the email is of the right format
    assert testUser.email.__contains__("@") == True
    print("\nPASSED: verified email format")
    assert "testcase.com".__contains__("@") == False
    print("PASSED: verified email must have correct format")


def testProfileStored():
    """Unit Test: verify that a new user's profile has been saved successfully."""

    # Assert that new user profile saved successfully
    testUserJSON = testUser.to_dict()
    assert testUserJSON["username"] == "test_user_0"
    assert testUserJSON["email"] == "test_user_0@tester.com"
    assert testUserJSON["password"] == "abc123"
    assert testUserJSON["user_type"] == "Landlord"
    print("\nPASSED: User profile saved successfully")
