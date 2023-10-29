//variables to define the API components
const queryURLCurrent = "https://api.openweathermap.org/data/2.5/weather?q=";
const queryURLForecast = "https://api.openweathermap.org/data/2.5/forecast?q=";
const APIKey = "&appid=8ccf05f501ea475aadec956092b99391";

//Retrieves search history from localStorage
function getSearchHistory() {
    return JSON.parse(localStorage.getItem('searchHistory')) || [];
}

//Saves any new city to your search history
function saveSearchHistory(cityName) {
    const searchHistory = getSearchHistory();
    searchHistory.unshift(cityName);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory.slice(0, 5)));
}

//Event listenr for the form subbmission
document.getElementById('cityForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const cityInput = document.getElementById('cityInput').value;

    const apiUrlCurrent = `${queryURLCurrent}${cityInput}&units=imperial${APIKey}`;
    const apiUrlForecast = `${queryURLForecast}${cityInput}&units=imperial${APIKey}`;

    fetch(apiUrlCurrent)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            saveSearchHistory(cityInput); 
        })
        .catch(error => {
            console.error('Error:', error);
        });

    fetch(apiUrlForecast)
        .then(response => response.json())
        .then(data => {
            displayForecast(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});


function displayCurrentWeather(data) {
    const cityName = data.name;
    const date = new Date(data.dt * 1000);
    const iconCode = data.weather[0].icon;
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    document.querySelector('#currentWeather h3').textContent = cityName;
    document.querySelector('#currentWeather p:nth-child(2)').textContent = `Date: ${date.toDateString()}`;
    document.querySelector('#currentWeather img').src = `https://openweathermap.org/img/w/${iconCode}.png`;
    document.querySelector('#currentWeather p:nth-child(4)').textContent = `Temperature: ${temperature}°F`;
    document.querySelector('#currentWeather p:nth-child(5)').textContent = `Humidity: ${humidity}%`;
    document.querySelector('#currentWeather p:nth-child(6)').textContent = `Wind Speed: ${windSpeed} mph`;
}

function displayForecast(data) {
    const forecastDays = data.list.slice(0, 5);

    forecastDays.forEach((day, index) => {
        const date = new Date(day.dt * 1000 + index * 24 * 60 * 60 * 1000);
        const iconCode = day.weather[0].icon;
        const temperature = day.main.temp;
        const windSpeed = day.wind.speed;
        const humidity = day.main.humidity;

        try {
            const forecastElement = document.querySelector(`.weather-icon-${index + 1}`);
            const forecastParent = forecastElement.parentElement;

            //Formats the date to mm/dd
            const month = date.getMonth() + 1;
            const dayOfMonth = date.getDate();
            const formattedDate = `${month.toString().padStart(2, '0')}/${dayOfMonth.toString().padStart(2, '0')}`;

            //updates forecast elements
            forecastParent.querySelector('h3').textContent = formattedDate;
            forecastElement.src = `https://openweathermap.org/img/w/${iconCode}.png`;
            forecastParent.querySelector('p:nth-child(3)').textContent = `Temperature: ${temperature}°F`;
            forecastParent.querySelector('p:nth-child(4)').textContent = `Wind Speed: ${windSpeed} mph`;
            forecastParent.querySelector('p:nth-child(5)').textContent = `Humidity: ${humidity}%`;
            forecastParent.querySelector('p:nth-child(6)').textContent = `Date: ${date.toDateString()}`;
        } catch (error) {
            //error handling
            console.error(`Error for day ${index + 1}:`, error);
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const searchHistory = getSearchHistory();
    const searchHistoryElement = document.getElementById('searchHistory');

    searchHistory.forEach(cityName => {
        const historyItem = document.createElement('div');
        historyItem.classList.add('search-history-item');
        historyItem.innerHTML = `
            <p>${cityName}</p>
            <button class="btn btn-sm btn-primary">View</button>
        `;
        searchHistoryElement.appendChild(historyItem);
    });
});
