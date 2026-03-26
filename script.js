document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const createRoomBtn = document.getElementById("createRoom");

    if (createRoomBtn) {
        createRoomBtn.addEventListener('click', () => {
            console.log("create room button clicked")
            socket.emit('createRoom');
        });
    }

    socket.on('roomCreated', (roomCode) => {
        console.log(`Room created! redirecting to code: ${roomCode}`);
        window.location.href = `bor.html?room=${roomCode}`;
    });
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