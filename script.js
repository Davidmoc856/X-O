document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup the connection and buttons
    const socket = io();
    const createRoomBtn = document.getElementById("createRoom");
    const joinRoomBtn = document.getElementById("joinRoom");
    const roomInput = document.getElementById("roomInput");

    console.log("DOM Loaded - Socket Initialized");

    // 2. CREATE ROOM LOGIC
    if (createRoomBtn) {
        createRoomBtn.addEventListener('click', () => {
            console.log("Emitting createRoom...");
            socket.emit('createRoom');
        });
    }

    // 3. JOIN ROOM LOGIC (Now safely inside the bubble)
    if (joinRoomBtn) {
        joinRoomBtn.addEventListener('click', () => {
            const code = roomInput.value.trim();
            if (code.length === 4) {
                console.log("Emitting joinRoom for code:", code);
                socket.emit('joinRoom', code);
            } else {
                alert("Please enter a valid 4-digit code");
            }
        });
    }

    // 4. SERVER RESPONSES
    socket.on('roomCreated', (roomCode) => {
        console.log("Room Success! Redirecting...");
        window.location.href = `bor.html?room=${roomCode}`;
    });

    // This tells the "Joiner" to move to the game page once the server confirms they joined
    socket.on('joinSuccess', (roomCode) => {
        console.log("Joined successfully! Moving to game...");
        window.location.href = `bor.html?room=${roomCode}`;
    });

    socket.on('error', (message) => {
        alert(message); // Tells them if the room code was wrong
    });

}); // <--- THIS bracket must be at the very bottom of the file