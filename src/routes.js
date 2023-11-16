// The dotenv module allows us to use enviroment variables stored in the .env file
import dotenv from "dotenv"

// Imports our database client object
import database_client from "./database.js"

// Configures our enviroment variables
dotenv.config()

// Whenever this route is called, create a new URL
const createShortenedURL = async (req, res) => {

    // Generates the shortened URL
    let database_response = await database_client.query("SELECT TO_HEX(nextval('shortened_url_sequence'));")
    const shortended_url = `${process.env.server_address}/${database_response.rows[0].to_hex}`

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
    const query_options = [req.body.name, req.body.target_url, shortended_url]
    database_response = await database_client.query("INSERT INTO urls (name, target_url, shortened_url) VALUES ($1, $2, $3) RETURNING *;", query_options)
    res.json(database_response.rows[0])
}

// Whenever this route is called, returns all of a user's URLs
const readURLs = async (req, res) => {

    // Performs the query and returns the results to the client
    const database_client_response = await database_client.query("SELECT * FROM urls;")
    res.json(database_client_response.rows)
}

// Whenever this route is called, returns all of a user's URLs
const readURL = async (req, res) => {

    // Verifies the id is a valid integer
    const idIntegerValue = parseInt(req.params.id)
    if (isNaN(idIntegerValue) || idIntegerValue + "" !== req.params.id) {
        sendBadRequest(req, res, "Non-integer value passed as id.")
        return
    }
    req.params.id = idIntegerValue

    // Performs the query and returns the results to the client
    const query_options = [req.params.id]
    const database_client_response = await database_client.query("SELECT * FROM urls WHERE id = $1;", query_options)
    res.json(database_client_response.rows)
}

// Whenever this route is called, updates a URL
const updateURL = async (req, res) => {

    // Verifies the id is a valid integer
    const idIntegerValue = parseInt(req.params.id)
    if (isNaN(idIntegerValue) || idIntegerValue + "" !== req.params.id) {
        sendBadRequest(req, res, "Non-integer value passed as id.")
        return
    }
    req.params.id = idIntegerValue

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
    const query_options = [req.body.name, req.body.target_url, req.body.id]
    const database_response = await database_client.query("UPDATE urls SET name = $1, target_url = $2 WHERE id = $3 RETURNING *;", query_options)
    res.json(database_response.rows[0])
}

// Whenever this route is called, delete a URL
const deleteURL = async (req, res) => {

    // Performs the query and returns the results to the client
    const query_options = [req.body.id]
    const database_response = await database_client.query("DELETE FROM urls WHERE id = $1 RETURNING *;", query_options)
    res.json(database_response.rows[0])
}

// This function is used to send a bad request response
const sendBadRequest = (req, res, err) => {
    res.status(400)
    res.send(err)
}

// Exports our routes
export default {
    createShortenedURL: createShortenedURL,
    readURLs: readURLs,
    readURL: readURL,
    updateURL: updateURL,
    deleteURL: deleteURL
}