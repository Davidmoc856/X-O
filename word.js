let currentWord = "";
let score = 0;
let timeLeft = 120; // Changed to 2 minutes
let timerInterval;

// categories array to mimic categories for hints


async function fetchNewWord() {
    try {
        // This API provides words from ALL categories (100,000+ words)
        const response = await fetch('https://random-word-api.herokuapp.com/word?number=1');
        const data = await response.json();
        return data[0].toUpperCase();
    } catch (error) {
        // Fallback for general words if internet trips
        const generalWords = ["CHAMPION", "BEYOND", "GALAXY", "MYSTERY", "FREEDOM"];
        return generalWords[Math.floor(Math.random() * generalWords.length)];
    }
}

async function initGame() {
    clearInterval(timerInterval);
    timeLeft = 120;
    document.getElementById("timer-val").innerText = timeLeft;

    currentWord = await fetchNewWord();

    // Scramble logic
    let wordArray = currentWord.split("");
    for (let i = wordArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }

    document.getElementById("scrambled-word").innerText = wordArray.join("");

    // NEW DYNAMIC HINTS: No longer just programming!
    document.getElementById("hint-text").innerText = `Hint: This word has ${currentWord.length} letters`;

    // Determining "Field" based on word length for arcade flavor
    let difficulty = currentWord.length > 7 ? "Expert" : "Beginner";
    document.getElementById("category-text").innerText = `Level: ${difficulty}`;

    document.getElementById("user-input").value = "";
    startTimer();
}
function startTimer() {
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert(`Omo, Game Over! Final Score: ${score}`);
            score = 0; // Reset Score
            document.getElementById("score-val").innerText = score;
            initGame(); // New game
        } else {
            timeLeft--;
            document.getElementById("timer-val").innerText = timeLeft;
        }
    }, 1000);
}

function checkGuess() {
    const userGuess = document.getElementById("user-input").value.toUpperCase().trim();

    if (userGuess === currentWord) {
        score += 10;
        document.getElementById("score-val").innerText = score;
        alert("Correct! +10 Points. Preparing next word...");
        initGame();
    } else {
        alert("Incorrect guess! Try again.");
    }
}

// Start Game on Page Load
document.addEventListener("DOMContentLoaded", initGame);