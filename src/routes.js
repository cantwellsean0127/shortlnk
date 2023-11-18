// The dotenv module allows us to use enviroment variables stored in the .env file
import dotenv from "dotenv"

// The crytpo module allows us to perform cryptographic functions
import crypto from "crypto"

// Imports our database client object
import database_client from "./database.js"

// Configures our enviroment variables
dotenv.config()

// Whenever this route is called, create a new user
const registerUser = async (req, res) => {
    ``

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
    let database_response = await database_client.query("SELECT username FROM users WHERE username = $1;", query_options)
    if (database_response.rowCount !== 0) {
        res.status(409)
        res.json({ message: `Username ${req.body.username} already exists.` })
        return
    }

    // Generates a random 32 byte salt for the password hash
    let salt = ""
    for (let iteration = 0; iteration < 16; iteration++) {
        salt += Math.round(Math.random() * 255).toString(16).padStart(2, "0")
    }

    // Hashes the password with the salt
    const password_hash = crypto.createHash("sha256").update(salt + req.body.password).digest("hex")

    // Inserts the user data into the database'
    query_options = [req.body.username, password_hash, salt]
    database_response = await database_client.query("INSERT INTO users (username, password_hash, password_salt) VALUES ($1, $2, $3) RETURNING *;", query_options)

    // Logs the new user in
    loginUser(req, res)
}

// Whenever this route is called, login a user
const loginUser = async (req, res) => {

    // Get's the user's salt
    let query_options = [req.body.username]
    let database_response = await database_client.query("SELECT password_salt FROM users WHERE username = $1;", query_options)
    if (database_response.rowCount === 0) {
        sendBadRequest(req, res, "Credentials are invalid.")
        return
    }
    let salt = database_response.rows[0].password_salt

    const password_hash = crypto.createHash("sha256").update(salt + req.body.password).digest("hex")

    // Verifies credentials
    query_options = [req.body.username, password_hash]
    database_response = await database_client.query("SELECT username FROM users WHERE username = $1 AND password_hash = $2;", query_options)
    if (database_response.rowCount === 0) {
        sendBadRequest(req, res, "Credentials are invalid.")
        return
    }

    // Generates a random 64 byte session id for the password hash
    let session_id = ""
    for (let iteration = 0; iteration < 32; iteration++) {
        session_id += Math.round(Math.random() * 255).toString(16).padStart(2, "0")
    }

    // Updates the user's session id in the database
    query_options = [session_id, req.body.username]
    database_response = await database_client.query("UPDATE users SET session_id = $1 WHERE username = $2 RETURNING *;", query_options)

    // Sets the cookie to be the session id
    const cookie_options = {
        secure: false,
        sameSite: "Strict",
        httpOnly: true
    }
    res.cookie("session_id", session_id, cookie_options)

    // Sends nothing right now
    res.json([])
}

// Whenever this route is called, logs out a user
const logoutUser = async (req, res) => {

    // Verifies a session id was passed
    if (req.cookies.session_id === undefined) {
        sendBadRequest(req, res, "No session id passed.")
        return
    }

    // Get's the current user's id
    let query_options = [req.cookies.session_id]
    let database_response = await database_client.query("SELECT id FROM users WHERE session_id = $1;", query_options)
    if (database_response.rowCount === 0) {
        sendBadRequest(req, res, "Invalid session id.")
        return
    }
    const user_id = database_response.rows[0].id

    // Removes the user's session id
    query_options = [user_id]
    database_response = await database_client.query("UPDATE users SET session_id = null WHERE id = $1;", query_options)

    // Clears the session id cookie
    res.clearCookie("session_id")

    // Sends nothing right now
    res.json([])
}

// Whenever this route is called, create a new URL
const createShortenedURL = async (req, res) => {

    // Verifies a session id was passed
    if (req.cookies.session_id === undefined) {
        sendBadRequest(req, res, "No session id passed.")
        return
    }

    // Get's the current user's id
    let query_options = [req.cookies.session_id]
    let database_response = await database_client.query("SELECT id FROM users WHERE session_id = $1;", query_options)
    if (database_response.rowCount === 0) {
        sendBadRequest(req, res, "Invalid session id.")
        return
    }
    const user_id = database_response.rows[0].id

    // Generates the shortened URL
    database_response = await database_client.query("SELECT TO_HEX(nextval('shortened_url_sequence'));")
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
        sendBadRequest(req, res, err)
        return
    }

    // If a name was not provided, set the name to "Unnamed"
    if (req.body.name === "" || req.body.name === undefined) {
        req.body.name = "Unnamed"
    }

    // Performs the query and returns the results to the client
    query_options = [req.body.name, req.body.target_url, shortended_url, user_id]
    database_response = await database_client.query("INSERT INTO urls (name, target_url, shortened_url, user_id) VALUES ($1, $2, $3, $4) RETURNING *;", query_options)
    res.json(database_response.rows[0])
}

