import sqlite3
from ..models.userModel import User

# Connect to the database
def get_db_connection():
    conn = sqlite3.connect('data/rentease.db')
    conn.row_factory = sqlite3.Row  # Enables accessing columns by name
    return conn

# Get user data from SQLite
def getUserData(isGoogleAuth=False) -> list[User]:
    table = "google_users" if isGoogleAuth else "users"
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(f"SELECT username, email, password, user_type FROM {table}")
    users_data = cursor.fetchall()
    conn.close()

    # Convert rows to User objects, excluding user_ID
    return [User(**user) for user in users_data]

# Add user data to SQLite
def setUserData(newUser: User, isGoogleAuth=False) -> bool:
    table = "google_users" if isGoogleAuth else "users"
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(f'''
            INSERT INTO {table} (username, email, password, user_type)
            VALUES (?, ?, ?, ?)
        ''', (newUser.username, newUser.email, newUser.password, newUser.user_type))
        conn.commit()
    except sqlite3.IntegrityError:
        return False  # Username or email already exists
    finally:
        conn.close()
    return True
