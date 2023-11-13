async function getLocationWeather(location) {
    const url ="https://api.weatherapi.com/v1/current.json?key=ce6352e5ca1c44c4917131930231211&q=" + location
    try{
        const response = await fetch(url)
        const data = await response.json()
        return data
    }
    catch(e){
        console.log(e);
    }
}

async function proccessInfo(info){
    console.log(info);
    const locationInfo = {
        name: info.location.name,
        region : info.location.region
    }
    const weather = {
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
}
const getInfo = async(location) =>{
    const info = await getLocationWeather(location)
    await proccessInfo(info)
}

const createCard = (info) =>{
    const card  = document.getElementById("card")

}

const changeBackground = (info) =>{

}

const render = async (location) =>{
    const locationinfo = await getInfo(location)
    createCard(locationinfo)
    changeBackground(locationinfo)
}

const btnLocation = document.getElementById("btn-location")
btnLocation.addEventListener("click", (e)=>{
    e.preventDefault();
    console.log("clcick");
    const formInput = document.getElementById("location").value;
    try{
        console.log("will reques with " + formInput);
        render(formInput);
    }catch(e){
        // show error
        console.log("there was an error",e);
        render("london")
    }
});

const card = document.createElement("div");
card.id ="card"

render("london")