// Whenever this route is called, returns all of a user's URLs
const readURLs = async (req, res) => {

    // Verifies a session id was passed
    if (req.cookies.session_id === undefined) {
        sendBadRequest(req, res, "No session id passed.")
        return
    }

    // Get's the current user's id
    let query_options = [req.cookies.session_id]
    let database_response = await database_client.query("SELECT id FROM users WHERE session_id = $1;", query_options)
    if (database_response.rowCount === 0) {
        sendBadRequest(req, res, "Invalid session id.")
        return
    }
    const user_id = database_response.rows[0].id

    // Performs the query and returns the results to the client
    query_options = [user_id]
    database_response = await database_client.query("SELECT * FROM urls WHERE user_id = $1;", query_options)
    res.json(database_response.rows)
}

// Whenever this route is called, returns all of a user's URLs
const readURL = async (req, res) => {

    // Verifies a session id was passed
    if (req.cookies.session_id === undefined) {
        sendBadRequest(req, res, "No session id passed.")
        return
    }

    // Get's the current user's id
    let query_options = [req.cookies.session_id]
    let database_response = await database_client.query("SELECT id FROM users WHERE session_id = $1;", query_options)
    if (database_response.rowCount === 0) {
        sendBadRequest(req, res, "Invalid session id.")
        return
    }
    const user_id = database_response.rows[0].id

    // Verifies the id is a valid integer
    const idIntegerValue = parseInt(req.params.id)
    if (isNaN(idIntegerValue) || idIntegerValue + "" !== req.params.id) {
        sendBadRequest(req, res, "Non-integer value passed as id.")
        return
    }
    req.params.id = idIntegerValue

    // Performs the query and returns the results to the client
    query_options = [req.params.id, user_id]
    database_response = await database_client.query("SELECT * FROM urls WHERE id = $1 AND user_id = $2;", query_options)
    res.json(database_response.rows)
}

// Whenever this route is called, updates a URL
const updateURL = async (req, res) => {

    // Verifies a session id was passed
    if (req.cookies.session_id === undefined) {
        sendBadRequest(req, res, "No session id passed.")
        return
    }

    // Get's the current user's id
    let query_options = [req.cookies.session_id]
    let database_response = await database_client.query("SELECT id FROM users WHERE session_id = $1;", query_options)
    if (database_response.rowCount === 0) {
        sendBadRequest(req, res, "Invalid session id.")
        return
    }
    const user_id = database_response.rows[0].id

    // Verifies the id is a valid integer
    if (typeof req.body.id !== "number") {
        const idIntegerValue = parseInt(req.body.id)
        if (isNaN(idIntegerValue) || idIntegerValue + "" !== req.body.id) {
            sendBadRequest(req, res, "Non-integer value passed as id. -> " + typeof req.body.id + " -> " + req.body.id)
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
        sendBadRequest(req, res, err)
        return
    }

    // If a name was not provided, set the name to "Unnamed"
    if (req.body.name === "" || req.body.name === undefined) {
        req.body.name = "Unnamed"
    }

    // Performs the query and returns the results to the client
    query_options = [req.body.name, req.body.target_url, req.body.id, user_id]
    database_response = await database_client.query("UPDATE urls SET name = $1, target_url = $2 WHERE id = $3 AND user_id = $4 RETURNING *;", query_options)
    res.json(database_response.rows[0])
}

// Whenever this route is called, delete a URL
const deleteURL = async (req, res) => {

    // Verifies a session id was passed
    if (req.cookies.session_id === undefined) {
        sendBadRequest(req, res, "No session id passed.")
        return
    }

    // Get's the current user's id
    let query_options = [req.cookies.session_id]
    let database_response = await database_client.query("SELECT id FROM users WHERE session_id = $1;", query_options)
    if (database_response.rowCount === 0) {
        sendBadRequest(req, res, "Invalid session id.")
        return
    }
    const user_id = database_response.rows[0].id

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
    query_options = [req.body.id, user_id]
    database_response = await database_client.query("DELETE FROM urls WHERE id = $1 AND user_id = $2 RETURNING *;", query_options)
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
    const database_response = await database_client.query("SELECT target_url FROM urls WHERE shortened_url = $1;", query_options)
    if (database_response.rowCount === 0) {
        res.redirect("/page-not-found.html")
    } else {
        res.redirect(database_response.rows[0].target_url)
    }
}

// Exports our routes
export default {
    registerUser: registerUser,
    loginUser: loginUser,
    logoutUser: logoutUser,
    createShortenedURL: createShortenedURL,
    readURLs: readURLs,
    readURL: readURL,
    updateURL: updateURL,
    deleteURL: deleteURL,
    redirect: redirect
}