const apiKey = "0d19090abb5a0f99a36820be42fa1bcc";

// Function to search time / date / next 4 days
let d = new Date();
let utc = d.getTime() + (d.getTimezoneOffset() * 60000);

function calcTime(offset) { // get time according to utc 
    let nd = new Date(utc + (3600000 * offset));
    const optionsLocalTime = {
        hour: "numeric"
    };
    const time = nd.toLocaleTimeString("fr-FR", optionsLocalTime);
    const timeSliced = time.slice(0, 2);
    return timeSliced;
}

function calcDate(offset) { // get date according to utc
    let nd = new Date(utc + (3600000 * offset));
    const optionsLocalDate = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    const dateComplete = (nd.toLocaleString("fr-FR", optionsLocalDate)).toUpperCase();
    $(".date").text(dateComplete);
}

// Weekday
function getNext4Days(offset) {
    let nd = new Date(utc + (3600000 * offset));
    const optionsLocalDate = {
        weekday: "long"
    };
    const currentDate = ((nd.toLocaleString("fr-FR", optionsLocalDate)).slice(0, 3)).toUpperCase();

    const weekday = ["DIM", "LUN", "MAR", "MER", "JEU", "VEN", "SAM"];

    const today = (day) => day == String(currentDate);
    const indexCurrentDay = weekday.findIndex(today);
    const indexFutur = [];

    // Get next days index
    for (i = 1; i <= 4; i++) {
        const newIndex = (indexCurrentDay + i) % 7;
        indexFutur.push(newIndex);
        $(".d" + i).text(weekday[indexFutur[i - 1]]);
    }
}
//////////////////////////////////////////////////////////////// Location current weather
const successLocationCurrent = function (data) {
    const currentUTC = (data.timezone) / 3600;

    calcDate(currentUTC); // get location date 
    getNext4Days(currentUTC);

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

    $(".loading").addClass("hidden");
    $("img").removeClass("hidden");
    $(".forecast-meteo").removeClass("hidden");
    $(".location").text(locationCity + ", ");
    $(".country").text(locationCountry);
    $(".flag-img").attr("src", locationFlag);

    // Get the right icon / temp according to UTC-0 
    const locationUTC = (data.city.timezone) / 3600;
    const locationData = data;

    tempsDays = []; // store the next 4 days temp
    iconDays = []; // store the next 4 days icons
    iconCode = [];  // for dark/white mode

    handleForecastInfo(locationUTC, locationData);

    for (i = 1; i <= 4; i++) {
        $(".d" + i + "-temp").text(tempsDays[i - 1] + "°");
        $(".d" + i + "-img").attr("src", iconDays[i - 1]);
    }
}

/////////////////////////////////////////// API CALL LOCATION
const optionsLocation = {
    enableHightAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

function success(pos) {
    $(".loading").removeClass("hidden");
    const latitude = pos.coords.latitude;
    const longitude = pos.coords.longitude;

    const urlForecastWeatherLatLong = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&units=metric&lang=fr&appid=" + apiKey;
    const urlCurrentWeatherLatLong = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&lang=fr&appid=" + apiKey + "&units=metric";

    // Get Current Weather
    $.get(urlCurrentWeatherLatLong, successLocationCurrent).done(function () {
    })
        .fail(function () {
            $('#myModal').modal('show');
        })

    // Get Forecast Weather
    $.get(urlForecastWeatherLatLong, successLocationForecast).done(function () {
    })
        .fail(function () {
            $('#myModal').modal('show');
        })
}

function error(err) {
    console.warn("ERREUR" + err.code + " " + err.message);
    $(".modal-body").text("Seule la recherche par ville est disponible. (" + err.message + ").");
    $('#myModal').modal('show');
    $(".loading").addClass("hidden");
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error, optionsLocation);
} else {
    $(".modal-body").text("La géolocalisation n'est pas supportée par ce browser.");
    $('#myModal').modal('show');
}

