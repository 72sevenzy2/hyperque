import https from "https";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
// necessary imports ^^

const options = {
    key: fs.readFileSync("./certificate/key.pem"),
    cert: fs.readFileSync("./certificate/cert.pem")
}

let games = {}; // where we will hold our games

function assign(players, teamcol1, teamcol2, req, res) {
    // check if the team colors are strings
    if (String(teamcol1, teamcol2)) {
        const teams = {};

        // split the teams
        const half = Math.floor(players.length / 2);
        for (let j = 0; j < players.length; j++) {
            teams[players[j]] = j < half ? teamcol1 : teamcol2;
        }
        return teams;
    }
    else {
        res.writeHead(400, { "content-type": "application/json" }).end(JSON.stringify({ message: "invalid format" }));
    }
}

const server = https.createServer(options, (req, res) => {
    // do things only if the url matches and also the type of request
    if (req.method === "POST" && req.url === "/makeQueue") {
        let body = ""; // where we will store the body data

        req.on("data", (chunk) => {
            // convert buffer to string
            body += chunk.toString();
        });

        req.on("end", () => {
            // extracting the data that is supposed to be passed in
            const { playerId, gameId, queueType = "default",
                matchSize = 4, color1 = "red", color2 = "blue" } = JSON.parse(body);

            if (!playerId && !gameId) {
                res.writeHead(401, { "content-type": "appplication/json" });
                res.end(JSON.stringify({ message: "missing fields" }));
                return;
            }

        });
    }
});