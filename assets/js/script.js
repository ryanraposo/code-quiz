const MAXTIME = 50;

var time;
var timerOn = false;
var timerId;
var timerText = document.getElementById("timer-text");

var QAs = [];

var score = 0;

class QA {
  constructor(questionText, possibleAnswers, correctAnswer) {

    this.questionText = questionText;
    this.possibleAnswers = possibleAnswers;
    this.correctAnswer = correctAnswer;

    this.questionEl = document.createElement("h1");
    this.questionEl.innerText = this.questionText;

    this.answersEl = [];
    this.possibleAnswers.forEach((possibleAnswer, index) => {
      const btnPossibleAnswer = document.createElement('button');
      btnPossibleAnswer.setAttribute('id', index.toString());
      btnPossibleAnswer.addEventListener('click', () => {onClickBtnPossibleAnswer(index === correctAnswer)});
      btnPossibleAnswer.innerText = possibleAnswer;
      this.answersEl.push(btnPossibleAnswer);
    })
  }

 
}
//* Buttons
function onClickBtnStart() {
  beginQuiz();
}

function onClickBtnRestart() {
  initializeGame();
}

function onClickBtnPossibleAnswer(isCorrect) {
  
  if (isCorrect) {
    score += 1;
  }
  else {
    time -= 5;
  }
  QAs.shift()

  if (QAs.length === 0) {
    gameOver();
    return;
  }
  
  QuizView();
  
}

function onClickBtnSubmitHighScore() {
  const inputInitialsEl = document.getElementById('input-initials');
  const initials = inputInitialsEl.value;

  const scores = localStorage.getItem('scores');
  let scoresObj = JSON.parse(scores);

  if (scoresObj === null) {
    scoresObj = {};
  } 

  scoresObj[initials] = score;

  score = 0;

  localStorage.setItem("scores", JSON.stringify(scoresObj))
  
  HighScoresView();
}
// *Utility
function initializeQuiz() {
  const qa1 = new QA("What day is it?", ["Monday", "Tuesday", "Wednesday"], 2);
  const qa2 = new QA("What city are we in?", ["New York", "Toronto", "Chicago"], 1);
  
  QAs.push(qa1, qa2)
}

function beginQuiz() {
  startTimer();
  QuizView();
}

function initializeGame() {
  const highScoresLinkEl = document.getElementById("high-scores-link")
  highScoresLinkEl.onclick = () => {HighScoresView()};
  score = 0;
  initializeQuiz();
  initializeTimer();
  StartView();
}

function gameOver() {
  stopTimer();
  EndView();
}

function sortScores(scoresObj) {
  // credit: Ashutosh Ranjan https://stackoverflow.com/users/6825501/ashutosh-ranjan
  const sorted = Object.entries(scoresObj)
  .sort(([, v1], [, v2]) => v1 - v2)
  .reduce((obj, [k, v]) => ({
    ...obj,
    [k.toString()]: v
  }), {})

  return sorted;

}
   
// *Views
function EndView() {

  let main = document.getElementById("main");
  main.innerHTML = '';

  const endHeaderEl = document.createElement("h1");
  endHeaderEl.innerText = "Game Over!"

  const endTextEl = document.createElement("p");
  endTextEl.innerText = "Your score was: " + score.toString();

  const inputInitialsEl = document.createElement("input");
  inputInitialsEl.id = "input-initials";
  inputInitialsEl.placeholder = "Enter your initials";

  const btnSubmitHighScore = document.createElement("button");
  btnSubmitHighScore.innerText = "Submit"
  btnSubmitHighScore.addEventListener("click", onClickBtnSubmitHighScore);

  const btnRestartEl = document.createElement("button");
  btnRestartEl.innerText = "Restart"
  btnRestartEl.addEventListener("click", onClickBtnRestart);


  main.appendChild(endHeaderEl);
  main.appendChild(endTextEl);
  main.appendChild(inputInitialsEl);
  main.appendChild(btnSubmitHighScore);
  main.appendChild(btnRestartEl);

}

function QuizView() {

  let main = document.getElementById("main");
  main.innerHTML = '';

  const qa = QAs[0];

  main.appendChild(qa.questionEl);
  qa.answersEl.forEach((answer) => {
    main.appendChild(answer);
  })

}

function StartView() {

  let main = document.getElementById("main");
  main.innerHTML = '';

  const header = '<h1>Let\'s play!</h1>'
  const description = '<p>Click below to begin</p>'
  const btnPlay = "<button id='btn-start' onclick='onClickBtnStart()'>Start</button>"

  main.innerHTML += header;
  main.innerHTML += description;
  main.innerHTML += btnPlay;

}

function HighScoresView() {
  
  let main = document.getElementById("main");
  main.innerHTML = '';

  let scoresListEl = document.createElement("ul");
  scoresListEl.setAttribute("id", "scores-list")
  
  const savedScores = localStorage.getItem("scores");
  const savedScoresObj = JSON.parse(savedScores);
  if (savedScoresObj === null){
    savedScoresObj = {}
  }

  for (const name in savedScoresObj) {
    const highScore = savedScoresObj[name];
    const highScoreEl = document.createElement("li");
    highScoreEl.innerText = name.concat(" : ", highScore);
    scoresListEl.appendChild(highScoreEl);
  }

  main.appendChild(scoresListEl);

}
// *Timer
function tickTimer() {
  if (!timerOn) {
    return;
  }
  time--;
  timerText.textContent = "Timer: " + time.toString();
  if (time === 0) {
    window.clearInterval(timerId);
    gameOver();
  }
}

function initializeTimer() {
  time = MAXTIME;
  window.clearInterval(timerId);
  timerId = window.setInterval(tickTimer, 1000);
  timerText.textContent = "Timer: " +  time.toString();
}

function startTimer() {
  timerOn = true;
}

function stopTimer() {
  timerOn = false;
}


initializeGame();
