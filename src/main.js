// The dotenv module allows us to use enviroment variables stored in the .env file
import dotenv from "dotenv"

// Imports our server object
import server from "./server.js"

// This is where program execution begins
const start = () => {

    // Configures our enviroment variables
    dotenv.config()

    // Listens for incoming connections
    server.listen(process.env.server_port)
}

// Starts our program
start()
