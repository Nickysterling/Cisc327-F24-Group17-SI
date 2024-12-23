# CMPE 327 - Assignment 5: Rental Management Portal

This repository contains a backend and frontend application with user authentication functionality.

## Installation

### 1. Prerequisites

- **Python**: Ensure at least Python Version 3.6 is installed. Download it from [Python Downloads](https://www.python.org/downloads/).
- **Node.js**: Ensure Node.js is installed. Download it from [Node.js Downloads](https://nodejs.org/en/download/).
- **SQLite**: Ensure SQLite is installed. Download it from [SQLite Downloads](https://www.sqlite.org/download.html)

#### Clone and open the repository

1. Clone the repository using the command below in your terminal:

```
git clone https://github.com/Nickysterling/Cisc327-F24-Group17-SI.git
```

2. Then, open the cloned repository in your terminal
3. Navigate to the Assignment-5 directory using the command:

```
cd Assignment-5
```

### 2. Install Python Packages

Install the required Python packages using `pip` and the `requirements.txt` file.

```
pip install -r requirements.txt
```

This should download the following packages:

1. Flask
2. Werkzeug
3. pytest
4. pandas

You can verify the installation by using the command `pip show <package_name>', for example:

``pip show pytest``

Should output:

```
Name: pytest
Version: 8.3.3
Summary: pytest: simple powerful testing with Python
Home-page: https://docs.pytest.org/en/latest/
Author: Holger Krekel, Bruno Oliveira, Ronny Pfannschmidt, Floris Bruynooghe, Brianna Laugher, Florian Bruhin, Others (See AUTHORS)
Author-email: 
License: MIT
...
```

### 3. Install the latest version of Node.js and npm Packages

- For Windows:

  1. Download the [Node.js installer](https://nodejs.org/en/download/).
  2. Run the installer.
  3. Verify installation:

     ```
     node -v
     npm -v
     ```
- For macOS:

  1. Using Homebrew (recommended):

     ```
     brew install node
     ```
  2. Verify installation:

     ```
     node -v
     npm -v
     ```
- For Linux (Ubuntu/Debian-based):

  1. Update the package list and install Node.js and npm:

     ```
     sudo apt update
     sudo apt install nodejs npm
     ```
  2. Verify installation:

     ```
     node -v
     npm -v
     ```

### 4. Install Packages for Tenant Page Tests

1. Navigate to the `tenant_tests` directory:

   ```
   cd Assignment-5/tests/tenant_tests
   ```
2. Install npm packages:

   ```
   npm install
   ```

### 5. SQLite Installation

Since this project uses SQLite as its database backend, follow these instructions to install SQLite on your system.

- For Windows:

  1. Download SQLite tools from the [SQLite Download Page](https://www.sqlite.org/download.html).
  2. Extract the downloaded ZIP file.
  3. Move `sqlite3.exe` to a directory in your system’s PATH (e.g., `C:\sqlite3`).
  4. Verify installation:

     ```
     sqlite3 --version
     ```
- For macOS:

  1. Install SQLite using Homebrew:

     ```
     brew install sqlite3
     ```
  2. Verify Installation:

     ```
     sqlite3 --version
     ```
- For Linux (Ubuntu/Debian-based):

  1. Update the package list:

     ```
     sudo apt update
     ```
  2. Install SQLite:

     ```
     sudo apt install sqlite3
     ```
  3. Verify Installation:

     ```
     sqlite3 --version
     ```

## Running the Application

1. Navigate to the project's root directory in your terminal after cloning the repository

   ```
   cd Assigment-5
   ```
2. Start the Flask application:

   ```
   python app.py
   ```

The flask server should start running on your local machine on port 5000.

## Running Unit Tests

### 1. Unit Tests for User and Login Features

1. Navigate to the `unit_tests` directory:

   ```
   cd Cisc327-F24-Group17-SI/Assignment-5/tests/unit_tests
   ```
2. Run the backend unit tests:

   > Note: a) the command below runs two different test sets for two features: new user creation and logging in, using a single command
   > b) database contents get printed to the console every time we query the database for debugging and to heuristically verify the test passes.
   >

   ```
   pytest -v -s new_user.py login.py
   ```
3. The output of the unit tests should look like this image (broken into separate images for readability)

Unit Test for `login.py`:
![Unit Tests for Login](https://github.com/Nickysterling/Cisc327-F24-Group17-SI/blob/main/Assignment-3/tests/CMPE327_A3_login_test_cases_ss.png?raw=true)

Unit Test for `new_user.py`:
![Unit Test for login.py](https://github.com/Nickysterling/Cisc327-F24-Group17-SI/blob/main/Assignment-3/tests/CMPE327_A3_new-user_test_cases_ss.png?raw=true)

### 2. Tenant Page Testing

1. Navigate to the `tenant_tests` directory:

   ```
   cd Cisc327-F24-Group17-SI/Assignment-5/tests/tenant_tests
   ```
2. Install the necessary packages (Instanbul (nyc), mocha, c8, and more):

   ```
   npm install
   ```
3. Run coverage tests using the following command:

   ```
   npm run coverage
   ```
4. The output of the tenant tests should look like this image:

<img width="607" alt="Screenshot 2024-11-11 at 10 02 13 PM" src="https://github.com/user-attachments/assets/a935e4c8-1f40-4016-80b3-8b5461b8ebaa">

With Code Coverage details:

<img width="607" alt="Screenshot 2024-11-11 at 10 02 13 PM" src="https://github.com/Nickysterling/Cisc327-F24-Group17-SI/blob/main/Assignment-4/report_and_screenshots/CMPE_A4_4_tenantJS-tests_coverage.png?raw=true">

## Code Coverage

### 1. Running a code coverage test for the Python code:

> Follow the instructions in "Running Unit Tests - 2. Tenant Page Testing", your output should look similar to the image below:

<img width="607" alt="Screenshot 2024-11-11 at 10 02 13 PM" src="https://github.com/Nickysterling/Cisc327-F24-Group17-SI/blob/main/Assignment-4/report_and_screenshots/CMPE_A4_3_with_abs_imports_ss.png?raw=true">

### 2. Running a code coverage test for the tenant JS code

> Follow the instructions in "Running Unit Tests - 2. Tenant Page Testing". You should get an output that looks like the image below:

<img width="607" alt="Screenshot 2024-11-11 at 10 02 13 PM" src="https://github.com/Nickysterling/Cisc327-F24-Group17-SI/blob/main/Assignment-4/report_and_screenshots/CMPE_A4_4_tenantJS-tests_coverage.png?raw=true">

## Integration Tests

### 1. Performing an integration test for the Python code:

From Cisc.. navigate to the integration tests directory:

```
cd Assignment-5
```

Then execute the pytest command below to run the integration test:

```
pytest -v tests/integration_tests/test_integration.py
```

It should provide an output that looks like the image below:

<img width="607" alt="python_integration_test_ss.png" src="https://github.com/Nickysterling/Cisc327-F24-Group17-SI/blob/main/Assignment-5/report_and_screenshots/python_integration_test_ss.png?raw=true">

> Note: The `register.py` file has a cover of 81% since the function needed to direclty register new users is tested from the unit tests and part of the functionality assessed in the integration test itself.

### 2. Peforming an integration test for the JavaScript code:

From Cisc.. navigate to the tenant_tests directory:

```
cd Assignment-5
cd tests
cd tenant_tests
```

Then execute the npm command to run the integration tests for both register and tenant pages by typing the following:

```
npm run coverage
```

It should provide an output that looks like this:

<img width="607" alt="js_integration_test.png" src="https://github.com/Nickysterling/Cisc327-F24-Group17-SI/blob/main/Assignment-5/report_and_screenshots/js_integration_test.png?raw=true">

## Database Querying

After SQLite installation, you can query the `rentease.db` database directly.

1. Navigate to the `data` directory:

   ```
   cd Assignment-5/data
   ```
2. Open the SQLite Command-Line Interface:

   ```
   sqlite3 rentease.db
   ```
3. Common Commands (Replace `users` with the desired table):

- View all tables: `.tables`
- Describe a table's structure: `.schema users`
- Select all records: `SELECT * FROM users;`
- Delete an account: `DELETE FROM users WHERE username = 'specific_username';`
- Exit SQLite: Type `.exit`

## Creating an Account

1. Go to the Registration Page: Navigate to `/register`.
2. Fill in the Form:

   - **Username**: Enter a unique username.
   - **Email**: Provide a valid email address.
   - **Password**: Create a secure password.
   - **User Type**: Select **Landlord** (Tenant option is currently disabled).
3. (Optional) Sign up with Google:

   - Click **Continue with Google** to simulate registration via Google.
4. Submit the form:

   - Once all required fields are filled, click **Register** to complete your account creation.

## Login Process

1. Go to the Login Page: Navigate to `/login`.
2. Enter your credentials:

   - **Username**: Enter your registered username.
   - **Email**: Enter your email address.
   - **Password**: Provide your password.
3. (Optional) Log in with Google:

   - Click **Continue with Google** to log in using a simulated Google account. You can use the test credentials `google_user_00@gmail.com` with the password `123`. Alternatively, if you’ve registered your own Google account, simply replace `00` with the corresponding number from your registration and use the password `123`.
4. Submit the form:

   - Click **Login** to access your account.

## Project Structure

```
Assignment-5/
├── apps/
│   ├── backend/
│   │   ├── login/
│   │   ├── models/
│   │   └── registration/
│   └── frontend/
│       ├── static/
│       └── templates/
├── data/
|   └── archive/
├── tests/
│   ├── integration_tests/
│   ├── unit_tests/
|   └── tenant_tests/
├── app.py
├── README.md
└── requirements.txt
```

## Individual Contributions

| Name                                  | Task/Contribution                                                                   |
| ------------------------------------- | ----------------------------------------------------------------------------------- |
| Samhith Sripada (20232740)            | 1. Implemented integration tests for Python routes.<br />2. Updated README.         |
| Nicholas Seegobin (20246787)          | 1. Created a report to document the coverage test analysis.<br />2. Updated README. |
| Rodrigo Del Aguila Velarde (20275528) | 1. Implemented integration tests for Javascript features.<br />2. Updated README.   |
