var history = localStorage.getItem("history");

if (history){
    history = history.split(",");
    for (i=history.length-1; i>=0; i--){
        var listEl = $('<li>');
        listEl.addClass('list-group-item cityHistory').text(history[i]);
        listEl.appendTo($('#history'));
    }
}else{
    history = [];
}

function fetchWeather(city) {
    fetch('https://api.openweathermap.org/data/2.5/forecast?q={'+ city +'}&appid={c7edcd49d6f0c8e1959bb9f207d5c8be}', {
        cache: 'reload',
        })
        .then((response) => response.json())
        .then(function (data) {
        console.log(data);
        });
}