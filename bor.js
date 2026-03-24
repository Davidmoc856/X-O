const socket = io("http://localhost:3000");

// 1. Get Room Code from the URL
const urlParams = new URLSearchParams(window.location.search);
const roomCode = urlParams.get('room');

const messageDisplay = document.getElementById("turn-display");
const roomSpan = document.getElementById("room-id");

let mySymbol = ""; 
let isMyTurn = false;

// 2. Setup Connection
if (roomCode) {
    if (roomSpan) roomSpan.innerText = roomCode;
    socket.emit("joinRoom", roomCode); 
} else {
    alert("No room code found! Going back to lobby.");
    window.location.href = "gameroom.html";
}

// 3. Listen for Game Start (Wait for 2nd player)
socket.on("gameStart", (data) => {
    mySymbol = data.symbol;
    isMyTurn = data.yourTurn; // Get turn status directly from server
    
    // Using proper backticks (the key next to '1')
    messageDisplay.innerText = `You are ${mySymbol}. ${isMyTurn ? "Your Turn!" : "Waiting for opponent..."}`;
});

// 4. Handle Clicks on the Grid
document.querySelectorAll(".cell").forEach((cell) => {
    cell.addEventListener("click", () => {
        const index = cell.id; // Gets "0", "1", etc. from your HTML IDs
        
        if (isMyTurn && cell.innerText === "") {
            // Update local UI immediately
            cell.innerText = mySymbol;
            isMyTurn = false;
            messageDisplay.innerText = "Waiting for opponent...";
            
            // Send to server
            socket.emit("makeMove", { 
                roomCode: roomCode, 
                index: index, 
                symbol: mySymbol 
            });
        }
    });
});

// 5. Listen for Opponent's Move
socket.on("moveMade", (data) => {
    const opponentCell = document.getElementById(data.index);
    if (opponentCell) {
        opponentCell.innerText = data.symbol;
        isMyTurn = true;
        messageDisplay.innerText = "Your Turn!";
    }
});

// 6. Handle Game Over
socket.on("gameOver", (winner) => {
    setTimeout(() => {
        if (winner === "draw") {
            alert("It's a tie!");
        } else {
            alert(`Player ${winner} wins the match!`);
        }
        window.location.href = "gameroom.html";
    }, 100);
});