const authenticationContainer = document.querySelector("#auth-container")
const loginForm = document.querySelector("#login-form")
const registrationForm = document.querySelector("#registration-form")

// Sets the authentication forms to be hidden by default
authenticationContainer.style.setProperty("display", "none")

// This function displays the registration form and hides the login form
const showLoginForm = () => {
    loginForm.style.setProperty("display", "block")
    registrationForm.style.setProperty("display", "none")
}

// This function displays the registration form and hides the login form
const showRegistrationForm = () => {
    loginForm.style.setProperty("display", "none")
    registrationForm.style.setProperty("display", "block")
}

// When the login form is submitted, send the login request
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault()
    const username = loginForm.querySelector("#login-username").value
    const password = loginForm.querySelector("#login-password").value
    const api_response = await login(username, password)
    if (api_response.ok) {
        authenticationContainer.style.setProperty("display", "none")
        showDashboard()
    } else {
        const api_data = await api_response.json()
        alert(api_data.message)
    }
})

// When the registration form is submitted, send the register request
registrationForm.addEventListener("submit", async (event) => {
    event.preventDefault()
    const username = registrationForm.querySelector("#registration-username").value
    const password = registrationForm.querySelector("#registration-password").value
    const api_response = await register(username, password)
    if (api_response.ok) {
        authenticationContainer.style.setProperty("display", "none")
        showDashboard()
    } else {
        const api_data = await api_response.json()
        alert(api_data.message)
    }
})