// Today date
const optionsDate = {
    weekday: "long",
    day: "numeric",
    month: "long"
};
const dateComplete = new Date().toLocaleDateString("fr-FR", optionsDate);
const dateCompleteCapitalized = dateComplete.toUpperCase();

$(".date").text(dateCompleteCapitalized);
/* document.querySelector(".time").innerHTML = currentHour; */

// Hours
const hours = new Date().getHours();
let minutes = new Date().getMinutes();
if (minutes < 10) {
    minutes = "0" + minutes;
}
const currentHour = hours + "h" + minutes;

// Weekday
const optionsDay = {
    weekday: "long"
};
const currentDay = new Date().toLocaleDateString("fr-FR", optionsDay);
const dayCapitalized = currentDay.toUpperCase();
const daySliced = dayCapitalized.slice(0, 3);

const weekday = ["DIM", "LUN", "MAR", "MER", "JEU", "VEN", "SAM"];

const today = (day) => day == String(daySliced);
const indexCurrentDay = weekday.findIndex(today);

const indexFutur = [];

// Get next days index
for (i = 1; i <= 4; i++) {
    const newIndex = (indexCurrentDay + i) % 7;
    indexFutur.push(newIndex);
}

// Insert next days in html page
for (i = 1; i <= 4; i++) {
    $(".d" + i).text(weekday[indexFutur[i - 1]]);
};

///////////////////////////////////////////////////////////////////////////// LOCATION TODAY WEATHER
const successLocationWeather = function (data) {
    const todayTemp = Math.floor(data.main.temp);
    const todayIcon = data.weather[0].icon;
    const todaySrcIcon = "images/iconSmile/" + todayIcon + ".svg";
    /* const todaySrcIcon = "images/iconToday/" + todayIcon + ".svg"; */

    $(".icon-meteo-today").attr("src", todaySrcIcon);
    $(".temp").text(todayTemp + "°");

    // Dynamic backbround
    if (todayIcon === "01d" || todayIcon === "02d") {
        $(".container-right").removeClass().addClass("bg-01d-02d container-right");
    } else if (todayIcon === "01n" || todayIcon === "02n") {
        $(".container-right").removeClass().addClass("bg-01n-02n container-right");
    } else if (todayIcon === "03d" || todayIcon === "03n" || todayIcon === "04d" || todayIcon === "04n") {
        $(".container-right").removeClass().addClass("bg-03d-03n-04d-04n container-right");
    } else if (todayIcon === "09d" || todayIcon === "10d") {
        $(".container-right").removeClass().addClass("bg-09d-10d container-right");
    } else if (todayIcon === "09n" || todayIcon === "10n") {
        $(".container-right").removeClass().addClass("bg-09n-10n container-right");
    } else if (todayIcon === "11d" || todayIcon === "11n") {
        $(".container-right").removeClass().addClass("bg-11d-11n container-right");
    } else if (todayIcon === "13d" || todayIcon === "13n") {
        $(".container-right").removeClass().addClass("bg-13d-13n container-right");
    } else if (todayIcon === "50d" || todayIcon === "50n") {
        $(".container-right").removeClass().addClass("bg-50d-50n container-right");
    }
}

//////////////////////////////////////////////////////// LOCATION NEXT DAYS WEATHER
const successLocationForcast = function (data) {
    const locationCity = (data.city.name).toUpperCase();
    const locationCountry = data.city.country;
    const locationFlag = "http://purecatamphetamine.github.io/country-flag-icons/3x2/" + locationCountry + ".svg";

    LocationTempsDays = [];
    LocationIconDays = [];

    for (i = 1; i <= 4; i++) {
        LocationTempsDays.push(Math.floor(data.list[i].main.temp));
        LocationIconDays.push("images/iconFutur/" + data.list[i].weather[0].icon + ".svg");
        /* LocationIconDays.push("http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png"); */
    }

    $(".loading").addClass("hidden");
    $("img").removeClass("hidden");
    $(".meteo-futur").removeClass("hidden");

    $(".location").text(locationCity + ", ");
    $(".country").text(locationCountry);
    $(".flag").attr("src", locationFlag);

    for (i = 1; i <= 4; i++) {
        $(".d" + i + "-temp").text(LocationTempsDays[i - 1] + "°");
    }

    for (i = 1; i <= 4; i++) {
        $(".d" + i + "-img").attr("src", LocationIconDays[i - 1]);
    }
}

