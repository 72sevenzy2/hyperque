export function assign(players, teamcol1, teamcol2, res) {
    // check if the team colors are the appropriate datatype
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
