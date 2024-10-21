const questionsApiUrl = "https://the-trivia-api.com/api/questions?limit=2&difficulty=";

let questions = [];
let currentQuestionIndex = 0;
let player1Score = 0;
let player2Score = 0;
let currentPlayer = 1;
let player1Name = '';
let player2Name = '';
const totalQuestions = 6;

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

const points = {
    easy: 10,
    medium: 15,
    hard: 20
};

function populateCategoryDropdown() {
    const categoryOptions = Object.keys(categories).map(category => {
        return `<option value="${categories[category]}">${category}</option>`;
    });
    categorySelectElement.innerHTML += categoryOptions.join('');
}

submitNamesButton.addEventListener('click', () => {
    player1Name = player1NameInput.value.trim() || 'Player 1';
    player2Name = player2NameInput.value.trim() || 'Player 2';
    document.getElementById('player-names-input').style.display = 'none';
    document.getElementById('category-selection').style.display = 'block';
    populateCategoryDropdown();
});

categorySelectElement.addEventListener('change', () => {
    if (categorySelectElement.value !== "") {
        startGameButton.disabled = false;
    }
});

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

function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    answersElement.innerHTML = '';
    nextButton.style.display = 'none';
    const answers = [...currentQuestion.incorrectAnswers, currentQuestion.correctAnswer];
    shuffleArray(answers);
    answers.forEach(answer => {
        const li = document.createElement('li');
        li.textContent = answer;
        li.addEventListener('click', () => handleAnswerClick(li, answer, currentQuestion.correctAnswer));
        answersElement.appendChild(li);
    });
}

function handleAnswerClick(selectedLi, selectedAnswer, correctAnswer) {
    Array.from(answersElement.children).forEach(li => li.style.pointerEvents = 'none');
    if (selectedAnswer === correctAnswer) {
        selectedLi.style.backgroundColor = 'green';
        addPoints(currentQuestionIndex);
    } else {
        selectedLi.style.backgroundColor = 'red';
        highlightCorrectAnswer(correctAnswer);
    }
    updateScores();
    nextButton.style.display = 'block';
}

function addPoints(index) {
    const difficulty = getQuestionDifficulty(index);
    const score = points[difficulty];
    if (currentPlayer === 1) {
        player1Score += score;
    } else {
        player2Score += score;
    }
}

function getQuestionDifficulty(index) {
    if (index < 2) {
        return 'easy';
    } else if (index < 4) {
        return 'medium';
    } else {
        return 'hard';
    }
}

function highlightCorrectAnswer(correctAnswer) {
    const allOptions = Array.from(answersElement.children);
    allOptions.forEach(option => {
        if (option.textContent === correctAnswer) {
            option.style.backgroundColor = 'green';
        }
    });
}

function updateScores() {
    player1ScoreElement.textContent = `${player1Name} Score: ${player1Score}`;
    player2ScoreElement.textContent = `${player2Name} Score: ${player2Score}`;
}

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        declareWinner();
    }
});

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
    nextButton.style.display = 'none';
    buttonsContainer.style.display = 'flex';
}

startAgainButton.addEventListener('click', () => {
    player1Score = 0;
    player2Score = 0;
    currentQuestionIndex = 0;
    updateScores();
    resultElement.textContent = '';
    buttonsContainer.style.display = 'none';
    document.getElementById('category-selection').style.display = 'block';
    gameArea.style.display = 'none';
});

continueButton.addEventListener('click', () => {
    currentQuestionIndex = 0;
    resultElement.textContent = '';
    buttonsContainer.style.display = 'none';
    fetchQuestions(categorySelectElement.value);
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

startGameButton.addEventListener('click', () => {
    document.getElementById('category-selection').style.display = 'none';
    gameArea.style.display = 'block';
    scoreBoard.style.display = 'block';
    fetchQuestions(categorySelectElement.value);
});
