const textDisplay = document.getElementById("text-display"),
  textInput = document.getElementById("text-input"),
  startBtn = document.getElementById("start-btn"),
  timeSpan = document.getElementById("time"),
  wpmSpan = document.getElementById("wpm"),
  accuracySpan = document.getElementById("accuracy");
let timer = 60,
  timerInterval,
  correctChars = 0,
  totalTyped = 0;
const passages = [
  "The art of typing has become an essential skill in the modern digital age. From writing emails to coding complex programs, being able to type quickly and accurately can save time and increase productivity. Many people improve their typing skills by practicing regularly with online typing tests.",
  "Technology continues to advance at an incredible pace, influencing nearly every aspect of our daily lives. From smartphones that fit in our pockets to powerful artificial intelligence tools, innovations have reshaped communication, work, and entertainment in ways that were unimaginable just a few decades ago.",
  "Reading books is one of the oldest and most rewarding habits known to humanity. Whether it is fiction, history, science, or philosophy, books expand our knowledge, spark creativity, and allow us to experience countless adventures without ever leaving our homes.",
  "Discipline and consistency are two of the most important ingredients for achieving success in any field. While talent may open the first door, it is hard work and perseverance that keep opportunities alive and help people turn their dreams into reality.",
];
let currentText = "",
  leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
startBtn.addEventListener("click", () => {
  resetTest(),
    (currentText = passages[Math.floor(Math.random() * passages.length)]),
    renderText(currentText),
    (textInput.disabled = !1),
    textInput.focus(),
    startTimer();
});
function renderText(t) {
  (textDisplay.innerHTML = ""),
    t.split("").forEach((t) => {
      const e = document.createElement("span");
      (e.innerText = t), textDisplay.appendChild(e);
    });
}
textInput.addEventListener("input", () => {
  const t = textDisplay.querySelectorAll("span"),
    e = textInput.value.split("");
  totalTyped++,
    (correctChars = 0),
    t.forEach((t, n) => {
      const o = e[n];
      null == o
        ? t.classList.remove("correct", "incorrect")
        : o === t.innerText
        ? (t.classList.add("correct"),
          t.classList.remove("incorrect"),
          correctChars++)
        : (t.classList.add("incorrect"), t.classList.remove("correct"));
    }),
    updateStats();
});
function startTimer() {
  (timer = 60),
    (timeSpan.innerText = timer),
    (timerInterval = setInterval(() => {
      timer--,
        (timeSpan.innerText = timer),
        timer <= 0 && (clearInterval(timerInterval), endTest());
    }, 1e3));
}
function updateStats() {
  let t = textInput.value.trim().split(/\s+/).filter(Boolean).length,
    e = 60 - timer,
    n = e > 0 ? Math.round((t / e) * 60) : 0,
    o = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 0;
  (wpmSpan.innerText = n), (accuracySpan.innerText = o);
}
function resetTest() {
  clearInterval(timerInterval),
    (textInput.value = ""),
    (correctChars = 0),
    (totalTyped = 0),
    (wpmSpan.innerText = "0"),
    (accuracySpan.innerText = "0");
}
function endTest() {
  textInput.disabled = !0;
  const t = prompt("Enter your name for the leaderboard:");
  t &&
    saveResult(
      t,
      parseInt(wpmSpan.innerText),
      parseInt(accuracySpan.innerText)
    );
}
function saveResult(t, e, n) {
  leaderboard.push({ name: t, wpm: e, accuracy: n }),
    leaderboard.sort((t, e) => e.wpm - t.wpm),
    (leaderboard = leaderboard.slice(0, 10)),
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard)),
    renderLeaderboard();
}
function renderLeaderboard() {
  const t = document.getElementById("leaderboard-body");
  (t.innerHTML = ""),
    leaderboard.forEach((e, n) => {
      const o = `<tr><td>${n + 1}</td><td>${e.name}</td><td>${e.wpm}</td><td>${
        e.accuracy
      }%</td></tr>`;
      t.innerHTML += o;
    });
}
renderLeaderboard();
