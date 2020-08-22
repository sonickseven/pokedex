const mainjs={
	data:{
		user: 'sonickseven',
		mail: 'sonickfaber7@yahoo.es',
		pass: 'S$7pokemon'
	},
	logic:{
		getUrlVars:()=>{
		    let vars = {}
		    let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m,key,value)=>{
		        vars[key] = value
		    })
		    return vars
		},
		callPokemonApi: dominio=>path=>
			new Promise(resol=>{
				boot.logic.ajax(`${dominio}${path}`,{method:'GET'}).then(resol).catch(console.log)
			})
		,
		startDesign: ()=>{
			se('.ss-name-user').textContent=mainjs.data.user.user
		},
		logout: function(evt){
			localStorage.removeItem('user')
			localStorage.removeItem('login')
			window.location.replace(`./login.html`)
		}
	},
	events:()=>{
		if(!mainjs.data.oneTime){
			mainjs.data.oneTime=true
			$('body').on('click', '.ss-logout', mainjs.logic.logout)
		}
	},
	init: ()=>{
		try{
			mainjs.data.user=JSON.parse(localStorage.user)
			mainjs.logic.startDesign()
			mainjs.events()
		}catch(err){
			// console.log(err, 'FT un error acá')			
		}
	}
}
document.addEventListener('DOMContentLoaded',()=>{
	mainjs.init()
},false)