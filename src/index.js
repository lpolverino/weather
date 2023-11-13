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

async function proccessInfo(info){
    //console.log(info);
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
        farrenheit:{
            min:tomorrow.mintemp_f,
            max:tomorrow.maxtemp_f,
        },
        celcius:{
            min:tomorrow.mintemp_c,
            max:tomorrow.maxtemp_c,
        },
        description: tomorrow.condition.text
    }

    return {
        location: locationInfo,
        weather:{
            today:weatherToday,
            tomorrow:weatherTomorrow
        }
    }
}
const getInfo = async(location) =>{
    const info = await getLocationWeather(location)
    const result =  await proccessInfo(info)
    console.log(result);
    return result
}

const createCardContent = (info) =>{
    const cardContent = document.createElement("div");
    cardContent.classList.add("card-content");

    const description = document.createElement("p");
    description.classList.add("card-description");
    description.innerText = info.weather.description;
    cardContent.appendChild(description);

    const regionLocation = document.createElement("div");
    regionLocation.classList.add("card-region");

    const location = document.createElement("p");
    location.innerText = info.location.name + " " + info.location.region 
    location.classList.add("card-location")
    regionLocation.appendChild(location)

    cardContent.appendChild(regionLocation)

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
    while(card.firstChild){
        card.removeChild(card.firstChild);
    }

    const header = createCardHeader(info.weather.today.temperature)
    const content = createCardContent(info)

    card.appendChild(header)
    card.appendChild(content)
}



const changeBackground = (info) =>{

}

const render = async (location) =>{

    const locationinfo = await getInfo(location)
    createCardToday(locationinfo)
    changeBackground(locationinfo.weather.description)
}

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

render("london")