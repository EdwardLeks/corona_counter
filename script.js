let corona = []
let people = {"corona":{}}

async function getData(){
	corona.push(fetch("https://pomber.github.io/covid19/timeseries.json").then(response => { 
		return response.json()
	}))

	await Promise.all(corona).then(value => {
		people["corona"] = value[0]
		return people["corona"]
	})
	
	count()
	createOptions()
}

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

			console.log(todayInfected)

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
}

getData()