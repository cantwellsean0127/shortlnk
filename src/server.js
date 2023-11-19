// The express module allows us to easily create and manage HTTP servers
import express from "express"

// The express-session module allows us to create and manage sessions
import express_session from "express-session"

// The express-rate-limit module allows us to limit the rate at which requests are handled
import express_rate_limit from "express-rate-limit"

// Imports our server routes
import routes from "./routes.js"

// Creates our express server instance
const server = express()

// This built-in middleware parses the body of any incoming requests and converts it into an object if the body is a JSON string
server.use(express.json())

// This build-in middleware rate limits requests to 100 per minute
server.use(express_rate_limit({ windowMs: 1 * 60 * 1000, max: 100 }))

// Middleware that will statically server files within the public directory. This is where our front-end file will be located.
server.use(express.static("./public"))

// Middleware for session management
server.use(express_session({ secret: process.env.session_key, saveUninitialized: false, resave: false, cookie: { secure: process.env.secure_cookies === "true", sameSite: "Strict" } }))

// Route for determining whether a user is authenticated or no
server.get("/api/authenticated", routes.authenticated)

// Route for registering a user
server.post("/api/register", routes.registerUser)

// Route for logging in a user
server.post("/api/login", routes.loginUser)

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