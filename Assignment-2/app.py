from flask import Flask, render_template, request, redirect, url_for
import json
from apps.backend.models.userModel import User
from apps.backend.registration.register import getUserData, setUserData

app = Flask(
    __name__,
    template_folder="apps/frontend/templates",
    static_folder="apps/frontend/static",
)


# Route for user registration
@app.route("/", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        # Get form data
        newUser = User(
            username=request.form["username"],
            email=request.form["email"],
            password=request.form["password"],
            user_type=request.form.get("user_type", "Tenant"),
        )

        if setUserData(newUser=newUser):
            return redirect(url_for("register_success", username=newUser.username))
        else:
            return redirect(url_for("register_failure", reason="user_exists"))

    return render_template("register/register.html")


# Route to simulate registration for a Google user
@app.route("/google_redirect")
def google_redirect():

    # Assign a mock credential set for google user
    userIterator = len(getUserData(isGoogleAuth=True))
    newUser = User(
        username=f"google_user_{userIterator}",
        email=f"google_user_{userIterator}@gmail.com",
        password="123",
        user_type="Landlord",
    )

    # add to existing set of google users in database
    if setUserData(newUser=newUser, isGoogleAuth=True):
        return redirect(url_for("register_success", username=newUser.username))
    else:
        # Add proper error handling for google registration failure
        return redirect(url_for("register_failure", reason="user_exists"))


# Route for successful registration
@app.route("/register_success")
def register_success():
    username = request.args.get("username")
    return render_template("register/register_success.html", username=username)


# Route for registration failure
@app.route("/register_failure")
def register_failure():
    reason = request.args.get("reason")
    return render_template("register/register_failure.html", reason=reason)


# Route to go back to the registration page
@app.route("/go_back")
def go_back():
    return redirect(url_for("register"))


# DIFFERENT
@app.route("/login", methods=["GET", "POST"])
def login():
    # collecting the form fields
    # checking to see if fields match db
    # if yes: success, else failure

    if request.method == "POST":

        # Debugging: print users to the console
        print(
            "User List:",
            getUserData(),
            "Google User List:",
            getUserData(isGoogleAuth=True),
        )

        user = User(
            username=request.form["username"],
            email=request.form["email"],
            password=request.form["password"],
        )

        # Check if the email and password match a user in the users list
        userAccounts = getUserData()
        for account in userAccounts:
            if (
                account.username == user.username
                and account.email == user.email
                and account.password == user.password
            ):
                return redirect(url_for("login_success", username=user.username))

        # If credentials do not match, redirect to login failure page
        return redirect(url_for("login_failure"))

    return render_template("login/login.html")


# Route to login with a Google account
@app.route("/choose_google_account")
def choose_google_account():
    error = request.args.get("error")
    return render_template("login/auth.html", error=error)


# Route for Google sign in using email verification
@app.route("/google_signin", methods=["POST"])
def google_signin():
    email = request.form["email"]

    userAccounts = getUserData(isGoogleAuth=True)

    # Loop through the list of User objects and print their details
    for account in userAccounts:
        if account.email == email:
            # Email recognized, redirect to password entry page
            return redirect(url_for("password_entry", email=email))
        
    # Email not recognized, redirect back with error parameter
    return redirect(url_for("choose_google_account", error=1))


# Route for Google sign in password page
@app.route("/password_entry/<email>")
def password_entry(email):
    error = request.args.get("error")
    return render_template("login/auth_pass.html", email=email, error=error)


# Direct user to a success message if correct password, else show failure message
@app.route("/password_verify/<email>", methods=["POST"])
def password_verify(email):
    password = request.form["password"]
    userAccounts = getUserData(isGoogleAuth=True)

    for account in userAccounts:
        if account.password == password and account.email == email:
            # Password is correct, redirect to login success page
            return redirect(url_for("login_success", username=account.username))
        
    # Password is incorrect, redirect back to the password page with an error
    return redirect(url_for("password_entry", email=email, error=1))


# Route for login success page
@app.route("/login_success")
def login_success():
    username = request.args.get("username")
    return render_template("login/login_success.html", username=username)


# Route for login failure page
@app.route("/login_failure")
def login_failure():
    return render_template("login/login_failure.html")


# Route for forgot password functionality
@app.route("/forgot_password", methods=["GET", "POST"])
def forgot_password():
    if request.method == "POST":
        # Simulate password reset functionality
        return redirect(url_for("forgot_password_success"))
    return render_template("login/forgot_password.html")


# Route for successful password reset
@app.route("/forgot_password_success")
def forgot_password_success():
    return render_template("login/forgot_password_success.html")


@app.route("/tenants")
def tenants():
    return render_template("tenants/tenants.html")


if __name__ == "__main__":
    app.run(debug=True)
