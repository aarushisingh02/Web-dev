const questions = [
    {
        question: "Which language styles web pages?",
        options: ["HTML", "CSS", "Python", "Java"],
        answer: "CSS"
    },
    {
        question: "Which language makes websites interactive?",
        options: ["JavaScript", "C++", "Java", "SQL"],
        answer: "JavaScript"
    },
    {
        question: "Which tag defines the largest heading?",
        options: ["<h1>", "<h6>", "<header>", "<head>"],
        answer: "<h1>"
    }
];

let currentIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const progressEl = document.getElementById("progress");
const resultBox = document.getElementById("result-box");
const scoreEl = document.getElementById("score");
const feedbackEl = document.getElementById("feedback");
const restartBtn = document.getElementById("restartBtn");
const timeEl = document.getElementById("time");

function startTimer() {
    timeLeft = 15;
    timeEl.textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timeEl.textContent = timeLeft;
        if (timeLeft === 0) {
            clearInterval(timer);
            showCorrectAnswer();
        }
    }, 1000);
}

function loadQuestion() {
    nextBtn.disabled = true;
    optionsEl.innerHTML = "";
    questionEl.textContent = questions[currentIndex].question;

    questions[currentIndex].options.forEach(option => {
        const btn = document.createElement("button");
        btn.textContent = option;

        btn.addEventListener("click", () => selectAnswer(btn, option));
        optionsEl.appendChild(btn);
    });

    updateProgress();
    startTimer();
}

function selectAnswer(button, selected) {
    clearInterval(timer);
    const correct = questions[currentIndex].answer;
    const buttons = document.querySelectorAll(".options button");

    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correct) {
            btn.classList.add("correct");
        }
        if (btn.textContent === selected && selected !== correct) {
            btn.classList.add("wrong");
        }
    });

    if (selected === correct) score++;
    nextBtn.disabled = false;
}

function showCorrectAnswer() {
    const correct = questions[currentIndex].answer;
    const buttons = document.querySelectorAll(".options button");

    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correct) {
            btn.classList.add("correct");
        }
    });

    nextBtn.disabled = false;
}

function updateProgress() {
    const progressPercent = (currentIndex / questions.length) * 100;
    progressEl.style.width = progressPercent + "%";
}

nextBtn.addEventListener("click", () => {
    currentIndex++;
    if (currentIndex < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
});

function showResult() {
    document.querySelector(".quiz-box").classList.add("hidden");
    resultBox.classList.remove("hidden");
    scoreEl.textContent = `${score} / ${questions.length}`;

    if (score === questions.length) {
        feedbackEl.textContent = "Excellent Performance 🌟";
    } else if (score >= 2) {
        feedbackEl.textContent = "Good Job 👍";
    } else {
        feedbackEl.textContent = "Keep Practicing 💡";
    }
}

restartBtn.addEventListener("click", () => {
    currentIndex = 0;
    score = 0;
    resultBox.classList.add("hidden");
    document.querySelector(".quiz-box").classList.remove("hidden");
    loadQuestion();
});

loadQuestion();
