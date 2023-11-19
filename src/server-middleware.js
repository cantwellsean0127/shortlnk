// The express module allows us to add built-in middlewares
import express from "express"

// The express-session module allows us to create and manage sessions
import express_session from "express-session"

// The connect-pg-simple module helps us with storing sessions in our database
import connect_pg_simple from "connect-pg-simple"

// The express-rate-limit module allows us to limit the rate at which requests are handled
import express_rate_limit from "express-rate-limit"

// Imports our database pool object
import database_pool from "./database.js"

// When this module is imported and invoked, set the server middleware
export default (server) => {

    // This built-in middleware parses the body of any incoming requests and converts it into an object if the body is a JSON string
    server.use(express.json())

    // This build-in middleware rate limits requests to 100 per minute
    server.use(express_rate_limit({ windowMs: 1 * 60 * 1000, max: 100 }))

    // Middleware that will statically server files within the public directory. This is where our front-end file will be located.
    server.use(express.static("./public"))

    // Middleware for session management
    server.use(express_session({
        store: new (connect_pg_simple(express_session))({
            pool: database_pool,
            tableName: "sessions"
        }),
        secret: process.env.session_key,
        saveUninitialized: false,
        resave: false,
        cookie: {
            secure: process.env.secure_cookies === "true",
            sameSite: "Strict"
        }
    }))

}