const form = document.querySelector("form");
const city = document.querySelector("#city");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetchData(city.value);
});

async function fetchData(city) {
  const cityData = await fetchCityData(city);

  const weatherData = await fetchWeatherData(
    cityData.latitude,
    cityData.longitude
  );

  // herosections Cityname & tempureture
  const cityName = document.querySelector(".city-name");
  cityName.textContent = city;
  const temperature = document.querySelector(".temperature");
  temperature.textContent = weatherData.temperature;

  const countryData = document.querySelector(".country .data-column");
  countryData.textContent = cityData.country;
  const timezoneData = document.querySelector(".timezone .data-column");
  timezoneData.textContent = cityData.timezone;
  const populationData = document.querySelector(".population .data-column");
  populationData.textContent = cityData.population;
  const low = document.querySelector(".low");
  low.textContent = `Low: ${weatherData.tomorrow.minTemp}`;
  const high = document.querySelector(".high");
  high.textContent = `High: ${weatherData.tomorrow.maxTemp}`;

  // show city info
  const container = document.querySelector(".container");
  container.classList.remove("hidden");
  // is day or night
  const body = document.querySelector("body");
  if (weatherData.isDay === 1) {
    body.classList.add("is_day");
    body.classList.remove("is_night");
  } else {
    body.classList.add("is_night");
    body.classList.remove("is_day");
  }

  //   const tomorrowMaxTemp = document.querySelector(".tomorrow-max-temp .data-column");
  //   tomorrowMaxTemp.textContent = weatherData.tomorrow.maxTemp;
  //   const tomorrowMinTemp = document.querySelector(".tomorrow-min-temp .data-column");
  //   tomorrowMinTemp.textContent = weatherData.tomorrow.minTemp;
}

// date 1 datetime 0 = night
async function fetchCityData(city) {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
    );
    const data = await response.json();
    return {
      country: data.results[0].country,
      timezone: data.results[0].timezone,
      population: data.results[0].population,
      latitude: data.results[0].latitude,
      longitude: data.results[0].longitude,
    };
  } catch (error) {
    console.error("Error fetching city data:", error);
    return nil;
  }
}

async function fetchWeatherData(latitude, longitude) {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
    );
    const data = await response.json();
    return {
      isDay: data.current.is_day,
      temperature: `${data.current.temperature_2m} ${data.current_units.temperature_2m}`,
      rain: data.current.rain,
      showers: data.current.showers,
      tomorrow: {
        maxTemp: `${data.daily.temperature_2m_max[0]} ${data.daily_units.temperature_2m_max}`,
        minTemp: `${data.daily.temperature_2m_min[0]} ${data.daily_units.temperature_2m_min}`,
      },
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return nil;
  }
}
