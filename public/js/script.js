// This function is used to send requests to our API
async function apiRequest(url, method, body = undefined) {

    // Creates the options for our request
    const options = { method: method, headers: { "Content-Type": "application/json" }, credentials: "include" }

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
})const cards_container = document.querySelector("#cards-container")

// This function retrieves all cards, but keeps them hidden
const fetchAllCards = async () => {
    cards_container.innerHTML = ""
    const api_response = await apiRequest("/api/urls", "GET")
    const api_data = await api_response.json()
    if (api_response.ok) {
        for (const card_data of api_data) {
            createCard(card_data)
        }
    } else {
        alert(api_data.message)
    }
}

// This function creats a card and adds it to the dashboard
const createCard = (card_data) => {

    // Creates the card itself
    const card = document.createElement("div")
    card.id = "card-" + card_data.id
    card.classList.add("card")
    cards_container.appendChild(card)

    // Creates the edit icon
    const editIcon = document.createElement("img")
    editIcon.src = "/images/edit-icon-24px.png"
    editIcon.addEventListener("click", showEditModal)
    card.appendChild(editIcon)

    // Creates the delete icon
    const deleteIcon = document.createElement("img")
    deleteIcon.addEventListener("click", showDeleteModal)
    deleteIcon.src = "/images/delete-icon-24px.png"
    card.appendChild(deleteIcon)

    // Creates the name heading
    const name = document.createElement("h2")
    name.classList.add("name")
    name.textContent = card_data.name
    card.appendChild(name)

    // Creates the shortened url paragraph
    const shortened_url = document.createElement("p")
    shortened_url.classList.add("shortened-url")
    let location = window.location.href
    if (location[location.length - 1] === "/") location = location.slice(0, location.length - 1)
    shortened_url.textContent = location + card_data.shortened_url
    card.appendChild(shortened_url)

    // Creates the target url paragraph
    const target_url = document.createElement("p")
    target_url.classList.add("target-url")
    target_url.textContent = card_data.target_url
    card.appendChild(target_url)
}

// Shows the card container
const showCardsContainer = () => {
    cards_container.style.setProperty("display", "block")
}const getCookieValue = (cookie_name) => {
    const cookies = document.cookie.split(";")
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim()
        let cookieParts = cookie.split("=")
        if (cookieParts[0] === cookie_name) {
            return cookieParts[1]
        }
    }
    return undefined
}
const dashboard = document.querySelector("#dashboard-container")

const showDashboard = () => {
    dashboard.style.setProperty("display", "block")
    fetchAllCards()
}
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
start()const createEditModal = document.querySelector("#create-and-edit-modal")
const deleteModal = document.querySelector("#delete-modal")

// Closes the modal
const closeCreateEditModal = () => {
    createEditModal.style.setProperty("display", "none")
    createEditModal.querySelector("form").reset()
    createEditModal.removeEventListener("submit", createURLHandler)
    createEditModal.removeEventListener("submit", editURLHandler)
}

// Shows the create modal
const showCreateModal = () => {
    createEditModal.querySelector("h2").textContent = "Create New URL"
    createEditModal.querySelector("form").querySelector("button").textContent = "Create URL"
    createEditModal.addEventListener("submit", createURLHandler)
    createEditModal.style.setProperty("display", "block")
}

// Create URL handler
const createURLHandler = async (event) => {
    event.preventDefault()
    const form = event.target

    const name = form.querySelector("#form-name").value
    const target_url = form.querySelector("#form-target-url").value

    const api_response = await createURL(name, target_url)
    if (api_response.ok) {
        fetchAllCards()
        closeCreateEditModal()
    } else {
        const api_data = await api_response.json()
        alert(api_data.message)
    }
}

// Shows the edit modal
const showEditModal = (event) => {

    const editIcon = event.target
    const card = editIcon.parentNode

    createEditModal.querySelector("h2").textContent = "Edit URL"
    createEditModal.querySelector("form").querySelector("button").textContent = "Update URL"
    createEditModal.querySelector("#form-id").value = card.id.split("-")[1]
    createEditModal.querySelector("#form-name").value = card.querySelector(".name").textContent
    createEditModal.querySelector("#form-target-url").value = card.querySelector(".target-url").textContent

    createEditModal.addEventListener("submit", editURLHandler)

    createEditModal.style.setProperty("display", "block")
}

// Edit URL handler
const editURLHandler = async (event) => {

    event.preventDefault()
    const form = event.target

    const id = form.querySelector("#form-id").value
    const name = form.querySelector("#form-name").value
    const target_url = form.querySelector("#form-target-url").value

    const api_response = await updateURL(id, name, target_url)
    if (api_response.ok) {
        fetchAllCards()
        closeCreateEditModal()
    } else {
        const api_data = await api_response.json()
        alert(api_data.message)
    }
}

// Delete URL handler
let deleteURLHandler = () => { }

// Shows the delete modal
const showDeleteModal = (event) => {

    const deleteIcon = event.target
    const card = deleteIcon.parentNode
    const id = card.id.split("-")[1]

    deleteModal.style.setProperty("display", "block")

    deleteURLHandler = async () => {
        const api_response = await deleteURL(id)
        if (api_response.ok) {
            fetchAllCards()
            closeDeleteModal()
        } else {
            const api_data = await api_response.json()
            alert(api_data.message)
        }
    }

    deleteModal.querySelector(".deleteButton").addEventListener("click", deleteURLHandler)
}

const closeDeleteModal = () => {
    deleteModal.style.setProperty("display", "none")
    deleteModal.querySelector(".deleteButton").removeEventListener("click", deleteURLHandler)
}