# 🦆 Rubber Duck Debugging - Frontend

**Interface de discussion avec un canard IA pour déboguer son code**  
_Développé avec Next.js, Tailwind CSS et TypeScript._  
_[Backend Spring Boot ici](https://github.com/Lelouch0909/rubber-duck-debugging-api)_

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
Catégorie Technologies
Frontend Next.js, TypeScript, Tailwind CSS
Monitoring Sentry
🚀 Installation
Cloner le dépôt :

```bash
git clone https://github.com/Lelouch0909/rubber-duck-debugging-front.git
cd rubber-duck-debugging-front
```

Installer les dépendances :

```bash
npm install
```

Configurer l'environnement :
Les variables d environnement sont dans les secrets du depot.

Démarrer le serveur de développement :

```bash
npm dev
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
npm lint  # Vérification du code
npm test  # Exécution des tests
```

📜 Licence
MIT - Voir le fichier LICENSE pour plus de détails.

````
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
````

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
