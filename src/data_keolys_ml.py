import csv
import numpy as np

import sys
import os

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
            timestamp = datetime.strptime(row[1], "%d/%m/%Y %H:%M:%S").timestamp
            date.append(timestamp)

            latitude.append(row[2])
            longitude.append(row[3])
            evenement.append(row[4])
            material_consequences.append(data["Conséquences matérielles"][row[5]])

            mild_impact_1.append(row[6])
            severe_impact_1.append(row[7])
            fatal_impact_1.append(row[8])
            mild_impact_2.append(row[9])
            severe_impact_2.append(row[10])
            fatal_impact_2.append(row[11])

            breakdown_V.append(data[row[12]])
            breakdown_POR.append(data[row[13]])
            breakdown_POI.append(data[row[14]])
            breakdown_M.append(data[row[15]])
            breakdown_DAE.append(data[row[16]])
            breakdown_DAA.append(data[row[17]])

            if row[18]:
                speed.append(row[18])
            else:
                speed.append(middle_tram_speed)

            downtime.append(row[19])

            if row[20]:
                conditions.append(data["Conditions"][row[20]])
            else:
                conditions.append(0)
        

        matrix = np.column_stack((
            np.array(date),
            np.array(latitude),
            np.array(longitude),
            np.array(evenement),
            np.array(material_consequences),
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
            np.array(conditions),            
        ))

        np.random.shuffle(matrix)

        target = matrix[:, -1]
        matrix = matrix[:, :-1]

        return matrix, target