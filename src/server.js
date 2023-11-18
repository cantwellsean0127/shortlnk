// The express module allows us to easily create and manage HTTP servers
import express from "express"

// The cookie-parser module allows us to use and manage cookies
import cookie_parser from "cookie-parser"

// Imports our server routes
import routes from "./routes.js"

// Creates our express server instance
const server = express()

// This built-in middleware parses the body of any incoming requests and converts it into an object if the body is a JSON string
server.use(express.json())

// Middleware that will statically server files within the public directory. This is where our front-end file will be located.
server.use(express.static("./public"))

// Middleware for parsing cookies
server.use(cookie_parser())

// Route for registering a user
server.post("/api/register", routes.registerUser)

// Route for logging in a user
server.post("/api/login", routes.loginUser)

// Route for logging out a user
server.post("/api/logout", routes.logoutUser)

// Route for creating a new url
server.post("/api/urls", routes.createShortenedURL)

// Route for reading a all user's URLs
server.get("/api/urls/", routes.readURLs)

// Route for reading a all user's URLs
server.get("/api/urls/:id", routes.readURL)

// Route for updating a user's URL
server.put("/api/urls/", routes.updateURL)
server.patch("/api/urls/", routes.updateURL)

// Route for deleting a user's URL
server.delete("/api/urls/", routes.deleteURL)

// Route for redirecting users to another url
server.get("/*", routes.redirect)

// Exports our server object
export default server