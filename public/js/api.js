// This function is used to send requests to our API
const apiRequest = async (url, method, body = undefined, use_token = false) => {

    // Creates the options for our request
    const options = { method: method, headers: { "Content-Type": "application/json" }, credentials: "include" }

    // Gets this sessions CSRF token
    if (use_token) {
        const api_response = await fetch("/api/csrf-token")
        const api_data = await api_response.json()
        let csrf_token = undefined
        if (api_response.ok) {
            csrf_token = api_data.csrf_token
            options.headers["X-CSRF-Token"] = csrf_token
        } else {
            alert(api_data.message)
        }
    }

    // If we are sending a body, stringify it and add it to the options object
    if (body) options.body = JSON.stringify(body)

    // Send the API request
    const response = await fetch(url, options)

    // Returns our response
    return response
}

// Authenticated
const authenticated = async () => {
    return await apiRequest("/api/authenticated", "GET")
}

// User login
const login = async (username, password) => {
    return await apiRequest("/api/login", "POST", { username, password }, true)
}

// User registration
const register = async (username, password) => {
    return await apiRequest("/api/register", "POST", { username, password }, true)
}

// Create a new URL
const createURL = async (name, target_url) => {
    return await apiRequest("/api/urls", "POST", { name, target_url }, true)
}

// Update an existing URL
const updateURL = async (id, name, target_url) => {
    return await apiRequest("/api/urls", "PATCH", { id, name, target_url }, true)
}

// Delete a URL
const deleteURL = async (id) => {
    return await apiRequest("/api/urls", "DELETE", { id }, true)
}

// Get a list of all URLs
const getURLs = async () => {
    return await apiRequest("/api/urls", "GET", true)
}

// Get a single URL by ID
const getURLById = async (id) => {
    return await apiRequest(`/api/urls/${id}`, "GET", true)
}
