'use strict'
window.URL=window.URL||window.webkitURL
const boot={
	data:{},
	templates:{
		hourglassSpin: data=>`<div class="lds-hourglass ${data.size||'min'}"></div>`,
		rippleSpin:data=>`<div class="lds-ripple ${data.size||'min'}">
				<div></div>
				<div></div>
				<div></div>
			</div>`,
		threePointSpin:data=>`<div class="loader loader-3 cionLoad">`+
				`<div class="dot dot1"></div>`+
				`<div class="dot dot2"></div>`+
				`<div class="dot dot3"></div>`+
			`</div>`,
		heartsSpin:data=>`<div class="loader loader-13">
				<div class="css-heart heart1"></div>
				<div class="css-heart heart2"></div>
				<div class="css-heart heart3"></div>
				<div class="css-heart heart4"></div>
			</div>`,
		popUpAlert:data=>`<div class="emergente ${(data.progress?' ss-progress': (data.loading?' ss-loading':' ss-popUpAler'))} animated flipInX${(data.progress?' progress':'')}">
			${(data.loading?
				'<span><i class="animate-spin demo-iconed-load icon-spin4"></i></span>'
				:
				''
			)}
			<p class="msg ${data.loading||(data.err?'icon-alert':(data.ask?'icon-alert':'icon-ok-circle'))}">${(!data.msg&&data.loading?' Cargando...':(data.msg||''))}</p>
			${(data.ask?'<div class="buttons">'+
				'<button class="ss-button-success" data-opt="1">Aceptar</button>'+
				'<button class="ss-button-cancel" data-opt="0">Cancelar</button>'+
			'</div>':'')}
			${(data.progress?
					'<div class="kuygser">Cargando...'+
						'<div></div>'+
					'</div>'
				:''
			)}
		</div>`,
		clipErr:data=>`<div class="ss-err-atention-${data.type} animated flipInX">${data.msg}</div>`
	},
	logic:{
		jsonp: url=>
			new Promise(resol=>{
				let callbackMethod = 'callback_' + new Date().getTime()
				let script = document.createElement('script')
				script.src = `${url}&jsonp=${callbackMethod}`
				document.body.appendChild(script)
				window[callbackMethod] = function(data){
					delete window[callbackMethod]
					document.body.removeChild(script)
					resol(data)
				}
			})
		,
		encodeURL: text=>
			text.replace(/(\!|\#|\$|\&|\'|\(|\)|\*|\+|\,|\/|\:|\;|\=|\?|\@|\[|\])/gi, texty=>{
				switch(texty){
					case'!':
						return '%21'
					break
					case'#':
						return '%23'
					break
					case'$':
						return '%24'
					break
					case'&':
						return '%26'
					break
					case"'":
						return '%27'
					break
					case'(':
						return '%28'
					break
					case')':
						return '%29'
					break
					case'*':
						return '%2A'
					break
					case'+':
						return '%2B'
					break
					case',':
						return '%2C'
					break
					case'/':
						return '%2F'
					break
					case':':
						return '%3A'
					break
					case';':
						return '%3B'
					break
					case'=':
						return '%3D'
					break
					case'?':
						return '%3F'
					break
					case'@':
						return '%40'
					break
					case'[':
						return '%5B'
					break
					case']':
						return '%5D'
					break
					default:
						return texty
					break
				}
			})
		,
		stringGen:len=>{
			let text='';
			let charset='abcdefghijklmnopqrstuvwxyz';
			for(var i=0;i<len;i++)
				text+=charset.charAt(Math.floor(Math.random()*charset.length));
			return text;
		},
		loadImg: src=>
			new Promise(resol=>{
				let image = new Image()
				image.src = src
				image.onload = function() {
					resol(this)
				};
				image.onerror=function(){
					resol(false)
				}
			})
		,
		shortCodes: data=>{
			return data.replace(/\[\[(.*?)\]\]/g, str=>{
				var textNeed=str.substring(1, str.length-1);
				var uhh=textNeed.match(/(\[)(.*?)(\])/g)
				switch(uhh[0]){
					case '[hrefTarget]':
						var options=uhh[1].replace(/(\[|\])/g, '').split('||')
						return '<a href="'+options[0]+'" class="btn btn-primary btn-details-primary" target="_blank">'+options[1]+'</a>'
					break
					case '[strong]':
						return '<strong>'+uhh[1].replace(/(\[|\])/g, '')+'</strong>'
					break
					case '[warning]':
						return '<strong style="color:#a52a36 !important;">'+uhh[1].replace(/(\[|\])/g, '')+'</strong>'
					break;
					default:
						return str
					break
				}
			})
		},
		generateTime:()=>{
			let now=new Date(),
				time=now.getTime(),
				expireTime=time+1000*36000000
			now.setTime(expireTime)
			return now.toGMTString()
		},
		checkDevice: data=>{
			if(navigator.userAgent.match(/(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i))
				return true
			else
				return false
		},
		fullScreen:data=>{
			if(data.responsive){
				if(boot.logic.responsive({width: true})){
					$('body').append('<div class="fullScreenClick"></div>')
					se('.fullScreenClick').addEventListener('click',function(){
						let docElm = document.documentElement;
						if(docElm.requestFullscreen) {
							docElm.requestFullscreen();
						}else if(docElm.mozRequestFullScreen) {
							docElm.mozRequestFullScreen();
						}else if(docElm.webkitRequestFullScreen) {
							docElm.webkitRequestFullScreen();
						}else if(docElm.msRequestFullscreen) {
							docElm.msRequestFullscreen();
						}
						this.remove()
					},false)
				}
			}
		},
		responsive: data=>{
			if(data.width)
				return window.innerWidth<(data.width2||620)
			else if(data.height)
				return window.innerHeight<(data.height||700)
			else
				console.log('no se han pasado parametros adecuados')
		},
		showErrClip:data=>{
			let elemRemove=se(`${data.elem}>[class^="ss-err-atention"], ${data.elem}>[class*="ss-err-atention"]`)
			if(elemRemove)
				elemRemove.remove()
			if(!$(data.elem).css('position').match(/(relative|absolue|fixed)/g))
				$(data.elem).css({position: 'relative'})
			$(data.elem).append(boot.templates.clipErr(data))
			let elemRemove2=se(`${data.elem}>[class^="ss-err-atention"], ${data.elem}>[class*="ss-err-atention"]`)
			setTimeout(()=>{
				elemRemove2.classList.add('flipOutX')
				setTimeout(()=>{
					elemRemove2.remove()
				},500)
			},(data.time||3000))
		},
		clickChecks:function(){
			let check=this
			if(!check.visign){
				check.classList.remove('ss-checkedOff')
				setTimeout(()=>{
					check.classList.add('ss-checkedOn')
				},50)
			}else{
				check.classList.remove('ss-checkedOn')
				setTimeout(()=>{
					check.classList.add('ss-checkedOff')
				},50)
			}
			check.visign=!check.visign
		},
		stringGen:len=>{
			let text='';
			let charset='abcdefghijklmnopqrstuvwxyz';
			for(var i=0;i<len;i++)
				text+=charset.charAt(Math.floor(Math.random()*charset.length));
			return text;
		},
		removePops:data=>{
			if(se('.emergente')){
				se('.emergente').classList.add('flipOutX')
				setTimeout(()=>{
					se('.emergente').remove()
				},800)
			}
		},
		loading:data=>{
			return new Promise(res=>{
				if(se('.emergente'))
					$('.emergente').remove()
				$('body').append(boot.templates.popUpAlert({loading: true, msg: data.msg}))
			})
		},
		progress:ev=>
			new Promise(res=>{
				var prog=parseInt(Math.round((ev.loaded / ev.total)*100));
				if(se('.emergente')&&prog<3)
					$('.emergente').remove()
				if(!se('body .ss-progress'))
					$('body').append(boot.templates.popUpAlert({progress: true}))
				$('.ss-progress .kuygser>div').css({width: prog+'%'})
				if(prog>99)
					setTimeout(()=>{
						$('.ss-progress').addClass('flipOutX')
					},(1000))
			})
		,
		popUpAlert:(data)=>{
			return new Promise(res=>{
				if(se('.emergente'))
					$('.emergente').remove()
				$('body').append(boot.templates.popUpAlert(data))
				if(data.ask){
					$('.ss-popUpAler .buttons>button').on('click', function(){
						res(parseInt(this.dataset.opt))
						$('.ss-popUpAler').addClass('flipOutX')
					})
				}else
					setTimeout(()=>{
						$('.ss-popUpAler').addClass('flipOutX')
						res(true)
					},(data.time||2500))
			})
		},
		fetch: (url, data, progress)=>
			new Promise(resol=>{
				let formData = new FormData()

				for(let i in data){
					formData.append(i, data[i])
				}
				fetch(url, {
					method: 'PUT',
					body: formData
				})
				.then(response=>{
					console.log(response.json(), response, 'FT jumm ni idea quejeso')
				})
				.catch(console.log)
				.then(response=>{
					console.log(response, 'FT pues de entrada el tamaño')
				})
			})
		,
		ajax:(url, data, progress)=>
			new Promise(res=>{
				let fomrD= new FormData()
				for(let i in data){
					fomrD.append(i, data[i])
				}
				let xhr = new XMLHttpRequest()

				if(progress)
					xhr.upload.addEventListener('progress', progress, false)

				xhr.open(data.method||'POST', url, true)
				xhr.onload=function(){
					try{
						res(JSON.parse(this.responseText))
					}catch(err){
						res({
							err: true,
							msg: `La respuesta no esta bien escrita en JSON`,
							text: this.responseText
						})
					}
				}
				xhr.send(fomrD)
			})
		,
		appendScript:data=>{
			if(!se('.'+data.class)){
				if(data.opt==='js'){
					var script = document.createElement('script');
					script.className=data.class
					script.type = 'text/javascript';
					script.src = data.src;
					se('head').appendChild(script);
				}else if(data.opt==='css'){
					var link  = document.createElement('link');
					link.className = data.class;
					link.rel  = 'stylesheet';
					link.type = 'text/css';
					link.href = data.src;
					link.media = 'all';
					se('head').appendChild(link);
				}
			}
		}
	}
}
function se(tag){
	return document.querySelector(tag)
}
function si(tag, cb){
	[].forEach.call(document.querySelectorAll(tag), elem=>{
		if(cb)
			cb(elem);
	})
	return document.querySelectorAll(tag).length
}
const SERVER=false
document.addEventListener('DOMContentLoaded',()=>{
	if(typeof jQuery==='undefined')
		boot.logic.appendScript({class:'ss-jquery-js', src:`./public/${SERVER?'sflib':'sfLib'}/jquery-3.2.1.min.js`, opt:'js'})
	boot.logic.appendScript({class:'ss-animate-css', src:`./public/${SERVER?'sflib':'sfLib'}/animate.css`, opt:'css'})
	boot.logic.appendScript({class:'ss-boot-css', src:`./public/${SERVER?'sflib':'sfLib'}/boot.css`, opt:'css'})
	boot.logic.appendScript({class:'ss-fontello-css', src:`./public/${SERVER?'sflib':'sfLib'}/fontello/css/war-embedded.css`, opt:'css'})
},false)