const optionsLocation = {
    enableHightAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

///////////////////////////////////////////////////////////////////////////// API CALL LOCATION
function success(pos) {
    $(".loading").removeClass("hidden");
    const crd = pos.coords;
    const latitude = crd.latitude;
    const longitude = crd.longitude;
    const apiKey = "0d19090abb5a0f99a36820be42fa1bcc";

    const urlCurrentForcastLatLong = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&units=metric&cnt=6&lang=fr&appid=" + apiKey;
    const urlCurrentWeatherLatLong = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&lang=fr&appid=" + apiKey + "&units=metric";

    $.get(urlCurrentForcastLatLong, successLocationForcast).done(function () {
    })
        .fail(function () {
            alert("erreur");
        })

    // Get TODAY info
    $.get(urlCurrentWeatherLatLong, successLocationWeather).done(function () {
    })
        .fail(function () {
            window.location.replace("file:///C:/Users/32456/Desktop/FrontEnd/WeatherApp/error.html");
        })
}

function error(err) {
    console.warn("ERREUR (${err.code}): (${err.message})");
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error, optionsLocation);
} else {
    alert("La géolocalisation n'est pas supportée par ce browser.");
}

//////////////////////////////////////////////////////////////// SUBMIT TODAY WEATHER
const successSubmitWeather = function (data) {
    const todayTemp = Math.floor(data.main.temp);
    const todayIcon = data.weather[0].icon;
    const todaySrcIcon = "images/iconSmile/" + todayIcon + ".svg";
    /* const todaySrcIcon = "images/iconToday/" + todayIcon + ".svg"; */

    $(".icon-meteo-today").attr("src", todaySrcIcon);
    $(".temp").text(todayTemp + "°");

    // Dynamic backbround
    if (todayIcon === "01d" || todayIcon === "02d") {
        $(".container-right").removeClass().addClass("bg-01d-02d container-right");
    } else if (todayIcon === "01n" || todayIcon === "02n") {
        $(".container-right").removeClass().addClass("bg-01n-02n container-right");
    } else if (todayIcon === "03d" || todayIcon === "03n" || todayIcon === "04d" || todayIcon === "04n") {
        $(".container-right").removeClass().addClass("bg-03d-03n-04d-04n container-right");
    } else if (todayIcon === "09d" || todayIcon === "10d") {
        $(".container-right").removeClass().addClass("bg-09d-10d container-right");
    } else if (todayIcon === "09n" || todayIcon === "10n") {
        $(".container-right").removeClass().addClass("bg-09n-10n container-right");
    } else if (todayIcon === "11d" || todayIcon === "11n") {
        $(".container-right").removeClass().addClass("bg-11d-11n container-right");
    } else if (todayIcon === "13d" || todayIcon === "13n") {
        $(".container-right").removeClass().addClass("bg-13d-13n container-right");
    } else if (todayIcon === "50d" || todayIcon === "50n") {
        $(".container-right").removeClass().addClass("bg-50d-50n container-right");
    }
}
/////////////////////////////////////////////////////////////// SUBMIT NEXT DAYS WEATHER
const successSubmitForcast = function (data) {
    const searchedCity = data.city.name
    const searchedCountry = data.city.country;
    const srcFlagCountry = "http://purecatamphetamine.github.io/country-flag-icons/3x2/" + searchedCountry + ".svg";

    tempsDays = [];
    iconDays = [];

    for (i = 1; i <= 4; i++) {
        tempsDays.push(Math.floor(data.list[i].main.temp));
        iconDays.push("images/iconFutur/" + data.list[i].weather[0].icon + ".svg");
        /* iconDays.push("http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png"); */
    }

    $(".loading").addClass("hidden");
    $("img").removeClass("hidden");
    $(".meteo-futur").removeClass("hidden");

    // Info
    $(".location").text(searchedCity + ", ");
    $(".country").text(searchedCountry);
    $(".flag").attr("src", srcFlagCountry);

    // Next days
    for (i = 1; i <= 4; i++) {
        $(".d" + i + "-temp").text(tempsDays[i - 1] + "°");
    }

    for (i = 1; i <= 4; i++) {
        $(".d" + i + "-img").attr("src", iconDays[i - 1]);
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////// API CALL SUBMIT

$("form").submit(e => {
    const apiKey = "0d19090abb5a0f99a36820be42fa1bcc";
    const inputVal = document.querySelector("input").value;

    const cityCapitalized = inputVal.charAt(0).toUpperCase() + inputVal.slice(1);

    setTimeout(() => { //clear input value
        document.querySelector("input").value = "";
    }, 10);

    document.querySelector(".location").innerHTML = cityCapitalized;

    const urlForecastCityName = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityCapitalized + "&lang=fr&appid=" + apiKey + "&units=metric&cnt=6";
    const urlCurrentWeatherCityName = "https://api.openweathermap.org/data/2.5/weather?q=" + cityCapitalized + "&lang=fr&appid=" + apiKey + "&units=metric";

    // Get futur info
    $.get(urlForecastCityName, successSubmitForcast).done(function () {
    })
        .fail(function () {
            window.location.replace("file:///C:/Users/32456/Desktop/FrontEnd/WeatherApp/error.html");
        })

    // Get TODAY info
    $.get(urlCurrentWeatherCityName, successSubmitWeather).done(function () {
    })
        .fail(function () {
            window.location.replace("file:///C:/Users/32456/Desktop/FrontEnd/WeatherApp/error.html");
        })
    e.preventDefault();
});
