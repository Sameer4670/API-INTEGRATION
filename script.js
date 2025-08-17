class WeatherApp {
    constructor() {
      this.cityInput = document.getElementById("cityInput")
      this.checkWeatherBtn = document.getElementById("checkWeatherBtn")
      this.weatherResult = document.getElementById("weatherResult")
      this.loadingSpinner = document.getElementById("loadingSpinner")
      this.errorMessage = document.getElementById("errorMessage")
      this.weatherAnimations = document.getElementById("weatherAnimations")
  
      this.initEventListeners()
    }
  
    initEventListeners() {
      this.checkWeatherBtn.addEventListener("click", () => this.checkWeather())
      this.cityInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.checkWeather()
        }
      })
  
      // Add input animation
      this.cityInput.addEventListener("focus", () => {
        this.cityInput.style.transform = "scale(1.02)"
      })
  
      this.cityInput.addEventListener("blur", () => {
        this.cityInput.style.transform = "scale(1)"
      })
    }
  
    async checkWeather() {
      const city = this.cityInput.value.trim()
  
      if (!city) {
        this.showError("Please enter a city name!")
        return
      }
  
      this.showLoading()
  
      try {
        // Simulate API call with mock data
        const weatherData = await this.fetchWeatherData(city)
        this.displayWeather(weatherData)
        this.showWeatherAnimation(weatherData.weather)
      } catch (error) {
        this.showError("City not found. Please try again!")
      }
    }
  
    async fetchWeatherData(city) {
      // Use OpenWeatherMap API for live weather data
      const apiKey = "7c3169634c0869f2fadec31ea198d211";
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      // Map OpenWeatherMap data to the format used in the app
      return {
        city: data.name,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
        weather: this.mapWeatherType(data.weather[0].main),
        description: data.weather[0].description,
      };
    }

    mapWeatherType(main) {
      // Map OpenWeatherMap weather types to app's types
      const mapping = {
        Clear: "sunny",
        Rain: "rainy",
        Drizzle: "rainy",
        Thunderstorm: "rainy",
        Clouds: "cloudy",
        Snow: "snow",
        Mist: "cloudy",
        Smoke: "cloudy",
        Haze: "cloudy",
        Dust: "cloudy",
        Fog: "cloudy",
        Sand: "cloudy",
        Ash: "cloudy",
        Squall: "rainy",
        Tornado: "rainy",
      };
      return mapping[main] || "sunny";
    }
  
    getWeatherDescription(weather) {
      const descriptions = {
        sunny: "clear sky",
        rainy: "light rain",
        cloudy: "partly cloudy",
        snow: "light snow",
      }
      return descriptions[weather] || "clear sky"
    }
  
    displayWeather(data) {
      document.getElementById("cityName").textContent = data.city
      document.getElementById("temperature").textContent = `${data.temperature}°C`
      document.getElementById("weatherIcon").textContent = this.getWeatherIcon(data.weather)
      document.getElementById("weatherDescription").textContent = data.description
      document.getElementById("feelsLike").textContent = `${data.feelsLike}°C`
      document.getElementById("humidity").textContent = `${data.humidity}%`
      document.getElementById("windSpeed").textContent = `${data.windSpeed} km/h`
  
      this.hideLoading()
      this.hideError()
      this.weatherResult.classList.remove("hidden")
  
      // Change background based on weather
      this.changeBackground(data.weather)
    }
  
    getWeatherIcon(weather) {
      const icons = {
        sunny: "☀️",
        rainy: "🌧️",
        cloudy: "☁️",
        snow: "❄️",
      }
      return icons[weather] || "☀️"
    }
  
    changeBackground(weather) {
      const backgrounds = {
        sunny: "linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)",
        rainy: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
        cloudy: "linear-gradient(135deg, #ddd6fe 0%, #8b5cf6 100%)",
        snow: "linear-gradient(135deg, #e3f2fd 0%, #90caf9 100%)",
      }
  
      document.body.style.background = backgrounds[weather] || backgrounds["sunny"]
    }
  
    showWeatherAnimation(weather) {
      // Hide all animations first
      const animations = this.weatherAnimations.querySelectorAll(".sun, .rain, .clouds, .snow")
      animations.forEach((animation) => animation.classList.add("hidden"))
  
      // Show relevant animation
      const animationClass =
        weather === "sunny"
          ? ".sun"
          : weather === "rainy"
            ? ".rain"
            : weather === "cloudy"
              ? ".clouds"
              : weather === "snow"
                ? ".snow"
                : ".sun"
  
      const animation = this.weatherAnimations.querySelector(animationClass)
      if (animation) {
        animation.classList.remove("hidden")
      }
    }
  
    showLoading() {
      this.weatherResult.classList.add("hidden")
      this.errorMessage.classList.add("hidden")
      this.loadingSpinner.classList.remove("hidden")
    }
  
    hideLoading() {
      this.loadingSpinner.classList.add("hidden")
    }
  
    showError(message) {
      this.hideLoading()
      this.weatherResult.classList.add("hidden")
      this.errorMessage.querySelector("p").textContent = message
      this.errorMessage.classList.remove("hidden")
  
      // Shake animation for error
      this.errorMessage.style.animation = "shake 0.5s ease-in-out"
      setTimeout(() => {
        this.errorMessage.style.animation = ""
      }, 500)
    }
  
    hideError() {
      this.errorMessage.classList.add("hidden")
    }
  }
  
  // Add shake animation for errors
  const style = document.createElement("style")
  style.textContent = `
      @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
      }
  `
  document.head.appendChild(style)
  
  // Initialize the weather app
  document.addEventListener("DOMContentLoaded", () => {
    new WeatherApp()
  })
  
  // Add some interactive effects
  document.addEventListener("mousemove", (e) => {
    const backgroundText = document.querySelector(".background-text")
    const x = (e.clientX / window.innerWidth) * 100
    const y = (e.clientY / window.innerHeight) * 100
  
    backgroundText.style.transform = `translate(-50%, -50%) translate(${x * 0.1}px, ${y * 0.1}px)`
  })
  
  // Add particle effect on button click
  document.addEventListener("click", (e) => {
    if (e.target.matches(".weather-btn") || e.target.closest(".weather-btn")) {
      createParticles(e.clientX, e.clientY)
    }
  })
  
  function createParticles(x, y) {
    for (let i = 0; i < 6; i++) {
      const particle = document.createElement("div")
      particle.style.cssText = `
              position: fixed;
              width: 6px;
              height: 6px;
              background: #667eea;
              border-radius: 50%;
              pointer-events: none;
              z-index: 1000;
              left: ${x}px;
              top: ${y}px;
          `
  
      document.body.appendChild(particle)
  
      const angle = (Math.PI * 2 * i) / 6
      const velocity = 100
      const vx = Math.cos(angle) * velocity
      const vy = Math.sin(angle) * velocity
  
      let opacity = 1
      let posX = 0
      let posY = 0
  
      const animate = () => {
        posX += vx * 0.02
        posY += vy * 0.02
        opacity -= 0.02
  
        particle.style.transform = `translate(${posX}px, ${posY}px)`
        particle.style.opacity = opacity
  
        if (opacity > 0) {
          requestAnimationFrame(animate)
        } else {
          particle.remove()
        }
      }
  
      animate()
    }
  }
  