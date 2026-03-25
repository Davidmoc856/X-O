const io = require("socket.io")(3000, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// The "Memory" of your game
const rooms = {};

function checkWinner(board) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let line of lines) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    return board.includes(null) ? null : "draw";
}

io.on("connection", (socket) => {
    console.log(`Connection: ${socket.id}`);

    // 1. CREATE ROOM
    socket.on("createRoom", () => {
        const roomCode = Math.floor(1000 + Math.random() * 9000).toString();
        rooms[roomCode] = {
            players: [], // Start empty, will fill when they land on bor.html
            board: Array(9).fill(null)
        };
        socket.emit("roomCreated", roomCode);
        console.log(`Room ${roomCode} created.`);
    });

    // 2. JOIN ROOM (The logic that makes it responsive)
    socket.on("joinRoom", (roomCode) => {
    const room = rooms[roomCode];

    if (room) {
        socket.join(roomCode);

        // Add the player if they aren't already counted
        if (!room.players.includes(socket.id) && room.players.length < 2) {
            room.players.push(socket.id);
            console.log(`User ${socket.id} added to Room ${roomCode}. Total: ${room.players.length}`);
        }

        // Send info to the person WHO JUST JOINED immediately
        const isHost = room.players[0] === socket.id;
        socket.emit("gameStart", { 
            symbol: isHost ? "X" : "O", 
            yourTurn: isHost, 
            roomCode: roomCode 
        });

        // If the second player is now here, notify the FIRST player to update their screen
        if (room.players.length === 2) {
            console.log(`Room ${roomCode} is full. Starting game!`);
            io.to(room.players[0]).emit("opponentJoined"); 
        }
    } else {
        socket.emit("error", "Room not found!");
    }
});
    // 3. MAKE MOVE
    socket.on("makeMove", (data) => {
        const room = rooms[data.roomCode];
        if (room) {
            room.board[data.index] = data.symbol;
            
            // Broadcast to everyone else in the room
            socket.to(data.roomCode).emit("moveMade", {
                index: data.index,
                symbol: data.symbol
            });

            const result = checkWinner(room.board);
            if (result) {
                io.to(data.roomCode).emit("gameOver", result);
                delete rooms[data.roomCode]; 
            }
        }
    });

    socket.on("disconnect", () => {
        console.log(`Disconnected: ${socket.id}`);
    });
});

console.log("-----------------------------------------");
console.log("Tic-Tac-Toe Server: STANDBY on Port 3000");
console.log("-----------------------------------------");