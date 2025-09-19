# Configuration Azure AD - Guide étape par étape

## 🎯 Objectif
Configurer une application Azure AD pour permettre à votre serveur MCP d'accéder à PowerPoint Online via Microsoft Graph API.

## 📋 Prérequis
- ✅ Compte Microsoft 365 (Office 365) avec droits administrateur
- ✅ Accès au [portail Azure](https://portal.azure.com)
- ✅ Droits pour créer des applications dans Azure AD

## 🚀 Étape 1 : Accéder au portail Azure

1. **Ouvrez votre navigateur** et allez sur : https://portal.azure.com
2. **Connectez-vous** avec votre compte Microsoft 365/Office 365
3. **Vérifiez le tenant** (organisation) en haut à droite de l'écran

> 💡 **Astuce :** Si vous avez plusieurs tenants, assurez-vous d'être dans le bon tenant où vous voulez créer l'application.

## 🏗️ Étape 2 : Créer l'application

### 2.1 Navigation vers Azure Active Directory
1. Dans le menu de gauche, cliquez sur **"Azure Active Directory"**
   - Si vous ne le voyez pas, cliquez sur **"Tous les services"** et cherchez "Azure Active Directory"

### 2.2 Créer une nouvelle application
1. Dans Azure AD, cliquez sur **"Registrations d'applications"** (App registrations)
2. Cliquez sur **"+ Nouvelle inscription"** (New registration)

### 2.3 Remplir les informations
```
Nom : MCP PowerPoint Mistral
Types de comptes pris en charge : Comptes dans cet annuaire organisationnel uniquement
URI de redirection : (Laisser vide pour l'instant)
```

4. Cliquez sur **"Inscrire"** (Register)

## 🔑 Étape 3 : Noter les informations importantes

Une fois l'application créée, vous verrez la page **"Vue d'ensemble"**. **NOTEZ CES VALEURS** :

```
📝 ID d'application (client) : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
📝 ID de l'annuaire (locataire) : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

> ⚠️ **Important :** Gardez ces informations en sécurité, vous en aurez besoin plus tard !

## 🔐 Étape 4 : Créer un secret client

### 4.1 Accéder aux secrets
1. Dans le menu de gauche de votre application, cliquez sur **"Certificats et secrets"**
2. Cliquez sur l'onglet **"Secrets clients"**

### 4.2 Créer un nouveau secret
1. Cliquez sur **"+ Nouveau secret client"**
2. Remplissez :
   ```
   Description : MCP PowerPoint Secret
   Expire : 24 mois (recommandé)
   ```
3. Cliquez sur **"Ajouter"**

### 4.3 Copier le secret
1. **COPIEZ IMMÉDIATEMENT** la valeur du secret (colonne "Valeur")
2. **⚠️ ATTENTION :** Cette valeur ne sera plus jamais affichée !

```
📝 Secret client : xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 🔒 Étape 5 : Configurer les permissions API

### 5.1 Accéder aux permissions
1. Dans le menu de gauche, cliquez sur **"Autorisations API"** (API permissions)

### 5.2 Ajouter les permissions Microsoft Graph
1. Cliquez sur **"+ Ajouter une autorisation"**
2. Sélectionnez **"Microsoft Graph"**
3. Choisissez **"Autorisations d'application"** (Application permissions)

### 5.3 Sélectionner les permissions nécessaires
Recherchez et sélectionnez ces permissions :

```
✅ Files.ReadWrite.All
   └─ Permet de lire et écrire des fichiers dans OneDrive/SharePoint

✅ Sites.ReadWrite.All  
   └─ Permet d'accéder aux sites SharePoint (où sont stockés les fichiers Office)
```

4. Cliquez sur **"Ajouter des autorisations"**

### 5.4 Accorder le consentement administrateur
1. De retour sur la page des autorisations, cliquez sur **"Accorder le consentement de l'administrateur pour [Votre organisation]"**
2. Confirmez en cliquant **"Oui"**

> ✅ **Vérification :** Vous devriez voir des coches vertes dans la colonne "État" pour toutes les permissions.

## 📝 Étape 6 : Résumé des informations collectées

Vous devriez maintenant avoir ces 3 informations cruciales :

```
📋 INFORMATIONS À CONSERVER :

🔑 Client ID (Application ID) : 
   xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

🔐 Client Secret : 
   xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

🏢 Tenant ID (Directory ID) : 
   xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## 🧪 Étape 7 : Configuration du projet MCP

Maintenant que Azure AD est configuré, configurons votre projet :

### Option A : Configuration automatique
```bash
npm run setup
```

### Option B : Configuration manuelle
1. Copiez le fichier `.env.example` vers `.env`
2. Remplissez avec vos valeurs Azure AD :

```env
MICROSOFT_CLIENT_ID=votre_client_id_ici
MICROSOFT_CLIENT_SECRET=votre_client_secret_ici
MICROSOFT_TENANT_ID=votre_tenant_id_ici
```

## ✅ Étape 8 : Test de la configuration

```bash
# Compilation
npm run build

# Test
npm start
```

Si tout fonctionne, vous devriez voir :
```
Serveur MCP PowerPoint démarré et connecté via stdio
```

## 🚨 Dépannage courant

### Erreur d'authentification
- ✅ Vérifiez que les 3 IDs sont corrects
- ✅ Assurez-vous que le consentement administrateur a été accordé
- ✅ Vérifiez que l'application est active

### Erreur de permissions
- ✅ Vérifiez que les permissions `Files.ReadWrite.All` et `Sites.ReadWrite.All` sont accordées
- ✅ Assurez-vous qu'il s'agit de permissions d'**application** (pas déléguées)

### Erreur de tenant
- ✅ Vérifiez que vous êtes dans le bon tenant Azure AD
- ✅ Assurez-vous que votre compte a les droits administrateur

## 📞 Besoin d'aide ?

Si vous rencontrez des problèmes, nous pouvons :
1. Vérifier chaque étape ensemble
2. Déboguer les erreurs spécifiques
3. Tester la connexion à Microsoft Graph

---

**Prêt à commencer ?** Ouvrez le portail Azure et suivons ces étapes ensemble ! 🚀