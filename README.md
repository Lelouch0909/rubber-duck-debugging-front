# 🦆 Rubber Duck Debugging - Frontend

**Interface de discussion avec un canard IA pour déboguer son code**  
*Développé avec Next.js, Tailwind CSS et TypeScript.*  
*[Backend Spring Boot ici](https://github.com/Lelouch0909/rubber-duck-debugging-api)*

---

## 📋 Table des matières
- [Méthodologie Git Flow](#-méthodologie-git-flow)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Variables d'environnement](#-variables-denvironnement)
- [Contribution](#-contribution)
- [Workflow](#-workflow)

---

## 🌿 Méthodologie Git Flow

### Installation de Git Flow
```bash
# macOS (via Homebrew)
brew install git-flow
```
```
# Linux (Debian/Ubuntu)
sudo apt-get install git-flow
```
```
# Windows (via Git Bash)
git flow init
```

Commandes de base
```bash

# Initialiser Git Flow dans le projet
git flow init
```
```
# Démarrer une nouvelle fonctionnalité
git flow feature start ma-fonctionnalite
```
```
# Publier une fonctionnalité sur le dépôt distant
git flow feature publish ma-fonctionnalite
```
```
# Fusionner une fonctionnalité dans la branche develop
git flow feature finish ma-fonctionnalite
```

🛠️ Tech Stack
Catégorie	Technologies
Frontend	Next.js, TypeScript, Tailwind CSS
Monitoring	Sentry
🚀 Installation
Cloner le dépôt :

```bash
git clone https://github.com/Lelouch0909/rubber-duck-debugging-front.git
cd rubber-duck-debugging-front
```
Installer les dépendances :

```bash
yarn install
```
Configurer l'environnement :
Les variables d environnement sont dans les secrets du depot.

Démarrer le serveur de développement :

```bash
yarn dev
```

🤝 Contribution
Processus

Utiliser Git Flow pour les branches :

```bash
git flow feature start nom_de_la_fonctionnalite
```
Ouvrir une Pull Request vers develop avec :

Un titre clair (ex: feat: Ajout de la coloration syntaxique)

Une description liée à l'issue 

Des captures d'écran si nécessaire

🔄 Workflow
Suivi des tâches :
Tableau Jira

CI/CD : Déploiement automatique via GitHub Actions

Tests : Exécutez avant de pousser :

```bash
yarn lint  # Vérification du code
yarn test  # Exécution des tests
```
📜 Licence
MIT - Voir le fichier LICENSE pour plus de détails.
```
