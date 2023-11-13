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

const createCardContent = (info) =>{
    const cardContent = document.createElement("div");
    cardContent.classList.add("card-content");

    const description = document.createElement("p");
    description.classList.add("card-description");
    description.innerText = info.weather.today.description;
    cardContent.appendChild(description);


    return cardContent
}

const createCardHeader = (info) =>{
    const temperature = document.createElement("h2")
    temperature.innerText = info.celcius +" Cº " + info.farenheit +" Fª"
    temperature.classList.add("temperature-header")
    return temperature
}

const createCardToday = (info) =>{
    const card  = document.getElementById("today")
    clearElement(card)

    const header = createCardHeader(info.weather.today.temperature)
    const content = createCardContent(info)

    card.appendChild(header)
    card.appendChild(content)
}

const createCardHeaderTomorrow = (tomorrowWeather) =>{
    console.log(tomorrowWeather);
    const temperature = document.createElement("h2")
    temperature.innerText = tomorrowWeather.celcius.max +" Cº " + tomorrowWeather.farenheit.max +" Fª"
    temperature.classList.add("temperature-header")
    return temperature
}

const createCardTomorrow = (info) =>{
    const card  = document.getElementById("tomorrow")
    clearElement(card)

    const header = createCardHeaderTomorrow(info.weather.tomorrow)

    card.appendChild(header)

    const description = document.createElement("p");
    description.classList.add("card-description");
    description.innerText = info.weather.tomorrow.description;
    card.appendChild(description);
}

const createHourCard = (hourWeather) =>{
    const hoursConteiner = document.getElementById("timeline")

    const card = document.createElement("div");
    card.classList.add("hour-card");

    const content = document.createElement("h3")
    content.innerText = hourWeather.weather.temp_c + "Cº " + hourWeather.weather.temp_f +"Fª"

    const timePara = document.createElement("p");
    timePara.innerText = hourWeather.hour

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


const changeBackground = (info) =>{

}

const createTitle = (location) =>{
    const titleConteiner = document.getElementById("Location-title")
    clearElement(titleConteiner)
    const title = document.createElement("h1");
    title.innerText = location.name + " " + location.region
    titleConteiner.appendChild(title)
}

const render = async (location) =>{

    const locationinfo = await getInfo(location);

    createTitle(locationinfo.location);

    createCardToday(locationinfo);
    createCardTomorrow(locationinfo);

    createHoursCards(locationinfo.weather.nextHours)
   
    changeBackground(locationinfo.weather.description);
}

(function initialize(){
    const btnLocation = document.getElementById("btn-location")
    btnLocation.addEventListener("click", (e)=>{
        e.preventDefault();
        const formInput = document.getElementById("location").value;
        try{
            render(formInput);
        }catch(e){
            console.log("there was an error",e);
            render("london")
        }
    });
    
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

