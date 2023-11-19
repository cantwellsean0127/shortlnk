// The dotenv module allows us to use enviroment variables stored in the .env file
import dotenv from "dotenv"

// The crytpo module allows us to perform cryptographic functions
import bcrypt from "bcrypt"

// Imports our database pool object
import database_pool from "./database.js"

// Configures our enviroment variables
dotenv.config()

// Whenever this route is called, return whether a user is authenticated
const authenticated = (req, res) => {
    res.json({ authenticated: req.session.authenticated === true })
}

// Whenever this route is called, create a new user
const registerUser = async (req, res) => {

    // Verifies the username was provided
    if (req.body.username === undefined) {
        sendBadRequest(req, res, "No username provided.")
        return
    }

    // Verifies the password was provided
    if (req.body.password === undefined) {
        sendBadRequest(req, res, "No password provided.")
        return
    }

    // Verifies the username passed does not already exists
    let query_options = [req.body.username]
    let database_response = await database_pool.query("SELECT username FROM users WHERE username = $1;", query_options)
    if (database_response.rowCount !== 0) {
        res.status(409)
        res.json({ message: `Username ${req.body.username} already exists.` })
        return
    }

    // Hashes the password
    const password_hash = bcrypt.hashSync(req.body.password, parseInt(process.env.salt_rounds))

    // Inserts the user data into the database'
    query_options = [req.body.username, password_hash]
    database_response = await database_pool.query("INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *;", query_options)
    if (database_response.rowCount === 0) {
        sendBadRequest(req, res, "Unable to register account.")
        return
    }

    // Logs the new user in
    loginUser(req, res)
}

// Whenever this route is called, login a user
const loginUser = async (req, res) => {

    // Get's the user's id
    let query_options = [req.body.username]
    let database_response = await database_pool.query("SELECT id FROM users WHERE username = $1;", query_options)
    if (database_response.rowCount === 0) {
        sendBadRequest(req, res, "Credentials are invalid.")
        return
    }
    const user_id = database_response.rows[0].id

    // Gets the password hash
    query_options = [user_id]
    database_response = await database_pool.query("SELECT password_hash FROM users WHERE id = $1;", query_options)
    const password_hash = database_response.rows[0].password_hash

    // Compares the passwords
    if (!bcrypt.compareSync(req.body.password, password_hash)) {
        sendBadRequest(req, res, "Credentials are invalid." + "     " + req.body.password + "     " + password_hash)
        return
    }

    // Regenerates the session
    req.session.regenerate((err) => {

        // Sets session variables
        req.session.authenticated = true
        req.session.user_id = user_id

        // Sends success
        res.json({ message: "Success" })
    })
}

// Whenever this route is called, create a new URL
const createShortenedURL = async (req, res) => {

    // Verifies a user is authenticated
    if (!req.session.authenticated) {
        sendBadRequest(req, res, "User not authenticated.")
        return
    }

    // Generates the shortened URL
    let database_response = await database_pool.query("SELECT TO_HEX(nextval('shortened_url_sequence'));")
    const shortended_url = `/${database_response.rows[0].to_hex}`

    // Verifies the target url was provided
    if (req.body.target_url === undefined) {
        sendBadRequest(req, res, "No target URL provided.")
        return
    }

    // Parses the provided target URL to verify it's format
    try {
        req.body.target_url = new URL(req.body.target_url).toString()
    } catch (err) {
        sendBadRequest(req, res, err.code)
        return
    }

    // If a name was not provided, set the name to "Unnamed"
    if (req.body.name === "" || req.body.name === undefined) {
        req.body.name = "Unnamed"
    }

    // Performs the query and returns the results to the client
    let query_options = [req.body.name, req.body.target_url, shortended_url, req.session.user_id]
    database_response = await database_pool.query("INSERT INTO urls (name, target_url, shortened_url, user_id) VALUES ($1, $2, $3, $4) RETURNING *;", query_options)
    res.json(database_response.rows[0])
}

// Whenever this route is called, returns all of a user's URLs
const readURLs = async (req, res) => {

    // Verifies a user is authenticated
    if (!req.session.authenticated) {
        sendBadRequest(req, res, "User not authenticated.")
        return
    }

    // Performs the query and returns the results to the client
    const query_options = [req.session.user_id]
    const database_response = await database_pool.query("SELECT * FROM urls WHERE user_id = $1;", query_options)
    res.json(database_response.rows)
}

