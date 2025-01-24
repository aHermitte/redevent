from datetime import datetime
import requests
from datetime import datetime, timedelta


class WeatherAPIcurrent:
    """ Class for fetching weather data from OpenWeatherMap API. """
    def __init__(self, api_key):
        """ Initialize the WeatherAPI with an API key. """
        self.api_key = api_key
        self.base_url = 'https://api.openweathermap.org/data/2.5/weather'

    def get_weather(self, latitude, longitude):
        """
        Get current weather data based on latitude and longitude.

        Args:
        - latitude (float): Latitude coordinate of the location.
        - longitude (float): Longitude coordinate of the location.

        Returns:
        - weather_data (dict): Dictionary containing weather information.
        """
        params = {
            'lat': latitude,
            'lon': longitude,
            'appid': self.api_key,
            'units': 'metric'  # Use metric units for temperature in Celsius
        }

        try:
            response = requests.get(self.base_url, params=params, timeout=10)
            response.raise_for_status()
            weather_data = response.json()
            return weather_data
        except requests.exceptions.RequestException as e:
            print(f"Error fetching weather data: {e}")
            return None



    def get_forecast_at_datetime(self, lat, lon, target_date):
        url = "https://api.openweathermap.org/data/2.5/forecast"
        params = {
            "lat": lat,
            "lon": lon,
            "appid": self.api_key,
            "units": "metric"
        }
        response = requests.get(url, params=params)
        forecast_data = response.json()
        
        #On vérifie d'abord que la date demandée n'est pas dans plus de 5 jours
        target_date = datetime.strptime(target_date, "%Y-%m-%d %H:%M:%S")
        if(target_date > datetime.now() + timedelta(days=5)):
            return "La date demandée est trop éloignée"
        

        # Filtrer par date et heure dans un intervale de 3h
        for forecast in forecast_data.get("list", []):
             forecast_datetime = datetime.strptime(forecast["dt_txt"], "%Y-%m-%d %H:%M:%S")
             if  forecast_datetime <= target_date < (forecast_datetime + timedelta(hours=3)):
                 return forecast

        return None  # Si aucune correspondance n'est trouvée
    
    
    def get_weather_conditions(self, lat, lon, target_date):
        good_data = self.get_forecast_at_datetime(lat, lon, target_date)
        target_date = datetime.strptime(target_date, "%Y-%m-%d %H:%M:%S")
        hour = target_date.hour
        
        if good_data is None:
            return 1 # Normal
        
        weather_conditions = good_data.get("weather", [])[0].get("main", "")
        if("Rain" in weather_conditions):
            if hour >= 22 or hour <= 6:
                return 5 #Nuit + Eau
            return 3 #Eau
        else :
            if hour >= 22 or hour <= 6:
                return 4 #Nuit
            return 1 #Normal
            
