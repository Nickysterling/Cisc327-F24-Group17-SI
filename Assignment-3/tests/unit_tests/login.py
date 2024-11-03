# test login behaviour
import pytest
import os
from apps.backend.models.userModel import User
from apps.backend.registration.register import getUserData, setUserData

# Create a new fake user
testUser = User(
    username="test_user_0",
    email="test_user_0@tester.com",
    password="abc123",
    user_type="Landlord",
)

invalidTestUser = User(
    username="master_user", email="test_user_0@tester.com", password="ABCDEFG"
)

basePath = os.path.dirname(os.path.abspath(__file__))
overrideDBPath = os.path.abspath(os.path.join(basePath, "../../", "data/rentease.db"))


def verifyUser(user: User, isGoogleAuth=False) -> bool:

    userVerified = False

    # Assert that test user profile can be used to login
    userAccounts = getUserData(specialDirectory=overrideDBPath)

    for account in userAccounts:
        if (
            account.username is user.username
            and account.email is user.email
            and account.password is user.password
        ):
            userVerified = True

    return userVerified


# Read all the data in the database for context
print("All standard users:")
print(getUserData(specialDirectory=overrideDBPath))


def testUserLogin():
    """Unit Test: test if the user can login"""

    if verifyUser(testUser) is False:
        setUserData(newUser=testUser, specialDirectory=overrideDBPath)
        print("Test User added to database")

    assert verifyUser(user=testUser) is True
    print("\nPASSED: User can login with correct credentials")


def testUserLoginWithWrongUsername():
    """Assert that test user profile cannot be logged into with invalid username"""

    test1 = testUser
    test1.username = "suspicious_tester"
    assert verifyUser(test1) is False
    print("\nPASSED: User cannot login with invalid username")


def testUserLoginWithWrongEmail():
    """Assert that test user profile cannot be logged into with invalid email"""

    test2 = testUser
    test2.email = "test_user_007@tester.com"
    assert verifyUser(user=test2) is False
    print("\nPASSED: User cannot login with invalid email")


def testUserLoginWithWrongPassword():
    """Assert that test user profile cannot be logged into with invalid password"""

    test3 = testUser
    test3.password = "password"
    assert verifyUser(user=test3) is False
    print("\nPASSED: User cannot login with invalid password")


def testNoUser():
    """Assert that test user profile cannot be logged in when no profile exists"""

    assert verifyUser(user=invalidTestUser) is False
    print("\nPASSED: User cannot login since no profile exists")