// Whenever this route is called, returns all of a user's URLs
const readURL = async (req, res) => {

    // Verifies a user is authenticated
    if (!req.session.authenticated) {
        sendBadRequest(req, res, "User not authenticated.")
        return
    }

    // Verifies the id is a valid integer
    const idIntegerValue = parseInt(req.params.id)
    if (isNaN(idIntegerValue) || idIntegerValue + "" !== req.params.id) {
        sendBadRequest(req, res, "Non-integer value passed as id.")
        return
    }
    req.params.id = idIntegerValue

    // Performs the query and returns the results to the client
    const query_options = [req.params.id, req.session.user_id]
    const database_response = await database_pool.query("SELECT * FROM urls WHERE id = $1 AND user_id = $2;", query_options)
    res.json(database_response.rows[0])
}

// Whenever this route is called, updates a URL
const updateURL = async (req, res) => {

    // Verifies a user is authenticated
    if (!req.session.authenticated) {
        sendBadRequest(req, res, "User not authenticated.")
        return
    }

    // Verifies the id is a valid integer
    if (typeof req.body.id !== "number") {
        const idIntegerValue = parseInt(req.body.id)
        if (isNaN(idIntegerValue) || idIntegerValue + "" !== req.body.id) {
            sendBadRequest(req, res, "Non-integer value passed as id.")
            return
        }
        req.body.id = idIntegerValue
    }

    // Verifies the target url was provided
    if (req.body.target_url === undefined) {
        sendBadRequest(req, res, "No target URL provided.")
        return
    }

    // Parses the provided target URL to verify it's format
    try {
        req.body.target_url = new URL(req.body.target_url).toString()
    } catch (err) {
        sendBadRequest(req, res, err.code)
        return
    }

    // If a name was not provided, set the name to "Unnamed"
    if (req.body.name === "" || req.body.name === undefined) {
        req.body.name = "Unnamed"
    }

    // Performs the query and returns the results to the client
    const query_options = [req.body.name, req.body.target_url, req.body.id, req.session.user_id]
    const database_response = await database_pool.query("UPDATE urls SET name = $1, target_url = $2 WHERE id = $3 AND user_id = $4 RETURNING *;", query_options)
    res.json(database_response.rows[0])
}

// Whenever this route is called, delete a URL
const deleteURL = async (req, res) => {

    // Verifies a user is authenticated
    if (!req.session.authenticated) {
        sendBadRequest(req, res, "User not authenticated.")
        return
    }

    // Verifies the id is a valid integer
    if (typeof req.body.id !== "number") {
        const idIntegerValue = parseInt(req.body.id)
        if (isNaN(idIntegerValue) || idIntegerValue + "" !== req.body.id) {
            sendBadRequest(req, res, "Non-integer value passed as id.")
            return
        }
        req.body.id = idIntegerValue
    }

    // Performs the query and returns the results to the client
    const query_options = [req.body.id, req.session.user_id]
    const database_response = await database_pool.query("DELETE FROM urls WHERE id = $1 AND user_id = $2 RETURNING *;", query_options)
    res.json(database_response.rows[0])
}

// This function is used to send a bad request response
const sendBadRequest = (req, res, err) => {
    res.status(400)
    res.json({ message: err })
}

// Whenever this route is called, redirect users to the target URL
const redirect = async (req, res) => {
    const query_options = [req.url]
    const database_response = await database_pool.query("SELECT target_url FROM urls WHERE shortened_url = $1;", query_options)
    if (database_response.rowCount === 0) {
        res.redirect("/page-not-found.html")
    } else {
        res.redirect(database_response.rows[0].target_url)
    }
}

// Exports our routes
export default (server) => {

    // Route for determining whether a user is authenticated or no
    server.get("/api/authenticated", authenticated)

    // Route for registering a user
    server.post("/api/register", registerUser)

    // Route for logging in a user
    server.post("/api/login", loginUser)

    // Route for creating a new url
    server.post("/api/urls", createShortenedURL)

    // Route for reading a all user's URLs
    server.get("/api/urls/", readURLs)

    // Route for reading a all user's URLs
    server.get("/api/urls/:id", readURL)

    // Route for updating a user's URL
    server.put("/api/urls/", updateURL)
    server.patch("/api/urls/", updateURL)

    // Route for deleting a user's URL
    server.delete("/api/urls/", deleteURL)

    // Route for redirecting users to another url
    server.get("/*", redirect)
}
