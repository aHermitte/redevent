import pandas as pd
import numpy as np
import csv
import sys
import os
import matplotlib.pyplot as plt
from datetime import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from data.translatorDictionnaryKeolis import data

middle_tram_speed = 30


def create_complete_data_csv(): 

    date = []
    latitude = []
    longitude = []
    evenement = []
    material_consequences = []
    mild_impact_1 = []
    severe_impact_1 = []
    fatal_impact_1 = []
    mild_impact_2 = []
    severe_impact_2 = []
    fatal_impact_2 = []
    breakdown_V = []
    breakdown_POR = []
    breakdown_POI = []
    breakdown_M = []
    breakdown_DAE = []
    breakdown_DAA = []
    speed = []
    downtime = []
    conditions = []

    # Require Extrait_Keolis.csv
    with open('./data/Extrait_Keolis.csv') as csvfile:
        reader = csv.reader(csvfile, delimiter=',')
        next(reader)  
        for row in reader:
            timestamp = datetime.strptime(row[1], "%d/%m/%y %H:%M").timestamp()
            date.append(timestamp)

            latitude.append(float(row[2].replace(',', '.')) if row[2] else 0.0)
            longitude.append(float(row[3].replace(',', '.')) if row[3] else 0.0)
            evenement.append(int(row[4]))
            material_consequences.append(data["Conséquences_matérielles"].get(row[5], 0))

            mild_impact_1.append(int(row[6]) if row[6] else 0)
            severe_impact_1.append(int(row[7]) if row[7] else 0)
            fatal_impact_1.append(int(row[8]) if row[8] else 0)
            mild_impact_2.append(int(row[9]) if row[9] else 0)
            severe_impact_2.append(int(row[10]) if row[10] else 0)
            fatal_impact_2.append(int(row[11]) if row[11] else 0)

            breakdown_V.append(data[row[12]])
            breakdown_POR.append(data[row[13]])
            breakdown_POI.append(data[row[14]])
            breakdown_M.append(data[row[15]])
            breakdown_DAE.append(data[row[16]])
            breakdown_DAA.append(data[row[17]])

            speed.append(float(row[18].replace(',', '.')) if row[18] else middle_tram_speed)

            downtime.append(float(row[19]) if row[19] else 0.0)

            if row[20]:
                conditions.append(data["Conditions"].get(row[20], 0))
            else:
                conditions.append(0)

        

        matrix = np.column_stack((
            np.array(date),
            np.array(latitude),
            np.array(longitude),
            np.array(evenement),
            np.array(conditions),  
            np.array(mild_impact_1),            
            np.array(severe_impact_1),
            np.array(fatal_impact_1),
            np.array(mild_impact_2),
            np.array(severe_impact_2),
            np.array(fatal_impact_2),
            np.array(breakdown_V),
            np.array(breakdown_POR),
            np.array(breakdown_POI),
            np.array(breakdown_M),
            np.array(breakdown_DAE),
            np.array(breakdown_DAA),
            np.array(speed),
            np.array(downtime),
            np.array(material_consequences),           
        ))

        return matrix



# Utiliser la fonction existante pour créer les données
def prepare_data():
    # Appel à votre méthode existante
    matrix = create_complete_data_csv()  

    # Colonnes correspondantes
    columns = [
        "Date", "Latitude", "Longitude", "Événement", "Conditions", 
        "Impact_léger_1", "Impact_grave_1", "Impact_mortel_1",
        "Impact_léger_2", "Impact_grave_2", "Impact_mortel_2",
        "Panne_V", "Panne_POR", "Panne_POI", "Panne_M",
        "Panne_DAE", "Panne_DAA", "Vitesse", "Temps_arrêt", 
        "Conséquences_matérielles"
    ]

    # Créer un DataFrame pandas
    data = pd.DataFrame(matrix, columns=columns)
    
    # Convertir les colonnes numériques si nécessaire
    # numeric_cols = ["Date", "Latitude", "Longitude", "Vitesse", "Temps_arrêt"]
    # data[numeric_cols] = data[numeric_cols].apply(pd.to_numeric)

    return data

# Charger les données
data = prepare_data()

# Distribution des conditions
conditions_dist = data["Conditions"].value_counts(normalize=True)
# Extraire l'heure des incidents
data['Hour'] = pd.to_datetime(data['Date'], unit='s').dt.hour

# Fonction pour calculer la probabilité d'accident basée sur la condition et l'heure
def calculate_accident_probability_for_date_and_condition(date_input, condition_input):
    # Calcul de probabilité basée sur la condition
    prob_conditions = conditions_dist.get(condition_input, 0.01)

    # Extraire l'heure de la date d'entrée
    input_hour = datetime.fromtimestamp(date_input).hour
    
    # Distribution des accidents par heure
    accidents_by_hour = data.groupby('Hour')['Événement'].count()
    total_accidents = accidents_by_hour.sum()
    
    # Probabilité d'accident à l'heure donnée (par rapport aux heures précédentes)
    prob_hour = accidents_by_hour.get(input_hour, 0) / total_accidents if total_accidents > 0 else 0

    # Calcul de la probabilité globale d'accident
    prob_accident = prob_conditions * prob_hour
    
    # Probabilités de gravité en cas d'accident
    prob_gravity_light = data["Impact_léger_1"].mean() if not data.empty else 0.2
    prob_gravity_severe = data["Impact_grave_1"].mean() if not data.empty else 0.1
    prob_gravity_fatal = data["Impact_mortel_1"].mean() if not data.empty else 0.05
    
    # Probabilités pour le deuxième type d'impact
    prob_gravity_light_2 = data["Impact_léger_2"].mean() if not data.empty else 0.2
    prob_gravity_severe_2 = data["Impact_grave_2"].mean() if not data.empty else 0.1
    prob_gravity_fatal_2 = data["Impact_mortel_2"].mean() if not data.empty else 0.05

    return prob_accident, prob_gravity_light, prob_gravity_severe, prob_gravity_fatal, prob_gravity_light_2, prob_gravity_severe_2, prob_gravity_fatal_2

