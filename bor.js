const socket = io();
//the work is done



// 1. Get Room Code from URL
const urlParams = new URLSearchParams(window.location.search);
const roomCode = urlParams.get('room');
URLSearchParams(window.location.search);
if (roomCode){
    socket.emit('joinRoom', roomCode);
}

// 2. Identify the correct HTML elements
const messageDisplay = document.getElementById("turn-display"); // Matches your HTML
const roomSpan = document.getElementById("room-id"); // Matches your HTML
const cells = document.querySelectorAll(".cell");

let mySymbol = ""; 
let isMyTurn = false;

// 3. Connect to the Room
if (roomCode) {
    if (roomSpan) roomSpan.innerText = roomCode;
    socket.emit("joinRoom", roomCode);
    console.log("Joined room:", roomCode);
} else {
    window.location.href = "gameroom.html";
}

// 4. Listen for the START signal
socket.on("gameStart", (data) => {
    console.log("GAME START SIGNAL RECEIVED!", data);
    mySymbol = data.symbol;
    isMyTurn = data.yourTurn;
    
    // Using standard quotes to avoid backtick issues
    messageDisplay.innerText = "You are " + mySymbol + ". " + (isMyTurn ? "Your Turn!" : "Waiting for opponent...");
});

// This listens for the signal that a second player has finally joined your room
socket.on("opponentJoined", () => {
    console.log("Opponent has arrived!");
    // Update the UI for the Host
    messageDisplay.innerText = "You are X. Your Turn!";
    isMyTurn = true;
});
// 5. Handle the Clicks
cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
        // Only allow a move if it's your turn AND the cell is empty
        if (isMyTurn && cell.innerText === "") {
            cell.innerText = mySymbol;
            isMyTurn = false;
            messageDisplay.innerText = "Waiting for opponent...";
            
            // Send the move to the server
            socket.emit("makeMove", { 
                roomCode: roomCode, 
                index: index, 
                symbol: mySymbol 
            });
        }
    });
});

// 6. Receive Opponent's Move
socket.on("moveMade", (data) => {
    const targetCell = cells[data.index];
    if (targetCell) {
        targetCell.innerText = data.symbol;
        isMyTurn = true;
        messageDisplay.innerText = "Your Turn!";
    }
});

// 7. Handle Game Over
const modal = document.getElementById("game-over-modal");
const resultText = document.getElementById("result-text");

// Listen for the winner signal from the server
socket.on("gameOver", (result) => {
    modal.style.display = "flex"; // Show the popup
    
    if (result === "draw") {
        resultText.innerText = "It's a Draw! 🤝";
    } else {
        resultText.innerText = (result === mySymbol) ? "You Won! 🎉" : "You Lost... 💀";
    }
});

// "Play Again" Button
document.getElementById("rematch-btn").onclick = () => {
    socket.emit("requestRematch", roomCode);
};

// "Exit" Button
document.getElementById("exit-btn").onclick = () => {
    window.location.href = "gameroom.html";
};

// Handle the board clearing
socket.on("resetBoard", () => {
    // 1. Hide the winner popup
    document.getElementById("game-over-modal").style.display = "none";

    // 2. Clear all the X and O visuals from the grid
    cells.forEach(cell => {
        cell.innerText = "";
    });

    // 3. CRITICAL: Reset the Turn Logic
    // X always starts first.
    if (mySymbol === "X") {
        isMyTurn = true;
        messageDisplay.innerText = "Your Turn! (X)";
    } else {
        isMyTurn = false;
        messageDisplay.innerText = "Waiting for X to move... (O)";
    }
    
    console.log("Game state reset. My Symbol: " + mySymbol + " | My Turn: " + isMyTurn);
});