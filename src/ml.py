import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
import numpy as np
#from data_for_ml import create_matrix
from sklearn.preprocessing import LabelEncoder
from data_keolys_ml import create_complete_data_csv
from tensorflow.keras.regularizers import l2
#X, y = create_matrix()
from tensorflow.keras.layers import Dropout
import os
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"

X, y = create_complete_data_csv()
encoder = LabelEncoder()
y = encoder.fit_transform(y.flatten())  


y = tf.keras.utils.to_categorical(y, num_classes=np.max(y) + 1)

scaler = StandardScaler()
X = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2, shuffle=True)
print(X_train.shape, X_test.shape, y_train.shape, y_test.shape)



model = Sequential()
model.add(Dense(16, input_dim=X.shape[1], activation='relu', kernel_regularizer=l2(0.001)))
model.add(Dropout(0.2))  
model.add(Dense(8, activation='relu', kernel_regularizer=l2(0.001))) 
model.add(Dropout(0.2))  
model.add(Dense(1, activation='sigmoid'))  
model.add(Dropout(0.2))  
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])


history = model.fit(X_train, y_train, epochs=70, batch_size=8, validation_split=0.2, verbose=1)


loss, accuracy = model.evaluate(X_test, y_test, verbose=0)
print(f"Test Loss: {loss:.4f}")
print(f"Test Accuracy: {accuracy:.4f}")