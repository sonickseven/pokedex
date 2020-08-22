const homejs={
	data:{
		start:0,
		limit: 50
	},
	templates:{
		cardRowPokemon: data=>`<li class="ss-item-card">
			<div class="ss-carRow-pokemon">
				<h5>${data.name}</h5>
				<div class="ss-img-pokemon" style="background-image: url(${data.img||'./public/imgs/6d8rt4h6rdt4h68drthd.png'})"></div>
				<div class="ss-content-types-pokemon">${
					data.types.map(val=>`<div><a href="" class="ss-button-gray">${val.name}</a></div>`).join('')
				}
				</div>
				<div class="ss-row-padding">
					<a href="./pokemon.html?cod=${data.id}" class="ss-button-link">Ver más...</a>
				</div>
			</div>
		</li>`
	},
	logic:{
		getIndividualInfoPokemon: data=>
			new Promise(resol=>{
				let numy=0,
					pokearray=[]
				function runTime(){
					if(numy<data.pokemon.length){
						homejs.data.baseUrl(`/pokemon/${data.pokemon[numy].name}`)
						.then(resp=>{
							pokearray.push({
								id: resp.id,
								numy: numy,
								name: resp.name,
								peso: resp.weight,
								types: resp.types.map(val=>val.type),
								img: resp.sprites.front_default,
								height: resp.height,
								abilities: resp.abilities.map(val=>val.ability.name)
							})
							numy++
							runTime()
						}).catch(console.log)
					}else{
						resol(pokearray)
					}
				}
				runTime()
			})
		,
		createVerticalMansory: ()=>{
			function resizeGridItem(item){
				let grid=se('.ss-content-cardRow>ul'),
					rowHeight=parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows')),
					rowGap=parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap')),
					rowSpan=Math.ceil((item.querySelector('.ss-carRow-pokemon').getBoundingClientRect().height+rowGap)/(rowHeight+rowGap))
				item.style.gridRowEnd='span '+rowSpan
			}
			si('.ss-item-card', elem=>{
				resizeGridItem(elem)
			})
		},
		runPokemonCreateCards: data=>{
			if(data.length){
				if(se('.ss-content-cardRow > ul')){
					if(data.length){
						se('.ss-content-cardRow > ul').innerHTML=data.map(val=>
							homejs.templates.cardRowPokemon(val)
						).join('')
						homejs.logic.createVerticalMansory()
						homejs.data.searchPoker=false
					}
				}
			}
		},
		loadLocalPokemon: data=>{
			if(localStorage.pokemons){
				try{
					let pokemons=JSON.parse(localStorage.pokemons)
					let minPoket=pokemons.slice(homejs.data.start, parseInt(homejs.data.start)+parseInt(homejs.data.limit))
					if(minPoket.length){
						homejs.logic.runPokemonCreateCards(minPoket)
						homejs.data.start+=parseInt(homejs.data.limit)
						se('.ss-footer-pokedex').style.display='block'
					}else
						homejs.logic.loadPokemons()
				}catch(err){
					homejs.logic.loadPokemons()
				}

			}else
				homejs.logic.loadPokemons()
		},
		loadPokemons: ()=>{
			boot.logic.loading({msg: `Estamos cargando los pokémones`})
			homejs.data.baseUrl(`/pokemon/?offset=${homejs.data.start}&limit=${homejs.data.limit}`)
			.then(resp=>{
				if(resp.results){
					if(resp.results.length)
						homejs.logic.getIndividualInfoPokemon({pokemon: resp.results})
						.then(pokedata=>{
							boot.logic.removePops()
							if(pokedata.length){
								if(!localStorage.pokemons)
									localStorage.pokemons=JSON.stringify(pokedata)
								else{
									try{
										let dataPoker=JSON.parse(localStorage.pokemons)
										pokedata.forEach(val=>{
											if(!dataPoker.some(val2=>parseInt(val2.id)===parseInt(val.id)))
												dataPoker.push(val)
										})
										localStorage.pokemons=JSON.stringify(dataPoker)
									}catch(err){
										console.log(err, 'FT acá no esta bien esto, IMPORTANTE')
									}
								}
								homejs.logic.runPokemonCreateCards(pokedata)
								se('.ss-footer-pokedex').style.display='block'
								if(pokedata.length!==homejs.data.limit){
									se('.ss-footer-pokedex').style.display='block'
									se('.ss-footer-pokedex [data-new]').style.display='none'
								}
							}else{
								boot.logic.popUpAlert({err: true, msg: `Ya no existen más pokémones, te has pasado del listado`, time: 4000})
								se('.ss-footer-pokedex [data-new]').style.display='none'
								se('.ss-footer-pokedex [data-old]').style.display='none'
							}
						}).catch(console.log)
					else
						boot.logic.popUpAlert({err: true, msg: `Te has pasado del limite del listado de los Pokemones`, time: 4000})
				}else
					boot.logic.popUpAlert({err: true, msg: `Lo sentimos algo salió mal, intentalo más tarde`, time: 4000})
					
			}).catch(console.log)
		},
		searchPokemon: function(evt){
			evt.preventDefault()
			function searchInApi(){
				boot.logic.loading({msg: 'Estamos buscando los pokémones'})
				homejs.data.baseUrl(`/pokemon/${namePoke}`)
				.then(resp=>{
					if(!resp.err){
						boot.logic.removePops()
						let formatData={
								id: resp.id,
								name: resp.name,
								peso: resp.weight,
								types: resp.types.map(val=>val.type),
								img: resp.sprites.front_default,
								height: resp.height,
								abilities: resp.abilities.map(val=>val.ability.name)
							}
						let pokemons=JSON.parse(localStorage.pokemons)
						if(!pokemons.some(val=>parseInt(val.id)===parseInt(formatData.id))){
							pokemons.push(formatData)
							localStorage.pokemons=JSON.stringify(pokemons)
							homejs.data.searchPoker=true
							homejs.logic.runPokemonCreateCards([formatData])
						}
					}else
						boot.logic.popUpAlert({err: true, msg: `El nombre del pokémon no existe, revisa que este bien escrito`, time: 4000})
						
				}).catch(console.log)
			}
			let namePoke=se('.ss-search-pokemon .ss-inputSearch').value
			clearTimeout(homejs.data.typeNameVideo)
			homejs.data.typeNameVideo=setTimeout(()=>{
				if(namePoke){
					if(localStorage.pokemons){
						try{
							let pokemons=JSON.parse(localStorage.pokemons)
							let pokemon=pokemons.filter(val=>
									val.name.match(new RegExp(namePoke, 'gi'))
								)
							if(pokemon.length){
								homejs.data.searchPoker=true
								homejs.logic.runPokemonCreateCards(pokemon)
							}else
								searchInApi()
						}catch(err){
							searchInApi()
						}
					}else
						searchInApi()
				}else{
					homejs.data.start-=homejs.data.limit
					homejs.logic.loadLocalPokemon()
				}
			},500)
		},
		putArrows:()=>{
			let params=mainjs.logic.getUrlVars()
			let oldArrow=se('.ss-footer-pokedex [data-old]'),
				newArrow=se('.ss-footer-pokedex [data-new]')
			if(params.limit&&params.start){
				params.start=parseInt(params.start)
				params.limit=parseInt(params.limit)
				homejs.data.start=params.start
				homejs.data.limit=params.limit

				oldArrow.dataset.old=params.start-homejs.data.limit
				oldArrow.href=`./?start=${params.start-homejs.data.limit}&limit=${homejs.data.limit}`

				if(homejs.data.start<1)
					oldArrow.style.display='none'

				newArrow.dataset.new=params.start+homejs.data.limit
				newArrow.href=`./?start=${params.start+homejs.data.limit}&limit=${homejs.data.limit}`


			}else{
				oldArrow.style.display='none'

				newArrow.dataset.new=homejs.data.limit
				newArrow.href=`./?start=${homejs.data.limit}&limit=${homejs.data.limit}`
			}
		}
	},
	events: ()=>{
		if(!homejs.data.oneTime){
			homejs.data.oneTime=true
			$('body').on('submit', '.ss-search-pokemon', homejs.logic.searchPokemon)
			$('body').on('keyup', '.ss-inputSearch', homejs.logic.searchPokemon)
		}
	},
	init: ()=>{
		homejs.data.baseUrl=mainjs.logic.callPokemonApi('https://pokeapi.co/api/v2')
		

		homejs.logic.putArrows()

		if(localStorage.login){
			mainjs.data.user=JSON.parse(localStorage.user)
			homejs.logic.loadLocalPokemon()
		}else{
			window.location.replace(`./login.html`)
		}
		homejs.events()
	}
}
document.addEventListener('DOMContentLoaded',()=>{
	setTimeout(()=>{homejs.init()}, 1000)
},false)