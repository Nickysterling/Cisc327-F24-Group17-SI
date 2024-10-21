from flask import Flask, render_template, request, redirect, url_for
import json
from apps.backend.models.userModel import User
from apps.backend.registration.register import getUserData, setUserData

app = Flask(
    __name__,
    template_folder="apps/frontend/templates",
    static_folder="apps/frontend/static",
)


# # Helper function to create and append a new user (either regular or Google user)
# def create_user(username, email, password, user_type, is_google_user=False):

#     newUser = User(
#         username=username, email=email, password=password, user_type=user_type
#     )

#     # if

#     if is_google_user:
#         google_users.append(newUser)
#     else:
#         userList.append(newUser)


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


# Route to simulate Google login and register a Google user
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


# Route for the login page
@app.route("/login")
def login():
    # Debugging: print users to the console
    print(
        "User List:",
        getUserData(),
        "\Google User List:",
        getUserData(isGoogleAuth=True),
    )
    return render_template("login/login.html")


@app.route("/choose_google_account")
def choose_google_account():
    return render_template("login/auth.html")


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


if __name__ == "__main__":
    app.run(debug=True)
