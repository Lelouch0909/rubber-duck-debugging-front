# Personnalisation du Design Keycloak (Guide)

Ce guide explique comment modifier l'apparence de la page de connexion Keycloak pour qu'elle corresponde à l'identité visuelle de votre projet ("Rubberduck").

## 1. Comprendre le système de thèmes Keycloak

Keycloak utilise un système de thèmes basé sur Freemarker (templates `.ftl`) et CSS. Pour changer le design, il ne faut **pas** modifier les fichiers internes de Keycloak, mais créer un nouveau thème qui hérite du thème de base.

## 2. Créer votre thème personnalisé

### Structure des dossiers
Sur votre ordinateur (ou directement sur le serveur si vous êtes à l'aise), créez la structure suivante :

```
my-theme/
└── login/
    ├── theme.properties
    ├── resources/
    │   ├── css/
    │   │   └── styles.css
    │   └── img/
    │       └── background.png (optionnel)
```

### Contenu des fichiers

**`theme.properties`** :
Ce fichier indique à Keycloak que votre thème hérite du thème standard (pour garder les fonctionnalités) mais applique vos styles.

```properties
parent=keycloak
import=common/keycloak
styles=css/styles.css
```

**`resources/css/styles.css`** :
C'est ici que vous mettez votre CSS. Pour "Rubberduck", vous pouvez copier le code ci-dessous qui reprend vos couleurs (Jaune Marker, Dark Mode).

```css
/* Fond de la page */
body {
    background-color: #1E2939; /* Votre --background */
    font-family: 'Inter', sans-serif;
    color: #F1F5F9;
}

/* Carte de login */
.login-pf-page .card-pf {
    background-color: #364153; /* Votre --card */
    border: 1px solid #4A5565;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    padding: 2rem;
}

/* Titre */
h1#kc-page-title {
    color: #ffffff;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 2rem;
}

/* Champs de saisie */
input.form-control {
    background-color: #1E2939 !important;
    border: 1px solid #6A7282 !important;
    color: #ffffff !important;
    border-radius: 8px !important;
    padding: 10px !important;
    height: auto !important;
}

input.form-control:focus {
    border-color: #FACC15 !important; /* Jaune / Marker */
    outline: none;
}

/* Labels */
label {
    color: #94A3B8;
    font-size: 0.9rem;
}

/* Boutons (Le plus important) */
input#kc-login {
    background-color: #FACC15 !important; /* Jaune standard ou votre oklch */
    color: #000000 !important;
    border: none !important;
    border-radius: 8px !important;
    font-weight: bold !important;
    text-transform: uppercase;
    transition: all 0.3s ease;
}

input#kc-login:hover {
    background-color: #EAB308 !important; /* Jaune plus foncé */
    transform: scale(1.02);
}

/* Liens (Mot de passe oublié, etc) */
a, a:visited {
    color: #FACC15 !important;
}
```

## 3. Installer le thème sur le serveur

1.  Connectez-vous à votre serveur VPS où tourne Keycloak (`51.222.109.63`).
2.  Localisez le dossier d'installation de Keycloak (souvent `/opt/keycloak/themes/` ou dans le volume Docker si vous utilisez Docker).
    *   *Si Docker :* Il faut monter le volume ou copier le dossier : `docker cp my-theme/ keycloak-container:/opt/keycloak/themes/`
3.  Déposez votre dossier `my-theme` dans le dossier `themes` de Keycloak.

## 4. Activer le thème

1.  Allez sur l'interface d'administration Keycloak (votre URL `/admin`).
2.  Connectez-vous en Admin.
3.  Sélectionnez votre Realm (`rubberduck`).
4.  Allez dans **Realm Settings** > onglet **Themes**.
5.  Dans le menu déroulant **Login Theme**, sélectionnez `my-theme`.
6.  Cliquez sur **Save**.

Désormais, tous vos utilisateurs verront votre interface personnalisée !
