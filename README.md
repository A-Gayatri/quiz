# Two-Player Trivia Game

## Overview

This is a competitive two-player trivia game built with JavaScript. It fetches quiz questions from [The Trivia API](https://the-trivia-api.com/docs/v2/), allowing two players to compete by answering questions from a selected category. Players take turns, and their scores are updated based on the difficulty of the questions they answer. The player with the higher score at the end is declared the winner.

## Features

1. **Player Setup**:
   - Players input their names before starting the game.
   - 
2. **Category Selection**:
   - Players choose a category together from a list.
   - Each game session fetches 6 questions: 2 easy, 2 medium, and 2 hard from The Trivia API.

3. **Turn-Based Gameplay**:
   - Players take turns answering questions:
     - Player 1 answers the first easy question.
     - Player 2 answers the second easy question.
     - The pattern repeats for medium and hard questions.

4. **Scoring System**:
   - Points are awarded based on the difficulty of the question:
     - Easy question: 10 points
     - Medium question: 15 points
     - Hard question: 20 points
   - Scores are displayed after each question is answered.

5. **Post-Game Options**:
   - After answering all questions in a category, players can:
     - Select another category.
     - End the game.

6. **End Game**:
   - The game ends when all selected categories are exhausted, or the players choose to stop.
   - Final scores are displayed, and the player with the higher score wins.

## How to Play

1. Input both players' names.
2. Select a trivia category from the dropdown list.
3. Answer the questions as they appear on the screen.
   - Player 1 will answer the first question, followed by Player 2.
   - Correct answers are highlighted in green, and wrong answers in red.
4. Continue answering questions until all six are answered.
5. Choose to play another round by selecting a new category or end the game.
6. View the final scores and winner.

## Points Distribution

- Easy question: 10 points
- Medium question: 15 points
- Hard question: 20 points

## Technologies Used

- **HTML** for structuring the webpage.
- **CSS** for basic styling.
- **JavaScript** for game logic and API interaction.
- **The Trivia API** to fetch trivia questions.

## Setup Instructions

1. Clone or download the repository to your local machine.
2. Open `index.html` in your preferred web browser.
3. Start the game by entering the player names and choosing a category.

## API Information

Questions are fetched using [The Trivia API](https://the-trivia-api.com/docs/v2/) in the following format:


The game retrieves:
- 2 questions of `easy` difficulty.
- 2 questions of `medium` difficulty.
- 2 questions of `hard` difficulty.

## Future Enhancements

- Improve the UI/UX for better player experience.
- Add additional game modes, such as timed rounds.
- Integrate more complex categories and question types.

## License

This project is open-source and available under the [MIT License](LICENSE).
