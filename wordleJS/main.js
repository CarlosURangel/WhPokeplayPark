let resultElement = document.querySelector(".result");
let mainContainer = document.querySelector(".main-container");
let rowId = 1;

const apiUrl = 'https://pokeapi.co/api/v2/pokemon-species/';
let word; // Declaramos la variable `word` a nivel global

initGame();

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

function initGame() {
  getRandomPokemonWithFiveLetters()
    .then(pokemonName => {
      word = pokemonName; // Asignamos `word` al nombre del Pokémon obtenido
      let wordArray = word.toUpperCase().split("");
      console.log(wordArray);

      let actualRow = document.querySelector(".row");
      drawSquares(actualRow, wordArray);
      listenInput(actualRow, wordArray);
      addFocus(actualRow);
    })
    .catch(error => console.error('Error en el juego:', error));
}

function getRandomPokemonWithFiveLetters() {
  return new Promise((resolve, reject) => {
    const fetchPokemon = () => {
      fetch(apiUrl)
        .then(result => result.json())
        .then(data => {
          const totalPokemon = data.count;
          const randomId = Math.floor(Math.random() * totalPokemon) + 1;

          return fetch(`${apiUrl}${randomId}/`);
        })
        .then(result => result.json())
        .then(pokemonData => {
          const name = pokemonData.name;
          
          if (name.length >= 3 && name.length <= 6) {
            resolve(name);
          } else {
            console.log(`El nombre "${name}" no tiene 5 letras, buscando otro...`);
            fetchPokemon();
          }
        })
        .catch(error => reject(error));
    };

    fetchPokemon(); 
  });
}

function listenInput(actualRow, wordArray) {
  let squares = actualRow.querySelectorAll(".square");
  squares = [...squares];

  let userInput = [];

  squares.forEach((element) => {
    element.addEventListener("input", (event) => {
      if (event.inputType !== 'deleteContentBackward') {
        userInput.push(event.target.value.toUpperCase());
        if (event.target.nextElementSibling) {
          event.target.nextElementSibling.focus();
        } else {
          let squaresFilled = document.querySelectorAll('.square');
          squaresFilled = [...squaresFilled];
          let lastFiveSquares = squaresFilled.slice(-word.length);
          let finalUserInput = [];
          lastFiveSquares.forEach(element => {
            finalUserInput.push(element.value.toUpperCase());
          });

          let indexExistsArray = letterExists(wordArray, finalUserInput);
          console.log(indexExistsArray);
          indexExistsArray.forEach((element) => {
            squares[element].classList.add("gold");
          });

          let rightIndex = compareArrays(wordArray, finalUserInput);
          console.log(rightIndex);
          rightIndex.forEach((element) => {
            squares[element].classList.add("green");
          });

          if (rightIndex.length == wordArray.length) {
            showResult("¡Ganaste!");
            return;
          }

          let actualRow = createRow(); 
          if (!actualRow) {
            return;
          }
          drawSquares(actualRow, wordArray);
          listenInput(actualRow, wordArray);
          addFocus(actualRow);
        }
      } else {
        userInput.pop();
      }
    });
  });
}

// FUNCIONES ADICIONALES

function compareArrays(array1, array2) {
  let equalsIndex = [];
  array1.forEach((element, index) => {
    if (element == array2[index]) {
      equalsIndex.push(index);
    }
  });
  return equalsIndex;
}

function letterExists(array1, array2) {
    let existsIndexArray = [];
    let letterCountOriginal = {}; // Contador de letras en la palabra original
  
    // Contar cuántas veces aparece cada letra en la palabra original (array1)
    array1.forEach((letter) => {
      letterCountOriginal[letter] = (letterCountOriginal[letter] || 0) + 1;
    });
  
    let letterCountInput = {}; // Contador de letras en la entrada del usuario
  
    // Comprobamos cada letra de la entrada del usuario
    array2.forEach((element, index) => {
      if (array1.includes(element)) {
        // Contamos cuántas veces aparece esta letra en la entrada del usuario
        letterCountInput[element] = (letterCountInput[element] || 0) + 1;
  
        // Solo la coloreamos si no supera la cantidad en la palabra original
        if (letterCountInput[element] <= letterCountOriginal[element]) {
          existsIndexArray.push(index);
        }
      }
    });
  
    return existsIndexArray;
  }
  

function createRow() {
  rowId++;
  if (rowId <= 5) {
    let newRow = document.createElement("div");
    newRow.classList.add("row");
    newRow.setAttribute("id", rowId);
    mainContainer.appendChild(newRow);
    return newRow;
  } else {
    // Al usar `word`, ahora es accesible a nivel global
    showResult(`Inténtalo de nuevo. La respuesta correcta era ${word.toUpperCase()}`);
  }
}

function drawSquares(actualRow, wordArray) {
  wordArray.forEach((item, index) => {
    if (index === 0) {
      actualRow.innerHTML += `<input type="text" maxlength="1" class="square focus">`;
    } else {
      actualRow.innerHTML += `<input type="text" maxlength="1" class="square">`;
    }
  });
}

function addFocus(actualRow) {
  let focusElement = actualRow.querySelector(".focus");
  focusElement.focus();
}

function showResult(textMsg) {
  // Crear el overlay y el modal
  const overlay = document.createElement('div');
  overlay.classList.add('modal-overlay');

  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `<p>${textMsg}</p>
                     <button class="button">Reiniciar</button>`;

  // Añadir el modal y overlay al body
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Bloquear el scroll del body mientras el modal esté activo
  document.body.classList.add('modal-open');

  // Evento para reiniciar el juego
  let resetBtn = modal.querySelector(".button");
  resetBtn.addEventListener("click", () => {
      location.reload();
  });
}
