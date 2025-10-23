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

            req.on("end", async () => {
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
                    await db.query("INSERT iGNORE INTO games (id, name) VALUES (?, ?)", [gameId, gameId]);

                    await db.query("INSERT INTO queues (game_id, queue_type, player_id) VALUES (?, ?, ?)",
                        [gameId, queueType, playerId]);

                    const [rows] = await db.query("SELECT * FROM queues WHERE game_id = ? AND queue_type = ? AND status = queued",
                        [gameId, queueType]);

                    // checking if the queue has enough players
                    if (rows.length >= matchSize) {
                        const matchplayers = rows.splice(0, matchSize).map(r => r.player_id);
                        const matchId = uuidv4();
                        const teams = assign(matchplayers, color1, color2, res);

                        // save match
                        await db.query("INSERT INTO matches (id, game_id, players, teams, status) VALUES (?, ?, ?, ?, ?)",
                            [matchId, gameId, JSON.stringify(matchplayers), JSON.stringify(teams), "waiting.."]);

                        // mark as already matched

                        await db.query("UPDATE queues SET status = 'matched' WHERE player_id IN (?)", [matchplayers]);

                        // for debugging
                        console.log("match created");
                        return res.end(JSON.stringify({ matchId, players: matchplayers, teams}));
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