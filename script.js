// Connect to your Node server running on Port 3000
const socket = io("http://localhost:3000");

// Check if we are connected to the server
socket.on("connect", () => {
    console.log("Browser connected to Server! ID:", socket.id);
});

// Select your 'Create Private Room' button using the ID from your HTML
const createBtn = document.getElementById("createRoom");

if (createBtn) {
    createBtn.addEventListener("click", () => {
        console.log("Button clicked: Sending 'createRoom' event to server...");
        socket.emit("createRoom");
    });
}

// When the server generates the room code, show it in your HTML
socket.on("roomCreated", (roomCode) => {
    console.log("Room created! Code:", roomCode);
    
    // This updates the <h2> in your 'status-card' div
    const codeDisplay = document.getElementById("displayRoomCode");
    const statusCard = document.getElementById("game-status");

    if (codeDisplay && statusCard) {
        codeDisplay.innerText = roomCode;
        statusCard.style.display = "block"; // Make the card visible
        document.getElementById("lobby").style.display = "none"; // Hide the buttons
    }
});