// This function is used to send requests to our API
const apiRequest = async (url, method, body = undefined) => {

    // Creates the options for our request
    const options = { method: method, headers: { "Content-Type": "application/json" }, credentials: "include" }

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
    return await apiRequest("/api/login", "POST", { username, password })
}

// User registration
const register = async (username, password) => {
    return await apiRequest("/api/register", "POST", { username, password })
}

// Create a new URL
const createURL = async (name, target_url) => {
    return await apiRequest("/api/urls", "POST", { name, target_url })
}

// Update an existing URL
const updateURL = async (id, name, target_url) => {
    return await apiRequest("/api/urls", "PATCH", { id, name, target_url })
}

// Delete a URL
const deleteURL = async (id) => {
    return await apiRequest("/api/urls", "DELETE", { id })
}

// Get a list of all URLs
const getURLs = async () => {
    return await apiRequest("/api/urls", "GET")
}

// Get a single URL by ID
const getURLById = async (id) => {
    return await apiRequest(`/api/urls/${id}`, "GET")
}
