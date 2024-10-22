## Assignment-2

This repository contains a backend and frontend application with user authentication functionality.

## Installation

1. Make sure you have Python installed on your system (Python 3.6 or higher is recommended)
2. Install the required packages using pip and the requirements.txt file:

```
pip install -r requirements.txt
```

## Running the Application

1. Navigate to the project's root directory in your terminal after cloning the repository

```
cd Assigment-2
```

2. Run the application using Python:

```
python app.py
```

The flask server should start running on your local machine on port 5000.

## Running Unit Tests

1. Navigate to the project's root directory in your terminal:

```
cd Assignment-2
```

2. To run the test scripts, navigate to this directory:

```
cd tests/unit_tests/
```

3: Then, enter this command to run the unit tests for the new user and login features

```
pytest -v -s new_user.py login.py
```

The output should look like this:
<img width="1729" alt="Unit tests new user login" src="https://github.com/user-attachments/assets/117ae697-ecd4-4ead-8a6e-f72f5de3a96d">


## Project Structure

```
Assignment-2/
├── apps/
│   ├── backend/
│   │   ├── login/
│   │   ├── models/
│   │   └── registration/
│   └── frontend/
│       ├── static/
│       └── templates/
├── tests/
│   └── unit_tests/
└── requirements.txt
```
