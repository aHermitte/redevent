# redevent
Projet REDEVENT

## Instructions de lancement

1) Cloner le projet avec la commande suivante : 
```bash
git clone https://github.com/aHermitte/redevent.git
```
Et se placer à la racine du répertoire cloné.

2) Lancer le serveur :
 - Installer les dépendances
```bash
python3 -m venv venv
venv/bin/pip3 install flask flask_cors requests
```
 - Lancer le serveur
```bash
venv/bin/python3 run.py
```
3) Lancer le client :
 - Installer les dépendances
```bash
cd front
npm install
```
 - Lancer le client
```bash
npm run dev
```

