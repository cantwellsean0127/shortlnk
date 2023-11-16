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

    // Performs the query and returns the results to the client
    const query_options = [req.body.name, req.body.target_url, shortended_url]
    database_response = await database_client.query("INSERT INTO urls (name, target_url, shortened_url) VALUES ($1, $2, $3) RETURNING *;", query_options)
    res.json(database_response.rows[0])
}


// Exports our routes
export default {
    createShortenedURL: createShortenedURL
}