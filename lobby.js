const io = require("socket.io")(3000, {
    cors: { origin: "*" } 
});

const rooms = {};

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // 1. Handling Room Creation (Lobby)
    socket.on("createRoom", () => {
        const roomCode = Math.floor(1000 + Math.random() * 9000).toString();
        // We store the creator as the first player (X)
        rooms[roomCode] = { 
            players: [socket.id], 
            board: Array(9).fill(null),
            currentTurn: 0 // Index 0 (X) starts first
        };
        socket.join(roomCode);
        socket.emit("roomCreated", roomCode);
        console.log(`Room ${roomCode} created.`);
    });

    // 2. Handling Joining (Lobby & Board)
    socket.on("joinRoom", (roomCode) => {
        if (rooms[roomCode]) {
            const room = rooms[roomCode];

            // If it's the second player joining
            if (room.players.length === 1 && room.players[0] !== socket.id) {
                room.players.push(socket.id);
                socket.join(roomCode);
                
                // Tell BOTH players to start. 
                // We tell the creator they are 'X' and the joiner they are 'O'
                io.to(room.players[0]).emit("gameStart", { roomCode, symbol: "X", yourTurn: true });
                io.to(room.players[1]).emit("gameStart", { roomCode, symbol: "O", yourTurn: false });
                
                console.log(`User joined room ${roomCode}. Game starting!`);
            } 
            // If the player is just reconnecting/refreshing the board page
            else if (room.players.includes(socket.id)) {
                socket.join(roomCode);
            }
        } else {
            socket.emit("error", "Room not found o!");
        }
    });

    // 3. Handling Moves (Board)
    socket.on("makeMove", (data) => {
        // data: { roomCode, index, symbol }
        const room = rooms[data.roomCode];
        if (room) {
            // Send the move to the OTHER player in that room
            socket.to(data.roomCode).emit("moveMade", {
                index: data.index,
                symbol: data.symbol
            });
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected.");
        // Logic to clean up empty rooms can go here
    });
});

console.log("Server is running on port 3000...");