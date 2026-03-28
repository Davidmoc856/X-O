const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score-val');

let score = 0;
let gameActive = false;
let gameSpeed = 8; 
let frameCount = 0;

// --- UPDATED PHYSICS ---
const player = {
    x: 80,
    y: 200,
    width: 25,
    height: 50, 
    color: '#00d2ff',
    dy: 0,
    jumpForce: 14, // MODIFIED: Balanced jump height
    gravity: 0.6,  // MODIFIED: Faster fall so he's not "floaty"
    grounded: false
};

// --- PRO-RUNNER ANIMATION ---
function drawRunner(x, y, w, h) {
    ctx.strokeStyle = player.color;
    ctx.lineWidth = 3;
    ctx.shadowBlur = 15;
    ctx.shadowColor = player.color;

    // We calculate the cycle based on frameCount to make it smooth
    let cycle = frameCount * 0.15; 
    let legOffset = Math.sin(cycle) * 12;
    let armOffset = Math.cos(cycle) * 10;

    // Lean the body forward slightly for a "sprinting" look
    let lean = 5; 

    // 1. Head (shifted forward)
    ctx.beginPath();
    ctx.arc(x + w/2 + lean, y + 8, 7, 0, Math.PI * 2);
    ctx.stroke();

    // 2. Torso (angled forward)
    ctx.beginPath();
    ctx.moveTo(x + w/2 + lean, y + 15);
    ctx.lineTo(x + w/2 - 2, y + 35);
    ctx.stroke();

    // 3. Arms (Opposite of legs)
    ctx.beginPath();
    // Front Arm
    ctx.moveTo(x + w/2 + 2, y + 20);
    ctx.lineTo(x + w/2 + 10 + armOffset, y + 35);
    // Back Arm
    ctx.moveTo(x + w/2 + 2, y + 20);
    ctx.lineTo(x + w/2 - 10 - armOffset, y + 35);
    ctx.stroke();

    // 4. Legs (One forward, one back)
    ctx.beginPath();
    // Front Leg
    ctx.moveTo(x + w/2 - 2, y + 35);
    ctx.lineTo(x + w/2 + legOffset, y + 50);
    // Back Leg
    ctx.moveTo(x + w/2 - 2, y + 35);
    ctx.lineTo(x + w/2 - legOffset, y + 50);
    ctx.stroke();

    ctx.shadowBlur = 0;
}

function createObstacle() {
    let size = Math.random() * (40 - 20) + 20;
    obstacles.push({
        x: canvas.width,
        y: canvas.height - size,
        width: 20,
        height: size,
        color: '#ff0055' 
    });
}

function startGame() {
    score = 0;
    obstacles = [];
    gameSpeed = 8;
    gameActive = true;
    player.y = 200;
    player.dy = 0;
    scoreEl.innerText = score;
    document.getElementById('start-btn').style.display = 'none';
    animate();
}

function animate() {
    if (!gameActive) return;
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frameCount++;

    // Ground Line
    ctx.strokeStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 2);
    ctx.lineTo(canvas.width, canvas.height - 2);
    ctx.stroke();

    // Physics
    player.dy += player.gravity;
    player.y += player.dy;

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.grounded = true;
    }

    drawRunner(player.x, player.y, player.width, player.height);

    if (Math.random() < 0.015) createObstacle();

    obstacles.forEach((obs, index) => {
        obs.x -= gameSpeed;
        
        ctx.fillStyle = obs.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = obs.color;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.shadowBlur = 0;

        // Collision Check
        if (player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y) {
            gameOver();
        }

        if (obs.x + obs.width < 0) {
            obstacles.splice(index, 1);
            score++;
            scoreEl.innerText = score;
            gameSpeed += 0.05; 
        }
    });
}

function gameOver() {
    gameActive = false;
    const btn = document.getElementById('start-btn');
    btn.style.display = 'inline-block';
    btn.innerText = 'REBOOT SYSTEM';
    alert("SYSTEM CRASH! Score: " + score);
}

// Controls
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && player.grounded) {
        player.dy = -player.jumpForce;
        player.grounded = false;
    }
});

canvas.addEventListener('touchstart', () => {
    if (player.grounded) {
        player.dy = -player.jumpForce;
        player.grounded = false;
    }
});