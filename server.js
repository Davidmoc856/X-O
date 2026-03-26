const express = require('express');
const http = require('http'); // 1. Add this line
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app); // 2. Create the server using your app
const io = new Server(server); // 3. Attach Socket.io to that server

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public'))); 
// Make sure your HTML/JS files are in a folder named 'public' 
// OR just use app.use(express.static(__dirname)); if they are in the root.

// ... keep your socket.on logic here ...

// 4. Update this line to use 'server'
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

// Function to check for a win 
function checkWinner(board) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    for (let line of lines) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Returns 'X' or 'O'
        }
    }
    return board.includes(null) ? null : "draw";
}



io.on("connection", (socket) => {
    console.log("New Connection:", socket.id);

    // FIX 1: Bring back the Create Room button logic
    socket.on("createRoom", () => {
        const roomCode = Math.floor(1000 + Math.random() * 9000).toString();
        rooms[roomCode] = { players: [], board: Array(9).fill(null) };
        socket.emit("roomCreated", roomCode); // Sends code back to script.js
        console.log(`Room ${roomCode} created.`);
    });

    socket.on("joinRoom", (roomCode) => {
        const room = rooms[roomCode];
        if (room) {
            socket.join(roomCode);
            if (room.players.length < 2 && !room.players.includes(socket.id)) {
                room.players.push(socket.id);
            }

            const isHost = room.players[0] === socket.id;
            socket.emit("gameStart", {
                symbol: isHost ? "X" : "O",
                yourTurn: isHost,
                roomCode: roomCode
            });

            if (room.players.length === 2) {
                io.to(room.players[0]).emit("opponentJoined");
            }
        } else {
            socket.emit("error", "Room not found! Please create one first.");
        }
    });

    
socket.on("makeMove", (data) => {
    const room = rooms[data.roomCode];
    if (room) {
        // Update the server's version of the board
        room.board[data.index] = data.symbol;

        // Broadcast the move to the other player
        socket.to(data.roomCode).emit("moveMade", data);

        // Check for a winner
        const result = checkWinner(room.board);
        if (result) {
            console.log(`Game Over in Room ${data.roomCode}: ${result}`);
            // Tell EVERYONE in the room who won
            io.to(data.roomCode).emit("gameOver", result);
            
            // Clean up the room after a few seconds so it can be reused
           // setTimeout(() => { delete rooms[data.roomCode]; }, 5000);
        }
    }
});
socket.on("requestRematch", (roomCode) => {
    const room = rooms[roomCode];
    if (room) {
        room.board = Array(9).fill(null); // Wipe server board
        
        // IMPORTANT: Tell BOTH players to reset and who starts
        // We broadcast to everyone in the room
        io.to(roomCode).emit("resetBoard"); 
        console.log(`Room ${roomCode} board has been cleared for rematch.`);
    }
});
});