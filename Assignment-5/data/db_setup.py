# db_setup.py
import sqlite3
import json

def create_tables():
    conn = sqlite3.connect('data/rentease.db')
    cursor = conn.cursor()

    # Create users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            user_ID INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            user_type TEXT CHECK(user_type IN ('Tenant', 'Landlord')) DEFAULT 'Landlord'
        )
    ''')

    # Create google_users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS google_users (
            user_ID INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            user_type TEXT CHECK(user_type IN ('Tenant', 'Landlord')) DEFAULT 'Landlord'
        )
    ''')

    conn.commit()
    conn.close()
    print("Database tables created successfully.")

# Load and insert data into the users table
def migrate_users_data():
    conn = sqlite3.connect('data/rentease.db')
    cursor = conn.cursor()

    with open('data/users.json', 'r') as f:
        users = json.load(f)
        for user in users:
            cursor.execute('''
                INSERT OR IGNORE INTO users (username, email, password, user_type)
                VALUES (?, ?, ?, ?)
            ''', (user['username'], user['email'], user['password'], user.get('user_type', 'Tenant')))

    conn.commit()
    conn.close()
    print("Data migrated to 'users' table successfully.")

# Load and insert data into the google_users table
def migrate_google_users_data():
    conn = sqlite3.connect('data/rentease.db')
    cursor = conn.cursor()

    with open('data/googleUsers.json', 'r') as f:
        google_users = json.load(f)
        for user in google_users:
            cursor.execute('''
                INSERT OR IGNORE INTO google_users (username, email, password, user_type)
                VALUES (?, ?, ?, ?)
            ''', (user['username'], user['email'], user['password'], user.get('user_type', 'Tenant')))

    conn.commit()
    conn.close()
    print("Data migrated to 'google_users' table successfully.")

# Run both migrations
def migrate_all_data():
    migrate_users_data()
    migrate_google_users_data()

# Run this only if executing this file directly
if __name__ == '__main__':
    create_tables()
    migrate_all_data()
