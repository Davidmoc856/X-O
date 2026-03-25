const socket = io("http://localhost:3000");

// 1. Get Room Code from URL
const urlParams = new URLSearchParams(window.location.search);
const roomCode = urlParams.get('room');

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
cells.forEach((cell) => {
    cell.addEventListener("click", () => {
        if (isMyTurn && cell.innerText === "") {
            cell.innerText = mySymbol;
            isMyTurn = false;
            messageDisplay.innerText = "Waiting for opponent...";
            socket.emit("makeMove", { roomCode, index: cell.id, symbol: mySymbol });
        }
    });
});

// 6. Receive Opponent's Move
socket.on("moveMade", (data) => {
    const targetCell = document.getElementById(data.index);
    if (targetCell) {
        targetCell.innerText = data.symbol;
        isMyTurn = true;
        messageDisplay.innerText = "Your Turn!";
    }
});

// 7. Handle Game Over
socket.on("gameOver", (winner) => {
    alert(winner === "draw" ? "It's a tie!" : "Player " + winner + " wins!");
    window.location.href = "gameroom.html";
});
