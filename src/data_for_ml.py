import csv
import numpy as np

import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from data.translatorDictionnary import data

def create_matrix():

    injuries = []
    crash_hour = []
    report_type = []
    num_units = []
    posted_speed_limit = []
    weather_condition = []
    lighting_condition = []
    roadway_surface_cond = []
    first_crash_type = []
    trafficway_type = []
    prim_contributory_cause = []
    lat = []
    long = []

    with open('./data/donnees_accidents_entiers.csv') as csvfile:
        reader = csv.reader(csvfile, delimiter=',')
        next(reader)  
        for row in reader:
            injuries.append([row[0]])
            crash_hour.append(int(row[2]))  
            report_type.append([row[3]]) 
            num_units.append(int(row[4]))  
            posted_speed_limit.append(int(row[5]))  
            weather_condition.append([row[6]]) 
            lighting_condition.append([row[7]]) 
            roadway_surface_cond.append([row[8]]) 
            first_crash_type.append([row[9]]) 
            trafficway_type.append([row[10]]) 
            prim_contributory_cause.append([row[11]]) 
            #lat.append(float(row[12])) 
            #long.append(float(row[13]))  


    matrix = np.column_stack((
        np.array(injuries),
        np.array(crash_hour),
        np.array(report_type), 
        np.array(num_units), 
        np.array(posted_speed_limit), 
        np.array(weather_condition), 
        np.array(lighting_condition), 
        np.array(roadway_surface_cond), 
        np.array(first_crash_type), 
        np.array(trafficway_type),      
        #np.array(lat),
        #np.array(long),
        np.array(prim_contributory_cause)
    ))

    np.random.shuffle(matrix)

    target = matrix[:, -1]
    matrix = matrix[:, :-1]

    return matrix, target

