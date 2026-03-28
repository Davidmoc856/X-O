let currentQuestionIndex = 0;
let score = 0;
let questions = [];

async function fetchQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
        const data = await response.json();
        questions = data.results;
        showQuestion();
    } catch (error) {
        document.getElementById("question-text").innerText = "Omo, check your internet! Failed to load questions.";
    }
}

function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        alert(`Quiz Finished! Final Score: ${score}/10`);
        location.reload(); // Restart
        return;
    }

    const q = questions[currentQuestionIndex];
    document.getElementById("q-count").innerText = currentQuestionIndex + 1;
    document.getElementById("category-text").innerText = q.category;
    document.getElementById("difficulty-text").innerText =`Difficulty: ${q.difficulty}`;
    document.getElementById("question-text").innerHTML = q.question; // innerHTML to handle special characters

    // Combine correct and incorrect answers and shuffle them
    let options = [...q.incorrect_answers, q.correct_answer];
    options.sort(() => Math.random() - 0.5);

    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = ""; // Clear old options

    options.forEach(option => {
        const btn = document.createElement("button");
        btn.classList.add("option-btn");
        btn.innerHTML = option;
        btn.onclick = () => checkAnswer(option, q.correct_answer, btn);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(selected, correct, btn) {
    const allBtns = document.querySelectorAll(".option-btn");
    allBtns.forEach(b => b.disabled = true); // Stop more clicks

    if (selected === correct) {
        btn.classList.add("correct");
        score++;
        document.getElementById("score-val").innerText = score;
    } else {
        btn.classList.add("wrong");
        // Show the correct answer in green
        allBtns.forEach(b => {
            if (b.innerHTML === correct) b.classList.add("correct");
        });
    }

    // Wait 1.5 seconds before moving to next question
    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 1500);
}

// Start the game
document.addEventListener("DOMContentLoaded", fetchQuestions);