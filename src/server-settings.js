// When this module is imported and invoked, set the server settings
export default (server) => {
    server.set("trust proxy", true)
}