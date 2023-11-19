// Imports our server object
import server from "./server.js"

// This is where program execution begins
const start = () => {

    // Listens for incoming connections on port 80
    server.listen(80)
}

// Starts our program
start()