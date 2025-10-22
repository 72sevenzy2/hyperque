// controller for handling requests outside of the preferred url or request type

export function handle_unknown_requests(req, res) {
    if (!req.method === "POST" && !req.url === "/makeQueue") {
        res.writeHead(404, { "content-type": "application/json" });
        res.end(JSON.stringify({ message: "server not found" }));
        return;
    }
}