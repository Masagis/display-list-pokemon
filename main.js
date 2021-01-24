const tabs = document.querySelectorAll('[data-tab-target]');
const tabContents = document.querySelectorAll('[data-tab-content]');

tabs.forEach(tab => {
	tab.addEventListener('click', () => {
		const target = document.querySelector(tab.dataset.tabTarget);
		tabContents.forEach(tabContent => {
			tabContent.classList.remove('active');
		});
		tabs.forEach(tab => {
			tab.classList.remove('active');
		});
		tab.classList.add('active');
		target.classList.add('active');
	});
});

let pokedexContainer = document.getElementById('pokedex-content');

let totalPokemon = document.querySelector(".totalPokemon");
let pokeRemove = document.getElementById("pokeRemove");

function removeLoadingIndicator(i, regionTotal, regionToRemove) {
	if (i === regionTotal) {
		let showLoading = document.getElementById("show-loading");
		showLoading.removeChild(regionToRemove);
	}
}

//The total Pokémon on this API is 1118
let pokedexTotal = 1118;
let fetchPokemons = async (i) => {
	for (let i = 1; i <= pokedexTotal; i++) {
		await getPokemon(i);
		totalPokemon.innerHTML = i;
		removeLoadingIndicator(i, pokedexTotal, pokeRemove);
	}
};
const getPokemon = async id => {
	const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
	const res = await fetch(url);
	const pokemon = await res.json();
	createPokemonCard(pokemon);
};

function createPokemonCard(pokemon) {
	const pokemonEl = document.createElement('div');
	pokemonEl.classList.add('pokemon');

	const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);

	const color = '#f1f2f3';
	pokemonEl.style.backgroundColor = color;

	const PokeInnerHTML = `
	<div id="poke_container" onclick="selectPokemon(${pokemon.id})">
		<span class="number">${pokemon.id.toString().padStart(2, '0')}</span>
        <div class="img-container">
            <img src="https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png" alt="${name}" />
			<h3 class="name">${name}</h3>
        </div>
	</div>
    `;

	pokemonEl.innerHTML = PokeInnerHTML;

	pokedexContainer.appendChild(pokemonEl);

}

const selectPokemon = async (id) => {
	const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
	const res = await fetch(url);
	const pokemon = await res.json();
	displayPopup(pokemon);
};
const displayPopup = (pokemon) => {
	const baseHp = pokemon.stats[0].base_stat;
	const baseAttack = pokemon.stats[1].base_stat;
	const baseDefense = pokemon.stats[2].base_stat;
	const baseSpecialAttack = pokemon.stats[3].base_stat;
	const baseSpecialDefense = pokemon.stats[4].base_stat;
	const baseSpeed = pokemon.stats[5].base_stat;

	const baseExp = pokemon.base_experience;
	const baseWeight = pokemon.weight;
	const baseHeight = pokemon.height;


	const poke_types = pokemon.types.map(function (type) {
		return type.type.name;
	}).join(", ");
	const pokeAbility = pokemon.abilities.map(function (ability) {
		return ability.ability.name;
	}).join(", ");
	const pokeMoves = pokemon.moves.map(function (move) {
		return move.move.name;
	}).join(", ");



	const htmlString = `
		<div class="popup">
		
			<button id="closeBtn" onclick="closePopup()">Close</button>
			<div class="popup-info">
				<h2 class="name">${pokemon.name}</h2>
				<div id="artwork-container" onclick="selectPokemon(${pokemon.id})">
            		<img class="artwork-popup" src="https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png" alt="${name}" />
        		</div>
				<div class="pokemon-data-section-popup">
					<p class="pokemon-type">Base Exp : <span>${baseExp}</span></p>
					<p class="pokemon-type">Weight : <span>${baseWeight}</span></p>
					<p class="pokemon-type">Height : <span>${baseHeight}</span></p>
				</div>
				<hr>
				<div class="pokemon-base-stat-section-popup">
					<h3 class="name">Stats</h3>
					<p>HP: <span>${baseHp}</span></p>
					<p>Attack: <span>${baseAttack}</span></p>
					<p>Defense: <span>${baseDefense}</span></p>
					<p>Special Attack: <span>${baseSpecialAttack}</span></p>
					<p>Special Defense: <span>${baseSpecialDefense}</span></p>
					<p>Speed: <span>${baseSpeed}</span></p>
				</div>
				<hr>
				<div class="pokemon-base-stat-section-popup">
					<h3 class="name">Types</h3>
					<p class="pokemon-type"><span>${poke_types}</span></p>
				</div>
					<hr>
					<div class="pokemon-base-stat-section-popup">
						<h3 class="name">Abilities</h3>
						<p class="pokemon-type"><span>${pokeAbility}</span></p>
					</div>
					<hr>
					<div class="pokemon-base-stat-section-popup">
						<h3 class="name">Moves</h3>
						<p class="pokemon-type"><span>${pokeMoves}</span></p>
					</div>
				</div>
        	</div>
		</div>
	`;
	//Popup that displays extra information on the Pokémon you click
	const popupDisplayAll = document.getElementById("popup-display-all");
	popupDisplayAll.innerHTML = htmlString;
}

const closePopup = () => {
	let popup = document.querySelector('.popup');
	popup.parentNode.removeChild(popup);
}
fetchPokemons();