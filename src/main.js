import "./style.css";

const app = document.querySelector("#app");

const TAILLE_CASE = 20;
const LARGEUR = 400;
const HAUTEUR = 400;

const COLONNES = LARGEUR / TAILLE_CASE;
const LIGNES = HAUTEUR / TAILLE_CASE;

const directions = {
  ArrowLeft: { dx: -1, dy: 0 },
  ArrowUp: { dx: 0, dy: -1 },
  ArrowRight: { dx: 1, dy: 0 },
  ArrowDown: { dx: 0, dy: 1 },
};

let canvas;
let ctx;

let snake;
let fruit;
let score;
let direction;
let intervalId;

function homeScreen() {
  app.innerHTML = `
    <div class="screen">
      <h1>🐍 Snake</h1>
      <button id="startBtn">Nouvelle partie</button>
    </div>
  `;

  document
    .querySelector("#startBtn")
    .addEventListener("click", startGame);
}

function startGame() {
  snake = [
    { x: 7, y: 4 },
    { x: 6, y: 4 },
    { x: 5, y: 4 },
  ];

  direction = { dx: 1, dy: 0 };
  score = 0;

  app.innerHTML = `
    <div class="game">
      <h1>🐍 Snake</h1>

      <div class="score">
        Score : <span id="score">${score}</span>
      </div>

      <canvas
        id="snake"
        width="${LARGEUR}"
        height="${HAUTEUR}">
      </canvas>
    </div>
  `;

  canvas = document.querySelector("#snake");
  ctx = canvas.getContext("2d");

  fruit = generateFruit();

  clearInterval(intervalId);
  intervalId = setInterval(gameLoop, 200);
}

function generateFruit() {
  let x;
  let y;

  do {
    x = Math.floor(Math.random() * COLONNES);
    y = Math.floor(Math.random() * LIGNES);
  } while (isSnakeOnCell(x, y));

  return { x, y };
}

function isSnakeOnCell(x, y) {
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === x && snake[i].y === y) {
      return true;
    }
  }

  return false;
}

function gameLoop() {
  moveSnake();

  const head = snake[0];

  if (hitWall(head) || hitSelf(head)) {
    gameOver();
    return;
  }

  draw();
}

function moveSnake() {
  const head = snake[0];

  const newHead = {
    x: head.x + direction.dx,
    y: head.y + direction.dy,
  };

  snake.unshift(newHead);

  if (
    newHead.x === fruit.x &&
    newHead.y === fruit.y
  ) {
    score++;

    document.querySelector("#score").textContent =
      score;

    fruit = generateFruit();
  } else {
    snake.pop();
  }
}

function hitWall(head) {
  return (
    head.x < 0 ||
    head.x >= COLONNES ||
    head.y < 0 ||
    head.y >= LIGNES
  );
}

function hitSelf(head) {
  for (let i = 1; i < snake.length; i++) {
    if (
      snake[i].x === head.x &&
      snake[i].y === head.y
    ) {
      return true;
    }
  }

  return false;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawFruit();
  drawSnake();
}

function drawSnake() {
  ctx.fillStyle = "green";

  for (let i = 0; i < snake.length; i++) {
    ctx.fillRect(
      snake[i].x * TAILLE_CASE,
      snake[i].y * TAILLE_CASE,
      TAILLE_CASE,
      TAILLE_CASE
    );
  }
}

function drawFruit() {
  ctx.fillStyle = "red";

  ctx.fillRect(
    fruit.x * TAILLE_CASE,
    fruit.y * TAILLE_CASE,
    TAILLE_CASE,
    TAILLE_CASE
  );
}

function gameOver() {
  clearInterval(intervalId);

  app.innerHTML = `
    <div class="screen">
      <h1>💀 Game Over</h1>

      <p>Score : ${score}</p>

      <button id="restartBtn">
        Rejouer
      </button>
    </div>
  `;

  document
    .querySelector("#restartBtn")
    .addEventListener("click", startGame);
}

document.addEventListener("keydown", (event) => {
  const newDirection = directions[event.code];

  if (!newDirection) return;

  const isOpposite =
    direction &&
    direction.dx + newDirection.dx === 0 &&
    direction.dy + newDirection.dy === 0;

  if (isOpposite) return;

  direction = newDirection;
});

homeScreen();