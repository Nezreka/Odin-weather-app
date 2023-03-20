class WeatherApp {
    constructor() {
      this.zipcode = "97504";
      this.apiKey = "?key=6af0f975c36346a883845819231903&q=";
      this.baseURL = "http://api.weatherapi.com/v1";
      this.forecast = "/forecast.json";
      this.currentWeather = "/current.json";
      this.search = "/search.json";
      this.future = "/future.json";
      this.timeZone = "/timezone.json";
      this.setting = 0;
      this.setBackground();
      this.getWeather();
      this.setupZipcodeInput();
      this.setupToggleButtons();
    }
  
    get zipcode() {
      return this._zipcode;
    }
  
    set zipcode(value) {
      this._zipcode = value;
    }

    getTimeOfDay(index) {
        const time = index % 24;
        const suffix = time < 12 ? "am" : "pm";
        const hour = time % 12 || 12;
        return `${hour}:00${suffix}`;
    }

    buildHourly(data){
        const currentHour = new Date().getHours();
        for(let i = currentHour; i < data.forecast.forecastday[0].hour.length; i++){
            const card = document.createElement("div");
            card.classList.add("card");
    
            const time = document.createElement("h2");
            time.classList.add("card-time");
            time.textContent = `${this.getTimeOfDay(i)}`
            card.appendChild(time);
    
            const temp = document.createElement("h1");
            temp.classList.add("card-temp");
            temp.classList.add("number");
            temp.textContent = `${data.forecast.forecastday[0].hour[i].temp_f}°F`;
            card.appendChild(temp);

            const image = document.createElement("img");
            image.classList.add("card-image");
            image.src = `http:${data.forecast.forecastday[0].hour[i].condition.icon}`
            card.appendChild(image);
            document.querySelector(".forecast-hourly").append(card)
        }

    }

    getMonthAndDay(dateString) {
        const [year, month, day] = dateString.split("-");
        return `${month}/${day}`;
    }

    buildDaily(data){
        for(let i = 0; i < data.forecast.forecastday.length; i++){
            const card = document.createElement("div");
            card.classList.add("card");
    
            const time = document.createElement("h2");
            time.classList.add("card-time");
            time.textContent = `${this.getMonthAndDay(data.forecast.forecastday[i].date)}`
            card.appendChild(time);
    
            const temp = document.createElement("h1");
            temp.classList.add("card-temp");
            temp.classList.add("number");
            temp.textContent = `${data.forecast.forecastday[i].day.maxtemp_f}°F`;
            card.appendChild(temp);

            const tempLow = document.createElement("h3");
            tempLow.classList.add("card-temp-low");
            tempLow.classList.add("number");
            tempLow.textContent = `${data.forecast.forecastday[i].day.mintemp_f}°F`;
            card.appendChild(tempLow);

            const image = document.createElement("img");
            image.classList.add("card-image");
            image.src = `http:${data.forecast.forecastday[i].day.condition.icon}`
            card.appendChild(image);
            document.querySelector(".forecast-hourly").append(card)
        }
    }

    buildCards(data){
        if(!this.setting){
            this.buildHourly(data)
        }else{
            this.buildDaily(data)
        }
    }
  
    updateCurrentWeather(data) {
      console.log(data);
      document.querySelector(
        ".location-inject"
      ).textContent = `${data.location.name}, ${data.location.region}`;
      document.querySelector(
        ".condition-inject"
      ).textContent = data.current.condition.text;
      document
        .querySelector(".condition-icon-inject")
        .setAttribute("src", `http:${data.current.condition.icon}`);
      document.querySelector(
        ".current-temp-inject"
      ).textContent = `${data.current.temp_f}°F`;
      this.buildCards(data);
    }
  
    async getWeather() {
      const url = this.baseURL + this.forecast + this.apiKey + this.zipcode + "&days=7";
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data = await response.json();
        // display weather data on webpage
        this.updateCurrentWeather(data);
      } catch (error) {
        console.log(error);
        // handle error
      }
    }
  
    getRandomImage(images) {
      const imageType =
        Object.keys(images)[
          Math.floor(Math.random() * Object.keys(images).length)
        ];
      const imageNumber =
        Math.floor(Math.random() * images[imageType].length) + 1;
      return `${imageType}${imageNumber}.jpg`;
    }
  
    setBackground() {
      const backgroundImages = {
        sunset: ["sunset1.jpg", "sunset2.jpg", "sunset3.jpg", "sunset4.jpg"],
        sunrise: ["sunrise1.jpg", "sunrise2.jpg", "sunrise3.jpg", "sunrise4.jpg"],
        snow: ["snow1.jpg", "snow2.jpg", "snow3.jpg", "snow4.jpg"],
        rain: ["rain1.jpg", "rain2.jpg", "rain3.jpg", "rain4.jpg"],
        day: ["day1.jpg", "day2.jpg", "day3.jpg", "day4.jpg"],
      };
  
      const backgroundImage = this.getRandomImage(backgroundImages);
      const backgroundElement = document.getElementById("background-img");
      backgroundElement.src = `./images/${backgroundImage}`;
      backgroundElement.classList.add("fadeIn");
      setTimeout(() => {
        backgroundElement.classList.remove("fadeIn");
      }, 1000);
    }

    setupToggleButtons() {
        const hourlyButton = document.querySelector(".hourly-button");
        const dailyButton = document.querySelector(".daily-button");
        const forecastHourly = document.querySelector(".forecast-hourly");
        const forecastDaily = document.querySelector(".forecast-daily");
    
        hourlyButton.addEventListener("click", () => {
          if (this.setting !== 0) {
            hourlyButton.classList.add("clicked");
            dailyButton.classList.remove("clicked");
            forecastDaily.innerHTML = "";
            forecastHourly.innerHTML = "";
            this.setting = 0;
            this.getWeather();
          }
        });
    
        dailyButton.addEventListener("click", () => {
          if (this.setting !== 1) {
            dailyButton.classList.add("clicked");
            hourlyButton.classList.remove("clicked");
            forecastHourly.innerHTML = "";
            forecastDaily.innerHTML = "";
            this.setting = 1;
            this.getWeather();
          }
        });
    }
  
    setupZipcodeInput() {
        const forecastHourly = document.querySelector(".forecast-hourly");
        const forecastDaily = document.querySelector(".forecast-daily");
      const inputElement = document.querySelector("#zipcode-input");
      const formElement = inputElement.closest("form");
  
      formElement.addEventListener("submit", (event) => {
        event.preventDefault();
        this._zipcode = inputElement.value;
        forecastHourly.innerHTML = "";
        forecastDaily.innerHTML = "";
        this.getWeather();
      });
  
      inputElement.addEventListener("input", (event) => {
        const value = event.target.value.replace(/\D/g, "");
        event.target.value = value;
      });
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const weather = new WeatherApp();
  });
  