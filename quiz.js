// Array of quiz questions with id, question, options, and correct answer
const quizQuestions = [
    {
        id: 1,
        question: "What is the capital of Bangladesh?",
        options: ["Chittagong", "Dhaka", "Sylhet", "Rajshahi"],
        correctAnswer: "Dhaka"
    },
    {
        id: 2,
        question: "Which river is known as the 'Padma' in Bangladesh?",
        options: ["Brahmaputra", "Ganges", "Meghna", "Jamuna"],
        correctAnswer: "Ganges"
    },
    {
        id: 3,
        question: "Who is the national poet of Bangladesh?",
        options: ["Rabindranath Tagore", "Kazi Nazrul Islam", "Michael Madhusudan Dutt", "Jasimuddin"],
        correctAnswer: "Kazi Nazrul Islam"
    },
    {
        id: 4,
        question: "When did Bangladesh gain independence?",
        options: ["1947", "1952", "1971", "1975"],
        correctAnswer: "1971"
    },
    {
        id: 5,
        question: "What is the currency of Bangladesh?",
        options: ["Rupee", "Taka", "Ringgit", "Rupiah"],
        correctAnswer: "Taka"
    }, 
    {
        id: 6, 
        question: "Which is the mangrove forest of Bangladesh?",
        options: ["Sundarbans", "Chittagong Hill Tracts", "Rangamati", "Khagrachari"],
        correctAnswer: "Sundarbans"
    }
];

// Variables to track quiz state
let currentQuestionIndex = 0;
let score = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;

// Utility functions for serializing and deserializing arrays for cookie storage
function serialize(array) {
    return JSON.stringify(array);
}

function deserialize(string) {
    return JSON.parse(string);
}

// Initialize the quiz
function initializeQuiz() {
    // Check if there's a saved quiz in progress
    const savedQuestionIndex = getCookie("currentQuestionIndex");
    const savedScore = getCookie("quizScore");
    const savedCorrect = getCookie("correctAnswers");
    const savedIncorrect = getCookie("incorrectAnswers");
    
    if (savedQuestionIndex && savedQuestionIndex !== "") {
        currentQuestionIndex = parseInt(savedQuestionIndex);
        score = parseInt(savedScore || 0);
        correctAnswers = parseInt(savedCorrect || 0);
        incorrectAnswers = parseInt(savedIncorrect || 0);
    } else {
        // Reset all values for fresh start
        currentQuestionIndex = 0;
        score = 0;
        correctAnswers = 0;
        incorrectAnswers = 0;
        
        // Save initial state to cookies
        setCookie("currentQuestionIndex", currentQuestionIndex);
        setCookie("quizScore", score);
        setCookie("correctAnswers", correctAnswers);
        setCookie("incorrectAnswers", incorrectAnswers); 
    }
    
    // Display the current question or results
    if (currentQuestionIndex < quizQuestions.length) {
        displayQuestion();
    } else {
        displayResults();
    }
}

// Display the current question
function displayQuestion() {
    const questionDisplay = document.getElementById("question-display");
    const currentQuestion = quizQuestions[currentQuestionIndex];
    
    let questionHTML = `
        <div class="question-container">
            <h2>Question ${currentQuestionIndex + 1} of ${quizQuestions.length}</h2>
            <h3>${currentQuestion.question}</h3>
            <div class="options-container">
    `;
    
    // Generate radio buttons for each option
    currentQuestion.options.forEach((option, index) => {
        questionHTML += `
            <div class="option-item">
                <input type="radio" id="option${index}" name="quiz-option" value="${option}">
                <label for="option${index}">${option}</label>
            </div>
        `;
    });
    
    questionHTML += `
            </div>
            <button onclick="submitAnswer()" class="submit-btn">Answer</button>
        </div>
    `;
    
    questionDisplay.innerHTML = questionHTML;
}

// Handle answer submission
function submitAnswer() {
    const selectedOption = document.querySelector('input[name="quiz-option"]:checked');
    
    if (!selectedOption) {
        alert("Please select an answer!");
        return;
    }
    
    const userAnswer = selectedOption.value;
    const currentQuestion = quizQuestions[currentQuestionIndex];
    
    // Check if answer is correct
    if (userAnswer === currentQuestion.correctAnswer) {
        score += 5;
        correctAnswers++;
    } else {
        incorrectAnswers++;
    }
    
    // Update cookies
    setCookie("quizScore", score);
    setCookie("correctAnswers", correctAnswers);
    setCookie("incorrectAnswers", incorrectAnswers);
    
    // Move to next question
    currentQuestionIndex++;
    setCookie("currentQuestionIndex", currentQuestionIndex);
    
    // Display next question or results
    if (currentQuestionIndex < quizQuestions.length) {
        displayQuestion();
    } else {
        displayResults();
    }
}

// Display quiz results and ask for user name
function displayResults() {
    document.getElementById("question-display").style.display = "none";
    document.getElementById("result-container").style.display = "block";
    
    const scoreDisplay = document.getElementById("score-display");
    scoreDisplay.innerHTML = `<h3>Your Final Score: ${score} points</h3>`;
    
    // Display summary
    const summaryContainer = document.getElementById("summary-container");
    const totalQuestions = quizQuestions.length;
    const correctPercentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);
    
    summaryContainer.innerHTML = `
        <h3>Quiz Summary</h3>
        <p>Total Questions: ${totalQuestions}</p>
        <p>Correct Answers: ${correctAnswers}</p>
        <p>Incorrect Answers: ${incorrectAnswers}</p>
        <p>Accuracy: ${correctPercentage}%</p>
    `;
}

// Save score to leaderboard
function saveScore() {
    const playerName = document.getElementById("player-name").value.trim();
    
    if (!playerName) {
        alert("Please enter your name!");
        return;
    }
    
    // Get existing leaderboard or create new one
    let leaderboard = [];
    const savedLeaderboard = getCookie("quizLeaderboard");
    
    if (savedLeaderboard && savedLeaderboard !== "") {
        leaderboard = deserialize(savedLeaderboard);
    }
    
    // Add current player
    leaderboard.push({
        name: playerName,
        score: score,
        correctAnswers: correctAnswers,
        incorrectAnswers: incorrectAnswers
    });
    
    // Sort leaderboard by score (highest first)
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Save to cookie
    setCookie("quizLeaderboard", serialize(leaderboard));
    
    // Hide result container and show leaderboard
    document.getElementById("result-container").style.display = "none";
    document.getElementById("leaderboard-container").style.display = "block";
    
    // Display leaderboard
    displayLeaderboard(leaderboard);
}

// Display leaderboard
function displayLeaderboard(leaderboard) {
    const leaderboardBody = document.getElementById("leaderboard-body");
    leaderboardBody.innerHTML = "";
    
    leaderboard.forEach((player, index) => {
        const row = document.createElement("tr");
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${player.name}</td>
            <td>${player.score}</td>
        `;
        
        leaderboardBody.appendChild(row);
    });
}

// Reset quiz to play again
function resetQuiz() {
    // Reset all quiz state cookies except leaderboard
    delCookie("currentQuestionIndex");
    delCookie("quizScore");
    delCookie("correctAnswers");
    delCookie("incorrectAnswers");
    
    // Reset variables
    currentQuestionIndex = 0;
    score = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    
    // Reset display
    document.getElementById("leaderboard-container").style.display = "none";
    document.getElementById("result-container").style.display = "none";
    document.getElementById("question-display").style.display = "block";
    
    // Start fresh quiz
    displayQuestion();
}