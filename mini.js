const questionsApiUrl = "https://the-trivia-api.com/api/questions?limit=2&difficulty=";

let questions = [];
let currentQuestionIndex = 0;
let player1Score = 0;
let player2Score = 0;
let currentPlayer = 1; // Player 1 starts
let player1Name = ''; // Store Player 1's name
let player2Name = ''; // Store Player 2's name
const totalQuestions = 6; // 2 Easy, 2 Medium, 2 Hard

const player1NameInput = document.getElementById('player1-name');
const player2NameInput = document.getElementById('player2-name');
const submitNamesButton = document.getElementById('submit-names');
const categorySelectElement = document.getElementById('category-select');
const startGameButton = document.getElementById('start-game');
const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const nextButton = document.getElementById('next-question');
const player1ScoreElement = document.getElementById('player1-score');
const player2ScoreElement = document.getElementById('player2-score');
const resultElement = document.getElementById('result');
const gameArea = document.getElementById('game-area');
const scoreBoard = document.getElementById('score-board');
const buttonsContainer = document.getElementById('buttons-container');
const continueButton = document.getElementById('continue');
const startAgainButton = document.getElementById('start-again');

// Predefined categories for The Trivia API
const categories = {
    "Food and Drink": "food_and_drink",
    "General Knowledge": "general_knowledge",
    "Geography": "geography",
    "History": "history",
    "Movies": "film_and_tv",
    "Music": "music",
    "Science": "science",
    "Sports": "sport",
    "Art and Literature": "arts_and_literature"
};

// Points system based on difficulty
const points = {
    easy: 10,
    medium: 15,
    hard: 20
};

// Populate categories in the dropdown
function populateCategoryDropdown() {
    const categoryOptions = Object.keys(categories).map(category => {
        return `<option value="${categories[category]}">${category}</option>`;
    });
    categorySelectElement.innerHTML += categoryOptions.join('');
}

// Submit player names and move to category selection
submitNamesButton.addEventListener('click', () => {
    player1Name = player1NameInput.value.trim() || 'Player 1'; // Use default if no input
    player2Name = player2NameInput.value.trim() || 'Player 2'; // Use default if no input

    // Hide player name input and show category selection
    document.getElementById('player-names-input').style.display = 'none';
    document.getElementById('category-selection').style.display = 'block';
    populateCategoryDropdown();
});

// Enable the start button once a valid category is selected
categorySelectElement.addEventListener('change', () => {
    if (categorySelectElement.value !== "") {
        startGameButton.disabled = false; // Enable the start button
    }
});

// Fetch questions based on the selected category and difficulty levels
async function fetchQuestions(category) {
    try {
        const easyResponse = await fetch(`${questionsApiUrl}easy&categories=${category}`);
        const easyQuestions = await easyResponse.json();

        const mediumResponse = await fetch(`${questionsApiUrl}medium&categories=${category}`);
        const mediumQuestions = await mediumResponse.json();

        const hardResponse = await fetch(`${questionsApiUrl}hard&categories=${category}`);
        const hardQuestions = await hardResponse.json();

        questions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];
        showQuestion();
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}

// Display the current question and options
function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    answersElement.innerHTML = ''; // Clear previous answers
    nextButton.style.display = 'none'; // Hide the next button

    const answers = [...currentQuestion.incorrectAnswers, currentQuestion.correctAnswer];
    shuffleArray(answers);

    answers.forEach(answer => {
        const li = document.createElement('li');
        li.textContent = answer;
        li.addEventListener('click', () => handleAnswerClick(li, answer, currentQuestion.correctAnswer));
        answersElement.appendChild(li);
    });
}

// Handle when a player clicks an answer
function handleAnswerClick(selectedLi, selectedAnswer, correctAnswer) {
    Array.from(answersElement.children).forEach(li => li.style.pointerEvents = 'none');

    if (selectedAnswer === correctAnswer) {
        selectedLi.style.backgroundColor = 'green'; // Correct answer
        addPoints(currentQuestionIndex);
    } else {
        selectedLi.style.backgroundColor = 'red'; // Wrong answer
        highlightCorrectAnswer(correctAnswer); // Highlight correct answer
    }

    updateScores();
    nextButton.style.display = 'block'; // Show the next button
}

// Add points based on difficulty and current player
function addPoints(index) {
    const difficulty = getQuestionDifficulty(index);
    const score = points[difficulty];

    if (currentPlayer === 1) {
        player1Score += score;
    } else {
        player2Score += score;
    }
}

// Determine question difficulty based on index
function getQuestionDifficulty(index) {
    if (index < 2) {
        return 'easy';
    } else if (index < 4) {
        return 'medium';
    } else {
        return 'hard';
    }
}

// Highlight the correct answer
function highlightCorrectAnswer(correctAnswer) {
    const allOptions = Array.from(answersElement.children);
    allOptions.forEach(option => {
        if (option.textContent === correctAnswer) {
            option.style.backgroundColor = 'green'; // Correct answer
        }
    });
}

// Update player scores on the scoreboard
function updateScores() {
    player1ScoreElement.textContent = `${player1Name} Score: ${player1Score}`;
    player2ScoreElement.textContent = `${player2Name} Score: ${player2Score}`;
}

// Move to the next question or end the game
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    currentPlayer = currentPlayer === 1 ? 2 : 1; // Switch players

    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        declareWinner();
    }
});

// Declare the winner and show Continue/Start Again buttons
function declareWinner() {
    let winnerMessage = '';
    if (player1Score > player2Score) {
        winnerMessage = `${player1Name} Wins!`;
    } else if (player2Score > player1Score) {
        winnerMessage = `${player2Name} Wins!`;
    } else {
        winnerMessage = "It's a tie!";
    }
    resultElement.textContent = winnerMessage;

    nextButton.style.display = 'none'; // Hide the next question button at the end of the game
    buttonsContainer.style.display = 'flex'; // Show "Continue" and "Start Again" buttons
}

// "Start Again" resets the game
startAgainButton.addEventListener('click', () => {
    player1Score = 0;
    player2Score = 0;
    currentQuestionIndex = 0;
    updateScores(); // Reset scores
    resultElement.textContent = ''; // Clear the result message
    buttonsContainer.style.display = 'none';
    document.getElementById('category-selection').style.display = 'block'; // Show category selection again
    gameArea.style.display = 'none'; // Hide the game area
});

// "Continue" fetches new questions and continues with the same scores
continueButton.addEventListener('click', () => {
    currentQuestionIndex = 0;
    resultElement.textContent = ''; // Clear the result message
    buttonsContainer.style.display = 'none'; // Hide the buttons
    fetchQuestions(categorySelectElement.value); // Fetch new questions
});

// Utility function to shuffle the array of answers
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Start the game after selecting a category
startGameButton.addEventListener('click', () => {
    document.getElementById('category-selection').style.display = 'none'; // Hide category selection
    gameArea.style.display = 'block'; // Show game area
    scoreBoard.style.display = 'block'; // Show score board
    fetchQuestions(categorySelectElement.value); // Fetch the questions based on selected category
});
