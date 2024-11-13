#import tensorflow as tf
#from tensorflow.keras.models import Sequential
#from tensorflow.keras.layers import Dense
from sklearn.model_selection import train_test_split
#from sklearn.preprocessing import StandardScaler
import numpy as np
import csv 
from data_for_ml import create_matrix

X, y = create_matrix()

scaler = StandardScaler()
X = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.3, shuffle=False)








