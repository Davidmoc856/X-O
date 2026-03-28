let targetWord = "";
let guessedLetters = [];
let lives = 6;
let score = 0;

// Using a different API that provides categories for better hints
async function fetchHangmanWord() {
    try {
        // We use a more stable API that provides 100,000+ words
        const response = await fetch('https://random-word-api.herokuapp.com/word?number=1');
        const data = await response.json();
        const word = data[0].toUpperCase();

        // Since this API only gives words, we'll assign a dynamic category
        let category = "General Knowledge";
        if (word.length > 8) category = "Advanced Level";
        if (word.length < 5) category = "Starter Level";

        return { word: word, category: category };
    } catch (e) {
        // Backup list with MORE than one word so it's not always 'Software'
        const fallbacks = ["DEVELOPER", "BOOTCAMP", "KEYBOARD", "NIGERIA", "ALGORITHM"];
        const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.fallbacks)];
        return { word: randomFallback, category: "Offline Mode" };
    }
}


async function initHangman() {
    lives = 6;
    guessedLetters = [];
    document.getElementById("lives-val").innerText = lives;
    document.getElementById("hangman-visual").innerText = "SYSTEM SECURE";
    document.getElementById("hangman-visual").style.color = "#00ff88";

    const data = await fetchHangmanWord();
    targetWord = data.word;
    document.getElementById("hint-text").innerText = `Category: ${data.category}`;

    renderWord();
    renderKeyboard();
}

function renderWord() {
    const display = targetWord.split("").map(letter =>
        guessedLetters.includes(letter) ? letter : "_"
    ).join(" ");
    document.getElementById("word-blanks").innerText = display;

    if (!display.includes("_")) {
        score += 20;
        document.getElementById("h-score").innerText = score;
        alert("ACCESS GRANTED! You guessed it.");
        initHangman();
    }
}

function renderKeyboard() {
    const kb = document.getElementById("keyboard");
    kb.innerHTML = "";
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(letter => {
        const btn = document.createElement("button");
        btn.innerText = letter;
        btn.classList.add("key");
        btn.onclick = () => handleGuess(letter, btn);
        kb.appendChild(btn);
    });
}

function handleGuess(letter, btn) {
    btn.disabled = true;
    if (targetWord.includes(letter)) {
        guessedLetters.push(letter);
        renderWord();
    } else {
        lives--;
        document.getElementById("lives-val").innerText = lives;
        updateVisual();
        if (lives === 0) {
            alert(`SYSTEM LOCKED! The word was ${targetWord}`);
            score = 0;
            document.getElementById("h-score").innerText = score;
            initHangman();
        }
    }
}

function updateVisual() {
    const visual = document.getElementById("hangman-visual");
    visual.style.color = "var(--neon-pink)";
    const messages = [
        "CRITICAL FAILURE",
        "SECURITY ALERT",
        "BREACH DETECTED",
        "FIREWALL WEAK",
        "SYSTEM COMPROMISED",
        "ATTEMPTING OVERRIDE"
    ];
    visual.innerText = messages[6 - lives] || "WARNING";
}

document.addEventListener("DOMContentLoaded", initHangman);