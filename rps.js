let playerScore = 0;
let cpuScore = 0;
let history = []; // AI uses this to learn your patterns

function getCPUMove() {
    // If you've played enough, AI tries to predict you
    if (history.length > 3) {
        const lastMove = history[history.length - 1];
        // If player repeated a move twice, AI counters the third repeat
        if (history[history.length - 1] === history[history.length - 2]) {
            if (lastMove === 'ROCK') return 'PAPER';
            if (lastMove === 'PAPER') return 'SCISSORS';
            if (lastMove === 'SCISSORS') return 'ROCK';
        }
    }
    // Otherwise, random move
    const choices = ['ROCK', 'PAPER', 'SCISSORS'];
    return choices[Math.floor(Math.random() * 3)];
}

function play(playerChoice) {
    const playerBox = document.getElementById("player-choice");
    const cpuBox = document.getElementById("cpu-choice");
    const resultText = document.getElementById("result-text");
    
    // Add history for AI learning
    history.push(playerChoice);

    // Start Shake Animation
    playerBox.classList.add("shaking");
    cpuBox.classList.add("shaking");
    playerBox.innerText = "✊";
    cpuBox.innerText = "✊";
    resultText.innerText = "WAITING...";

    setTimeout(() => {
        playerBox.classList.remove("shaking");
        cpuBox.classList.remove("shaking");

        const cpuChoice = getCPUMove();
        
        // Update Icons
        const icons = { 'ROCK': '✊', 'PAPER': '✋', 'SCISSORS': '✌️' };
        playerBox.innerText = icons[playerChoice];
        cpuBox.innerText = icons[cpuChoice];

        // Win Logic
        if (playerChoice === cpuChoice) {
            resultText.innerText = "DRAW! TRY AGAIN";
        } else if (
            (playerChoice === 'ROCK' && cpuChoice === 'SCISSORS') ||
            (playerChoice === 'PAPER' && cpuChoice === 'ROCK') ||
            (playerChoice === 'SCISSORS' && cpuChoice === 'PAPER')
        ) {
            playerScore++;
            resultText.innerText = "YOU WON  👻! COMPUTER LOST 💩";
            resultText.style.color = "#00ff88";
        } else {
            cpuScore++;
            resultText.innerText = "COMPUTER WON 👻! YOU LOST 💩";
            resultText.style.color = "var(--neon-pink)";
        }

        document.getElementById("p-score").innerText = playerScore;
        document.getElementById("cpu-score").innerText = cpuScore;
    }, 1000);
}