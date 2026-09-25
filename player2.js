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
let player2Time = 60;
let gameInterval;
let scores = { 1: 0, 2: 0 };
let gameFinished = false;
let gameStarted = false;
let isRevealing = false;
let playerNames = { 1: 'Jugador 1', 2: 'Jugador 2' };

function updateScoreboard() {
  const score1 = document.getElementById('score1-value');
  const score2 = document.getElementById('score2-value');
  const label1 = document.getElementById('score1-label');
  const label2 = document.getElementById('score2-label');

  if (score1) score1.textContent = scores[1];
  if (score2) score2.textContent = scores[2];
  if (label1) label1.textContent = playerNames[1];
  if (label2) label2.textContent = playerNames[2];

  document.querySelectorAll('.score-card').forEach((card) => {
    const isActive = Number(card.dataset.player) === currentPlayer;
    card.classList.toggle('active', isActive);
  });
}

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

  if (gameFinished || !gameStarted || isRevealing) return;

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
    scores[currentPlayer] += 1;
    flippedCards = [];
    updateScoreboard();

    const matchSound = document.getElementById('matchSound');
    if (matchSound) matchSound.play();

    if (matchedCards.length === totalPairs * 2) {
      gameFinished = true;
      gameStarted = false;
      clearInterval(gameInterval);
      const winner = scores[1] === scores[2]
        ? 'Empate'
        : scores[1] > scores[2]
          ? playerNames[1]
          : playerNames[2];
      displayMessage(`Partida terminada. ${winner} gana con ${scores[1]} - ${scores[2]} aciertos.`);
      return;
    }

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
      switchPlayer();
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
  cards.forEach(card => {
    card.textContent = card.dataset.symbol;
    card.classList.add('flipped');
  });

  setTimeout(() => {
    cards.forEach(card => {
      card.textContent = '';
      card.classList.remove('flipped', 'enlarged', 'unflip');
    });
    isRevealing = false;
    gameStarted = true;
    updateBoard();
    startTimer();
  }, seconds * 1000);
}

function switchPlayer() {
  if (gameFinished || !gameStarted) return;
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  updateBoard();
}

function updateBoard() {
  const playerTurn = document.getElementById('player-turn');
  if (playerTurn) {
    playerTurn.textContent = `Turno de ${playerNames[currentPlayer]}`;
  }

  document.getElementById('player1-time').textContent = `Tiempo de ${playerNames[1]}: ${player1Time}s`;
  document.getElementById('player2-time').textContent = `Tiempo de ${playerNames[2]}: ${player2Time}s`;
  updateScoreboard();
}

function startTimer() {
  clearInterval(gameInterval);
  gameInterval = setInterval(() => {
    if (gameFinished || !gameStarted) return;

    if (currentPlayer === 1) {
      player1Time--;
      if (player1Time <= 0) {
        player1Time = 0;
        clearInterval(gameInterval);
        gameFinished = true;
        gameStarted = false;
        displayMessage(`Tiempo agotado. ${playerNames[2]} gana por tiempo.`);
      }
    } else {
      player2Time--;
      if (player2Time <= 0) {
        player2Time = 0;
        clearInterval(gameInterval);
        gameFinished = true;
        gameStarted = false;
        displayMessage(`Tiempo agotado. ${playerNames[1]} gana por tiempo.`);
      }
    }

    updateBoard();
  }, 1000);
}

function startGame() {
  const gameBoard = document.getElementById('game-board');
  gameBoard.innerHTML = '';
  cards = [];
  flippedCards = [];
  matchedCards = [];
  moves = 0;
  currentPlayer = 1;
  gameFinished = false;
  gameStarted = false;
  scores = { 1: 0, 2: 0 };
  displayMessage('');

  player1Time = 60;
  player2Time = 60;
  document.getElementById('player1-time').textContent = `Tiempo del Jugador 1: ${player1Time}s`;
  document.getElementById('player2-time').textContent = `Tiempo del Jugador 2: ${player2Time}s`;
  updateScoreboard();

  generateRandomCards();
  showCardsForSeconds(revealSeconds);
}

function startMultiplayer() {
  const player1Input = document.getElementById('player1-name');
  const player2Input = document.getElementById('player2-name');
  const name1 = player1Input.value.trim();
  const name2 = player2Input.value.trim();

  if (!name1 || !name2) {
    const lobbyError = document.getElementById('lobby-error');
    lobbyError.textContent = 'Escriban los dos nombres para comenzar.';
    lobbyError.style.display = 'block';
    return;
  }

  document.getElementById('lobby-error').style.display = 'none';

  playerNames = { 1: name1, 2: name2 };
  document.getElementById('lobby').hidden = true;
  document.getElementById('game-screen').hidden = false;
  currentPlayer = 1;
  startGame();
}

document.getElementById('start-button').addEventListener('click', startMultiplayer);
document.getElementById('restart-button').addEventListener('click', startGame);

updateBoard();

