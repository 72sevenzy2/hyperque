import https from "https";
import fs from "fs";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
// necessary imports ^^

dotenv.config();

const PORT = process.env.PORT || 6000;

const options = {
    key: fs.readFileSync("./certificate/key.pem"),
    cert: fs.readFileSync("./certificate/cert.pem")
}

let games = {}; // where we will hold our games

function assign(players, teamcol1, teamcol2, res) {
    // check if the team colors are strings
    if (typeof teamcol1 === "string" && typeof teamcol2 === "string") {
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
        try {
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
                    res.writeHead(401, { "content-type": "application/json" });
                    res.end(JSON.stringify({ message: "missing fields" }));
                    return;
                }
                // create a game instance
                if (!games[gameId]) { games[gameId] = {}; }

                // create  game and queuetype instance
                if (!games[gameId][queueType]) { games[gameId][queueType] = { queue: [], matches: {} }; }

                const gamequeue = games[gameId][queueType].queue;
                const gamematches = games[gameId][queueType].matches;

                // adding (of each game) a individual player to the queue
                gamequeue.push(playerId);

                // checking if the queue has enough players
                if (gamequeue.length >= matchSize) {
                    const matchplayers = gamequeue.splice(0, matchSize);
                    const matchId = uuidv4();
                    const teams = assign(matchplayers, color1, color2, res);

                    // match

                    const match = { players: matchplayers, teams, status: "waiting" };
                    gamematches[matchId] = match;

                    // for debugging
                    console.log("match created");
                    return res.end(JSON.stringify({ matchId, ...match }));
                }
                return res.end(JSON.stringify({ status: "queued", queueLength: gamequeue.length }));
            });
        } catch (error) {
            res.writeHead(400, { "content-type": "application/json" }).end(JSON.stringify({ message: "error", error }));
        }
    }
    else {
        res.writeHead(400, { "content-type": "application/json" }).end(JSON.stringify({ msg: "invalid url" }));
    }
});


// starting the server
server.listen(PORT, "0.0.0.0", () => {
    console.log("server running successfully");
});