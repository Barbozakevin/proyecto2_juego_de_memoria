const symbols = [
  '🂠', '🂡', '🂢', '🂤', '🂥', '🂦', '🂧', '🂨', '🂩', '🂪', '🂫', '🂭',
  '🂮', '🂱', '🂲', '🂳', '🂴', '🂵', '🂶', '🂷', '🂸', '🂹', '🂺', '🂻'
];

const totalPairs = 5;
const revealSeconds = 10;
let cards = [];
let flippedCards = [];
let matchedCards = [];
let moves = 0;
let currentPlayer = 1;
let player1Time = 60;
let gameInterval;
let revealInterval;
let revealTimeout;
let gameStarted = false;
let isRevealing = false;

function generateRandomCards() {
  const doubledSymbols = symbols.slice(0, totalPairs).concat(symbols.slice(0, totalPairs));
  doubledSymbols.sort(() => Math.random() - 0.5);

  const gameBoard = document.getElementById('game-board');
  for (let i = 0; i < doubledSymbols.length; i++) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = doubledSymbols[i];
    card.dataset.index = i;
    card.addEventListener('click', handleCardClick);
    gameBoard.appendChild(card);
    cards.push(card);
  }
}

function handleCardClick() {
  const card = this;

  if (!gameStarted || isRevealing) return;

  if (!flippedCards.includes(card) && flippedCards.length < 2 && !matchedCards.includes(card)) {
    card.textContent = card.dataset.symbol;
    card.classList.add('flipped');
    flippedCards.push(card);

    const flipSound = document.getElementById('flipSound');
    if (flipSound) flipSound.play();

    if (flippedCards.length === 2) {
      moves++;
      checkMatch();
    }
  } else {
    card.classList.toggle('enlarged');
  }
}

function checkMatch() {
  const [firstCard, secondCard] = flippedCards;

  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    matchedCards.push(firstCard, secondCard);
    flippedCards = [];

    if (matchedCards.length === totalPairs * 2) {
      displayMessage(`¡Felicidades! Has ganado en ${moves} movimientos.`);
      clearInterval(gameInterval);
      gameStarted = false;
    }

    const matchSound = document.getElementById('matchSound');
    if (matchSound) matchSound.play();

    setTimeout(() => {
      firstCard.style.visibility = 'hidden';
      secondCard.style.visibility = 'hidden';
      updateBoard();
    }, 500);
  } else {
    setTimeout(() => {
      firstCard.textContent = '';
      secondCard.textContent = '';
      firstCard.classList.add('unflip');
      secondCard.classList.add('unflip');
      displayErrorMessage('¡Intenta de nuevo!');
      flippedCards = [];
    }, 1000);
  }
}

function displayMessage(message) {
  const messageContainer = document.getElementById('message');
  if (messageContainer) {
    messageContainer.textContent = message;
    messageContainer.style.display = 'block';
  }
}

function displayErrorMessage(message) {
  const errorMessageContainer = document.getElementById('error-message');
  if (errorMessageContainer) {
    errorMessageContainer.textContent = message;
    errorMessageContainer.style.display = 'block';

    setTimeout(() => {
      errorMessageContainer.style.display = 'none';
    }, 1500);
  }
}

function showCardsForSeconds(seconds) {
  isRevealing = true;
  let remainingSeconds = seconds;
  const previewTime = document.getElementById('preview-time');
  clearInterval(revealInterval);
  previewTime.textContent = `Memorización: ${remainingSeconds}s`;
  cards.forEach(card => {
    card.textContent = card.dataset.symbol;
    card.classList.add('flipped');
  });

  revealInterval = setInterval(() => {
    remainingSeconds--;
    previewTime.textContent = `Memorización: ${remainingSeconds}s`;
  }, 1000);

  revealTimeout = setTimeout(() => {
    clearInterval(revealInterval);
    cards.forEach(card => {
      card.textContent = '';
      card.classList.remove('flipped', 'enlarged', 'unflip');
    });
    isRevealing = false;
    previewTime.textContent = '¡Empieza a encontrar las parejas!';
    gameStarted = true;
    updateBoard();
    startTimer();
  }, seconds * 1000);
}

function updateBoard() {
  const playerTurn = document.getElementById('player-turn');
  if (playerTurn) {
    playerTurn.textContent = `Turno del Jugador ${currentPlayer}`;
  }
}

function startTimer() {
  clearInterval(gameInterval);
  gameInterval = setInterval(() => {
    if (!gameStarted) return;

    player1Time--;
    document.getElementById('player1-time').textContent = `Tiempo del Jugador 1: ${player1Time}s`;

    if (player1Time <= 0) {
      clearInterval(gameInterval);
      gameStarted = false;
      alert('Tiempo agotado. Has perdido.');
    }
  }, 1000);
}

function startGame() {
  const gameBoard = document.getElementById('game-board');
  clearInterval(gameInterval);
  clearTimeout(revealTimeout);
  clearInterval(revealInterval);
  gameBoard.innerHTML = '';
  cards = [];
  flippedCards = [];
  matchedCards = [];
  moves = 0;
  currentPlayer = 1;
  gameStarted = false;
  document.getElementById('start-button').textContent = 'Reiniciar';
  displayMessage('');

  player1Time = 60;
  document.getElementById('player1-time').textContent = `Tiempo del Jugador 1: ${player1Time}s`;

  generateRandomCards();
  showCardsForSeconds(revealSeconds);
}

document.getElementById('start-button').addEventListener('click', startGame);
updateBoard();