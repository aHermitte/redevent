import pandas as pd
import numpy as np
import csv
import sys
import os
import matplotlib.pyplot as plt
from datetime import datetime
from scipy import stats
from math import radians, cos, sin, sqrt, atan2

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from data.translatorDictionnaryKeolis import data

# Fonction pour calculer la distance entre deux points géographiques (haversine)
def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Rayon moyen de la Terre en km
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c

# Ajout d'un intervalle de confiance
def confidence_interval(p, n, confidence=0.95):
    if n == 0:
        return (0, 0)
    se = np.sqrt(p * (1 - p) / n)
    z = stats.norm.ppf((1 + confidence) / 2)
    lower = max(p - z * se, 0)
    upper = min(p + z * se, 1)
    return (lower, upper)

def create_complete_data_csv():
    middle_tram_speed = 30
    data_list = []
    
    with open('./data/Extrait_Keolis.csv') as csvfile:
        reader = csv.reader(csvfile, delimiter=',')
        next(reader)  
        for row in reader:
            timestamp = datetime.strptime(row[1], "%d/%m/%y %H:%M").timestamp()
            
            data_list.append([
                timestamp,
                float(row[2].replace(',', '.')) if row[2] else 0.0,
                float(row[3].replace(',', '.')) if row[3] else 0.0,
                int(row[4]),
                data["Conditions"].get(row[20], 0) if row[20] else 0
            ])
    
    return np.array(data_list)

def prepare_data():
    matrix = create_complete_data_csv()
    columns = ["Date", "Latitude", "Longitude", "Événement", "Conditions"]
    return pd.DataFrame(matrix, columns=columns)

def calculate_accident_probability_normal(date_input, condition_input, lat, lon, confidence = 0.95):
    data = prepare_data()
    data['Hour'] = pd.to_datetime(data['Date'], unit='s').dt.hour
    
    nearby_data = data[data.apply(lambda row: haversine(row['Latitude'], row['Longitude'], lat, lon) <= 1, axis=1)]
    
    if nearby_data.empty:
        return 0.0000, 0.0000, 0.0000
    
    mean_accidents = nearby_data['Événement'].mean()
    std_accidents = nearby_data['Événement'].std() if len(nearby_data) > 1 else 0
    
    prob_accident = round(stats.norm.cdf(1, loc=mean_accidents, scale=std_accidents), 6)
    ci_lower, ci_upper = confidence_interval(prob_accident, len(nearby_data), confidence)
    
    return prob_accident, ci_lower, ci_upper

# Exemple d'utilisation
date_input = 1733472000
condition_input = 3 # condition "eau"
latitude = 44.794171
longitude = -0.635021
confidence = 0.95
prob_accident, ci_lower, ci_upper = calculate_accident_probability_normal(date_input, condition_input, latitude, longitude, confidence)

print(f"Probabilité d'accident: {prob_accident:.4f} (95% CI: [{ci_lower:.4f}, {ci_upper:.4f}])")




