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
    const code = document.getElementById("roomInput").value; 
    if (code.length === 4) {
        socket.emit("joinRoom", code);
    } else {
        alert("Please enter a valid 4-digit code");
    }
});

// 3. LISTEN FOR GAME START (This is the critical fix)
// This is for the HOST who is still waiting in the lobby
socket.on("gameStart", (data) => {
    console.log("Opponent joined! Jumping to board...");
    
    // We use data.roomCode which we just added to the server
    window.location.href = `bor.html?room=${data.roomCode}`; 
});
document.getElementById("cancelBtn").addEventListener("click", () => {
    window.location.reload(); 
});