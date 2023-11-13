async function getLocationWeather(location) {
    const url ="https://api.weatherapi.com/v1/current.json?key=ce6352e5ca1c44c4917131930231211&q=" + location
    try{
        const response = await fetch("https://api.weatherapi.com/v1/current.json?key=ce6352e5ca1c44c4917131930231211&q=london")
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

async function getInfo(location){
    const info = await getLocationWeather(location)
    await proccessInfo(info)
}

getInfo("london")