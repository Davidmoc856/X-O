/* global io */
const socket = io("http://localhost:3000");

// 1. Get Room Code from the URL
const urlParams = new URLSearchParams(window.location.search);
const roomCode = urlParams.get('room');

// These start empty and get filled when the server says "Go!"
let mySymbol = "";
let isMyTurn = false;

// 2. Join the specific room as soon as the page loads
if (roomCode) {
    socket.emit("joinRoom", roomCode);
}

// 3. LISTEN for the server to start the game
socket.on("gameStart", (data) => {
    mySymbol = data.symbol;   // The server tells you if you are 'X' or 'O'
    isMyTurn = data.yourTurn; // The server tells you if it's your turn to move
    
    document.getElementById('room-id').innerText = data.roomCode;
    document.getElementById('turn-display').innerText = isMyTurn ? `Your Turn (${mySymbol}) `: `Opponent's Turn (${mySymbol === 'X' ? 'O' : 'X'})`;
});

// 4. Handle Board Clicks
const cells = document.querySelectorAll('.cell');
cells.forEach((cell, index) => {
    cell.onclick = () => {
        // Only allow a click if it's your turn AND the cell is empty
        if (isMyTurn && cell.innerText === "") {
            cell.innerText = mySymbol;
            cell.classList.add(mySymbol.toLowerCase());
            
            // Send the move to the server
            socket.emit("makeMove", {
                roomCode: roomCode,
                index: index,
                symbol: mySymbol
            });
            
            // Switch turn locally so you can't click twice
            isMyTurn = false;
            document.getElementById('turn-display').innerText = "Opponent's Turn...";
        }
    };
});

// 5. Receive Moves from your opponent
socket.on("moveMade", (data) => {
    const cell = cells[data.index];
    cell.innerText = data.symbol;
    cell.classList.add(data.symbol.toLowerCase());
    
    // Now it's your turn!
    isMyTurn = true;
    document.getElementById('turn-display').innerText = `Your Turn (${mySymbol})`;
});

// Handle errors
socket.on("error", (msg) => {
    alert(msg);
});
function checkWinner() {
    const cells = document.querySelectorAll('.cell');
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (cells[a].innerText && 
            cells[a].innerText === cells[b].innerText && 
            cells[a].innerText === cells[c].innerText) {
            
            alert(`Player ${cells[a].innerText} Wins!`);
            window.location.href = 'gameroom.html'; // Send back to lobby
            return true;
        }
    }
    
    // Check for Draw
    const isDraw = [...cells].every(cell => cell.innerText !== "");
    if (isDraw) {
        alert("It's a Draw!");
        window.location.href = 'gameroom.html';
    }
}