const canvas = document.querySelector("#game-board");
const ctx = canvas.getContext("2d");

const scoreElement = document.querySelector("#score");
const highScoreElement = document.querySelector("#high-score");
const resetBtn = document.querySelector("#reset-btn");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake;
let food;
let direction;
let nextDirection;
let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;
let gameOver = false;
let gameLoop;

highScoreElement.innerText = highScore;
function startGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];

    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };

    score = 0;
    gameOver = false;

    scoreElement.innerText = score;

    createFood();

    clearInterval(gameLoop);
    gameLoop = setInterval(updateGame, 120);
}
function createFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
if (
        snake.some(
            segment => segment.x === food.x && segment.y === food.y
        )
    ) {
        createFood();
    }
}
function drawGame() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ff4d6d";
    ctx.fillRect(
        food.x * gridSize,
        food.y * gridSize,
        gridSize - 2,
        gridSize - 2
    );
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "#a78bfa" : "#8b5cf6";

        ctx.fillRect(
            segment.x * gridSize,
            segment.y * gridSize,
            gridSize - 2,
            gridSize - 2
        );
    });
}

function updateGame() {
    if (gameOver) return;

    direction = nextDirection;

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };
    if (
        head.x < 0 ||
        head.x >= tileCount ||
        head.y < 0 ||
        head.y >= tileCount
    ) {
        endGame();
        return;
    }
    if (
        snake.some(
            segment => segment.x === head.x && segment.y === head.y
        )
    ) {
        endGame();
        return;
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;

        scoreElement.innerText = score;

        if (score > highScore) {
            highScore = score;
            highScoreElement.innerText = highScore;

            localStorage.setItem("snakeHighScore", highScore);
        }

        createFood();
    } else {
        snake.pop();
    }

    drawGame();
}
document.addEventListener("keydown", (event) => {

    if (event.key === "ArrowUp" && direction.y === 0) {
        nextDirection = { x: 0, y: -1 };
    }

    if (event.key === "ArrowDown" && direction.y === 0) {
        nextDirection = { x: 0, y: 1 };
    }

    if (event.key === "ArrowLeft" && direction.x === 0) {
        nextDirection = { x: -1, y: 0 };
    }

    if (event.key === "ArrowRight" && direction.x === 0) {
        nextDirection = { x: 1, y: 0 };
    }
});
function endGame() {
    gameOver = true;

    clearInterval(gameLoop);

    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "Game Over!",
        canvas.width / 2,
        canvas.height / 2
    );

    ctx.font = "18px Arial";

    ctx.fillText(
        "Click New Game",
        canvas.width / 2,
        canvas.height / 2 + 35
    );
}

resetBtn.addEventListener("click", startGame);
startGame();