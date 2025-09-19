# MCP PowerPoint pour Mistral

Un serveur MCP (Model Context Protocol) qui permet à Mistral d'interagir avec PowerPoint en ligne via Microsoft Graph API.

## 🚀 Fonctionnalités

- ✅ Créer de nouvelles présentations PowerPoint
- ✅ Lister les présentations existantes
- ✅ Obtenir les détails d'une présentation
- ✅ Partager des présentations avec d'autres utilisateurs
- 🔄 Ajouter des slides (en développement - nécessite Office.js)
- 🔄 Modifier le contenu des slides (en développement - nécessite Office.js)
- 🔄 Supprimer des slides (en développement - nécessite Office.js)

## 📋 Prérequis

1. **Compte Microsoft 365** avec accès à PowerPoint Online
2. **Application Azure AD** enregistrée avec les permissions appropriées
3. **Node.js** version 18 ou supérieure
4. **TypeScript** pour le développement

## 🔧 Installation

1. **Cloner et installer les dépendances :**
```bash
git clone <repository-url>
cd mcp-powerpoint-mistral
npm install
```

2. **Configuration de l'application Azure AD :**

   a. Aller sur [Azure Portal](https://portal.azure.com)
   
   b. Naviguer vers "Azure Active Directory" > "App registrations"
   
   c. Cliquer sur "New registration"
   
   d. Remplir les informations :
   - Name: `MCP PowerPoint Mistral`
   - Supported account types: `Accounts in this organizational directory only`
   - Redirect URI: Laisser vide pour l'instant
   
   e. Après création, noter l'Application (client) ID et Directory (tenant) ID
   
   f. Aller dans "Certificates & secrets" et créer un nouveau client secret
   
   g. Dans "API permissions", ajouter les permissions suivantes :
   - `Microsoft Graph` > `Application permissions` > `Files.ReadWrite.All`
   - `Microsoft Graph` > `Application permissions` > `Sites.ReadWrite.All`
   - Accorder le consentement administrateur

3. **Configuration des variables d'environnement :**
```bash
cp .env.example .env
```

Modifier le fichier `.env` :
```env
MICROSOFT_CLIENT_ID=your_application_client_id
MICROSOFT_CLIENT_SECRET=your_client_secret
MICROSOFT_TENANT_ID=your_tenant_id
MCP_SERVER_NAME=mcp-powerpoint-mistral
MCP_SERVER_VERSION=1.0.0
NODE_ENV=development
```

4. **Compilation et démarrage :**
```bash
npm run build
npm start
```

## 🔨 Développement

```bash
# Mode développement avec rechargement automatique
npm run dev

# Mode watch pour TypeScript
npm run watch

# Tests
npm test

# Linting
npm run lint

# Formatage du code
npm run format
```

## 📚 Utilisation

### Démarrage du serveur MCP

```bash
# Via npm
npm start

# Ou directement
node dist/index.js

# Mode stdio (par défaut)
node dist/index.js --stdio
```

### Outils disponibles

#### 1. `create_presentation`
Créer une nouvelle présentation PowerPoint.

**Paramètres :**
- `name` (string, requis) : Nom de la présentation
- `templateId` (string, optionnel) : ID du modèle à utiliser

**Exemple :**
```json
{
  "name": "create_presentation",
  "arguments": {
    "name": "Ma nouvelle présentation",
    "templateId": "template123"
  }
}
```

#### 2. `list_presentations`
Lister les présentations disponibles.

**Paramètres :**
- `limit` (number, optionnel) : Nombre maximum de résultats (défaut: 20)
- `search` (string, optionnel) : Terme de recherche

**Exemple :**
```json
{
  "name": "list_presentations",
  "arguments": {
    "limit": 10,
    "search": "rapport"
  }
}
```

#### 3. `get_presentation`
Obtenir les détails d'une présentation.

**Paramètres :**
- `presentationId` (string, requis) : ID de la présentation
- `includeSlides` (boolean, optionnel) : Inclure les détails des slides (défaut: true)

**Exemple :**
```json
{
  "name": "get_presentation",
  "arguments": {
    "presentationId": "abc123",
    "includeSlides": true
  }
}
```

#### 4. `share_presentation`
Partager une présentation avec d'autres utilisateurs.

**Paramètres :**
- `presentationId` (string, requis) : ID de la présentation
- `permissions` (string, requis) : Type de permissions ('read' ou 'edit')
- `emails` (array, requis) : Liste des adresses email

**Exemple :**
```json
{
  "name": "share_presentation",
  "arguments": {
    "presentationId": "abc123",
    "permissions": "edit",
    "emails": ["user1@example.com", "user2@example.com"]
  }
}
```

### Outils en développement

Les outils suivants nécessitent l'intégration d'Office.js pour manipuler directement le contenu des slides :

- `add_slide` : Ajouter une nouvelle slide
- `update_slide_content` : Modifier le contenu d'une slide
- `delete_slide` : Supprimer une slide

## 🔐 Sécurité

- Les credentials Azure AD sont stockés dans des variables d'environnement
- L'authentification utilise le flux Client Credentials de OAuth 2.0
- Les tokens d'accès sont gérés automatiquement avec renouvellement
- Les permissions sont limitées au minimum nécessaire

## 🐛 Dépannage

### Erreur d'authentification
- Vérifier que les credentials Azure AD sont corrects
- S'assurer que les permissions ont été accordées
- Vérifier que l'application Azure AD est active

### Erreur "Cannot find module"
```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install

# Recompiler TypeScript
npm run build
```

### Erreur de permissions
- Vérifier que l'utilisateur a accès à PowerPoint Online
- S'assurer que les permissions Microsoft Graph sont accordées
- Vérifier la configuration du tenant Azure AD

## 📈 Roadmap

- [ ] Intégration complète d'Office.js pour la manipulation des slides
- [ ] Support des modèles PowerPoint personnalisés
- [ ] Gestion des animations et transitions
- [ ] Export en PDF
- [ ] Collaboration en temps réel
- [ ] Intégration avec d'autres services Office 365

## 🤝 Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit vos changements (`git commit -am 'Ajout de nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
1. Consulter la documentation
2. Vérifier les [issues existantes](../../issues)
3. Créer une nouvelle issue si nécessaire

## 🔗 Liens utiles

- [Microsoft Graph API Documentation](https://docs.microsoft.com/en-us/graph/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Azure Active Directory](https://azure.microsoft.com/services/active-directory/)
- [PowerPoint Online](https://www.office.com/powerpoint)