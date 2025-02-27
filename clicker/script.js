let clicks = 0;
let currentClickCount = 0; // Contador para este ciclo de captura
let clickLimit = Math.floor(Math.random() * (50 - 20 + 1)) + 20;
let pokemons = [];

document.getElementById('pokeball').addEventListener('click', () => {
    clicks++;
    currentClickCount++;
    document.getElementById('clicks').textContent = clicks;

    // Agregar clase de animación
    const pokeball = document.getElementById('pokeball');
    pokeball.classList.add('pokeball-click');

    // Remover clase de animación después de la duración de la animación
    setTimeout(() => {
        pokeball.classList.remove('pokeball-click');
    }, 300);  // La animación dura 0.3 segundos

    // Verificar si se ha alcanzado el límite de clicks para capturar
    if (currentClickCount >= clickLimit) {
        capturePokemon();
        currentClickCount = 0; // Reiniciar el contador de este ciclo
        clickLimit = Math.floor(Math.random() * (50 - 20 + 1)) + 20;  // Generar un nuevo límite
    }
});
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
// Función para capturar un Pokémon
async function capturePokemon() {
    try {
        const randomId = Math.floor(Math.random() * 898) + 1; // Generar un ID de Pokémon aleatorio
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        const pokemon = await response.json();

        const pokemonName = pokemon.name;
        const pokemonImage = pokemon.sprites.front_default;

        pokemons.push({ name: pokemonName, id: randomId }); // Guardar el nombre y el ID del Pokémon
        updatePokemonList();
        showPokemonModal(pokemonName, pokemonImage);
    } catch (error) {
        console.error("Error capturando Pokémon:", error);
        document.getElementById('message').textContent = "Se peló!";
    }
}

// Actualizar la lista de Pokémon capturados
function updatePokemonList() {
    const pokemonList = document.getElementById('pokemon-list');
    pokemonList.innerHTML = '';
    pokemons.forEach(pokemon => {
        const li = document.createElement('li');
        li.textContent = pokemon.name;
        li.classList.add('clickable');
        li.addEventListener('click', () => {
            fetchPokemonDetails(pokemon.id);  // Evento para obtener más detalles del Pokémon
        });
        pokemonList.appendChild(li);
    });
}

// Mostrar modal de captura de Pokémon
function showPokemonModal(name, image) {
    const modal = document.getElementById('pokemon-modal');
    const pokemonName = document.getElementById('pokemon-name');
    const pokemonImage = document.getElementById('pokemon-image');
    
    pokemonName.textContent = `Capturaste un ${name}!`;
    pokemonImage.src = image;

    modal.style.display = "block";
}

// Mostrar el modal con la información del Pokémon capturado
async function fetchPokemonDetails(pokemonId) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const pokemon = await response.json();

        const pokemonTypes = pokemon.types.map(typeInfo => typeInfo.type.name).join(', ');
        const pokemonImage = pokemon.sprites.front_default;

        // Actualizar el modal con la información del Pokémon
        const modal = document.getElementById('pokemon-info-modal');
        const infoPokemonName = document.getElementById('info-pokemon-name');
        const infoPokemonImage = document.getElementById('info-pokemon-image');
        const infoPokemonType = document.getElementById('info-pokemon-type');

        infoPokemonName.textContent = `Name: ${pokemon.name}`;
        infoPokemonImage.src = pokemonImage;
        infoPokemonType.textContent = `Type: ${pokemonTypes}`;

        modal.style.display = "block";
    } catch (error) {
        console.error("Error al obtener detalles del Pokémon:", error);
    }
}

// Cerrar el modal de captura de Pokémon
document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('pokemon-modal').style.display = "none";
});

// Cerrar el modal de información del Pokémon
document.getElementById('close-info-modal').addEventListener('click', () => {
    document.getElementById('pokemon-info-modal').style.display = "none";
});

// Cerrar el modal al hacer click en la "x"
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('pokemon-modal').style.display = "none";
});

document.querySelector('.close-info-modal').addEventListener('click', () => {
    document.getElementById('pokemon-info-modal').style.display = "none";
});

// Cerrar el modal si haces clic fuera del modal
window.addEventListener('click', (event) => {
    const modal = document.getElementById('pokemon-modal');
    const infoModal = document.getElementById('pokemon-info-modal');
    
    if (event.target === modal) {
        modal.style.display = "none";
    }

    if (event.target === infoModal) {
        infoModal.style.display = "none";
    }
});

// Desplegar y contraer el menú de Pokémon capturados
document.getElementById('toggle-menu').addEventListener('click', () => {
    const capturedPokemons = document.getElementById('captured-pokemons');
    capturedPokemons.classList.toggle('hidden'); // Toggle para mostrar u ocultar el menú
});