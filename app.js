const sentence = document.querySelector('.sentence-to-write');
const textAreaToTest = document.querySelector('.text-to-test');
const APIEndpoint = 'http://api.quotable.io/random';
let spansFromAPISentence;
const timeDisplayed = document.querySelector('.time');
const scoreDisplayed = document.querySelector('.score');

let time = 60;
let score = 0;

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
  } catch (error) {
    console.log(error);
  }
}

getNewSentence();

window.addEventListener('keydown', handleStart);

function handleStart(e) {
  if (e.key === 'Escape') {
  }
}
