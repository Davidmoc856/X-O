var board = null;
var game = new Chess();
var socket = io();
var roomId = window.location.hash.substring(1) || Math.random().toString(36).substr(2, 9);

// Update URL with Room ID for sharing
if (!window.location.hash) window.location.hash = roomId;
document.getElementById('room-id').innerText = roomId;

socket.emit('joinRoom', roomId);

// Listen for join success
socket.on('joinSuccess', () => {
    document.getElementById('status').innerText = 'Connected';
});

// Listen for waiting for opponent
socket.on('waitingForOpponent', () => {
    document.getElementById('status').innerText = 'Waiting for opponent';
});

// Listen for game start
socket.on('gameStart', () => {
    document.getElementById('status').innerText = 'Playing';
});

function onDrop(source, target) {
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    if (move === null) return 'snapback';

    // Send move to the other player
    socket.emit('chessMove', {
        roomId: roomId,
        move: move,
        boardConfig: game.fen()
    });
}

// Receive move from opponent
socket.on('chessMove', function(data) {
    game.move(data.move);
    board.position(game.fen());
});

var config = {
    draggable: true,
    position: 'start',
    onDrop: onDrop,
    pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
};
board = Chessboard('myBoard', config);