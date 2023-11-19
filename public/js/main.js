
// This is where program execution starts
const start = async () => {
    const api_response = await authenticated()
    const api_data = await api_response.json()
    if (api_response.ok) {

        // If a user is authenticated, show the dashboard
        if (api_data.authenticated) {
            showDashboard()
        }

        // Otherwise, show the login screen
        else {
            authenticationContainer.style.setProperty("display", "flex")
            showLoginForm()
        }
    } else {
        alert(api_data.message)
    }
}

// Starts program execution
start()