//while modules arent in the app(aka its not a OOP app), this global varialbes are needed

let unity = "celcius"
let city = ""
let locationinfo = {}
let is_Day = true


async function getLocationWeather(location) {
    const url ="https://api.weatherapi.com/v1/forecast.json?key=ce6352e5ca1c44c4917131930231211&q=" + location + "&days=2"
    try{
        console.log(url);
        const response = await fetch(url)
        const data = await response.json()
        return data
    }
    catch(e){
        console.log(e);
    }
}

const clearElement = (element) => {
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
}

async function proccessInfo(info){
    console.log(info);

    const locationInfo = {
        name: info.location.name,
        region : info.location.region
    }
    const weatherToday = {
        description: info.current.condition.text,
        feels:{
            farenheit:info.current.feelslike_f,
            celcius:info.current.feelslike_c
        },
        temperature:{
            farenheit:info.current.feelslike_f,
            celcius:info.current.feelslike_c
        }
    }

    const tomorrow = info.forecast.forecastday[1].day
    const weatherTomorrow = {
        farenheit:{
            min:tomorrow.mintemp_f,
            max:tomorrow.maxtemp_f,
        },
        celcius:{
            min:tomorrow.mintemp_c,
            max:tomorrow.maxtemp_c,
        },
        description: tomorrow.condition.text
    }

    let hour = info.location.localtime.slice(-5,-3)
    try{
        hour = Number(hour)
    }catch(e){
        console.log("cannot get hour");
    }
    const weatherHours = []
    for (var i = 0 ; i < 5; i++) {
        if(hour + i < 24){
            weatherHours.push({
                hour: hour + i,
                weather:info.forecast.forecastday[0].hour[hour + i]
            })
        }
      }

    if(info.current.is_day === 1){
        is_Day = true
    }else{
        is_Day = false
    }
      
    return {
        location: locationInfo,
        weather:{
            today:weatherToday,
            tomorrow:weatherTomorrow,
            nextHours:weatherHours
        }
    }
}

const getInfo = async(location) =>{
    const info = await getLocationWeather(location)
    const result =  await proccessInfo(info)
    return result
}

const createCardContent = (description) =>{
    const cardContent = document.createElement("div");
    cardContent.classList.add("card-content");

    const content = document.createElement("p");
    content.classList.add("card-description");
    content.innerText = description
    cardContent.appendChild(content);

    return cardContent
}

const createCardHeader = (celcius, faranheit) =>{
    const temperature = document.createElement("h2")
    if(unity === "celcius"){
        temperature.innerText = celcius +" Cº"
    }else{
        temperature.innerText = faranheit+" Fª"
    }
    temperature.classList.add("temperature-header")
    return temperature
}

const createCard = (celcius, farenheit, description, id) =>{
    const card  = document.getElementById(id)
    clearElement(card)

    const header = createCardHeader(celcius, farenheit)
    const content = createCardContent(description)

    const conteiner = document.createElement("div")
    conteiner.classList.add("card-conteiner")

    const title = document.createElement("h2");
    title.innerText = id.charAt(0).toUpperCase() + id.slice(1)
    title.classList.add("card-title")

    conteiner.appendChild(title)
    conteiner.appendChild(header)
    conteiner.appendChild(content)

    card.appendChild(conteiner)

}

const createHourCard = (hourWeather) =>{
    const hoursConteiner = document.getElementById("timeline")

    const card = document.createElement("div");
    card.classList.add("hour-card");

    const content = document.createElement("h3")
    if(unity ==="celcius"){
        content.innerText = hourWeather.weather.temp_c + " Cº"
    }else{
        content.innerText = hourWeather.weather.temp_f +" Fª"
    }

    const timePara = document.createElement("p");
    timePara.innerText = hourWeather.hour + "hs"

    card.appendChild(content)
    card.appendChild(timePara)
    hoursConteiner.appendChild(card)
} 

const createHoursCards = (hoursWeather) =>{
    const hoursConteiner = document.getElementById("timeline")
    clearElement(hoursConteiner)
    hoursWeather.forEach((hourWeather) =>{
        createHourCard(hourWeather);
    });
}

const changeBackground = () =>{
    const  bg = document.getElementById("bg");

    if(!is_Day && bg.classList.contains("day")){
        bg.classList.remove("day")
        bg.classList.add("night")
    }
    if(is_Day && bg.classList.contains("night")){
        bg.classList.remove("night")
        bg.classList.add("day")
    }

}

const createTitle = (location) =>{
    const titleConteiner = document.getElementById("Location-title")
    clearElement(titleConteiner)
    const title = document.createElement("h1");
    title.innerText = location.name + " " + location.region
    titleConteiner.appendChild(title)
}

const render = async (location) =>{


    if(city !== location){
        locationinfo = await getInfo(location);
    }

    if(city === ""){
        city = location
    }

    createTitle(locationinfo.location);

    createCard(
        locationinfo.weather.today.temperature.celcius,
        locationinfo.weather.today.temperature.farenheit,
        locationinfo.weather.today.description,
        "today"
    );
    createCard(
        locationinfo.weather.tomorrow.celcius.max,
        locationinfo.weather.tomorrow.farenheit.max,
        locationinfo.weather.tomorrow.description,
        "tomorrow"
    );

    createHoursCards(locationinfo.weather.nextHours)
   
    changeBackground();
}


(function initialize(){

    const btnLocation = document.getElementById("btn-location")
    btnLocation.addEventListener("click", (e)=>{
        e.preventDefault();
        const formInput = document.getElementById("location").value;
        try{
            render(formInput);
            city = formInput
        }catch(e){
            console.log("there was an error",e);
            render("london")
        }
    });

    const btnChange = document.getElementById("change");
    btnChange.addEventListener("click", (e) =>{
        let  button = e.target
        if(button.dataset["unity"] === "celcius"){
            button.dataset["unity"] = "farenhait"
            button.innerText = "Fª"
            unity = "farenhait"
        }else{
            button.dataset["unity"] = "celcius"
            button.innerText ="Cª"
            unity = "celcius"
        }
        render(city)
    })
    
    const cardToday = document.createElement("div");
    const content = document.getElementById("content")
    cardToday.id ="today"
    content.appendChild(cardToday)
    
    const cardTomorrow = document.createElement("div");
    cardTomorrow.id ="tomorrow"
    content.appendChild(cardTomorrow)
    
    const timelineConteiner = document.createElement("div")
    timelineConteiner.id = "timeline"
    content.appendChild(timelineConteiner);
    
    render("london")

})();

