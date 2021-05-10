import { template } from 'lodash'
import clearSkyDay from './assets/01d@2x.png'
import clearSkyNight from './assets/01n@2x.png'
import fewCloudsDay from './assets/02d@2x.png'
import fewCloudsNight from './assets/02n@2x.png'
import scatteredCloudsDay from './assets/03d@2x.png'
import scatteredCloudsNight from './assets/03n@2x.png'
import overcastCloudsDay from './assets/04d@2x.png'
import overcastCloudsNight from './assets/04n@2x.png'
import showerDay from './assets/09d@2x.png'
import showerNight from './assets/09n@2x.png'
import rainDay from './assets/10d@2x.png'
import rainNight from './assets/10n@2x.png'
import thunderstormDay from './assets/11d@2x.png'
import thunderstormNight from './assets/11n@2x.png'
import snowDay from './assets/13d@2x.png'
import snowNight from './assets/13n@2x.png'
import mistDay from './assets/50d@2x.png'
import mistNight from './assets/50n@2x.png'

let weatherImgList = [
    [clearSkyDay, clearSkyNight],
    [fewCloudsDay, fewCloudsNight],
    [scatteredCloudsDay, scatteredCloudsNight],
    [overcastCloudsDay, overcastCloudsNight],
    [showerDay, showerNight],
    [rainDay, rainNight],
    [thunderstormDay, thunderstormNight],
    [snowDay, snowNight],
    [mistDay, mistNight],
]


const addWeatherImg = (data) => {
    let imgContainer = document.getElementById("conditionPicture");
    if (data.weather[0].icon == "01d") {
        imgContainer.src = weatherImgList[0][0]
    } else if (data.weather[0].icon == "01n") {
        imgContainer.src = weatherImgList[0][1]
    } else if (data.weather[0].icon == "02d") {
        imgContainer.src = weatherImgList[1][0]
    } else if (data.weather[0].icon == "02n") {
        imgContainer.src = weatherImgList[1][1]
    } else if (data.weather[0].icon == "03d") {
        imgContainer.src = weatherImgList[2][0]
    } else if (data.weather[0].icon == "03n") {
        imgContainer.src = weatherImgList[2][1]
    } else if (data.weather[0].icon == "04d") {
        imgContainer.src = weatherImgList[3][0]
    } else if (data.weather[0].icon == "04n") {
        imgContainer.src = weatherImgList[3][1]
    } else if (data.weather[0].icon == "09d") {
        imgContainer.src = weatherImgList[4][0]
    } else if (data.weather[0].icon == "09n") {
        imgContainer.src = weatherImgList[4][1]
    } else if (data.weather[0].icon == "10d") {
        imgContainer.src = weatherImgList[5][0]
    } else if (data.weather[0].icon == "10n") {
        imgContainer.src = weatherImgList[5][1]
    } else if (data.weather[0].icon == "11d") {
        imgContainer.src = weatherImgList[6][0]
    } else if (data.weather[0].icon == "11n") {
        imgContainer.src = weatherImgList[6][1]
    } else if (data.weather[0].icon == "13d") {
        imgContainer.src = weatherImgList[7][0]
    } else if (data.weather[0].icon == "13n") {
        imgContainer.src = weatherImgList[7][1]
    } else if (data.weather[0].icon == "50d") {
        imgContainer.src = weatherImgList[8][0]
    } else if (data.weather[0].icon == "50n") {
        imgContainer.src = weatherImgList[8][1]
    }
}

const updateLocationDisplay = (cityName, countryName) => {
    let locationDisplay = document.getElementById("locationDisplay");
    locationDisplay.innerHTML = `${cityName}, ${countryName}`
}

const updateConditionDisplay = (data) => {
    let conditionDisplay = document.getElementById('conditionDisplay');
    conditionDisplay.innerHTML = data.weather[0].description.toUpperCase();
}

const updateTempDisplay = (data, units) => {
    let tempDisplay = document.getElementById('tempDisplay');
    tempDisplay.innerHTML = `${data.main.temp.toFixed()}${units}`
}

const updateWindNum = (data, units) => {
    let windNum = document.getElementById('windNum');
    let windSpeed = data.wind.speed
    if (units == "km/h") {
        windSpeed = windSpeed*3.6;
    }
    windNum.innerHTML = `${windSpeed.toFixed()} ${units}`
}

const updateHumidityNum = (data) => {
    let humidityNum = document.getElementById('humidityNum');
    humidityNum.innerHTML = `${data.main.humidity}%`
}

export {addWeatherImg, updateLocationDisplay, updateConditionDisplay, updateTempDisplay, updateWindNum, updateHumidityNum};