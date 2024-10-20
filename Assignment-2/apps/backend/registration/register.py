# Helper functions for registering new users
import json
from ..models.userModel import User

# getter method to get user data from database
def getUserData(isGoogleAuth=False) -> list[dict]:

    database = "data/googleUsers.json" if isGoogleAuth else "data/users.json"

    userList = []
    with open(database, "r") as file:
        userList = json.load(file)

    return userList


# setter method to set/append user data to database
def setUserData(newUser: User, isGoogleAuth=False) -> bool:

    # specify which set of user data to read
    database = "data/googleUsers.json" if isGoogleAuth else "data/users.json"

    # check to see if user already exists
    users = getUserData(isGoogleAuth)
    if users.get("username") == newUser.username or users.get("email") == newUser.email:
        return False

    # save the user data to the database
    with open(database, "w") as file:
        users.append(newUser)
        json.dump(users, file, indent=4)

    # if successfully added the new user then return true
    return True
