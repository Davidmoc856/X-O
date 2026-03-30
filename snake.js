const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score-val');
const msgEl = document.getElementById('msg');
const speedSelect = document.getElementById('speed-select');
const startBtn = document.getElementById('start-btn');
const selector = document.querySelector('.level-selector');
const controlButtons = document.querySelectorAll('.control-btn');

const gridSize = 20;
let cellSize = 20;
let snake = [];
let food = { x: 0, y: 0 };
let dx = 1;
let dy = 0;
let nextDx = 1;
let nextDy = 0;
let score = 0;
let gameSpeed = 100;
let gameActive = false;
let gameTimer = null;
let touchStartX = 0;
let touchStartY = 0;

function resizeCanvas() {
    const parentWidth = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
    const availableWidth = Math.min(parentWidth * 0.92, window.innerWidth * 0.82, 420);
    const boardSize = Math.max(260, Math.floor(availableWidth / gridSize) * gridSize);

    canvas.width = boardSize;
    canvas.height = boardSize;
    cellSize = canvas.width / gridSize;

    drawScene();
}

function initSnake() {
    console.log('Saint World System: Initializing...');

    clearTimeout(gameTimer);
    gameSpeed = parseInt(speedSelect?.value || '100', 10);

    snake = [{ x: 10, y: 10 }];
    score = 0;
    dx = 1;
    dy = 0;
    nextDx = 1;
    nextDy = 0;
    gameActive = true;

    if (scoreEl) scoreEl.innerText = '0';
    if (msgEl) msgEl.innerText = 'STREAM ACTIVE - USE ARROWS, SWIPE, OR THE D-PAD';
    if (startBtn) startBtn.style.display = 'none';
    if (selector) selector.style.display = 'none';

    generateFood();
    resizeCanvas();
    scheduleNextTick();
}

function scheduleNextTick() {
    if (!gameActive) return;

    clearTimeout(gameTimer);
    gameTimer = window.setTimeout(stepGame, gameSpeed);
}

function stepGame() {
    if (!gameActive) return;

    dx = nextDx;
    dy = nextDy;

    const newHead = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    if (
        newHead.x < 0 ||
        newHead.x >= gridSize ||
        newHead.y < 0 ||
        newHead.y >= gridSize ||
        checkSelfCollision(newHead)
    ) {
        endGame();
        return;
    }

    snake.unshift(newHead);

    if (newHead.x === food.x && newHead.y === food.y) {
        score += 10;
        if (scoreEl) scoreEl.innerText = String(score);
        generateFood();

        if (gameSpeed > 45) {
            gameSpeed -= 2;
        }
    } else {
        snake.pop();
    }

    drawScene();
    scheduleNextTick();
}

function drawScene() {
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ff0055';
    ctx.shadowBlur = Math.max(8, cellSize * 0.4);
    ctx.shadowColor = '#ff0055';
    ctx.fillRect(
        food.x * cellSize + cellSize * 0.1,
        food.y * cellSize + cellSize * 0.1,
        cellSize * 0.8,
        cellSize * 0.8
    );

    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? '#00d2ff' : 'rgba(0, 210, 255, 0.6)';
        ctx.shadowBlur = index === 0 ? Math.max(8, cellSize * 0.45) : 0;
        ctx.shadowColor = '#00d2ff';
        ctx.beginPath();
        ctx.arc(
            part.x * cellSize + cellSize / 2,
            part.y * cellSize + cellSize / 2,
            cellSize * 0.4,
            0,
            Math.PI * 2
        );
        ctx.fill();
    });

    ctx.shadowBlur = 0;
}

function generateFood() {
    do {
        food.x = Math.floor(Math.random() * gridSize);
        food.y = Math.floor(Math.random() * gridSize);
    } while (snake.some(part => part.x === food.x && part.y === food.y));
}

function checkSelfCollision(head) {
    return snake.some(part => part.x === head.x && part.y === head.y);
}

function endGame() {
    gameActive = false;
    clearTimeout(gameTimer);

    if (msgEl) {
        msgEl.innerText = `SYSTEM CRASH! SCORE: ${score} — TAP REBOOT STREAM TO PLAY AGAIN`;
    }

    if (startBtn) {
        startBtn.style.display = 'inline-block';
        startBtn.innerText = 'REBOOT STREAM';
    }

    if (selector) selector.style.display = 'block';
}

function queueDirection(newDx, newDy) {
    const isReverse =
        (newDx === -dx && newDy === -dy) ||
        (newDx === -nextDx && newDy === -nextDy);

    if (isReverse) return;

    nextDx = newDx;
    nextDy = newDy;
}

window.addEventListener('keydown', event => {
    const keyMap = {
        ArrowLeft: [-1, 0],
        ArrowUp: [0, -1],
        ArrowRight: [1, 0],
        ArrowDown: [0, 1]
    };

    const direction = keyMap[event.key];
    if (!direction) return;

    event.preventDefault();
    queueDirection(direction[0], direction[1]);
});

const directionMap = {
    up: [0, -1],
    left: [-1, 0],
    right: [1, 0],
    down: [0, 1]
};

controlButtons.forEach(button => {
    const direction = directionMap[button.dataset.dir];
    if (!direction) return;

    const handlePress = event => {
        event.preventDefault();
        queueDirection(direction[0], direction[1]);
    };

    button.addEventListener('pointerdown', handlePress);
    button.addEventListener('click', handlePress);
});

canvas.addEventListener('touchstart', event => {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}, { passive: true });

canvas.addEventListener('touchend', event => {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    if (Math.abs(deltaX) < 20 && Math.abs(deltaY) < 20) return;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        queueDirection(deltaX > 0 ? 1 : -1, 0);
        return;
    }

    queueDirection(0, deltaY > 0 ? 1 : -1);
}, { passive: true });

function setDir(newDx, newDy) {
    queueDirection(newDx, newDy);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();