
// This is where program execution starts
const start = () => {

    // Gets the session id cookie
    const session_id = getCookieValue("session_id")

    // If there is a session id cookie, show the user's dashboard
    if (session_id) {
        showDashboard()
    }

    // If there's no session id cookie, have the user login
    else {
        authenticationContainer.style.setProperty("display", "flex")
        showLoginForm()
    }
}

// Starts program execution
start()