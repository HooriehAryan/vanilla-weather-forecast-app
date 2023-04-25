// -----------------------dispaly date & time-------------------
function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours.toString().length === 1) {
    hours = "0" + hours;
  }
  let minutes = date.getMinutes();
  if (minutes.toString().length === 1) {
    minutes = "0" + minutes;
  }
  //--today--
  let today = date.getDate();

  //-day of the week--
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[date.getDay()];

  //--months--
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jully",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[date.getMonth()];

  //--result--
  return `${day}, ${today} ${month} ${hours}:${minutes}`;
}

//----------------------convert dt in day format-----------------------
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}
//---------------convert tempreture for forecast data-------------------
function displayFarenHietTempForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = "";
  let forecastHTML = `<div class="row">`;

  for (let i = 1; i < 6; i++) {
    forecast = response.data.daily[i];

    forecastHTML =
      forecastHTML +
      `<div class="col-2">
      <p>${formatDay(forecast.dt)}</p>
      
      <p>
         <img class="icon" src="http://openweathermap.org/img/wn/${
           forecast.weather[0].icon
         }@2x.png" alt="" >
      </p>
          <p>
        <span class="weather-forecas-temp-max">${Math.round(
          (forecast.temp.max * 9) / 5 + 32
        )}</span>°/
        <span class="weather-forecas-temp-min">${Math.round(
          (forecast.temp.min * 9) / 5 + 32
        )}</span>°
      </p>
    </div>
    
  `;
  }
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
//-------------------- display forecast--------------------------
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = "";
  let forecastHTML = `<div class="row">`;

  for (let i = 1; i < 6; i++) {
    forecast = response.data.daily[i];
    forecastHTML =
      forecastHTML +
      `<div class="col-2">
      <p>${formatDay(forecast.dt)}</p>
      
      <p>
         <img class="icon" src="http://openweathermap.org/img/wn/${
           forecast.weather[0].icon
         }@2x.png" alt="" >
      </p>
          <p>
        <span class="weather-forecas-temp-max">${Math.round(
          forecast.temp.max
        )}</span>°/
        <span class="weather-forecas-temp-min">${Math.round(
          forecast.temp.min
        )}</span>°
      </p>
    </div>
  `;
  }
  // })
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
//----------------get coodinates for forecast weather-------------------
function getForecast(coordinates) {
  lat = coordinates.lat;
  long = coordinates.lon;
  let key = "97bed167ec49bff56e6c1b63daef9c86";
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${key}&units=metric`;
  console.log(url);
  axios.get(url).then(displayForecast);
}

// ---------------display current location weather------------------
function displayCurrentWeather(response) {
  console.log(response);
  document.querySelector("#city-title").innerHTML = response.data.name;

  celsiusTemp = response.data.main.temp;
  feelsLikeTemp = response.data.main.feels_like;
  maxTemp = response.data.main.temp_max;
  minTemp = response.data.main.temp_min;

  document.querySelector("#current-temp").innerHTML = Math.round(celsiusTemp);

  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;

  document.querySelector("#humidity").innerHTML = response.data.main.humidity;

  document.querySelector("#windSpeed").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#feelsLike").innerHTML = Math.round(
    response.data.main.feels_like
  );
  document.querySelector("#maxTemp").innerHTML = Math.round(
    response.data.main.temp_max
  );
  document.querySelector("#minTemp").innerHTML = Math.round(
    response.data.main.temp_min
  );

  //--calculate data&time--
  //-convert timestamp to ms-

  document.querySelector("#date-time").innerHTML = formatDate(
    response.data.dt * 1000
  );

  //--add relevant main weather icon--
  let iconElement = document.querySelector("#main-icon");

  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].main);

  document.querySelector("#search-input").value = "";

  getForecast(response.data.coord);
}

//----search current location with latitude and longitude-------
function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let key = "cff65853d7c461490797b173c0cc1233";
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`;
  let searchInput = document.querySelector("#search-input");
  searchInput.value = "";
  axios.get(url).then(displayCurrentWeather);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}

// -------search engine: search city with it's name---------
function searchCity(city) {
  let key = "cff65853d7c461490797b173c0cc1233";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;
  axios.get(url).then(displayCurrentWeather);
}
//-----------show city title then call a fuction for search the weasther values----------
function cityTitle(event) {
  event.preventDefault();

  let newCity = document.querySelector("#search-input").value;
  city = newCity;

  if (newCity.length === 0) {
    alert("Enter a city name");
  } else {
    searchCity(newCity);
  }
}

//---------------convert tempreture-------------------
function displayFarenHietTemp(event) {
  event.preventDefault();
  //remove the active class from cel
  celsiusLink.classList.remove("active");
  farenhietLink.classList.add("active");

  let tempElement = document.querySelector("#current-temp");
  farenhietTemp = (celsiusTemp * 9) / 5 + 32;
  tempElement.innerHTML = Math.round(farenhietTemp);

  document.querySelector("#maxTemp").innerHTML = Math.round(
    (maxTemp * 9) / 5 + 32
  );
  document.querySelector("#minTemp").innerHTML = Math.round(
    (minTemp * 9) / 5 + 32
  );
  document.querySelector("#feelsLike").innerHTML = Math.round(
    (feelsLikeTemp * 9) / 5 + 32
  );

  //call a function whitch convert cel to faren for an array
  let key = "97bed167ec49bff56e6c1b63daef9c86";
  let latitude = lat;
  let longitude = long;
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`;
  axios.get(url).then(displayFarenHietTempForecast);
}

function displayCelsiusTemp(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  farenhietLink.classList.remove("active");
  let tempElement = document.querySelector("#current-temp");
  tempElement.innerHTML = Math.round(celsiusTemp);
  document.querySelector("#maxTemp").innerHTML = Math.round(maxTemp);
  document.querySelector("#minTemp").innerHTML = Math.round(minTemp);
  document.querySelector("#feelsLike").innerHTML = Math.round(feelsLikeTemp);

  searchCity(city);
}
//-----------------------------------------------------
//---set global variables----
city = "San Diego";
let celsiusTemp = null;
let feelsLikeTemp = null;
let maxTemp = null;
let minTemp = null;
let lat = 0;
let long = 0;
//---show default city values--
searchCity(city);

//---click search button--
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", cityTitle);

//---click currentLocation button--
let currentButton = document.querySelector("#currentLocation");
currentButton.addEventListener("click", getCurrentPosition);

//---click fahrenheit link--
let farenhietLink = document.querySelector("#fahrenheit-link");
farenhietLink.addEventListener("click", displayFarenHietTemp);

//---click celsius link--
let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemp);
