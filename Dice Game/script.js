"use strict";
let currentPlayer = 0;

const players = document.querySelectorAll(".player");
const rollDiceBtn = document.querySelector(".roll");
const holdBtn = document.querySelector(".hold");
const diceImage = document.querySelector(".dice");
const currentScores = document.querySelectorAll(".currentValue");
const scores = document.querySelectorAll(".score");
const victory = document.querySelector(".victoryPanel");
const overlay = document.querySelector(".overlay");
const again = document.querySelector(".playAgain");
const newGame = document.querySelector(".newGame");

const aboutBtn = document.querySelector(".aboutBtn");
const aboutPanel = document.querySelector(".about-section");
const close = document.querySelector(".close");

function updateUI(currentPlayer) {
  if (currentPlayer === 0) {
    players[0].classList.add("active");
    players[1].classList.remove("active");
    players[1].classList.add("inactive");
  } else {
    players[1].classList.add("active");
    players[0].classList.remove("active");
    players[0].classList.add("inactive");
  }
}

function switchPlayer() {
  currentPlayer = currentPlayer === 0 ? 1 : 0;
  updateUI(currentPlayer);
}

function rollDice() {
  const diceValue = Math.floor(Math.random() * 6) + 1;
  console.log(diceValue);

  switch (diceValue) {
    case 1:
      diceImage.src = "1.png";
      break;
    case 2:
      diceImage.src = "2.png";
      break;
    case 3:
      diceImage.src = "3.png";
      break;
    case 4:
      diceImage.src = "4.png";
      break;
    case 5:
      diceImage.src = "5.png";
      break;
    case 6:
      diceImage.src = "6.png";
      break;
  }
  return diceValue;
}

function displayVictory(currentPlayer) {
  document.querySelector(".playerID").textContent = currentPlayer + 1;
  victory.classList.remove("hidden");
  overlay.classList.remove("hidden");
  console.log(`Victory!`);
}

function displayAbout() {
  aboutPanel.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

function hideAbout() {
  aboutPanel.classList.add("hidden");
  overlay.classList.add("hidden");
}

function hideVictory() {
  victory.classList.add("hidden");
  overlay.classList.add("hidden");
}

function reset() {
  currentScores[0].textContent = 0;
  scores[0].textContent = 0;
  currentScores[1].textContent = 0;
  scores[1].textContent = 0;
  diceImage.src = "1.png";
  hideVictory();
}

rollDiceBtn.addEventListener("click", function () {
  const res = rollDice();
  if (res !== 1) {
    currentScores[currentPlayer].textContent =
      Number(currentScores[currentPlayer].textContent) + res;
  } else {
    currentScores[currentPlayer].textContent = 0;
    switchPlayer();
  }
});

holdBtn.addEventListener("click", function () {
  if (Number(currentScores[currentPlayer].textContent)) {
    scores[currentPlayer].textContent =
      Number(scores[currentPlayer].textContent) +
      Number(currentScores[currentPlayer].textContent);
    currentScores[currentPlayer].textContent = 0;
  }
  if (Number(scores[currentPlayer].textContent) >= 50) {
    displayVictory(currentPlayer);
  } else {
    switchPlayer();
  }
});

aboutBtn.addEventListener("click", displayAbout);
close.addEventListener("click", hideAbout);
again.addEventListener("click", reset);
newGame.addEventListener("click", reset);
