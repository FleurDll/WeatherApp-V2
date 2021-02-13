// Today's date
const optionsDate = {
    weekday: "long",
    day: "numeric",
    month: "long"
};
const dateComplete = new Date().toLocaleDateString("fr-FR", optionsDate);
const dateCompleteCapitalized = dateComplete.toUpperCase();

$(".date").text(dateCompleteCapitalized);

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

//////////////////////////////////////////////////////////////// Location current weather
const successLocationWeather = function (data) {
    const currentTemp = Math.floor(data.main.temp);
    const currentIcon = data.weather[0].icon;
    const currentSrcIcon = "images/iconSmile/" + currentIcon + ".svg";

    $(".icon-today-meteo").attr("src", currentSrcIcon);
    $(".temp").text(currentTemp + "°");


    getDynamicImage(currentIcon);
}

/////////////////////////////////////////////////////////////// Location forecast weather
const successLocationForecast = function (data) {
    const locationCity = (data.city.name).toUpperCase();
    const locationCountry = data.city.country;
    const locationFlag = "https://purecatamphetamine.github.io/country-flag-icons/3x2/" + locationCountry + ".svg";

    LocationTempForecast = [];
    LocationIconForecast = [];
    iconCode = [];  // for dark/white mode

    for (i = 8; i <= 32; i += 8) {
        LocationTempForecast.push(Math.floor(data.list[i - 1].main.temp));
        iconCode.push(data.list[i - 1].weather[0].icon);
        LocationIconForecast.push("images/iconFutur/" + data.list[i - 1].weather[0].icon + ".svg");
    }

    $(".loading").addClass("hidden");
    $("img").removeClass("hidden");
    $(".forecast-meteo").removeClass("hidden");
    $(".location").text(locationCity + ", ");
    $(".country").text(locationCountry);
    $(".flag-img").attr("src", locationFlag);

    for (i = 1; i <= 4; i++) {
        $(".d" + i + "-temp").text(LocationTempForecast[i - 1] + "°");
    }

    for (i = 1; i <= 4; i++) {
        $(".d" + i + "-img").attr("src", LocationIconForecast[i - 1]);
    }
    return iconCode;
}

///////////////////////////////////////////////////////////////////////////// API CALL LOCATION
const optionsLocation = {
    enableHightAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

function success(pos) {
    $(".loading").removeClass("hidden");
    const crd = pos.coords;
    const latitude = crd.latitude;
    const longitude = crd.longitude;
    const apiKey = "0d19090abb5a0f99a36820be42fa1bcc";

    const urlCurrentForecastLatLong = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&units=metric&lang=fr&appid=" + apiKey;
    const urlCurrentWeatherLatLong = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&lang=fr&appid=" + apiKey + "&units=metric";

    $.get(urlCurrentForecastLatLong, successLocationForecast).done(function () {
    })
        .fail(function () {
            $('#myModal').modal('show');
        })

    // Get TODAY info
    $.get(urlCurrentWeatherLatLong, successLocationWeather).done(function () {
    })
        .fail(function () {
            $('#myModal').modal('show');
        })
}

function error(err) {
    console.warn("ERREUR" + err.code + " " + err.message);
    $(".modal-body").text("Seul la recherche par ville est disponible. (" + err.message + ").");
    $('#myModal').modal('show');
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error, optionsLocation);
} else {
    alert("La géolocalisation n'est pas supportée par ce browser.");
}

//////////////////////////////////////////////////////////////// Submit current weather
const successSubmitCurrent = function (data) {

    const currentTemp = Math.floor(data.main.temp);
    const currentIcon = data.weather[0].icon;
    const currentSrcIcon = "images/iconSmile/" + currentIcon + ".svg";

    $(".icon-today-meteo").attr("src", currentSrcIcon);
    $(".temp").text(currentTemp + "°");

    getDynamicImage(currentIcon);
}
/////////////////////////////////////////////////////////////// Submit forcast weather
const successSubmitForecast = function (data) {
    const searchedCity = (data.city.name).toUpperCase();
    const searchedCountry = data.city.country;
    const srcFlagCountry = "https://purecatamphetamine.github.io/country-flag-icons/3x2/" + searchedCountry + ".svg";
    const backgroundColorWhileSubmit = $(".window").css("background-color");

    tempsDays = [];
    iconDays = [];
    iconCode = [];  // for dark/white mode

    for (i = 8; i <= 32; i += 8) {
        tempsDays.push(Math.floor(data.list[i - 1].main.temp));
        iconCode.push(data.list[i - 1].weather[0].icon);

        if (backgroundColorWhileSubmit === "rgb(18, 18, 18)") {
            iconDays.push("images/darkmodeIcon/" + data.list[i - 1].weather[0].icon + ".svg");
        } else {
            iconDays.push("images/iconFutur/" + data.list[i - 1].weather[0].icon + ".svg");
        }
    }

    $(".loading").addClass("hidden");
    $("img").removeClass("hidden");
    $(".forecast-meteo").removeClass("hidden");
    $(".location").text(searchedCity + ", ");
    $(".country").text(searchedCountry);
    $(".flag-img").attr("src", srcFlagCountry);

    for (i = 1; i <= 4; i++) {
        $(".d" + i + "-temp").text(tempsDays[i - 1] + "°");
    }

    for (i = 1; i <= 4; i++) {
        $(".d" + i + "-img").attr("src", iconDays[i - 1]);
    }

    return iconCode;
}
////////////////////////////////////////////////////////////////////////////////////// API CALL SUBMIT