//////////////////////////////////////////////////////////////// Submit current weather
const successSubmitCurrent = function (data) {
    const localUTC = (data.timezone) / 3600;

    calcDate(localUTC); //get searched city date 
    getNext4Days(localUTC);

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

    $(".loading").addClass("hidden");
    $("img").removeClass("hidden");
    $(".forecast-meteo").removeClass("hidden");
    $(".location").text(searchedCity + ", ");
    $(".country").text(searchedCountry);
    $(".flag-img").attr("src", srcFlagCountry);

    // Get the right icon / temp according to UTC-0 
    const submitUTC = (data.city.timezone) / 3600;
    const submitData = data;

    tempsDays = []; // store the next 4 days temp
    iconDays = []; // store the next 4 days icons
    iconCode = [];  // for dark/white mode

    handleForecastInfo(submitUTC, submitData);

    for (i = 1; i <= 4; i++) {
        $(".d" + i + "-temp").text(tempsDays[i - 1] + "°");
        $(".d" + i + "-img").attr("src", iconDays[i - 1]);
    }
}
////////////////////////////////////////////////////////////////////////////////////// API CALL SUBMIT

$("form").submit(e => {
    const inputVal = $("#inputCity").val();
    const cityCapitalized = inputVal.charAt(0).toUpperCase() + inputVal.slice(1);
    $(".location").text(cityCapitalized);

    setTimeout(() => { //clear input value
        $("#inputCity").val("");
    }, 10);

    const urlForecastCityName = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityCapitalized + "&lang=fr&appid=" + apiKey + "&units=metric";
    const urlCurrentCityName = "https://api.openweathermap.org/data/2.5/weather?q=" + cityCapitalized + "&lang=fr&appid=" + apiKey + "&units=metric";

    // Get current info
    $.get(urlCurrentCityName, successSubmitCurrent).done(function () {
    })
        .fail(function () {
            window.location.replace("https://fleurdll.github.io/Weather/error");
        })

    // Get forecast info
    $.get(urlForecastCityName, successSubmitForecast).done(function () {
    })
        .fail(function () {
            window.location.replace("https://fleurdll.github.io/Weather/error");
        })
    e.preventDefault();
});

///////////////////////////////////// Deal with the right forecast info - "This is some serious GOURMET shit"
function handleForecastInfo(searchedUTC, usedData) {
    let d = new Date();
    let utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    const utc0Time = calcTime(0);

    function calcTime(offset) {
        let nd = new Date(utc + (3600000 * offset));
        const optionsLocalTime = {
            hour: "numeric"
        };
        const time = nd.toLocaleTimeString("fr-FR", optionsLocalTime);
        const timeSliced = time.slice(0, 2);
        return timeSliced;
    }

    if (utc0Time >= 21 && utc0Time < 0) { // first item 00H
        handleSearchedUTC(17);
    } else if (utc0Time >= 0 && utc0Time < 3) { //first item 3H
        handleSearchedUTC(16);
    } else if (utc0Time >= 3 && utc0Time < 6) { //first item 6H
        handleSearchedUTC(15);
    } else if (utc0Time >= 6 && utc0Time < 9) { //first item 9H
        handleSearchedUTC(14);
    } else if (utc0Time >= 9 && utc0Time < 12) { //first item 12H
        handleSearchedUTC(13);
    } else if (utc0Time >= 12 && utc0Time < 15) { //first item 15H
        handleSearchedUTC(12);
    } else if (utc0Time >= 15 && utc0Time < 18) { //first item 18H
        handleSearchedUTC(11);
    } else if (utc0Time >= 18 && utc0Time < 21) { //first item 21H
        handleSearchedUTC(10);
    }

    function handleSearchedUTC(listNumer) {
        if (searchedUTC === -14) {
            getRightIcon(listNumer);
        } else if (searchedUTC === -13 || searchedUTC === -12) {
            getRightIcon(listNumer - 1);
        } else if (searchedUTC === -11 || searchedUTC === -10 || searchedUTC === -9) {
            getRightIcon(listNumer - 2);
        } else if (searchedUTC === -8 || searchedUTC === -7 || searchedUTC === -6) {
            getRightIcon(listNumer - 3);
        } else if (searchedUTC === -5 || searchedUTC === -4 || searchedUTC === -3) {
            getRightIcon(listNumer - 4);
        } else if (searchedUTC === -2 || searchedUTC === -1 || searchedUTC === 0 || searchedUTC === 1) {
            getRightIcon(listNumer - 5);
        } else if (searchedUTC === 2 || searchedUTC === 3) {
            getRightIcon(listNumer - 6);
        } else if (searchedUTC === 4 || searchedUTC === 5 || searchedUTC === 6) {
            getRightIcon(listNumer - 7);
        } else if (searchedUTC === 7 || searchedUTC === 8 || searchedUTC === 9) {
            getRightIcon(listNumer - 8);
        } else if (searchedUTC === 10 || searchedUTC === 11 || searchedUTC === 12 || searchedUTC === 13 || searchedUTC === 14) {
            getRightIcon(listNumer - 9);
        }

        function getRightIcon(first) {
            for (i = first; i <= ((first + 8 * 3)); i += 8) {
                tempsDays.push(Math.floor(usedData.list[i].main.temp));
                iconCode.push(usedData.list[i].weather[0].icon);

                const backgroundColorWhileSubmit = $(".window").css("background-color");

                if (backgroundColorWhileSubmit === "rgb(18, 18, 18)") {
                    iconDays.push("images/darkmodeIcon/" + usedData.list[i].weather[0].icon + ".svg");
                } else {
                    iconDays.push("images/iconFutur/" + usedData.list[i].weather[0].icon + ".svg");
                }
            }
        }
    }
}

