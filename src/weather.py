import requests

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

