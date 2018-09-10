'use strict'

const playButton = document.getElementById("play");
const answerButton = document.getElementById("answer");
const resetButton = document.getElementById("reset");


const questionDiv = document.getElementById("question");
const answerDiv = document.querySelector(".score");
const label = document.querySelector("form > label");
const intro = document.getElementById("intro");
const form  = document.querySelector('form');

const correctCount = document.getElementById("correct");
const questionCount = document.getElementById("remaining");


const radios = document.getElementsByName('answer');

let index = 0;
let questions = [];
let correct = false;
let answer = undefined;
// initially set to eleven to hide transition between game states
let remainingQuestions = 11;
let correctTally = 0;



function requestQuestions() {
    fetch('https://opentdb.com/api.php?amount=10&type=boolean')
        .then(function(response) {
            return response.json();
        })
        .then(function(myJson) {
            if (myJson.response_code === 0) {
                questions = myJson.results;
                hidePlayElements();
                showAnswerElements();
                loadQuestion();
                updateCount();
                questionCount.innerHTML = remainingQuestions;
        }
    });
}



// read current questions (index 0)

function hidePlayElements(){
    playButton.classList.add('hidden');
    intro.classList.add('hidden');
    resetButton.classList.add('hidden');
}

function showAnswerElements(){
    form.classList.remove('hidden');
    answerButton.classList.remove('hidden');
    answerDiv.classList.remove('hidden');  
}

function loadQuestion() {
    label.innerHTML = `${questions[index].question} <br>`;
    correct = questions[index].correct_answer.toLowerCase();
    index++;
}

function retrieveUserAnswer() {
    for (let i = 0; i < radios.length; i++){
        if (radios[i].checked === true) {
            answer = radios[i].value;
        }
    }
}

function compareAnswer() {
    if (answer === correct) {
        correctTally++;
    }
}

function updateCount() {
    correctCount.innerHTML = correctTally;
    remainingQuestions--;
    questionCount.innerHTML = remainingQuestions;

}

function showReset() {
    form.classList.add('hidden');
    intro.innerHTML = `Congratulations, you got ${correctTally} out of 10 right! <br> Would you like to try again?`;
    intro.classList.remove('hidden');
    answerButton.classList.add('hidden');
    resetButton.classList.remove('hidden');
}

function resetGame() {
    index = 0;
    remainingQuestions = 11;
    correctTally = 0;
}


playButton.addEventListener('click', (e) => {
    requestQuestions();
});

answerButton.addEventListener('click', (e) => {
    retrieveUserAnswer();
    compareAnswer();
    updateCount();
    console.log(remainingQuestions);
    if (remainingQuestions > 0){
        loadQuestion();
    } else {
        showReset()
    }
});

resetButton.addEventListener('click', (e) => {
    resetGame();
    requestQuestions();
 
});