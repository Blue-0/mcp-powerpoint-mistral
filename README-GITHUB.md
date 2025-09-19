# 🚀 MCP PowerPoint Mistral

Serveur MCP (Model Context Protocol) pour Mistral avec intégration PowerPoint Online via Microsoft Graph API.

## ⚡ Déploiement rapide avec GitHub + Portainer

### 1. Configuration Portainer Stack

**URL du repository :** `https://github.com/VOTRE_USERNAME/mcp-powerpoint-mistral.git`

**Docker Compose Path :** `docker-compose.portainer.yml`

### 2. Variables d'environnement requises

Dans Portainer, configurez ces variables :

```env
MICROSOFT_CLIENT_ID=votre_client_id_azure
MICROSOFT_CLIENT_SECRET=votre_client_secret_azure
MICROSOFT_TENANT_ID=votre_tenant_id_azure
```

### 3. Configuration Mistral

Une fois déployé, configurez le Custom Connector dans Mistral :

```
Connector name: PowerPoint
Connection server: http://[VOTRE_SERVEUR]:3000
Authentication: No Authentication
```

## 📋 Fonctionnalités

- ✅ Créer des présentations PowerPoint
- ✅ Lister les présentations existantes  
- ✅ Obtenir les détails d'une présentation
- ✅ Partager des présentations
- 🔄 Modifier les slides (en développement)

## 🔧 API Endpoints

- `GET /` - Informations du serveur
- `GET /health` - Status de santé
- `POST /tools/create_presentation` - Créer une présentation
- `POST /tools/list_presentations` - Lister les présentations
- `POST /tools/get_presentation` - Détails d'une présentation
- `POST /tools/share_presentation` - Partager une présentation

## 📚 Documentation complète

- [Azure Setup](AZURE_SETUP.md) - Configuration Azure AD
- [Portainer Setup](PORTAINER_SETUP.md) - Déploiement Portainer
- [Mistral Config](MISTRAL_CONFIG.md) - Configuration Mistral
- [Getting Started](GETTING_STARTED.md) - Guide de démarrage

## 🆘 Support

Pour toute question ou problème, consultez la documentation ou créez une issue.

---

Made with ❤️ for Mistral AI integration