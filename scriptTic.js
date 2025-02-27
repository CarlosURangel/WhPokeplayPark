// Variables principales
const board = document.querySelectorAll('.cell');
const pokemonContainer = document.getElementById('pokemon-container');
const pokemonImage = document.getElementById('pokemon-image');
const pokemonInput = document.getElementById('pokemon-input');
const submitGuess = document.getElementById('submit-guess');
const message = document.getElementById('message');

const playerX = document.getElementById('player-x');
const playerO = document.getElementById('player-o');
const winnerModal = document.getElementById('winner-modal');
const winnerMessage = document.getElementById('winner-message');
const restartGameButton = document.getElementById('restart-game');
const regionSelector = document.getElementById('region');
const startGameButton = document.getElementById('start-game');

let currentPlayer = 'X';
let selectedCell = null;
let currentPokemon = null;
let gameActive = true;
let selectedRegion = 'all';
let pokemons = [];

// Rango de IDs de Pokémon por región
const regionPokemonRanges = {
    kanto: { min: 1, max: 151 },
    johto: { min: 152, max: 251 },
    hoenn: { min: 252, max: 386 },
    sinnoh: { min: 387, max: 493 },
    unova: { min: 494, max: 649 },
    kalos: { min: 650, max: 721 },
    alola: { min: 722, max: 809 },
    galar: { min: 810, max: 898 },
    paldea: { min: 899, max: 1010 }
};


function toggleMenu() {
    var menu = document.getElementById('menuLinks');
    menu.classList.toggle("mostrar");
  
    // Si el menú se está mostrando, añadir el evento de clic en el documento
    if (menu.classList.contains("mostrar")) {
      document.addEventListener("click", closeMenuOnClickOutside);
    } else {
      document.removeEventListener("click", closeMenuOnClickOutside);
    }
  }
  
  function closeMenuOnClickOutside(event) {
    var menu = document.getElementById('menuLinks');
    var menuIcon = document.querySelector(".menuIcon");
  
    // Comprobar si el clic se ha hecho fuera del menú y del ícono de menú
    if (!menu.contains(event.target) && !menuIcon.contains(event.target)) {
      menu.classList.remove("mostrar"); // Cerrar el menú si se hizo clic fuera
      document.removeEventListener("click", closeMenuOnClickOutside); // Eliminar el listener una vez que se cerró el menú
    }
  }
// Obtener un Pokémon aleatorio de la región seleccionada
async function getRandomPokemon() {
    let min, max;
    if (selectedRegion === 'all') {
        min = 1;
        max = 1010;
    } else {
        const range = regionPokemonRanges[selectedRegion];
        min = range.min;
        max = range.max;
    }

    const randomId = Math.floor(Math.random() * (max - min + 1)) + min;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data = await response.json();
    return data;
}

// Mostrar el Pokémon a adivinar
async function showPokemon() {
    const pokemon = await getRandomPokemon();
    currentPokemon = pokemon;
    pokemonImage.src = pokemon.sprites.front_default;
    message.textContent = "Adivina el Pokémon para jugar tu turno!";
}

// Cambiar el turno del jugador y mostrar un nuevo Pokémon
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Cambiar de turno
    updatePlayerIndicator();
    showPokemon(); // Mostrar un nuevo Pokémon para el siguiente turno
}

// Actualizar el indicador visual del jugador activo
function updatePlayerIndicator() {
    if (currentPlayer === 'X') {
        playerX.classList.add('active');
        playerO.classList.remove('active');
    } else {
        playerO.classList.add('active');
        playerX.classList.remove('active');
    }
}

// Verificar si el nombre del Pokémon ingresado es correcto
function checkPokemonGuess(guess) {
    return guess.toLowerCase() === currentPokemon.name.toLowerCase();
}

// Verificar si hay un ganador
function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
        [0, 4, 8], [2, 4, 6]             // Diagonales
    ];

    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return board[a].textContent === currentPlayer &&
               board[a].textContent === board[b].textContent &&
               board[a].textContent === board[c].textContent;
    });
}

// Reiniciar el juego
function restartGame() {
    board.forEach(cell => {
        cell.textContent = ''; // Limpiar el tablero
    });
    gameActive = true;
    winnerModal.style.display = 'none'; // Ocultar el modal
    currentPlayer = 'X'; // Reiniciar con el jugador X
    updatePlayerIndicator();
    showPokemon(); // Mostrar un nuevo Pokémon
}

// Mostrar el ganador y reiniciar el juego
function announceWinner() {
    winnerMessage.textContent = `¡El ganador es ${currentPlayer}!`;
    winnerModal.style.display = 'block';
}

// Evento al hacer clic en una celda del tablero
board.forEach(cell => {
    cell.addEventListener('click', () => {
        if (!cell.textContent && gameActive) {
            selectedCell = cell;
            showPokemon(); // Mostrar el Pokémon cuando seleccionas una celda
        }
    });
});

// Evento para enviar la respuesta de adivinanza
submitGuess.addEventListener('click', () => {
    if (!gameActive) return;

    const guess = pokemonInput.value.trim();
    if (checkPokemonGuess(guess)) {
        selectedCell.textContent = currentPlayer; // Colocar "X" o "O" en la celda
        selectedCell = null;
        pokemonInput.value = ''; // Limpiar el input

        if (checkWinner()) {
            gameActive = false; // Detener el juego
            announceWinner(); // Mostrar el modal con el ganador
        } else {
            switchPlayer(); // Cambiar turno después de una jugada correcta
        }
    } else {
        message.textContent = "¡Incorrecto! El turno pasa al otro jugador.";
        pokemonInput.value = ''; // Limpiar el campo de texto
        switchPlayer(); // Cambiar turno
    }
});

// Evento para iniciar el juego después de seleccionar una región
startGameButton.addEventListener('click', () => {
    selectedRegion = regionSelector.value;
    restartGame();
});

// Reiniciar el juego cuando se haga clic en el botón de reinicio
restartGameButton.addEventListener('click', restartGame);