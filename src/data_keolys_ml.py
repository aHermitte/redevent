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
            timestamp = datetime.strptime(row[1], "%d/%m/%y %H:%M").timestamp()
            date.append(timestamp)

            latitude.append(float(row[2].replace(',', '.')) if row[2] else 0.0)
            longitude.append(float(row[3].replace(',', '.')) if row[3] else 0.0)
            evenement.append(int(row[4]))
            material_consequences.append(data["Conséquences_matérielles"].get(row[5], 0))

            mild_impact_1.append(int(row[6]) if row[6] else -1)
            severe_impact_1.append(int(row[7]) if row[7] else -1)
            fatal_impact_1.append(int(row[8]) if row[8] else -1)
            mild_impact_2.append(int(row[9]) if row[9] else -1)
            severe_impact_2.append(int(row[10]) if row[10] else -1)
            fatal_impact_2.append(int(row[11]) if row[11] else -1)

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

        np.random.shuffle(matrix)

        target = matrix[:, -1]
        matrix = matrix[:, :-1]

        return matrix, target

m, t = create_complete_data_csv()

print(m.shape)
print(t.shape)