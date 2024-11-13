import csv
import numpy as np

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

    with open('./data/output_file.csv_Exemple_accidentologie.csv') as csvfile:
        reader = csv.reader(csvfile, delimiter=',')
        count = 0
        for row in reader:
            if(count != 0):
                injuries.append(int(row[0]))
                crash_hour.append(int(row[2]))
                report_type.append(int(row[3]))
                num_units.append(int(row[4]))
                posted_speed_limit.append(int(row[5]))
                weather_condition.append(int(row[6]))
                lighting_condition.append(int(row[7]))
                roadway_surface_cond.append(int(row[8]))
                first_crash_type.append(int(row[9]))
                trafficway_type.append(int(row[10]))
                prim_contributory_cause.append(int(row[11]))
                lat.append(int(row[12]))
                long.append(int(row[13]))

            count = count + 1

    data = np.column_stack = ((
        injuries,
        crash_hour,
        report_type, 
        num_units, 
        posted_speed_limit, 
        weather_condition, 
        lighting_condition, 
        roadway_surface_cond, 
        first_crash_type, 
        trafficway_type,      
        lat,
        long,
        prim_contributory_cause
    ))

    np.random.shuffle(data)

    target = data[:, -1]
    data = data[:, :-1]

    return data, target