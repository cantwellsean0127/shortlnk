// This function is used to send requests to our API
async function apiRequest(url, method, body = undefined) {

    // Creates the options for our request
    const options = { method: method, headers: { "Content-Type": "application/json" } }

    // If we are sending a body, stringify it and add it to the options object
    if (body) options.body = JSON.stringify(body)

    // Send the API request
    const response = await fetch(url, options)

    // Returns our response
    return response
}

// User login
async function login(username, password) {
    return await apiRequest("/api/login", "POST", { username, password })
}

// User registration
async function register(username, password) {
    return await apiRequest("/api/register", "POST", { username, password })
}

// Create a new URL
async function createURL(name, target_url) {
    return await apiRequest("/api/urls", "POST", { name, target_url })
}

// Update an existing URL
async function updateURL(id, name, target_url) {
    return await apiRequest("/api/urls", "PATCH", { id, name, target_url })
}

// Delete a URL
async function deleteURL(id) {
    return await apiRequest("/api/urls", "DELETE", { id })
}

// Get a list of all URLs
async function getURLs() {
    return await apiRequest("/api/urls", "GET")
}

// Get a single URL by ID
async function getURLById(id) {
    return await apiRequest(`/api/urls/${id}`, "GET")
}
