var apiKey= "dc73b9f2be92cd0a2da9c582e9770b1c";

var cityInputEl = $("#cityinput");
var currentCity= $("#currentcity");
var windEl = $("#wind");
var uvEl = $("#UV");
var humidityEl = $("#humidity");
var temperatureEl = $("#temperature");
var imgEl=$("#icon");
var uvEl=$("#uvel");
var forecast=$(".forecast");
var searchBtn=$("#searchBtn");
var cityInput=$("#cityinput");
var city="New York";


$(document).ready(function() {
    function currentWeather() {
        var requestUrl= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid="+ apiKey;
        fetch(requestUrl) 
        .then (function(response){
            console.log("there is a ", response)
            return response.json();
        }).then (function(data){
            console.log(data);
            // convert kelvin to fahrenheit (rounded to tenth decimal)
            var temperatureF=Math.round((((data.main.temp-273.15)*1.8)+32)*10)/10;
            var currentYear = new Date().getFullYear(); 
            var currentMonth = new Date().getMonth() + 1; 
            var currentDay = new Date().getDate(); 
            var latitute = data.coord.lat; 
            var longitude = data.coord.lon; 
            var iconId= data.weather[0].icon; 

            // date (M/DD/YYYY)
            currentCity.text(data.name+"("+currentMonth+"/"+currentDay+"/"+currentYear+")"); 
            temperatureEl.text("temperature: "+temperatureF+"°F"); 
            humidityEl.text("humidity: "+data.main.humidity+"%"); 
            windEl.text("wind-speed: "+data.wind.speed+"MPH"); 
            imgEl.attr("src", "https://openweathermap.org/img/wn/"+iconId+".png");
            imgEl.attr("alt", data.weather[0].description); 
            imgEl.attr('id', "icon"); 
            
            // fetch request for UV
            var uvUrl= "https://api.openweathermap.org/data/2.5/uvi?lat="+latitute+"&lon="+longitude+"&appid="+apiKey;
            fetch(uvUrl) 
            .then (function (response) {
                console.log ("UV has a "+response);
                return response.json();
            })
            .then (function (data) {
                console.log(data);
                var currentUV= data.value;
                uvEl.text(currentUV);
                // change highlight color depending on how high the uv is
                if (currentUV<3) { 
                    uvEl.addClass("lowuv");
                } else if (currentUV<5) {
                    uvEl.addClass("moderateuv");
                } else if (currentUV<7) {
                    uvEl.addClass("highuv");
                } else {
                    uvEl.addClass("veryhighuv");
                }
            })
            var cityId= data.id;
            var futureUrl= "https://api.openweathermap.org/data/2.5/forecast?id="+cityId+"&appid="+apiKey;
            fetch(futureUrl)
            .then(function (response) {
                console.log (response);
                return response.json(); 
            })

            .then(function(data) {
                console.log(data);
                for (i=0;i<5;i++) {
                    // formatting the API call (date, img elements, temp, etc.)
                    var forecastIndex = i*8 + 4;
                    var indexDate=new Date(data.list[forecastIndex].dt*1000); 
                    var futureDay = indexDate.getDate(); 
                    var futureMonth = indexDate.getMonth() + 1; 
                    var futureYear = indexDate.getFullYear(); 
                    var forecastDiv = $("<div>"); 
                    forecastDiv.addClass("col bg-primary text-white ml-3 ml-b rounded");
                    forecast.append(forecastDiv); 

                    var forecastP = $("<p>");  
                    forecastP.text(futureMonth+"/"+futureDay+"/"+futureYear); 
                    forecastP.addClass("dayforecast"); 

                    var forecastImg = $("<img>"); 
                    forecastImg.attr("src", "https://openweathermap.org/img/wn/"+data.list[forecastIndex].weather[0].icon+".png") 
                    forecastImg.attr("alt", data.list[forecastIndex].weather[0].description); 

                    var forecastTemp = $("<p>"); 
                    var tempToF = Math.round((((data.list[forecastIndex].main.temp-273.15)*1.8)+32)*10)/10; 
                    forecastTemp.text("Temperature: " +tempToF+ "°F"); 
                    forecastTemp.addClass("forecasttemp"); 
                    
                    var forecastHum = $("<p>"); 
                    forecastHum.text("Humidity: "+data.list[forecastIndex].main.humidity + "%"); 
                    forecastHum.addClass("forecasthumidity"); 
                    forecastDiv.append(forecastP,forecastImg,forecastTemp,forecastHum); 
                }
            });
        });
    }
    currentWeather();
    $("#searchBtn").on("click", function() {
        console.log("hello");
        localStorage.setItem("city", $(cityInput).val());
        cityParse=(localStorage.getItem("city"));
        city=cityParse;
        console.log(city);
        $(".forecast").empty();
        currentWeather();
    });
})

