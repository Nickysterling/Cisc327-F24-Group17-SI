# Helper functions for registering new users
import json
import os
from ..models.userModel import User


# getter method to get user data from database
def getUserData(isGoogleAuth=False) -> list[User]:

    # specify if reading from general users or google-based users
    database = "data/googleUsers.json" if isGoogleAuth else "data/users.json"

    # create empty lists to return user data, and process user data in JSON
    users = []
    userList = []

    # read from the database, check to see if there is data first
    if os.path.getsize(database) > 0:
        with open(database, "r") as file:
            userList = json.load(file)

        # convert JSON to "User" data model
        for userDict in userList:
            user = User(
                username=userDict["username"],
                email=userDict["email"],
                password=userDict["password"],
                user_type=userDict["user_type"],
            )
            users.append(user)

    # return collection of users
    return users


# setter method to set/append user data to database
def setUserData(newUser: User, isGoogleAuth=False) -> bool:

    # specify which set of user data to read
    database = "data/googleUsers.json" if isGoogleAuth else "data/users.json"

    # check to see if user already exists
    users = getUserData(isGoogleAuth)
    for user in users:
        if user.username == newUser.username or user.email == newUser.email:
            return False

    # save the user data to the database
    with open(database, "w") as file:
        users.append(newUser.to_dict())
        json.dump(users, file, indent=4)

    # if successfully added the new user then return true
    return True
