// should contain contents of local storage at key "historyStorage"
var historyStorage = localStorage.getItem("historyStorage");

// checks for empty storage and fills the history list with items
if (typeof historyStorage == "string") {
    var hist = historyStorage.split(",");
    for (var i = hist.length - 1; i >= 0; i--) {
        if (hist[i].length > 0) {
            var listEl = $('<li>');
            var buttonEl = $('<button>');
            listEl.addClass('list-group-item cityHistory')
            buttonEl.addClass("cityButton").text(hist[i]);
            buttonEl.appendTo(listEl);
            listEl.appendTo($('#history'));
        }
    }
} else {
    // Sets empty storage as just an empty string
    historyStorage = "";
}

// Fetch weather data from openweathermap.org using their api and key
// Displays results on the web page
function fetchWeather(city) {

    // Current weather api pull
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=c7edcd49d6f0c8e1959bb9f207d5c8be', {
        cache: 'reload',
    })
        .then((response) => response.json())
        .then(function (data) {
            console.log(data);
            // Ensures data is not null
            if (data) {
               
                // Code for invalid city name
                if (data.cod == '404') {
                    $("#city").text(data.message);

                    // Successful pull of weather data for the city 
                } else if (data.cod == "200") {

                    // Update the weather page with data from the api
                    $("#city").text(data.name + " (" + dayjs().format('M/D/YYYY') + ") ");
                    $("#icon").attr('src', "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
                    $("#temp").text("Temp: " + convertKtoF(data.main.temp).toFixed(2) + " °F");
                    $("#wind").text("Wind: " + data.wind.speed + " MPH");
                    $("#humi").text("Humidity: " + data.main.humidity + " %");

                    // Saves NEW cities to the history section and localStorage
                    if (!historyStorage.includes(data.name)) {

                        // Adds the new city to the list of cities
                        historyStorage += data.name + ",";

                        // Adds a list with a button into the history section
                        var listEl = $('<li>');
                        var buttonEl = $('<button>');
                        listEl.addClass('list-group-item cityHistory')
                        buttonEl.addClass("cityButton").text(data.name);
                        buttonEl.appendTo(listEl);
                        listEl.appendTo($('#history'));

                        // Updates the localStorage with the new list of cities
                        localStorage.setItem("historyStorage", historyStorage);
                    }
                }
            }
        });

    // 5 day weather forecast pull
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=c7edcd49d6f0c8e1959bb9f207d5c8be', {
        cache: 'reload',
    })
        .then((response) => response.json())
        .then(function (data) {
            if (data) {
                //list[3], [11], [19], [27], [35] - specific position of the forecast for noon of the next 5 days (oneweathermap has hours set in 3 hours intervals)
                if (data.cod == "200") {
                    // Get current date
                    var day = dayjs();

                    // Updates all 5 forecast data
                    for (var i = 0; i < 5; i++) {
                        $("#date" + i).text(day.add(i + 1, 'day').format('M/D/YYYY'));
                        $("#icon" + i).attr('src', "http://openweathermap.org/img/w/" + data.list[3 + (i * 8)].weather[0].icon + ".png");
                        $("#temp" + i).text("Temp: " + convertKtoF(data.list[3 + (i * 8)].main.temp).toFixed(2) + " °F");
                        $("#wind" + i).text("Wind: " + data.list[3 + (i * 8)].wind.speed + " MPH");
                        $("#humi" + i).text("Humidity: " + data.list[3 + (i * 8)].main.humidity + " %");
                        console.log(data.list)
                    }
                }
            }
        });
}

$( "current" ).css( {"background-image" : "url(skyBGgrass (1).jpg )"} );

// Convert kelvin to fahrenheit
function convertKtoF(kelvin) {
    return (((kelvin - 273.15) * 9) / 5) + 32;
}

// AddeventListener to search button
$("#search").on('click', function () {
    if ($("#cityName").val().length > 0) {
        fetchWeather($("#cityName").val());
    }
});

// Add event listener to the history list buttons
$(".cityButton").on('click', function (e) {
    e.preventDefault();
    if (e.target.innerText.length > 0) {
        fetchWeather(e.target.innerText);
    }
});

