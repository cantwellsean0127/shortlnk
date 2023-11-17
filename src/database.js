// The dotenv module allows us to use enviroment variables stored in the .env file
import dotenv from "dotenv"

// The pg module allows us to interact with our PostgreSQL database
import pg from "pg"

// Configures our enviroment variables
dotenv.config()

// Creates our database client from a connection string
const database_client = new pg.Client({
    connectionString: process.env.database_connection_string
})

// Attempts to connect to our PostgreSQL database
// On failure, exits the program
try {
    await database_client.connect()
} catch (err) {
    console.log(err)
    process.exit(1)
}

// Exports our database client object
export default database_client