const pokemonjs={
	templates:{
		cardPokemon: data=>`<div class="ss-carRow-pokemon">
				<i class="ss-close-icon ss-coni-cancel-1" onclick="window.history.go(-1); return false;"></i>
				<h5>${data.name}</h5>
				<div class="ss-img-pokemon" style="background-image: url(${data.img})"></div>
				<div class="ss-row-padding text-left">
					<span class="ss-metadata-poke">Altura: ${data.height}</span>
				</div>
				<div class="ss-row-padding text-left">
					<span class="ss-metadata-poke">Peso: ${data.peso}Kg</span>
				</div>
				<div class="ss-row-padding text-left">
					<span class="ss-metadata-poke">Movimientos</span>
					<div class="ss-lista-skills">
						${data.abilities.map(val=>
							`<span>${val}</span>`
						).join('')}
					</div>
				</div>
				<div class="ss-row-padding text-left">
					Tipo de pokémon
				</div>
				<div class="ss-content-types-pokemon">
					${data.types.map(val=>
						`<div>
							<a class="ss-button-gray">${val.name}</a>
						</div>`
					).join('')}
				</div>
				<div class="ss-row-padding">
					<a onclick="window.history.go(-1); return false;" class="ss-button-link">Regresar</a>
				</div>
			</div>`.replace(/(\n|\s\s|\t)+/g, '')
	},
	logic:{
		getUrlParams: ()=>{
			let urlParams=0
			let params=mainjs.logic.getUrlVars()
			if(params.cod){
				let datos=JSON.parse(localStorage.pokemons)
				let pokemon=datos.filter(val=>parseInt(val.id)===parseInt(params.cod))
				if(pokemon.length)
					se('.ss-content-cards').innerHTML=pokemonjs.templates.cardPokemon(pokemon[0])
				else
					boot.logic.popUpAlert({msg: 'Lo sentimos, algo funcionó mal, intentalo más tarde'})
			}else
				window.location.replace(`./`)
		}
	},
	init:()=>{
		pokemonjs.logic.getUrlParams()
	}
}
document.addEventListener('DOMContentLoaded',()=>{
	pokemonjs.init()
},false)