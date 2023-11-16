// The express module allows us to easily create and manage HTTP servers
import express from "express"

// Imports our server routes
import routes from "./routes.js"

// Creates our express server instance
const server = express()

// This built-in middleware parses the body of any incoming requests and converts it into an object if the body is a JSON string
server.use(express.json())

// Route for creating a new url
server.post("/api/urls", routes.createShortenedURL)

// Exports our server object
export default server