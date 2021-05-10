import _, { template } from 'lodash';
import "./main.css";
import {addWeatherImg, updateLocationDisplay, updateConditionDisplay, updateTempDisplay, updateWindNum, updateHumidityNum} from './updateWeatherDisplay'


const data = require('./city.list.json');
const countryList = require('./countries.json');
let previousInput = "";
let currentUnit = "metric";

(function initPage () {
    document.getElementById("searchBar").value = "";
})();

function displaySearchText() { 
    setInterval(()=>{
        let currentInput = document.getElementById("searchBar").value.toLowerCase();
        if (currentInput == "" && document.querySelectorAll("li").length != 0) {
            clearList();
        };
        if (currentInput != "" && currentInput != previousInput) {
            let matchedCityList = searchCity(currentInput);
            previousInput = currentInput;
            displayRecommendedList(matchedCityList);
        };
    }, 500);
};

function searchCity(text){
    let matchedCityList = [];
    let splitText = text.split(", ");

    if (splitText.length == 1) {
        data.forEach((cityObj) => {
            if (cityObj.name.toLowerCase().startsWith(text)) {
                matchedCityList.push(cityObj);
            };
        })
    } else if (splitText.length == 2) {
        if (splitText[1].length == 0) {
            data.forEach((cityObj) => {
                if (cityObj.name.toLowerCase().startsWith(splitText[0])) {
                    matchedCityList.push(cityObj);
                };
            })
        } else if (splitText[1].length >= 1) {
            let countryCodeList = returnCountryCodes(splitText[1])
            data.forEach((cityObj) => {
                if (cityObj.name.toLowerCase() == splitText[0]) {
                    if (countryCodeList.includes(cityObj.country)) {
                        matchedCityList.push(cityObj);
                    }
                };
            })
        }
    }
    return matchedCityList
}

function returnCountryCodes (inputText) {
    let countryCodeList = []
    countryList.forEach((countryObj) => {
        if (countryObj.name.toLowerCase().startsWith(inputText)) {
            countryCodeList.push(countryObj.code);
        };
    })
    return countryCodeList;
}

function displayRecommendedList(matchedCityList) {
    let listContainer = document.getElementById("suggestedList");
    let cityNumber = 0;
    clearList();

    matchedCityList.forEach((cityObj) => {
        if (cityNumber >= 8) {
            return;
        }
        let newCity = document.createElement("li");
        newCity.innerHTML = cityObj.name + ", " + codeToText(cityObj.country);
        newCity.value = cityNumber;
        newCity.id = `List${cityNumber}`;
        listContainer.appendChild(newCity);
        autofillInput(newCity.id);
        cityNumber++;
    });
}

function clearList() {
    let listContainer = document.getElementById("suggestedList");
    let existingList = document.querySelectorAll("li");

    existingList.forEach((cityInList)=>{
        listContainer.removeChild(cityInList);
    });
};

function codeToText(countryCode) {
    let countryName = "";
    countryList.forEach((countryObj)=>{
        if (countryObj.code == countryCode) {
            countryName = countryObj.name;
        }
    })
    return countryName;
}

function textToCode(countryText) {
    let countryCode = "";
    countryList.forEach((countryObj)=>{
        if (countryObj.name == countryText) {
            countryCode = countryObj.code;
        }
    })
    return countryCode;
}

function autofillInput (input) {
    let selectInput = document.getElementById(input)
    selectInput.addEventListener('click', function(){
        document.getElementById("searchBar").value = selectInput.innerHTML;
        clearList();
        return previousInput = selectInput.innerHTML.toLowerCase();
    })
}

function isCountryIncluded(input) {
    let splitText = input.split(", ");
    if (splitText.length == 2){
        return true;
    } else {
        return false;
    }
}

document.getElementById("searchBar").addEventListener('keypress', function(event){  
    if (event.keyCode == 13) {
        event.preventDefault();
        
        let currentInput = document.getElementById("searchBar").value;
        let lowerCaseInput = currentInput.toLowerCase();
        if (!isCountryIncluded(lowerCaseInput)){
            grabDataNoCountry(currentInput, currentUnit).then(function(data){
                if (data.message == "city not found") {
                    console.log("City does not exist. Please verify the spelling of the city");
                } else {
                    updateDisplay(data);
                    console.log(data);
                }
            })
        } else {
            grabDataWithCountry(currentInput, currentUnit).then(function(data){
                if (data.message == "city not found") {
                    console.log("City does not exist. Please verify the spelling of the city");
                } else {
                    updateDisplay(data);
                    console.log(data);  
                }
            })
        }
        clearList();
    }
});

function grabDataNoCountry(input, units) {
    return fetch(`http://api.openweathermap.org/data/2.5/weather?q=${input}&appid=c80444b3c23833eaa012a8347002c7c9&units=${units}`, {mode: 'cors'})
        .then(function(response){
            return response.json();
        })
        .catch(function(){
            console.log("URL does not exist!")
        })
}

function grabDataWithCountry(input, units) {
    let splitText = input.split(", ");
    let cityName = splitText[0]
    let countryCode = textToCode(splitText[1])
    return fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName},${countryCode}&appid=c80444b3c23833eaa012a8347002c7c9&units=${units}`, {mode: 'cors'})
        .then(function(response){
            return response.json();
        })
        .catch(function(){
            console.log("URL does not exist!")
        })
}

function updateDisplay(data) {
    let cityName = data.name;
    let countryName = codeToText(data.sys.country);
    let speedUnit = "";
    let tempUnit = "";

    if (currentUnit == "imperial") {
        speedUnit = "mph"
        tempUnit = "°F"
    } else if (currentUnit == "metric"){
        speedUnit = "km/h"
        tempUnit = "°C"
    }
    updateLocationDisplay(cityName, countryName);
    updateConditionDisplay(data);
    updateTempDisplay(data, tempUnit);
    updateWindNum(data, speedUnit);
    updateHumidityNum(data);
    addWeatherImg(data);
}

document.getElementById('btnMetric').addEventListener('click', function(){
    currentUnit = 'metric';
    let currentInput = document.getElementById('locationDisplay').innerHTML
    grabDataNoCountry(currentInput, currentUnit).then(function(data){
        if (data.message == "city not found") {
            console.log("City does not exist. Please verify the spelling of the city");
        } else {
            updateDisplay(data);
        }
    })
    let selectedBtn = document.getElementsByClassName('btnPressed');
    selectedBtn[0].classList.remove('btnPressed');
    document.getElementById('btnMetric').classList.add('btnPressed');

    return currentUnit
    
})

document.getElementById('btnImperial').addEventListener('click', function(){
    currentUnit = 'imperial';
    let currentInput = document.getElementById('locationDisplay').innerHTML
    grabDataNoCountry(currentInput, currentUnit).then(function(data){
        if (data.message == "city not found") {
            console.log("City does not exist. Please verify the spelling of the city");
        } else {
            updateDisplay(data);
        }
    })
    let selectedBtn = document.getElementsByClassName('btnPressed');
    selectedBtn[0].classList.remove('btnPressed');
    document.getElementById('btnImperial').classList.add('btnPressed');

    return currentUnit
})

displaySearchText();

grabDataNoCountry("Toronto", currentUnit).then(function(data){
    if (data.message == "city not found") {
        console.log("City does not exist. Please verify the spelling of the city");
    } else {
        updateDisplay(data);
    }
})