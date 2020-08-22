const loginupjs={
	data:{},
	init:()=>{
		loginupjs.events()
	},
	logic: {
		startLogin: function(evt){
			evt.preventDefault()
			let datas={
				user: se('.ss-user').value,
				pass: se('.ss-password').value
			}
			function normalLogin(){
				if(datas.user.match(new RegExp(mainjs.data.mail, 'gi'))){
					if(datas.pass===mainjs.data.pass){
						localStorage.login=true
						localStorage.user=JSON.stringify(mainjs.data)
						window.location.replace(`./`)
						console.log('FT si sta bien logeado esto')
					}else
						boot.logic.popUpAlert({err: true, msg: 'La contraseña es incorrecta', time: 4000})
				}else
					boot.logic.popUpAlert({err: true, msg: 'El usuario no existe', time: 4000})
			}
			if(localStorage.users){
				try{
					let users=JSON.parse(localStorage.users)
					console.log(users, 'FT estos son los usuarios')
					let userf=users.filter(val=>val.mail.match(new RegExp(datas.user, 'gi')))
					if(userf.length){
						if(datas.pass===userf[0].pass){
							console.log('FT bien hecho muchahcos jajaja')
							localStorage.login=true
							localStorage.user=JSON.stringify(userf[0])
							window.location.replace(`./`)
						}else{
							boot.logic.popUpAlert({err: true, msg: 'La contraseña es incorrecta', time: 4000})
						}
					}else{
						boot.logic.popUpAlert({err: true, msg: 'El usuario no existe', time: 4000})
					}
				}catch(err){
					localStorage.users=JSON.stringify([mainjs.data])
					normalLogin()
				}
			}else{
				localStorage.users=JSON.stringify([mainjs.data])
				normalLogin()
			}
		},
		createMaster: evt=>{
			evt.preventDefault()
			let name=se('.ss-name-user').value,
				mail=se('.ss-mail-user').value,
				pass=se('.ss-password').value,
				pass2=se('.ss-password2').value

			if(pass===pass2){
				localStorage.login=true
				let datasss={
					user: name,
					pass: pass,
					mail: mail
				}
				localStorage.user=JSON.stringify(datasss)

				try{
					let users=JSON.parse(localStorage.users)
					users.push(datasss)
					localStorage.users=JSON.stringify(users)
				}catch(err){
					console.log('FT no funciono bien esto')
				}

				window.location.replace(`./`)
			}else
				boot.logic.popUpAlert({err: true, msg: 'Las contraseñas tienen que ser las mismas',time: 3000})

			console.log('FT que comiencen las validaciones')
		}
	},
	events: ()=>{
		if(!loginupjs.data.oneEventCall){
			loginupjs.data.oneEventCall=true
			$('body').on('submit','.ss-start-session', loginupjs.logic.startLogin)
			$('body').on('submit','.ss-create-master', loginupjs.logic.createMaster)

		}
	}
}
document.addEventListener('DOMContentLoaded',loginupjs.init,false)