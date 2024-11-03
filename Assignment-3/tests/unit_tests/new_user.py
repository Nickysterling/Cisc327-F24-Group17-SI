# test new user creation
import pytest
import os
import random
from apps.backend.models.userModel import User
from apps.backend.registration.register import setUserData, deleteUser
from .login import verifyUser

# Create a new fake user
testUser = User(
    username="test_user_0",
    email="test_user_0@tester.com",
    password="abc123",
    user_type="Landlord",
)

basePath = os.path.dirname(os.path.abspath(__file__))
overrideDBPath = os.path.abspath(os.path.join(basePath, "../../", "data/rentease.db"))


if verifyUser(testUser):
    deleteUser(username=testUser.username, specialDirectory=overrideDBPath)
    print("test user profile deleted")


def testCreateNewUser():
    """Unit Test: verify that a new user can be created correctly."""

    # Assert user properties are set properly
    assert testUser.username == "test_user_0"
    assert testUser.email == "test_user_0@tester.com"
    assert testUser.password == "abc123"
    assert testUser.user_type == "Landlord"


def testNewUserEmailFormat():
    """Unit Test: verify that a new user's email is formatted correctly."""

    # Assert the email is of the right format
    assert testUser.email.__contains__("@") is True
    print("\nPASSED: verified email format")
    assert "testcase.com".__contains__("@") is False
    print("PASSED: verified email must have correct format")


def testProfileStored():
    """Unit Test: verify that a new user's profile has been saved successfully."""

    randomTestUser = testUser
    randomTestUser.username += f"{random.randint(0,100000)}"

    assert setUserData(newUser=randomTestUser, specialDirectory=overrideDBPath) is True
    print("\nPASSED: User profile saved successfully")
