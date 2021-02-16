# How's the Weather ? 
*13/02/21*
https://fleurdll.github.io/Weather/

This web app gives current and forecast weather info.

## Motivation
I have already created a first weather app (https://my-weather-app-practice.herokuapp.com/), it was built with nodeJS, express and EJS (Backend therefore). It only gives current weather for the searched cities. It was my first play around with API.

Now I wanted to upgrade the level using Frontend only, both in design and fonctionalities :
- User's location
- Searched cities
- Dark mode 
- Images that changes depending on the current weather
- Full reponsiveness app (laptop, tablet and smartphone)

## Built With
- HTML, CSS
- JavaScript
- [jQuery](https://jquery.com/)
- [Bootstrap](https://getbootstrap.com/)

## API
From [OpenWeatherMap](https://openweathermap.org/) => 
For [Current](https://openweathermap.org/current) weather (location || submit)  &
For [Forecast](https://openweathermap.org/forecast5) weather (location || submit) 

## Main issues I encountered :
1. When I wanted to add the darkmode (thanks to my brother burning eyes in front of my white background. Disclaimer : he was right). Here the tricky part was to adjust the new forecast meteo icones each time the darkmode was switch on / off, and to stick to the darkmode icons when darkmode was left on. 
2. Plus, something was odd about the forecast info. I though I wrote a code that would select mid day forecast info only. Than, why for some searched cities, night meteo icons would appears ?
Well, I was retrieving the forecast info indicated at noon ("dt_txt": "2021-02-20 12:00:00" in the JSON file). I realized that this time indication was based on UTC-0, not the searched location. Else, the first item from the JSON list of forecast info (every tree hours), change depending on the current UTC-0 time. If it's 11h UTC, then the first item on the list would be at 12h, if it's 18h UTC-0, it would be 21h etc. 
Therefore, I had these two bug to handle. To have a good view of the pattern, I search all UTC, and write all sort of tables (Debug forecast weather.odt). Then I was able to predict wich first item on the list I had to aim for according to the UTC-0 and the location UTC. handleForecastInfo is the function taking care of that. line 215.
