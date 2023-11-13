async function getLocationWeather(location) {
    //we need to insert the location and check for error
    try{
        response = await fetch("https://api.weatherapi.com/v1/current.json?key=ce6352e5ca1c44c4917131930231211&q=london")
        console.log(response.json());
        return response.json()
    }
    catch(e){
        console.log(e);
    }
}
 getLocationWeather("london")