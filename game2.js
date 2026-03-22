const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

const winConditions = [
    [0,1,2], [3,4,5], [6,7,8], 
    [0,3,6], [1,4,7], [2,5,8], 
    [0,4,8], [2,4,6]
];

function handleCellClick(e) {
    const index = e.target.getAttribute('data-index');
    if (gameState[index] !== "" || !gameActive) return;

    // Player X Moves
    makeMove(index, "X");

    // If no winner yet, Computer "O" moves after a short delay
    if (gameActive && gameState.includes("")) {
        statusText.innerText = "Computer is thinking...";
        setTimeout(computerMove, 600); 
    }
}

function computerMove() {
    // 50% chance to be a genius, 50% to be random
    const isGenius = Math.random() < 0.5;
    let moveIndex;

    if (isGenius) {
        // Use the smart minimax logic
        moveIndex = getBestMove(gameState); 
    } else {
        // Use the random logic you already have
        let emptyCells = [];
        gameState.forEach((val, idx) => { if (val === "") emptyCells.push(idx); });
        moveIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    if (moveIndex !== undefined) {
        makeMove(moveIndex, "O");
    }
}

function makeMove(index, player) {
    gameState[index] = player;
    document.querySelector(`[data-index='${index}']`).innerText = player;
    
    if (checkWinner()) {
        statusText.innerText = player === "X" ? "🎉 You Won!" : "🤖 Computer Won!";
        gameActive = false;
    } else if (!gameState.includes("")) {
        statusText.innerText = "🤝 It's a Draw!";
        gameActive = false;
    } else {
        statusText.innerText = player === "X" ? "Computer's Turn..." : "Your Turn (X)";
    }
}

function checkWinner() {
    return winConditions.some(condition => {
        const [a, b, c] = condition;
        // 1. Check if the first cell is NOT empty
        // 2. Check if the first cell matches the second
        // 3. Check if the first cell matches the third
        return gameState[a] !== "" && 
               gameState[a] === gameState[b] && 
               gameState[a] === gameState[c];
    });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', () => location.reload());
function getBestMove(board) {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    // Check for terminal states (win/loss/draw)
    if (checkWinnerForMinimax(board, "O")) return 10 - depth;
    if (checkWinnerForMinimax(board, "X")) return depth - 10;
    if (!board.includes("")) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "X";
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Helper for the brain to simulate the game
function checkWinnerForMinimax(board, player) {
    return winConditions.some(condition => {
        return condition.every(index => board[index] === player);
    });
}