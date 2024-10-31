class User:
    def __init__(
        self, username: str, email: str, password: str, user_type: str = "Landlord"
    ):

        self.username = username
        self.email = email
        self.password = password
        self.user_type = user_type

    def to_dict(self):

        # convert the object into a dictionary to store into database
        return {
            "username": self.username,
            "email": self.email,
            "password": self.password,
            "user_type": self.user_type,
        }
