const socket = io("http://localhost:3000");

// 1. CREATE ROOM LOGIC
document.getElementById("createRoom").addEventListener("click", () => {
    socket.emit("createRoom");
});

socket.on("roomCreated", (roomCode) => {
    document.getElementById("displayRoomCode").innerText = roomCode;
    document.getElementById("game-status").style.display = "block";
    document.getElementById("lobby").style.display = "none";
});

// 2. JOIN ROOM LOGIC
document.getElementById("joinRoom").addEventListener("click", () => {
    const code = document.getElementById("roomInput").value; // Gets the 4 digits you typed
    if (code.length === 4) {
        socket.emit("joinRoom", code);
        console.log("Attempting to join room:", code);
    } else {
        alert("Please enter a valid 4-digit code");
    }
});

// 3. CANCEL BUTTON LOGIC
document.getElementById("cancelBtn").addEventListener("click", () => {
    // This just refreshes the page to take you back to the main menu
    window.location.reload(); 
});

// 4. LISTEN FOR GAME START
socket.on("gameStart", (data) => {
    console.log("Opponent found! Room:", data.roomCode);
    
    // This is the magic line that moves everyone to the game board
    window.location.href = `bor.html?room=${data.roomCode}`; 
});