$("form").submit(e => {
    const apiKey = "0d19090abb5a0f99a36820be42fa1bcc";
    const inputVal = $("#inputCity").val();
    const cityCapitalized = inputVal.charAt(0).toUpperCase() + inputVal.slice(1);

    setTimeout(() => { //clear input value
        $("#inputCity").val("");
    }, 10);

    $(".location").text(cityCapitalized);

    const urlForecastCityName = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityCapitalized + "&lang=fr&appid=" + apiKey + "&units=metric";
    const urlCurrentWeatherCityName = "https://api.openweathermap.org/data/2.5/weather?q=" + cityCapitalized + "&lang=fr&appid=" + apiKey + "&units=metric";

    // Get forecast info
    $.get(urlForecastCityName, successSubmitForecast).done(function () {
    })
        .fail(function () {
            window.location.replace("https://fleurdll.github.io/Weather/error");
        })

    // Get current info
    $.get(urlCurrentWeatherCityName, successSubmitCurrent).done(function () {
    })
        .fail(function () {
            window.location.replace("https://fleurdll.github.io/Weather/error");
        })
    e.preventDefault();
});

// switch button Darkmode / Whitemode
$(".toggle-state").click(() => {
    var backgroundColor = $(".window").css("background-color");
    if (backgroundColor === "rgb(255, 255, 255)") {
        darkMode();
    } else {
        whiteMode();
    }
});

function darkMode() {
    $(".window").css("background-color", "#121212");
    $(".body-index").css("backgroundColor", "#121212");
    $(".container-right").addClass("dark-overlay");
    $(".window").css("box-shadow", "0px 0px 51px -19px rgba(250, 250, 250, 0.25)");
    $(".location, .temp").css("color", "#A8A8A8");
    $(".country, .date, .forecast-day").css("color", "#606060");

    // Change icon forcast
    iconDarkMode = [];
    for (i = 0; i <= 4; i++) {
        iconDarkMode.push("images/darkmodeIcon/" + iconCode[i] + ".svg");
    }
    for (i = 1; i <= 4; i++) {
        $(".d" + i + "-img").attr("src", iconDarkMode[i - 1]);
    }
}

function whiteMode() {
    $(".window").css("background-color", "#ffffff");
    $(".body-index").css("backgroundColor", "#ffffff");
    $(".container-right").removeClass("dark-overlay");
    $(".window").css("box-shadow", "0px 0px 51px -19px rgba(0, 0, 0, 0.75)");
    $(".location, .temp").css("color", "#505050");
    $(".country, .date, .forecast-day").css("color", "#a2b0c1");

    // Change icon forcast
    iconWhiteMode = [];
    for (i = 0; i <= 4; i++) {
        iconWhiteMode.push("images/iconFutur/" + iconCode[i] + ".svg");
    }
    for (i = 1; i <= 4; i++) {
        $(".d" + i + "-img").attr("src", iconWhiteMode[i - 1]);
    }
}

// Dynamic backbround
function getDynamicImage(todayIcon) {

    const windowSize = $(window).width();

    if (windowSize > 730) {
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
    } else {
        $(".container-right").addClass("bg-image-smartphone");
    }
}

////////////////////// Full-Screen mode
function getFullscreenElement() {
    return document.fullscreenElement
        || document.webkitFullscreenElement
        || document.mozFullscreenElement
        || document.msFullscreenElement
}

function toggleFullscreen() {
    if (getFullscreenElement()) {
        document.exitFullscreen();
    } else {
        document.documentElement.requestFullscreen().catch((e) => {
            console.log(e);
        });
    }
}

document.addEventListener("dblclick", () => {
    toggleFullscreen();
});

$(document).ready(function () {
    var windowHeight = $(window).innerHeight();
    $('body').css({ 'height': windowHeight });
});