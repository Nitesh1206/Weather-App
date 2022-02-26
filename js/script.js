 const timeEl = document.getElementById('time');
 const dateEl = document.getElementById('date');
 const currentWeatherEl = document.getElementById('current-weather');
 const timeZone = document.getElementById('time-zone');
 const countryEl = document.getElementById('country');
 const currentTempEl = document.getElementById('current-temp');
 const weatherForcastEl = document.getElementById('weather-forcast');

 const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
 const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
 
 const API_KEY = '7c30c96eceabab2c2595fca414e44b94';

 setInterval(() =>{
     const time = new Date();
     const month = time.getMonth();
     const day = time.getDay();
     const date = time.getDate();
     const hour = time.getHours();
     const hoursIn12HrsFormat = hour >= 13 ? hour % 12 : hour
     const minutes = time.getMinutes();
     const ampm = hour >= 12 ? 'PM' : 'AM'

     timeEl.innerHTML = (hoursIn12HrsFormat < 10 ? '0' + hoursIn12HrsFormat : hoursIn12HrsFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + `<span id="am-pm">${ampm}</span>`
     dateEl.innerHTML = days[day] + ' ' + date + ' ' + months[month]
 },1000);

 getWeatherData();
 function getWeatherData() {
     navigator.geolocation.getCurrentPosition((success) =>{
         console.log(success);

         let {latitude, longitude} = success.coords;
          
         fetch (`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data =>{
             console.log(data);
             showWeatherData(data);
         })

     })
 }

 function showWeatherData(data){
     let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;

        timeZone.innerHTML = data.timezone;
        countryEl.innerHTML = data.lat + 'N' + data.lon + "E"

        currentWeatherEl.innerHTML = 
        `<div class="weather-item">
            <div>Humidity</div>
            <div>${humidity}%</div>
         </div>
         <div class="weather-item">
            <div>pressure</div>
            <div>${pressure}</div>
         </div>
         <div class="weather-item">
            <div>Wind speed</div>
            <div>${wind_speed}</div>
         </div>
         <div class="weather-item">
            <div>Sunrise</div>
            <div>${window.moment(sunrise * 1000).format('HH:mm A')}</div>
         </div>
         <div class="weather-item">
            <div>Sunset</div>
            <div>${window.moment(sunset * 1000).format('HH:mm A')}</div>
         </div>`;

         let otherDayForcast = ''
         data.daily.forEach((day, idx) =>{
             if(idx == 0){
                    currentTempEl.innerHTML = `
                    <img src="/images/cloudy-day.png" alt="Weather Image" class="icon">
                    <div class="others">
                        <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                        <div class="temp">Night - ${day.temp.night}&#176; C</div>
                        <div class="temp">Day - ${day.temp.night}&#176; C</div>
                    </div>
                    ` 
             }
             else{
                 otherDayForcast += `
                 <div class="weather-forcast-item">
                    <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
                    <img src="/images/cloudy-day.png" alt="Weather Image" class="icon">
                    <div class="temp">Night - ${day.temp.night}&#176; C</div>
                    <div class="temp">Day - ${day.temp.day}&#176; C</div>
                </div> `
             }
         }) 

         weatherForcastEl.innerHTML = otherDayForcast;
}


