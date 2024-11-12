const searchBtn = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const screenGreen =  document.getElementsByClassName("screen");

// 3 lights on left upper conner.
const red = document.getElementsByClassName("red")[0];
const yellow = document.getElementsByClassName("yellow")[0];
const green = document.getElementsByClassName("green")[0];

const pokemon =  {
    name: document.getElementById("pokemon-name"),
    id: document.getElementById("pokemon-id"),
    weight: document.getElementById("weight"),
    height: document.getElementById("height"),
    types: document.getElementById("types"),
    sprite: document.getElementById("sprite"),
    stats: [
      document.getElementById("hp"),
      document.getElementById("attack"),
      document.getElementById("defense"),
      document.getElementById("special-attack"),
      document.getElementById("special-defense"),
      document.getElementById("speed"),
    ]
}

//greenScreen in the middle of the screen
const lightEffect = (elemHTML, color) => {
  elemHTML.style.backgroundColor = color;
}

// 3 colored lights on left corner
const cornerLightsOn = (color) => {
  green.style.setProperty("--visibility", "hidden");
  yellow.style.setProperty("--visibility", "hidden");
  red.style.setProperty("--visibility", "hidden");
  if(color) {
    color.style.setProperty("--visibility", "visible");
  }
}

//2- fetch the pokemon data
const fetchData = async (string) => {
  cornerLightsOn(yellow)
  try {
    const apiAdress = `https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${string.toLowerCase()}`;
    const res = await fetch(apiAdress);
    const data = await res.json();
    console.log(data);
    return data
  } catch(err) {
    alert("Pokémon not found");
    cornerLightsOn(red);
  }
} 

//3- we use desestructure data in parameter
const updateHtmlStats = async ({name, id, weight, height, sprites, types, stats}) => {
  pokemon.name.innerText = name.toUpperCase();
  lightEffect(screenGreen[0], '#96F983');
  pokemon.id.innerText = id;
  pokemon.weight.innerText = weight;
  pokemon.height.innerText = height;
  pokemon.sprite.src = sprites.front_default;
  pokemon.sprite.style.visibility = "visible";

  pokemon.types.innerHTML = '';
  for(let type of types) {
    pokemon.types.innerHTML += `<span poktype=${type.type.name.toUpperCase()}>${type.type.name.toUpperCase()}</span>`
  }

  for(let i= 0; i < stats.length; i += 1) {
    pokemon.stats[i].innerText = stats[i].base_stat
  }
  cornerLightsOn(green)
}

//1- begin with
const pokemonSearch = async () => {
  if(searchInput.value != '') {
    const pokemonOrId = searchInput.value[0] === '#' ?  searchInput.value.slice(1).trim() : searchInput.value.trim();
    console.log(pokemonOrId)
    const data = await fetchData(pokemonOrId);
    if(data) {
      await updateHtmlStats(data);
      if ('speechSynthesis' in window) {
        await speechPokemon(data.name, data.types)
      }
    }
  } else {
    cornerLightsOn(red)
    alert("Pokémon not found");
  }
}

searchBtn.addEventListener("click", () => {
  pokemonSearch();
});

document.addEventListener("change", (event) => {
  //music audio
  const bgm = document.getElementById("bgm");
  bgm.volume = 0.3;
  bgm.play();

  //pokemon search
  if (event.key === "Enter") {
    pokemonSearch();
  };
});

// turn lights top left corner lights off 
cornerLightsOn('');

// look if the speechSynthesis is supported by the browser
if ('speechSynthesis' in window) {
  // Speech Synthesis supported 🎉
  speechSynthesis.getVoices();
  console.log("audio speechSynthesis suported");
 }else{
   // Speech Synthesis Not Supported 😣
   alert("Sorry, your browser doesn't support text to speech!");
 }

 // speech the pokemon searched
const speechPokemon = async (name, types) => {
  var msg = new SpeechSynthesisUtterance();
  msg.lang = 'en';
  msg.volume = 1; // From 0 to 1
  msg.rate = 0.9; // From 0.1 to 10
  msg.pitch = 1; // From 0 to 2
  var voices = speechSynthesis.getVoices();
  msg.voice = voices[3];
 
  let speech = `${name},`
  for(let type of types) {
    speech +=  ` ${type.type.name}`
  }
  speech += " pokemon.";

  msg.text = speech; // what will speech
  speechSynthesis.speak(msg);
 }
 


 