# Exemple d'utilisation
date_input = 1733472000 # (timestamp)
condition_input = 3  # Par exemple, condition "eau"
prob_accident, prob_gravity_light, prob_gravity_severe, prob_gravity_fatal, prob_gravity_light_2, prob_gravity_severe_2, prob_gravity_fatal_2 = calculate_accident_probability_for_date_and_condition(date_input, condition_input)

print(f"Probabilité d'accident: {prob_accident:.4f}")
print(f"Probabilité de gravité légère (impact 1): {prob_gravity_light:.4f}")
print(f"Probabilité de gravité sévère (impact 1): {prob_gravity_severe:.4f}")
print(f"Probabilité de gravité mortelle (impact 1): {prob_gravity_fatal:.4f}")
print(f"Probabilité de gravité légère (impact 2): {prob_gravity_light_2:.4f}")
print(f"Probabilité de gravité sévère (impact 2): {prob_gravity_severe_2:.4f}")
print(f"Probabilité de gravité mortelle (impact 2): {prob_gravity_fatal_2:.4f}")







######## Marche mais valeur fixe à des endroits #########


# # Distribution des conditions
# conditions_dist = data["Conditions"].value_counts(normalize=True)
# # Distribution des vitesses
# vitesse_dist = data["Vitesse"].value_counts(normalize=True)
# # Distribution des impacts
# impact_leger1_dist = data["Impact_léger_1"].value_counts(normalize=True)
# impact_grave1_dist = data["Impact_grave_1"].value_counts(normalize=True)
# impact_mortel1_dist = data["Impact_mortel_1"].value_counts(normalize=True)
# impact_leger2_dist = data["Impact_léger_2"].value_counts(normalize=True)
# impact_grave2_dist = data["Impact_grave_2"].value_counts(normalize=True)
# impact_mortel2_dist = data["Impact_mortel_2"].value_counts(normalize=True)

# # Fonction de calcul de probabilité d'accident en fonction de la condition et de la date
# def calculate_accident_probability_for_date_and_condition(date_input, condition_input):
#     # Calcul de probabilité basée sur la condition
#     prob_conditions = conditions_dist.get(condition_input, 0.01)
    
#     # Estimer la probabilité d'accident en fonction de la date (si c'est pertinent, sinon on met une probabilité fixe)
#     # Pour l'instant, on ne fait rien avec la date ici car tu veux que la condition ait plus de poids
#     prob_date = 0.05  # Ce peut être une probabilité de base pour la date (à ajuster selon le cas)

#     # Calculer la probabilité d'accident globale
#     prob_accident = prob_conditions * prob_date

#     # Probabilités de gravité en cas d'accident
#     prob_gravité_leger_1 = 0.1  # 10% de probabilité d'impact léger si accident
#     prob_gravité_grave_1 = 0.2   # 20% de probabilité d'impact grave
#     prob_gravité_mortel_1 = 0.05  # 5% de probabilité d'impact mortel

#     prob_gravité_leger_2 = 0.1
#     prob_gravité_grave_2 = 0.2
#     prob_gravité_mortel_2 = 0.05

#     # Retourner les probabilités
#     return prob_accident, prob_gravité_leger_1, prob_gravité_grave_1, prob_gravité_mortel_1, prob_gravité_leger_2, prob_gravité_grave_2, prob_gravité_mortel_2

# # Exemple d'utilisation : 
# date_input = "2024-12-06"  # Remplacer par la date entrée par l'utilisateur
# condition_input = 3  # Condition entre 0 et 6

# prob_accident, prob_gravité_leger_1, prob_gravité_grave_1, prob_gravité_mortel_1, prob_gravité_leger_2, prob_gravité_grave_2, prob_gravité_mortel_2 = calculate_accident_probability_for_date_and_condition(date_input, condition_input)

# # Afficher les résultats
# print(f"Probabilité d'accident: {prob_accident:.4f}")
# print(f"Probabilité d'impact léger (1): {prob_gravité_leger_1:.4f}")
# print(f"Probabilité d'impact grave (1): {prob_gravité_grave_1:.4f}")
# print(f"Probabilité d'impact mortel (1): {prob_gravité_mortel_1:.4f}")
# print(f"Probabilité d'impact léger (2): {prob_gravité_leger_2:.4f}")
# print(f"Probabilité d'impact grave (2): {prob_gravité_grave_2:.4f}")
# print(f"Probabilité d'impact mortel (2): {prob_gravité_mortel_2:.4f}")




