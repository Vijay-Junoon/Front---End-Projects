"use strict";

const keys = document.querySelectorAll(".key");
const word = document.querySelector(".word");
const newGame = document.querySelector(".newGame");

const victory = document.querySelector(".victory");
const lose = document.querySelector(".lose");

const losePanel = document.querySelector(".losePanel");
const victoryPanel = document.querySelector(".victoryPanel");

const overlay = document.querySelector(".overlay");

const close = document.querySelector(".close");
const closeLose = document.querySelector(".closeLose");

const tryAgain = document.querySelector(".tryAgain");
const scoreValue = document.querySelector(".score");

const aboutBTN = document.querySelector(".aboutBTN");
const aboutPanel = document.querySelector(".aboutPanel");
const aboutDevButton = document.querySelector(".aboutDevButton");
const aboutDev = document.querySelector(".aboutDev");
const aboutDeveloperpanel = document.querySelector(".aboutDeveloper-panel");

let movie = "";
let result = "";
let score = 0;

const movieNames = [
  "The Godfather",
  "Titanic",
  "Forrest Gump",
  "The Dark Knight",
  "Inception",
  "Pulp Fiction",
  "The Shawshank Redemption",
  "Avatar",
  "Jurassic Park",
  "The Lord of the Rings: The Return of the King",
];

function showAboutDev() {
  overlay.classList.remove("hidden");
  aboutDeveloperpanel.classList.remove("hidden");
  aboutPanel.classList.add("Active");
  aboutDeveloperpanel.style.zIndex = 1;
}

function hideAboutDev() {
  aboutDeveloperpanel.classList.add("hidden");
  aboutPanel.classList.remove("Active");
  overlay.classList.add("hidden");
  aboutDeveloperpanel.style.zIndex = -1;
}

function showAbout() {
  aboutPanel.classList.add("Active");
}

function hideAbout() {
  aboutPanel.classList.remove("Active");
}

function displayVictory() {
  victory.classList.remove("hidden");
  victoryPanel.style.zIndex = 1;
  overlay.classList.remove("hidden");
  newGame.classList.remove("hidden");
  word.textContent = "";
}

function hideVictory() {
  victory.classList.add("hidden");
  victoryPanel.style.zIndex = -1;
  overlay.classList.add("hidden");
  word.classList.add("hidden");
}

function displayLose() {
  lose.classList.remove("hidden");
  losePanel.style.zIndex = 1;
  overlay.classList.remove("hidden");
  newGame.classList.remove("hidden");
  word.textContent = "";
}

function hideLose() {
  lose.classList.add("hidden");
  losePanel.style.zIndex = -1;
  overlay.classList.add("hidden");
  word.classList.add("hidden");
}

function updateScore() {
  scoreValue.textContent = score;
}

function calScore() {
  let temp = 0;
  for (let i = 0; i < result.length; i++) {
    if (result[i] === "_") temp += 1;
  }
  score = temp + 3;
  console.log(`Score: ${score}`);
  updateScore();
}

function generateRandomWord() {
  hideVictory();
  newGame.classList.add("hidden");
  word.classList.remove("hidden");
  movie = movieNames[Math.trunc(Math.random() * 10)].toUpperCase();
  result = "";
  for (let i = 0; i < movie.length; i++) {
    if (
      movie[i] !== "A" &&
      movie[i] !== "E" &&
      movie[i] !== "I" &&
      movie[i] !== "O" &&
      movie[i] !== "U" &&
      movie[i] !== " "
    ) {
      result += "_";
    } else {
      result += movie[i];
    }
  }
  console.log(movie);
  console.log(result);
  word.textContent = result;
  calScore();
}

function typeLetter(x) {
  let placeholder = "";
  score -= 1;
  updateScore();
  for (let i = 0; i < movie.length; i++) {
    if (movie[i] === x) {
      placeholder += x;
    } else {
      placeholder += result[i];
    }
  }
  result = placeholder;
  console.log(placeholder);
  word.classList.add("Active");
  setTimeout(() => {
    word.classList.remove("Active");
  }, 100);
  word.textContent = placeholder;

  if (word.textContent === movie && score > 0) {
    displayVictory();
  }
  if (score <= 0) {
    displayLose();
  }
  //   calScore();
}

for (let i = 0; i < keys.length; i++) {
  keys[i].addEventListener("click", function () {
    typeLetter(keys[i].textContent);
  });
}

newGame.addEventListener("click", generateRandomWord);
close.addEventListener("click", hideVictory);
closeLose.addEventListener("click", hideLose);
tryAgain.addEventListener("click", generateRandomWord);
aboutBTN.addEventListener("click", showAbout);
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    if (!aboutPanel.classList.contains("hidden")) {
      hideAbout();
    }
    if (!aboutDeveloperpanel.classList.contains("hidden")) {
      hideAboutDev();
    }
  }
});
aboutDevButton.addEventListener("click", showAboutDev);
