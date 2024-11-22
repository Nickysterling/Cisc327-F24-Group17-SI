import sqlite3
import pandas as pd
from apps.backend.models.userModel import User


# Connect to the database
def get_db_connection(specialDirectory=""):
    print("Directory: " + specialDirectory)

    conn = (
        sqlite3.connect("data/rentease.db")
        if specialDirectory == ""
        else sqlite3.connect(specialDirectory)
    )
    conn.row_factory = sqlite3.Row  # Enables accessing columns by name
    print("Successfully connected to SQLite database")

    # Print the initial data in the database to the terminal
    tables = ["google_users", "users"]
    for table in tables:
        print(f"Data from {table} table:")
        query = f"SELECT * FROM {table}"
        print(pd.read_sql_query(query, conn))
        print("\n")

    return conn


# Get user data from SQLite
def getUserData(isGoogleAuth=False, specialDirectory="") -> list[User]:
    table = "google_users" if isGoogleAuth else "users"
    conn = get_db_connection(specialDirectory)
    cursor = conn.cursor()
    cursor.execute(f"SELECT username, email, password, user_type FROM {table}")
    users_data = cursor.fetchall()
    conn.close()

    # Convert rows to User objects, excluding user_ID
    return [User(**user) for user in users_data]


# Add user data to SQLite
def setUserData(newUser: User, isGoogleAuth=False, specialDirectory="") -> bool:
    table = "google_users" if isGoogleAuth else "users"
    conn = get_db_connection(specialDirectory)
    cursor = conn.cursor()

    if newUser.email.__contains__("@") is False:
        return False

    try:
        cursor.execute(
            f"""
            INSERT INTO {table} (username, email, password, user_type)
            VALUES (?, ?, ?, ?)
        """,
            (newUser.username, newUser.email, newUser.password, newUser.user_type),
        )
        conn.commit()
    except sqlite3.IntegrityError:
        print("ERROR: There was an issue creating an account")
        return False  # Username or email already exists
    finally:
        # print the new user details to show the new object.
        print("New User Data Set")
        conn.close()
    return True


def deleteUser(username: str, isGoogleAuth=False, specialDirectory="") -> bool:
    """
    Deletes a user entry from the database based on username.

    Parameters:
    - username (str): The username of the user to delete.
    - isGoogleAuth (bool): If True, deletes from the google_users table; otherwise, deletes from the users table.
    - specialDirectory (str): Optional path to a special directory for database connection.

    Returns:
    - bool: True if a row was deleted, False otherwise.
    """
    # Select the correct table
    table = "google_users" if isGoogleAuth else "users"

    # Connect to the database
    conn = get_db_connection(specialDirectory)
    cursor = conn.cursor()

    # Execute the delete statement
    cursor.execute(f"DELETE FROM {table} WHERE username = '{username}'")
    conn.commit()

    # Check if any row was deleted
    row_deleted = cursor.rowcount > 0

    # Close the connection
    conn.close()

    return row_deleted