//////////////////////////////////// switch button Darkmode / Whitemode
$(".toggle-state").click(() => {
    const backgroundColor = $(".window").css("background-color");
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
    for (i = 0; i <= 3; i++) {
        iconDarkMode.push("images/darkmodeIcon/" + iconCode[i] + ".svg");
        $(".d" + (i + 1) + "-img").attr("src", iconDarkMode[i]);
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
        $(".d" + (i + 1) + "-img").attr("src", iconWhiteMode[i]);
    }
}

/////////////////////////////////////// Dynamic backbround
function getDynamicImage(todayIcon) {
    const backgroundColor = $(".window").css("background-color");
    const windowSize = $(window).width();

    if (windowSize > 730) {
        if (backgroundColor === "rgb(18, 18, 18)") {
            handleOverlay("dark-overlay");
        } else if (backgroundColor === "rgb(255, 255, 255)") {
            handleOverlay();
        }
    } else {
        $(".container-right").addClass("bg-image-smartphone"); // the image will not change in smartphone size
    }

    function handleOverlay(addOverlay) { // keep the dark overlay during darkmode while user submit several cities
        if (todayIcon === "01d" || todayIcon === "02d") {
            $(".container-right").removeClass().addClass("bg-01d-02d container-right").addClass(addOverlay);
        } else if (todayIcon === "01n" || todayIcon === "02n") {
            $(".container-right").removeClass().addClass("bg-01n-02n container-right").addClass(addOverlay);
        } else if (todayIcon === "03d" || todayIcon === "03n" || todayIcon === "04d" || todayIcon === "04n") {
            $(".container-right").removeClass().addClass("bg-03d-03n-04d-04n container-right ");
        } else if (todayIcon === "09d" || todayIcon === "10d") {
            $(".container-right").removeClass().addClass("bg-09d-10d container-right").addClass(addOverlay);
        } else if (todayIcon === "09n" || todayIcon === "10n") {
            $(".container-right").removeClass().addClass("bg-09n-10n container-right").addClass(addOverlay);
        } else if (todayIcon === "11d" || todayIcon === "11n") {
            $(".container-right").removeClass().addClass("bg-11d-11n container-right").addClass(addOverlay);
        } else if (todayIcon === "13d" || todayIcon === "13n") {
            $(".container-right").removeClass().addClass("bg-13d-13n container-right").addClass(addOverlay);
        } else if (todayIcon === "50d" || todayIcon === "50n") {
            $(".container-right").removeClass().addClass("bg-50d-50n container-right").addClass(addOverlay);
        }
    }
}
//////////////////////////////////// Full-Screen mode
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