
# Redevent

Ce projet a été réalisé dans le cadre de la filière Génie Logiciel à l'ENSEIRB-Matmeca par des élèves de troisième année:

Killian Mannarelli,
Jules Braun,
Lucie Perrin,
Allan Denoce,
Arthur Hermitte,

# Manuel d'utilisation

## Setup sur Linux/MacOs
1) Cloner le projet avec la commande suivante : 
```bash
git clone https://github.com/aHermitte/redevent.git
```
Et se placer à la racine du répertoire cloné.
2) S'assurer d'avoir python et npm (NodeJs) correctement installés
3) Se placer dans le répertoire du projet

## Setup sur Windows

1) Installer git ou l'application Github Desktop afin de pouvoir cloner le projet.
2) Installer python3
3) Installer nodejs
```bash
winget install Schniz.fnm
# Relancer le terminal
fnm install 22
# La commande suivante doit être exécutée à chaque nouvelle ouverture du terminal ou bien placée dans le fichier de configuration powershell
fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression
```
4) Se placer dans le répertoire du projet

## Installation des dépendances

1) Modules pythons
Avec python dans un environnement virtuel
```bash
python3 -m venv venv
venv/bin/pip3 install -r requirements.txt
```
Ou bien directement 
```bash
pip3 install -r requirements.txt
```

2) Paquets nodejs
```bash
cd front
npm install
```
3) Ajouter le fichier csv contenant les données. Cette étape est indispensable pour le fonctionnement de l'application.
Placer le fichier dans le répertoire ```data/```

## Lancement de l'application
1) Lancer le client
```bash
npm run dev
```

2) Lancer le serveur dans un nouveau terminal

Avec python dans un environnement virtuel
```bash
venv/bin/python3 run.py
```
Ou bien directement
```bash
python3 run.py
```

