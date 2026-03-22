const board = document.getElementById('game-board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];

const winConditions = [
    [0,1,2], [3,4,5], [6,7,8], // Rows
    [0,3,6], [1,4,7], [2,5,8], // Cols
    [0,4,8], [2,4,6]           // Diagonals
];

function handleCellClick(e) {
    const index = e.target.getAttribute('data-index');
    if (gameState[index] !== "" || checkWinner()) return;

    gameState[index] = currentPlayer;
    e.target.innerText = currentPlayer;
    
    if (checkWinner()) {
        statusText.innerText = `🎉 Player ${currentPlayer} Wins!`;
        statusText.style.color = "#1038199f"; // Make it green for the winner
    } else if (!gameState.includes("")) {
        statusText.innerText = "🤝 It's a Draw!";
        statusText.style.color = "#777";
    } else {
        // Switch player
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        // UPDATE THE STATUS TEXT HERE:
        statusText.innerText =` Player ${currentPlayer}'s Turn`;
    }
}

function checkWinner() {
    return winConditions.some(condition => {
        return condition.every(index => gameState[index] === currentPlayer);
    });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', () => location.reload());