// The express module allows us to easily create and manage HTTP servers
import express from "express"

// Imports our middleware function
import middleware from "./server-middleware.js"

// Imports our settings function
import settings from "./server-settings.js"

// Imports our server routes
import routes from "./server-routes.js"

// Creates our express server instance
const server = express()

// Sets the settings
settings(server)

// Adds the middleware
middleware(server)

// Adds our routes
routes(server)

// Exports our server object
export default server