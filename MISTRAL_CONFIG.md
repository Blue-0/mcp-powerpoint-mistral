# 🎯 Configuration Mistral Custom Connector - Guide final

## ✅ Ce qui a été adapté pour Mistral

Après analyse de la documentation Mistral, notre serveur a été adapté pour :
- ✅ **Serveur HTTP** accessible via URL (requis par Mistral)
- ✅ **Pas d'authentification** pour le serveur MCP lui-même
- ✅ **Format de réponse compatible** avec les attentes Mistral
- ✅ **Routes REST** pour chaque outil PowerPoint

## 🚀 Déploiement pour Mistral

### Étape 1 : Installation des nouvelles dépendances
```bash
npm install
```

### Étape 2 : Compilation 
```bash
npm run build
```

### Étape 3 : Test en local
```bash
# Test du serveur HTTP
npm run start-http

# Ou en mode développement
npm run dev-http
```

Le serveur démarrera sur `http://localhost:3000`

### Étape 4 : Vérification
Testez ces URLs dans votre navigateur :
- `http://localhost:3000/` - Info du serveur
- `http://localhost:3000/health` - Status de santé

## 🐳 Déploiement sur Portainer

### Option A : Via Stack (recommandé)
1. **Portainer** → **Stacks** → **+ Add stack**
2. **Nom** : `mcp-powerpoint-mistral`
3. **Docker Compose** :
```yaml
version: '3.8'

services:
  mcp-powerpoint-mistral:
    image: mcp-powerpoint-mistral:latest
    container_name: mcp-powerpoint-mistral
    restart: unless-stopped
    environment:
      - MICROSOFT_CLIENT_ID=8fcb1582-8249-4d04-962e-00403cc733ac
      - MICROSOFT_CLIENT_SECRET=0d474b30-0966-4d2a-8afe-234c01db4bb0
      - MICROSOFT_TENANT_ID=e030fce7-fad5-40cd-8fbf-d4ddb42c9da7
      - NODE_ENV=production
      - PORT=3000
    ports:
      - "3000:3000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Option B : Build et déploiement
```bash
# Build de l'image
docker build -t mcp-powerpoint-mistral:latest .

# Test local
docker run --env-file .env -p 3000:3000 mcp-powerpoint-mistral:latest
```

## 🔧 Configuration dans Mistral

### Étape 1 : Accéder aux Custom Connectors
1. **le Chat** → **Intelligence** → **Connectors**
2. **+ Add Connector** 
3. **Custom MCP Connector**

### Étape 2 : Configuration du Connector
```
📝 Connector name: PowerPoint
📝 Connection server: http://votre-serveur:3000
📝 Description: Intégration PowerPoint Online pour créer et gérer des présentations
📝 Authentication method: No Authentication
```

### Étape 3 : URLs selon votre déploiement

**Local (test):**
```
http://localhost:3000
```

**Portainer (réseau local):**
```
http://[IP_SERVEUR]:3000
```

**Portainer (domaine):**
```
http://powerpoint-mcp.votre-domaine.com
```

## 🛠️ Outils disponibles pour Mistral

Une fois configuré, vous pourrez utiliser ces commandes naturelles :

### Créer des présentations
```
"Crée une présentation PowerPoint sur l'IA générative"
"Crée une nouvelle présentation appelée 'Budget 2025'"
```

### Lister et consulter
```
"Montre-moi toutes mes présentations PowerPoint"
"Quelles sont mes présentations récentes ?"
"Donne-moi les détails de ma présentation 'Projet Alpha'"
```

### Partager
```
"Partage ma présentation 'Résultats Q4' avec l'équipe marketing"
"Donne accès en lecture à marie@entreprise.com sur ma dernière présentation"
```

## 🔍 Test de la configuration

### 1. Test direct de l'API
```bash
# Test de santé
curl http://localhost:3000/health

# Test de création
curl -X POST http://localhost:3000/tools/create_presentation \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Presentation"}'
```

### 2. Test dans Mistral
Une fois configuré, testez avec :
```
"Peux-tu créer une présentation PowerPoint de test ?"
```

## 🚨 Dépannage

### Serveur ne démarre pas
```bash
# Vérifier les logs
docker logs mcp-powerpoint-mistral

# Vérifier les variables d'environnement
docker exec mcp-powerpoint-mistral env | grep MICROSOFT
```

### Mistral ne trouve pas le serveur
1. ✅ Vérifiez que l'URL est accessible : `curl http://votre-serveur:3000/health`
2. ✅ Vérifiez les firewalls/proxy
3. ✅ Testez depuis le même réseau que Mistral

### Erreurs d'authentification Microsoft
1. ✅ Vérifiez les credentials Azure AD
2. ✅ Testez : `curl http://votre-serveur:3000/tools/list_presentations -X POST`

## 📊 Monitoring

### Logs du serveur
```bash
# Logs en temps réel
docker logs -f mcp-powerpoint-mistral

# Dernières lignes
docker logs --tail 50 mcp-powerpoint-mistral
```

### Métriques
- **Santé** : `GET /health`
- **Info** : `GET /`
- **Test de connexion Microsoft** : `POST /tools/list_presentations`

## 🎉 Prêt !

Votre serveur MCP PowerPoint est maintenant compatible avec la méthode Custom Connector de Mistral. Une fois déployé et configuré, vous pourrez interagir naturellement avec PowerPoint via le chat Mistral !

**Prochaine étape :** Déployez sur Portainer et configurez dans Mistral ! 🚀