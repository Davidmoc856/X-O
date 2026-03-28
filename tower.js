const canvas = document.getElementById('towerCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score-val');

let tower = [];
const boxHeight = 35;
let currentBlock;
let gameActive = false;
let score = 0;
let speed = 2;

function initTower() {
    score = 0;
    speed = 2;
    tower = [{ x: 100, y: canvas.height - boxHeight, w: 200 }]; // Base block
    newBlock();
    gameActive = true;
    scoreEl.innerText = score;
    document.getElementById('start-btn').style.display = 'none';
    animate();
}

function newBlock() {
    const lastBlock = tower[tower.length - 1];
    currentBlock = {
        x: 0,
        y: lastBlock.y - boxHeight,
        w: lastBlock.w,
        direction: 1
    };
}

function animate() {
    if (!gameActive) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all stacked blocks
    tower.forEach((block, index) => {
        // Create a gradient for a 3D feel
        let hue = (index * 20) % 360;
        ctx.fillStyle = `hsla(${hue}, 70%, 50%, 1)`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${hue}, 70%, 50%, 0.8)`;
        ctx.fillRect(block.x, block.y, block.w, boxHeight - 2);
    });

    // Move current block
    currentBlock.x += speed * currentBlock.direction;
    if (currentBlock.x + currentBlock.w > canvas.width || currentBlock.x < 0) {
        currentBlock.direction *= -1;
    }

    // Draw moving block
    ctx.fillStyle = "#fff";
    ctx.fillRect(currentBlock.x, currentBlock.y, currentBlock.w, boxHeight - 2);

    requestAnimationFrame(animate);
}

function handleStack() {
    if (!gameActive) return;

    const lastBlock = tower[tower.length - 1];
    
    // Check if missed completely
    if (currentBlock.x > lastBlock.x + lastBlock.w || currentBlock.x + currentBlock.w < lastBlock.x) {
        gameOver();
        return;
    }

    // Calculate overlap (The "Chop" Logic)
    let newX = Math.max(currentBlock.x, lastBlock.x);
    let newW = Math.min(currentBlock.x + currentBlock.w, lastBlock.x + lastBlock.w) - newX;

    // Add to tower
    tower.push({ x: newX, y: currentBlock.y, w: newW });
    score++;
    scoreEl.innerText = score;
    

    scoreEl.classList.add('score-pulse');
    setTimeout(() => scoreEl.classList.remove('score-pulse'), 400);
    speed += 0.2; // Increase speed as it gets higher

    // Camera move: If tower gets too high, shift everything down
    if (tower.length > 8) {
        tower.forEach(b => b.y += boxHeight);
    }

    newBlock();
}

function gameOver() {
    gameActive = false;
    alert("TOWER COLLAPSED! Final Height: " + score);
    document.getElementById('start-btn').style.display = 'inline-block';
    document.getElementById('start-btn').innerText = 'REBUILD';
}

// Controls
window.addEventListener('keydown', (e) => { if(e.code === 'Space') handleStack(); });
canvas.addEventListener('touchstart', (e) => { e.preventDefault(); handleStack(); });