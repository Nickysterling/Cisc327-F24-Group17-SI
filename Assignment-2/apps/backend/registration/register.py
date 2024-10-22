# Helper functions for registering new users
import json
import os
from ..models.userModel import User


# Getter method to retrieve user data from the database
def getUserData(isGoogleAuth=False) -> list[User]:
    """
    Fetch user data from the JSON database.
    
    :param isGoogleAuth: Boolean to check whether to fetch Google-authenticated users or general users.
    :return: A list of User objects.
    """
    # Specify which database to read from (general users or Google users)
    database = "data/googleUsers.json" if isGoogleAuth else "data/users.json"
    
    # Initialize empty list to store user data
    users = []

    # Check if the database file is not empty
    if os.path.getsize(database) > 0:
        with open(database, "r") as file:
            try:
                # Load user data from JSON file
                userList = json.load(file)
            except json.JSONDecodeError:
                # Handle corrupted or empty JSON data
                userList = []

        # Convert JSON data into User objects
        for userDict in userList:
            user = User(
                username=userDict["username"],
                email=userDict["email"],
                password=userDict["password"],
                user_type=userDict["user_type"]
            )
            users.append(user)

    return users


# Setter method to add new user data to the database
def setUserData(newUser: User, isGoogleAuth=False) -> bool:
    """
    Append a new user's data to the JSON database if the user doesn't already exist.
    
    :param newUser: User object to add to the database.
    :param isGoogleAuth: Boolean to specify whether this is a Google-authenticated user.
    :return: Boolean indicating whether the operation was successful.
    """
    # Specify which database to read from and write to
    database = "data/googleUsers.json" if isGoogleAuth else "data/users.json"

    # Fetch existing users
    users = getUserData(isGoogleAuth)

    # Check if the user already exists
    for user in users:
        if user.username == newUser.username or user.email == newUser.email:
            return False  # User already exists

    # Add the new user's data to the list and save it to the database
    users.append(newUser)

    # Write updated user data back to the JSON file
    with open(database, "w") as file:
        # Convert User objects back to dictionaries for JSON serialization
        json.dump([user.to_dict() for user in users], file, indent=4)

    return True
