let corona = []
let people = {"corona":{}, "population":{}}

let check = document.getElementById('startup-check')

window.onload = function(){
	if(!localStorage.getItem("DontShow")) {
		openModal()
	} else {
		check.checked = true
	}
}

function openModal(){
	document.getElementById('modal-screen').classList.add('display')
}

function closeModal(){
	document.getElementById('modal-screen').classList.remove('display')
}

function startModal(){
	if(check.checked){
		localStorage.setItem("DontShow", "true")
	}else{
		localStorage.removeItem('DontShow')
	}
}

function openNav() {
  document.getElementById("mySidebar").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
}

document.addEventListener('click', function(e){
	const cList = e.target.classList
	if(cList.contains('stay-safe')){
		e.preventDefault()
		openModal()
	} else if(cList.contains('modal-screen')){
		closeModal()
	}
})

async function getData(){
	corona.push(fetch("https://pomber.github.io/covid19/timeseries.json").then(response => { 
		return response.json()
	}))

	corona.push(fetch("https://raw.githubusercontent.com/samayo/country-json/master/src/country-by-population.json").then(response => { 
		return response.json()
	}))

	await Promise.all(corona).then(value => {
		people["corona"] = value[0]
		people["population"] = value[1]
		return people
	})
	
	count()
	createOptions()
}

document.getElementById('location').addEventListener('click', function(){
	document.getElementById('location').value = ""
})

function createOptions() {
	select = document.getElementById('location-list');
	for (keys in people['corona']){
			let opt = document.createElement('option')
			opt.value = keys
			opt.innerHTML = keys
			select.appendChild(opt)
	}
}

function count(){
	let country = document.getElementById('location').value

	let totalInfected = 0
	let totalDead = 0
	let totalRecovered = 0 

	let todayInfected = 0
	let todayDead = 0
	let todayRecovered = 0 

	if(country === "World"){
		for(cntry in people['corona']){
			totalInfected += people['corona'][cntry][people['corona'][cntry].length - 1]['confirmed']
			totalDead += people['corona'][cntry][people['corona'][cntry].length - 1]['deaths']
			totalRecovered += people['corona'][cntry][people['corona'][cntry].length - 1]['recovered']

			todayInfected += people['corona'][cntry][people['corona'][cntry].length - 1]['confirmed'] - people['corona'][cntry][people['corona'][cntry].length - 2]['confirmed']
			todayDead += people['corona'][cntry][people['corona'][cntry].length - 1]['deaths'] - people['corona'][cntry][people['corona'][cntry].length - 2]['deaths']
			todayRecovered += people['corona'][cntry][people['corona'][cntry].length - 1]['recovered'] - people['corona'][cntry][people['corona'][cntry].length - 2]['recovered']
		}
	} else {
		totalInfected = people['corona'][country][people['corona'][country].length - 1]['confirmed']
		totalDead = people['corona'][country][people['corona'][country].length - 1]['deaths']
		totalRecovered = people['corona'][country][people['corona'][country].length - 1]['recovered']
	
		todayInfected =  totalInfected - people['corona'][country][people['corona'][country].length - 2]['confirmed']
		todayDead = totalDead - people['corona'][country][people['corona'][country].length - 2]['deaths']
		todayRecovered = totalRecovered - people['corona'][country][people['corona'][country].length - 2]['recovered']
	}

	document.getElementById('location-heading').innerHTML = country

	document.getElementById('infected-count').innerHTML = totalInfected
	document.getElementById('death-count').innerHTML = totalDead
	document.getElementById('recovered-count').innerHTML = totalRecovered

	document.getElementById('today-infected').innerHTML = todayInfected
	document.getElementById('today-dead').innerHTML = todayDead
	document.getElementById('today-recovered').innerHTML = todayRecovered

	function population(){
		currentPopulation = 0
		if(country === "World"){
			for(cntry in people['population']){
				currentPopulation += Number(people['population'][cntry]['population'])
			}
		} else {
			for(cntry in people['population']){
				if(people['population'][cntry]['country'].includes(country)){
					currentPopulation = Number(people['population'][cntry]['population'])
				} else if(country === 'US'){
					currentPopulation = Number(people['population'][227]['population'])
				} else if(country === 'Cabo Verde'){
					currentPopulation = Number(people['population'][38]['population'])
				}
			}
			
		}
		function percentage(){
			let infectedPercent = (totalInfected / currentPopulation) * 100
			document.getElementById('infected-percent').innerHTML = infectedPercent.toFixed(1-Math.floor(Math.log(infectedPercent)/Math.log(10))) + "%"
			document.getElementById('infected-percent-bar').value = infectedPercent
			
			if(totalDead > 0){
				let deadPercent = (totalDead / currentPopulation) * 100
				let critical = Math.round((totalDead / totalInfected) * 100)
				document.getElementById('dead-percent').innerHTML = deadPercent.toFixed(1-Math.floor(Math.log(deadPercent)/Math.log(10))) + "%"
				document.getElementById('dead-percent-bar').value = deadPercent
				document.getElementById('dead-critical').innerHTML =  critical + "% Fatal"
			} else{
				document.getElementById('dead-percent').innerHTML = '0%'
				document.getElementById('dead-percent-bar').value = 0
				document.getElementById('dead-critical').innerHTML = '0%'
			}

			if(totalRecovered > 0){
				let recoveryPercent = Math.round((totalRecovered / totalInfected) * 100)
				document.getElementById('recovery-percent').innerHTML = recoveryPercent + "%"
				document.getElementById('recovery-percent-bar').value = recoveryPercent
				document.getElementById('recovery-remaining').innerHTML = (100 - recoveryPercent) + "% Remaining"
			} else{
				document.getElementById('recovery-percent').innerHTML = '0%'
				document.getElementById('recovery-percent-bar').value = 0
				document.getElementById('recovery-remaining').innerHTML = '0%'
			}

		}
		percentage()
	}
	population()
}

getData()