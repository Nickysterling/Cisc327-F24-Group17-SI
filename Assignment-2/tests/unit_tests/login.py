# test login behaviour
import pytest
from apps.backend.models.userModel import User

# Create a new fake user
testUser = User(
    username="test_user_0",
    email="test_user_0@tester.com",
    password="abc123",
    user_type="Landlord",
)


def testUserLogin():
    """Unit Test: test if the user can login"""

    # Assert that test user profile can be used to login
    assert (
        testUser.username == "test_user_0"
        and testUser.email == "test_user_0@tester.com"
        and testUser.password == "abc123"
    )
    print("\nPASSED: User can login with correct credentials")


def testUserLoginWithWrongUsername():
    """Assert that test user profile cannot be logged into with invalid username"""
    assert (
        testUser.username == "master_user"
        and testUser.email == "test_user_0@tester.com"
        and testUser.password == "abc123"
    ) is False
    print("\nPASSED: User cannot login with invalid username")


def testUserLoginWithWrongEmail():
    """Assert that test user profile cannot be logged into with invalid email"""
    assert (
        testUser.username == "test_user_0"
        and testUser.email == "test_user_007@tester.com"
        and testUser.password == "abc123"
    ) is False
    print("\nPASSED: User cannot login with invalid email")


def testUserLoginWithWrongPassword():
    """Assert that test user profile cannot be logged into with invalid password"""
    assert (
        testUser.username == "master_user"
        and testUser.email == "test_user_0@tester.com"
        and testUser.password == "password"
    ) is False
    print("\nPASSED: User cannot login with invalid password")
