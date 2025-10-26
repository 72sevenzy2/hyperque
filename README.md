# HyperQue.js

## (This project is still in its early stages.)

### hyperque is a lightweight tool used to effortlessly create a cross-server matchmaking systems BACKEND API HyperQue lets the developers focus only the LuaU scripting part of things, whilst letting hyperque handle all the requests, sorting all the teams and sending data back to their game which lets it know which queued players to teleport players to a different server.

# Instillation

To get started: `npm install hyperque`

Or if your using yarn:

`yarn add hyperque`


# USAGE

you must send a JSON formatted data of the player trying to queue into a match, so whilst sending a http request to the backend endpoint (from roblox) please makesure to include the following:
`
{
"playerId": "string",
"gameId": "string",
"queueType": "default",
"matchSize": number,
"color1": "red",
"color2": "blue"
}
`
^ you can change the values into the actual data, and just to clarify the queueType is ment for knowing which kind of game
the player is wanting to get queued into, by default its set to "default", but be sure to change it according to the players choice. The color1 and color2 are which colors team 1, and team 2 should have, you may change it according to your preferences, color1 is set to "red" by default and color2 is set to "blue" by default.

And this is how the response will look like:

{
  "matchId": "random-uuid-string",
  "players": ["playerA", "playerB", "playerC", "playerD"],
  "teams": {
    "red": ["playerA", "playerB"],
    "blue": ["playerC", "playerD"]
  }
}

^ for the matchId, the random-uuid-string is basically the unique match id that will be given to you after the match has been created.


## Theres mainly 2 ways to get started with hyperque.

### - installing the package directly via npm or yarn and host it on your own, (you can also set custom endpoints specifically for your roblox game), and send requests to it in roblox, and based on the data you teleport your players accordingly.

### - sending an request to the already-hosted server, (it has 1 endpoint which any game can use.), and await the data which is sent back from the server. (still not hosted as of now, will remove this when it does.)



## I would appreciate feedback aswell, my discord is @72seventy2, and instagram: @72sevenzy2


### License - MIT