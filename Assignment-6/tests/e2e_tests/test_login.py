from playwright.sync_api import sync_playwright
from apps.backend.models.userModel import User

# set of users (first one is valid, rest are invalid)
existingUsers = [
    User(
        username="test_user_0",
        email="test_user_0@tester.com",
        password="abc123",
    ),
    User(
        username="e2e_invalid_tester_register0",
        email="e2e_invalid_tester0_____test.com",
        password="abc123",
    ),
    User(
        username="e2e_invalid_tester_register1",
        email="e2e_invalid_tester1@test.com",
        password="",
    ),
]

redirectURLs: [str] = []


def testUserLogin():
    print("\n>> Performing E2E Testing, might take up to 1 minute...")

    with sync_playwright() as p:
        i = 0
        for user in existingUsers:
            # Launch browser at maximum screen size
            browser = p.chromium.launch(headless=False)
            context = browser.new_context(viewport={"width": 1536, "height": 864})
            page = context.new_page()

            # Navigate to the rentease register page
            page.goto("http://127.0.0.1:5000/login")

            page.fill(
                selector='input[name="username"]', value=user.username, timeout=30000
            )
            page.fill(selector='input[name="email"]', value=user.email, timeout=30000)

            page.fill(
                selector='input[name="password"]', value=user.password, timeout=30000
            )

            # capture screenshot
            page.screenshot(
                path=f"report_and_screenshots/test_login/{i}_enter_fields_screenshot.png"
            )

            # Submit the form
            page.click('button[type="submit"]')

            # Print the current page URL
            print("Current Page URL:", page.url)

            # Append the url for assertion
            redirectURLs.append(page.url)

            # capture screenshot
            page.wait_for_timeout(250)
            page.screenshot(
                path=f"report_and_screenshots/test_login/{i}_successful_account_screenshot.png"
            )
            i += 1

            # Close browser after 1 sec
            page.wait_for_timeout(1000)
            browser.close()

    # Registration - Case 1: Successful login
    assert (
        redirectURLs[0]
        == f"http://127.0.0.1:5000/login_success?username={existingUsers[0].username}"
    )


def testRegisterCase1():
    # Registration - Case 2: Unsuccessful login
    assert (
        redirectURLs[1]
        != f"http://127.0.0.1:5000/login_success?username={existingUsers[1].username}"
    )


def testRegisterCase2():
    # Registration - Case 3: Unsuccessful login
    assert (
        redirectURLs[2]
        != f"http://127.0.0.1:5000/login_success?username={existingUsers[2].username}"
    )
