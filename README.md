# How's the Weather ? 
*13/02/21*
## https://howstheweatherapp.herokuapp.com/

This web app gives current and forecast weather info.

## Motivation
I have already created a first weather app (https://my-weather-app-practice.herokuapp.com/), it was built with nodeJS, express and EJS (Backend). It only gives current weather for the searched cities. It was my first play around with API.

Now I wanted to upgrade the level, using frontend & backend, in design and fonctionalities :
- FR & EN language
- User's language detector
- User's location
- Searched cities
- Dark mode 
- Images that changes depending on the current weather (a way to travel a bit)
- Full reponsiveness app (laptop, tablet and smartphone)
- Full screen mode by double clicking

## Built With
- HTML, CSS
- JavaScript
- [jQuery](https://jquery.com/)
- [Nodejs](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [Bootstrap](https://getbootstrap.com/)

## API
From [OpenWeatherMap](https://openweathermap.org/) => 
For [Current](https://openweathermap.org/current) weather (location || submit)  &
For [Forecast](https://openweathermap.org/forecast5) weather (location || submit).

## Main issues I encountered 
1. When I wanted to add the darkmode (thanks to my brother burning eyes in front of my white background. Disclaimer : he was right). Here, the tricky part was to adjust the new forecast meteo icones each time the darkmode was switch on / off, and to stick to the darkmode icons when darkmode was left on. 
2. Plus, something was odd about the forecast info. I thought I wrote a code that would select mid day forecast info only. Then, why for some looked after cities, night meteo icons would appear ?
Well, I was retrieving the forecast info indicated at noon ("dt_txt": "2021-02-20 12:00:00" in the JSON file). I realized that this time indication was based on UTC-0, not the searched location. Futhermore, the first item from the JSON list of forecast info (every tree hours) changes depending on the current UTC-0 time. If it's 11h UTC, then the first item on the list would be at 12h, if it's 18h UTC-0, it would be 21h etc. 
Therefore, I had these two bugs to handle. To have a good view of the pattern, I search all UTC, and write all sort of tables (debug forecast weather.png). Then I was able to predict wich first item on the list I had to aim for according to the UTC-0 and the location UTC. handleForecastInfo is the function taking care of that. [line 282](https://github.com/FleurDll/Weather/blob/e9820fdd9619387266921176985d643de12dc5f2/index.js#L282) in index.js.



## Future improvement 
Reduce image load time. They are already compressed, which improved the problem a little.

## Preview
- Desktop <br>
![desktopPreviewDark](https://user-images.githubusercontent.com/75179031/108262289-07b6fb00-7165-11eb-9146-eea84f86acad.png)

- Tablet Darkmode <br>
![tabletPreviewWhite](https://user-images.githubusercontent.com/75179031/108262292-08e82800-7165-11eb-851a-8058d784016b.png)

- Smartphone <br>
![smartphonePreviewDark](https://user-images.githubusercontent.com/75179031/108262290-084f9180-7165-11eb-8e27-89dcf43edd23.jpg)





