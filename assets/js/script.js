var cityInputEl = document.querySelector("#city-input");
var cityHistoryEl = document.querySelector("#search-history");
var cityWeatherEl = document.querySelector("#city");
var fiveDayEl = document.querySelector("#five-day");
var searchButton = document.querySelector("#search");

//  API key: eb4e2dad1b3139204ac9acffff6d3724
var getWeatherInfo = function (location) {
    var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + location + ",us&units=imperial&APPID=eb4e2dad1b3139204ac9acffff6d3724";

    // make a request to the url
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    displayWeather(data, location);
                });
            } else {
                alert('Error: Not Found');
            }
        })
        .catch(function (error) {
            alert("Unable to connect to weather website");
        });

};

var getForecastInfo = function (lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=eb4e2dad1b3139204ac9acffff6d3724";

    // make a request to the url
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    displayForecast(data);
                });
            } else {
                alert('Error: Not Found');
            }
        })
        .catch(function (error) {
            alert("Unable to connect to weather website");
        });

};

function formatName(name) {
    name = name.toLowerCase();
    let words = name.split(' ');
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    words = words.join(" ");
    return words;
}

function formatDate(timeStamp) {
    var a = new Date(timeStamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = month + ' ' + date + ', ' + year; // + ' ' + hour + ':' + min;
    return time;
}

var weatherExtraInfo = function (info, check) {
    // Get information from server
    if (check === false) {
        var temp = info.main.temp;
        var wind = info.wind.speed;
        var humidity = info.main.humidity;
    } else {
        var temp = info.daily[check].temp.day;
        var wind = info.daily[check].wind_speed;
        var humidity = info.daily[check].humidity;
    }

    // Create element
    var temperature = document.createElement("p");
    temperature.innerHTML = "Temp: " + temp + "&#176 F";
    var windSpeed = document.createElement("p");
    windSpeed.innerHTML = "Wind: " + wind + " MPH";
    var humidityPercent = document.createElement("p");
    humidityPercent.innerHTML = "Humidity: " + humidity + "%";
    var uvIndexRating = document.createElement("p");
    uvIndexRating.setAttribute("id", "uv");
    uvIndexRating.innerHTML = "UV Index: ";

    var infoContainer = document.createElement("div");
    if (check === false) {
        infoContainer.append(temperature, windSpeed, humidityPercent, uvIndexRating);
    } else {
        infoContainer.append(temperature, windSpeed, humidityPercent);
    }
    return infoContainer;
}

var displayWeather = function (weatherData, searchCity) {
    // Format info
    let time = weatherData.dt;
    time = formatDate(time);
    searchCity = formatName(searchCity);
    var currentIcon = weatherData.weather[0].icon;

    var latitude = weatherData.coord.lat;
    var longitude = weatherData.coord.lon;
    console.log(latitude, longitude);
    getForecastInfo(latitude, longitude);

    // Create element with info for the searched city
    cityWeatherEl.innerHTML = "<h2 id='current-city' class='w-100'>" + searchCity + " (" + time + ") " + "<img src='http://openweathermap.org/img/wn/" + currentIcon + "@2x.png' /></h2>";
    cityWeatherEl.append(weatherExtraInfo(weatherData, false));
}

var displayForecast = function (forecastData) {
    // Append the UV Index to the current weather
    var uv = document.querySelector("#uv");

    var uvIndex = forecastData.current.uvi;
    uv.innerHTML = "UV Index: " + uvIndex;
    //cityWeatherEl.append(uvIndex);

    // Make the forecast cards
    for (let i = 1; i < 6; i++) {
        let time = forecastData.daily[i].dt;
        time = formatDate(time);
        var forecastIcon = forecastData.daily[i].weather[0].icon;

        var forecastEl = document.createElement("div");
        forecastEl.classList.add("col-2", "forecast-card");
        forecastEl.innerHTML = "<h5>" + time + "</h5><img src='http://openweathermap.org/img/wn/" + forecastIcon + "@2x.png' />";
        forecastEl.append(weatherExtraInfo(forecastData, i));
        fiveDayEl.append(forecastEl);
    }
}

// default weather
getWeatherInfo("san francisco");

var buttonClickHandler = function (event) {
    var city = cityInputEl.value;
    if (city) {
        fiveDayEl.textContent = "";
        getWeatherInfo(city);
    }
    // cityInputEl = event.target.getAttribute("data-language");
    // if (language) {
    //   getFeaturedRepos(language);

    //   // clear old content
    //   repoContainerEl.textContent = "";
    // }
    // console.log(cityInputEl)
}
searchButton.addEventListener("click", buttonClickHandler);

//getWeatherInfo("atlanta");