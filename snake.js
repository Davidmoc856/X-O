// 1. Get Elements
const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score-val');

// 2. Game Variables
let snake = [];
let food = { x: 0, y: 0 };
let dx = 1;
let dy = 0;
let score = 0;
let gameSpeed = 100;
let gameActive = false;

// 3. Initialize Function
function initSnake() {
    console.log("Saint World System: Initializing...");
    
    // Get speed from the dropdown
    const speedSelect = document.getElementById('speed-select');
    gameSpeed = parseInt(speedSelect.value); // Converts the option value to a number
    
    // Reset Stats
    snake = [{ x: 10, y: 10 }];
    score = 0;
    dx = 1;
    dy = 0;
    gameActive = true;
    
    // UI Updates
    if (scoreEl) scoreEl.innerText = "0";
    const startBtn = document.getElementById('start-btn');
    const selector = document.querySelector('.level-selector');
    
    if (startBtn) startBtn.style.display = 'none';
    if (selector) selector.style.display = 'none'; // Hide selector during play

    generateFood();
    runGame();
}



// 4. Game Loop
function runGame() {
    if (!gameActive) return;

    setTimeout(function() {
        // Clear screen
        ctx.fillStyle = "#0a0a1a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Food
        ctx.fillStyle = "#ff0055";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#ff0055";
        ctx.fillRect(food.x * 20 + 2, food.y * 20 + 2, 16, 16);

        // Move Snake
        const headX = snake[0].x + dx;
        const headY = snake[0].y + dy;
        const newHead = { x: headX, y: headY };

        // Check Collisions
        if (headX < 0 || headX >= 20 || headY < 0 || headY >= 20 || checkSelfCollision(newHead)) {
            endGame();
            return;
        }

        snake.unshift(newHead);

        // Check Food
        if (headX === food.x && headY === food.y) {
            score += 10;
            if (scoreEl) scoreEl.innerText = score;
            generateFood();
            if (gameSpeed > 50) gameSpeed -= 2;
        } else {
            snake.pop();
        }

        // Draw Snake
        snake.forEach((part, index) => {
            ctx.fillStyle = (index === 0) ? "#00d2ff" : "rgba(0, 210, 255, 0.6)";
            ctx.shadowBlur = (index === 0) ? 15 : 0;
            ctx.shadowColor = "#00d2ff";
            ctx.beginPath();
            ctx.arc(part.x * 20 + 10, part.y * 20 + 10, 8, 0, Math.PI * 2);
            ctx.fill();
        });

        runGame();
    }, gameSpeed);
}

// 5. Helper Functions
function generateFood() {
    food.x = Math.floor(Math.random() * 20);
    food.y = Math.floor(Math.random() * 20);
}

function checkSelfCollision(head) {
    return snake.some(part => part.x === head.x && part.y === head.y);
}

// ALSO: Update your endGame/gameOver function to show the selector again
function endGame() {
    gameActive = false;
    alert("SYSTEM CRASH! Score: " + score);
    const startBtn = document.getElementById('start-btn');
    const selector = document.querySelector('.level-selector');
    
    if (startBtn) {
        startBtn.style.display = 'inline-block';
        startBtn.innerText = 'REBOOT STREAM';
    }
    if (selector) selector.style.display = 'block'; // Bring it back for the next round
}

// 6. Controls
window.addEventListener('keydown', e => {
    if (e.keyCode === 37 && dx !== 1) { dx = -1; dy = 0; }
    if (e.keyCode === 38 && dy !== 1) { dx = 0; dy = -1; }
    if (e.keyCode === 39 && dx !== -1) { dx = 1; dy = 0; }
    if (e.keyCode === 40 && dy !== -1) { dx = 0; dy = 1; }
});

// Function for Mobile Button Controls
function setDir(newDx, newDy) {
    // Prevent the snake from reversing on itself
    if (newDx === -1 && dx === 1) return;
    if (newDx === 1 && dx === -1) return;
    if (newDy === -1 && dy === 1) return;
    if (newDy === 1 && dy === -1) return;

    dx = newDx;
    dy = newDy;
}