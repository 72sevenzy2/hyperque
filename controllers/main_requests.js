import { assign } from "./assign_teams.js";
import { v4 as uuidv4 } from "uuid";
import { db } from "./database/database.js";

// necessary imports ^^

export function handle_requests(req, res) {
    if (req.method === "POST" && req.url === "/makeQueue") {
        try {
            let body = ""; // where we will store the body data

            req.on("data", (chunk) => {
                // convert buffer to string
                body += chunk.toString();
            });

            req.on("end", () => {
                try {
                    // extracting the data that is supposed to be passed in
                    const { playerId, gameId, queueType = "default",
                        matchSize = 4, color1 = "red", color2 = "blue" } = JSON.parse(body);

                    if (!playerId && !gameId && !queueType && !matchSize && !color1 && !color2) {
                        res.writeHead(401, { "content-type": "application/json" });
                        res.end(JSON.stringify({ message: "missing fields" }));
                        return;
                    }

                    // check if the match size is below 1 or equal to 1, if so do error
                    if (matchSize <= 1) {
                        res.writeHead(401, { "conten-type": "application/json" });
                        res.end(JSON.stringify({ error: "match size cant be 1 or below 1" }));
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
                } catch (error) {
                    res.writeHead(404, { "content-type": "application/json" });
                    res.end(JSON.stringify({ message: "something went wrong" }));
                    return;
                }
            });
        } catch (error) {
            res.writeHead(400, { "content-type": "application/json" }).end(JSON.stringify({ message: "error", error }));
        }
    }
}