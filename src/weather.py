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


    def get_weather_at_date(self, latitude, longitude, date):
        """
        Get weather data based on latitude and longitude at a specific date (5 days after current date maximum).

        Args:
        - latitude (float): Latitude coordinate of the location.
        - longitude (float): Longitude coordinate of the location.
        - date (string)

        Returns:
        - city information + average weather (array): Array containing weather prediction at the date in parameter.
        """

        weather_data = get_weather(self, latitude, longitude)

        # Get "List" part of the Json
        forecast_list = weather_data.get("list", [])

        # Convert date to datetime
        target_date = datetime.strptime(date, "%Y-%m-%d %H:%M:%S")

        # Initialize block before and after the date in parameter
        before_block = None
        after_block = None

        # Find those blocks
        for forecast in forecast_list:
            forecast_date = datetime.strptime(forecast["dt_txt"], "%Y-%m-%d %H:%M:%S")

            if forecast_date <= target_date:
                before_block = forecast
            elif forecast_date > target_date and after_block is None:
                after_block = forecast
                break

        if not before_block or not after_block:
            raise ValueError("Impossible to find blocks before and after the dte in parameter.")

        # Initialize average block
        averaged_block = {}

        for key in before_block.keys():
            # Average of numeral values
            if isinstance(before_block[key], (int, float)) and isinstance(after_block[key], (int, float)):
                averaged_block[key] = (before_block[key] + after_block[key]) / 2
            elif isinstance(before_block[key], dict) and isinstance(after_block[key], dict):
                averaged_block[key] = {
                    sub_key: (before_block[key][sub_key] + after_block[key][sub_key]) / 2
                    for sub_key in before_block[key]
                    if isinstance(before_block[key][sub_key], (int, float)) and isinstance(after_block[key][sub_key], (int, float))
                }
            else:
                # Text values : we keep value of before_block
                averaged_block[key] = before_block[key]

        # Get city values
        city_data = weather_data.get("city", {})

        # Return city values and the average block
        return city_data | averaged_block


