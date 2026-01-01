const checkButton = document.querySelector(".btn");
const aboutButton = document.querySelector(".info");

function checkComplexity(pwd) {
  // length
  let complexityScore = 0;
  if (pwd.length < 6) {
    complexityScore += 6.25;
  } else if (pwd.length > 6 && pwd.length < 9) {
    complexityScore += 12;
  } else if (pwd.length > 9 && pwd.length < 15) {
    complexityScore += 18;
  } else {
    complexityScore += 25;
  }

  console.log("Length: ", complexityScore);

  //variety
  const lowerCase = "abcdefghijklmnopqrstuvwxyz";
  const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "@!#$%^&*";

  // Lowercase check
  if ([...pwd].some((c) => lowerCase.includes(c))) {
    complexityScore += 6.25;
  }

  // Uppercase check
  if ([...pwd].some((c) => upperCase.includes(c))) {
    complexityScore += 6.25;
  }

  // Numbers check
  if ([...pwd].some((c) => numbers.includes(c))) {
    complexityScore += 6.25;
  }

  // Symbols check
  if ([...pwd].some((c) => symbols.includes(c))) {
    complexityScore += 6.25;
  }

  //commonWords
  const commonPasswordWords = [
    "password",
    "123456",
    "123456789",
    "qwerty",
    "abc123",
    "password1",
    "admin",
    "letmein",
    "welcome",
    "login",
    "monkey",
    "dragon",
    "sunshine",
    "football",
    "iloveyou",
    "starwars",
    "master",
    "hello",
    "freedom",
    "whatever",
    "qazwsx",
    "trustno1",
    "shadow",
    "superman",
    "batman",
    "michael",
    "jessica",
    "killer",
    "hockey",
    "soccer",
    "baseball",
    "internet",
    "computer",
    "qwertyuiop",
    "asdfgh",
    "zxcvbn",
    "pass",
    "123123",
    "flower",
    "princess",
    "lovely",
    "loveme",
    "zaq1zaq1",
    "1q2w3e",
    "1qaz2wsx",
    "111111",
    "222222",
    "333333",
    "444444",
    "555555",
    "666666",
    "777777",
    "888888",
    "999999",
    "000000",
    "qwert",
    "asdf",
    "zxcv",
    "love",
    "star",
    "sun",
    "moon",
    "earth",
    "mars",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "soccer",
    "basketball",
    "tennis",
    "volleyball",
    "guitar",
    "piano",
    "music",
    "rock",
    "metal",
    "pop",
    "movie",
    "freedom",
    "money",
    "internet",
    "internet",
    "iloveu",
    "dragon",
    "pokemon",
    "naruto",
    "onepiece",
    "bleach",
    "football",
    "soccer",
    "baseball",
    "hockey",
    "monkey",
    "tiger",
    "lion",
    "bear",
    "wolf",
    "cat",
    "dog",
    "fish",
    "bird",
    "snake",
    "rabbit",
    "horse",
    "cow",
    "sheep",
    "chicken",
    "summer",
    "winter",
    "spring",
    "autumn",
    "hello",
    "welcome",
    "admin123",
    "guest",
    "root",
    "superuser",
    "master123",
    "pass123",
    "abc12345",
    "1234",
    "4321",
    "1111",
    "1212",
    "123abc",
    "abcabc",
    "qwerty123",
    "asdf123",
    "zxcv123",
  ];

  const pwdLower = pwd.toLowerCase();
  if (commonPasswordWords.some((word) => pwdLower.includes(word))) {
    complexityScore -= 10;
  } else {
    complexityScore += 12.5;
  }

  return [
    complexityScore / 75,
    commonPasswordWords.some((word) => pwdLower.includes(word)),
  ];
}

function checkPossibilities(pwd) {
  let charSet = 0;
  let hasLower = false;
  let hasUpper = false;
  let hasNumber = false;
  let hasSymbol = false;

  const lowerCase = "abcdefghijklmnopqrstuvwxyz";
  const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "@!#$%^&*";

  for (let i = 0; i < pwd.length; i++) {
    if (lowerCase.includes(pwd[i])) hasLower = true;
    else if (upperCase.includes(pwd[i])) hasUpper = true;
    else if (numbers.includes(pwd[i])) hasNumber = true;
    else if (symbols.includes(pwd[i])) hasSymbol = true;
  }

  if (hasLower) charSet += 26;
  if (hasUpper) charSet += 26;
  if (hasNumber) charSet += 10;
  if (hasSymbol) charSet += 10;

  const possibilities = Math.pow(charSet, pwd.length);

  return possibilities;
}

function estimateTime(pwd, hasCommonWords) {
  const possibilities = checkPossibilities(pwd);
  let guessesPerSecond = 0;
  if (hasCommonWords) guessesPerSecond = 1e6;
  else guessesPerSecond = 1e9;
  const time = possibilities / guessesPerSecond;

  const units = [
    { label: "years", value: 31536000 },
    { label: "days", value: 86400 },
    { label: "hours", value: 3600 },
    { label: "minutes", value: 60 },
  ];

  for (const unit of units) {
    if (time >= unit.value) {
      return [
        `${(time / unit.value).toFixed(2)} ${unit.label}`,
        time.toFixed(2),
      ];
    }
  }
  return [`${time.toFixed(2)} seconds`, time.toFixed(2)];
}

function crackTimeScore(time) {
  if (time < 1) return 0;
  if (time < 60) return 10;
  if (time < 3600) return 20;
  if (time < 86400) return 35;
  if (time < 2592000) return 50;
  if (time < 31536000) return 65;
  if (time < 315360000) return 80;
  if (time < 3153600000) return 90;
  return 100;
}

function getPwd() {
  const pwd = document.querySelector(".inputPwd").value;
  const complexityPercentage = document.querySelector(".complexityPercentage");
  const est = document.querySelector(".est");
  const score = document.querySelector(".score");

  console.log("Password to check: ", pwd);

  const res = checkComplexity(pwd);

  const estimatedTime = estimateTime(pwd, res[1]);
  console.log(estimatedTime[0], res[1]);
  complexityPercentage.textContent = res[0] * 100 + "%";
  est.textContent = estimatedTime[0];
  const crackScore = crackTimeScore(estimatedTime[1]);
  overallScore = res[0] * 100 * 0.6 + crackScore * 0.4;
  // console.log(overallScore);
  score.textContent = overallScore + "%";
}

checkButton.addEventListener("click", () => {
  getPwd();
});

function displayOverlay() {
  const overlay = document.querySelector(".about-overlay");
  overlay.classList.remove("hidden");
  overlay.addEventListener("click", () => {
    overlay.classList.add("hidden");
  });
}

aboutButton.addEventListener("click", () => {
  displayOverlay();
});
