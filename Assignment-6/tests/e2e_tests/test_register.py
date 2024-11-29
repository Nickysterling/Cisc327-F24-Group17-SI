from playwright.sync_api import sync_playwright
from apps.backend.models.userModel import User
from apps.backend.registration.register import deleteUser

# set of users (first one is valid, rest are invalid)
users = [
    User(
        username="e2e_tester_register",
        email="e2e_tester_register@test.com",
        password="abc123",
        user_type="Landlord",
    ),
    User(
        username="e2e_invalid_tester_register0",
        email="e2e_invalid_tester_register0_____test.com",
        password="abc123",
        user_type="Landlord",
    ),
    User(
        username="e2e_invalid_tester_register1",
        email="e2e_invalid_tester_register1@test.com",
        password="",
        user_type="Landlord",
    ),
]

redirectURLs: [str] = []


def testUserRegistration():
    print("\n>> Performing E2E Testing, might take up to 1 minute...")

    with sync_playwright() as p:
        i = 0
        for user in users:
            # Launch browser at maximum screen size
            browser = p.chromium.launch(headless=False)
            context = browser.new_context(viewport={"width": 1536, "height": 864})
            page = context.new_page()

            # Navigate to the rentease register page
            page.goto("http://127.0.0.1:5000/")

            page.fill(
                selector='input[name="username"]', value=user.username, timeout=30000
            )
            page.fill(selector='input[name="email"]', value=user.email, timeout=30000)

            page.fill(
                selector='input[name="password"]', value=user.password, timeout=30000
            )

            landlord_radio = page.query_selector(
                'input[name="user_type"][value="Landlord"]'
            )

            if landlord_radio:
                print("Exists:", landlord_radio is not None)
                print("Visible:", landlord_radio.is_visible())
                print("Enabled:", landlord_radio.is_enabled())
                print("Checked:", landlord_radio.is_checked())
            else:
                print("Landlord radio button not found.")

            page.click('label[for="landlord"]')

            # capture screenshot
            page.screenshot(
                path=f"report_and_screenshots/test_register/{i}_enter_fields_screenshot.png"
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
                path=f"report_and_screenshots/test_register/{i}_successful_account_screenshot.png"
            )
            i += 1

            # Close browser after 1 sec
            page.wait_for_timeout(1000)
            browser.close()

    deleteUser(username=users[0].username)

    # Registration - Case 1: Successful registration
    assert (
        redirectURLs[0]
        == f"http://127.0.0.1:5000/register_success?username={users[0].username}"
    )


def testRegisterCase1():
    # Registration - Case 2: Unsuccessful registration
    assert (
        redirectURLs[1]
        != f"http://127.0.0.1:5000/register_success?username={users[1].username}"
    )


def testRegisterCase2():
    # Registration - Case 3: Unsuccessful registration
    assert (
        redirectURLs[2]
        != f"http://127.0.0.1:5000/register_success?username={users[2].username}"
    )
