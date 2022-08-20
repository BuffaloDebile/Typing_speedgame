const sentence = document.querySelector('.sentence-to-write');
const textAreaToTest = document.querySelector('.text-to-test');
const APIEndpoint = 'http://api.quotable.io/random';
let spansFromAPISentence;
const timeDisplayed = document.querySelector('.time');
const scoreDisplayed = document.querySelector('.score');

let time = 60;
let score = 0;
let timerID;

async function getNewSentence() {
  try {
    const response = await fetch(APIEndpoint);
    if (!response.ok) throw new Error();

    const { content } = await response.json();

    sentence.textContent = '';

    content.split('').forEach((character) => {
      const spanCharacter = document.createElement('span');
      spanCharacter.textContent = character;
      sentence.appendChild(spanCharacter);
    });

    spansFromAPISentence = sentence.querySelectorAll('.sentence-to-write span');
    textAreaToTest.value = '';
    locked = false;
  } catch (error) {
    console.log(error);
  }
}

getNewSentence();

window.addEventListener('keydown', handleStart);

function handleStart(e) {
  if (e.key === 'Escape') {
    if (timerID) {
      clearInterval(timerID);
      timerID = undefined;
    }

    time = 60;
    score = 0;

    timeDisplayed.classList.add('.active');
    textAreaToTest.classList.add('.active');

    timeDisplayed.textContent = `Time: ${time}`;
    scoreDisplayed.textContent = `Score: ${score}`;
    textAreaToTest.value = '';

    spansFromAPISentence.forEach((span) => (span.className = ''));

    textAreaToTest.addEventListener('input', handleTyping);
    textAreaToTest.focus();
  }
}
let locked = false;
function handleTyping(e) {
  if (locked) return;

  if (!timerID) {
    startTimer();
  }

  const sentenceCompleted = checkSpans();
  if (sentenceCompleted) {
    locked = true;
    getNewSentence();
    score += spansFromAPISentence.length;
    scoreDisplayed.textContent = `score : ${score}`;
  }
}

function startTimer() {
  time--;
  timeDisplayed.textContent = `Time: ${time}`;
  timerID = setInterval(() => {
    time--;
    timeDisplayed.textContent = `Time: ${time}`;
    if (time === 0) {
      clearInterval(timerID);
      timeDisplayed.classList.remove('active');
      textAreaToTest.classList.remove('active');
      const spansFromAPISentence = sentence.querySelectorAll('span');
      spansFromAPISentence.forEach((span) =>
        span.classList.contains('correct') ? score++ : '',
      );
      scoreDisplayed.textContent = `Score: ${score}`;
      textAreaToTest.removeEventListener('input', handleTyping);
    }
  }, 1000);
}

function checkSpans() {
  const textAreaCharactersArray = textAreaToTest.value.split('');
  let sentenceCompleted = true;
  let currentGoodLetters = 0;

  for (let i = 0; i < spansFromAPISentence.length; i++) {
    if (textAreaCharactersArray[i] === undefined) {
      spansFromAPISentence[i].className = '';
      sentenceCompleted = false;
    } else if (
      textAreaCharactersArray[i] === spansFromAPISentence[i].textContent
    ) {
      spansFromAPISentence[i].classList.remove('wrong');
      spansFromAPISentence[i].classList.add('correct');
      currentGoodLetters++;
    } else {
      spansFromAPISentence[i].classList.add('wrong');
      spansFromAPISentence[i].classList.remove('correct');
      sentenceCompleted = false;
    }
  }

  scoreDisplayed.textContent = `Score : ${score + currentGoodLetters}`;

  return sentenceCompleted;
}
