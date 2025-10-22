// main server

import https from "https";
import fs from "fs";
import { handle_unknown_requests } from "./controllers/unknown_requests";
import dotenv from "dotenv";
import { handle_requests } from "./controllers/main_requests";
// necessary imports and controllers ^^

dotenv.config();

const PORT = process.env.PORT || 6000;

const options = {
    key: fs.readFileSync("./certificate/key.pem"),
    cert: fs.readFileSync("./certificate/cert.pem")
}

const server = https.createServer(options, (req, res) => {
    // do things only if the url matches and also the type of request
    handle_requests(req, res);
    // handle requests from another url or request type
    handle_unknown_requests(req, res);
});


// starting the server
server.listen(PORT, "0.0.0.0", () => {
    console.log("server running successfully");
});