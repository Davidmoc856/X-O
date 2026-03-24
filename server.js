const io = require("socket.io")(3000, {
    cors: {
        origin: "*", // Allows any website/local file to connect
        methods: ["GET", "POST"]
    }
});

const rooms = {};

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // --- 1. LOBBY: CREATE ROOM ---
    socket.on("createRoom", () => {
        const roomCode = Math.floor(1000 + Math.random() * 9000).toString();
        
        rooms[roomCode] = {
            players: [socket.id], // First player (Creator)
            board: Array(9).fill(null),
            currentTurn: socket.id // Creator usually goes first
        };

        socket.join(roomCode);
        socket.emit("roomCreated", roomCode);
        console.log(`Room ${roomCode} created by ${socket.id}`);
    });

    // --- 2. LOBBY/BOARD: JOIN ROOM ---
    socket.on("joinRoom", (roomCode) => {
        const room = rooms[roomCode];

        if (room) {
            // Check if player is already in or if there is space for a 2nd player
            if (room.players.length === 1 && room.players[0] !== socket.id) {
                room.players.push(socket.id);
                socket.join(roomCode);

                console.log(`User ${socket.id} joined Room ${roomCode}. Starting game...`);

                // Tell Creator they are 'X' and it's their turn
                io.to(room.players[0]).emit("gameStart", { 
                    roomCode: roomCode, 
                    symbol: "X", 
                    yourTurn: true 
                });

                // Tell Joiner they are 'O' and they must wait
                io.to(room.players[1]).emit("gameStart", { 
                    roomCode: roomCode, 
                    symbol: "O", 
                    yourTurn: false 
                });
            } else if (room.players.includes(socket.id)) {
                // Handle reconnection if they refresh the bor.html page
                socket.join(roomCode);
            } else {
                socket.emit("error", "Room is full!");
            }
        } else {
            socket.emit("error", "Room not found!");
        }
    });

    // --- 3. BOARD: HANDLING MOVES ---
    socket.on("makeMove", (data) => {
        // data contains: { roomCode, index, symbol }
        const room = rooms[data.roomCode];
        
        if (room) {
            // Broadcast the move to the OTHER player in the room
            socket.to(data.roomCode).emit("moveMade", {
                index: data.index,
                symbol: data.symbol
            });
            console.log(`Move in ${data.roomCode}: ${data.symbol} at ${data.index}`);
        }
    });

    // --- 4. CLEANUP ---
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        // Optional: Add logic to close room if a player leaves
    });
});

console.log("-----------------------------------------");
console.log("Tic-Tac-Toe Server is LIVE on Port 3000");
console.log("-----------------------------------------");