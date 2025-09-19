# 🐳 Déploiement Portainer - Guide complet

## 🎯 Objectif
Déployer votre serveur MCP PowerPoint sur Portainer pour l'utiliser avec Mistral.

## 📋 Prérequis Portainer
- ✅ Portainer installé et accessible
- ✅ Accès Docker sur votre serveur
- ✅ Configuration Azure AD terminée

## 🚀 Méthode 1 : Déploiement via Stack Portainer

### 1.1 Créer une Stack
1. **Connectez-vous à Portainer**
2. Allez dans **"Stacks"**
3. Cliquez sur **"+ Add stack"**
4. Nommez votre stack : `mcp-powerpoint-mistral`

### 1.2 Configuration Docker Compose
Copiez cette configuration dans l'éditeur Portainer :

```yaml
version: '3.8'

services:
  mcp-powerpoint-mistral:
    image: mcp-powerpoint-mistral:latest
    container_name: mcp-powerpoint-mistral
    restart: unless-stopped
    environment:
      - MICROSOFT_CLIENT_ID=${MICROSOFT_CLIENT_ID}
      - MICROSOFT_CLIENT_SECRET=${MICROSOFT_CLIENT_SECRET}
      - MICROSOFT_TENANT_ID=${MICROSOFT_TENANT_ID}
      - MCP_SERVER_NAME=mcp-powerpoint-mistral
      - MCP_SERVER_VERSION=1.0.0
      - NODE_ENV=production
      - PORT=3000
    ports:
      - "3000:3000"
    volumes:
      - mcp_logs:/app/logs
    healthcheck:
      test: ["CMD", "node", "-e", "console.log('Health check OK')"]
      interval: 30s
      timeout: 10s
      retries: 3
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

volumes:
  mcp_logs:
```

### 1.3 Variables d'environnement
Dans la section **"Environment variables"** de Portainer, ajoutez :

```
MICROSOFT_CLIENT_ID=8fcb1582-8249-4d04-962e-00403cc733ac
MICROSOFT_CLIENT_SECRET=0d474b30-0966-4d2a-8afe-234c01db4bb0
MICROSOFT_TENANT_ID=e030fce7-fad5-40cd-8fbf-d4ddb42c9da7
```

## 🏗️ Méthode 2 : Build et Push de l'image

### 2.1 Build local
```bash
# Dans votre projet
docker build -t mcp-powerpoint-mistral:latest .

# Test local
docker run --env-file .env -p 3000:3000 mcp-powerpoint-mistral:latest
```

### 2.2 Push vers un registry (optionnel)
Si vous avez un registry Docker privé :

```bash
# Tag pour votre registry
docker tag mcp-powerpoint-mistral:latest votre-registry.com/mcp-powerpoint-mistral:latest

# Push
docker push votre-registry.com/mcp-powerpoint-mistral:latest
```

## 🔧 Méthode 3 : Déploiement direct via Portainer

### 3.1 Upload du projet
1. **Compressez votre projet** (zip) en incluant :
   ```
   ✅ src/
   ✅ package.json
   ✅ tsconfig.json
   ✅ Dockerfile
   ✅ .dockerignore
   ❌ node_modules/
   ❌ .env (sécurité)
   ```

2. Dans Portainer, allez dans **"Images"**
3. Cliquez sur **"Build a new image"**
4. Uploadez votre ZIP
5. Définissez le nom : `mcp-powerpoint-mistral:latest`

### 3.2 Créer le container
1. Allez dans **"Containers"**
2. Cliquez sur **"+ Add container"**
3. Configuration :
   ```
   Name: mcp-powerpoint-mistral
   Image: mcp-powerpoint-mistral:latest
   ```

4. **Variables d'environnement** :
   ```
   MICROSOFT_CLIENT_ID=8fcb1582-8249-4d04-962e-00403cc733ac
   MICROSOFT_CLIENT_SECRET=0d474b30-0966-4d2a-8afe-234c01db4bb0
   MICROSOFT_TENANT_ID=e030fce7-fad5-40cd-8fbf-d4ddb42c9da7
   NODE_ENV=production
   ```

5. **Ports** :
   ```
   Host: 3000
   Container: 3000
   ```

6. **Restart policy** : `unless-stopped`

## 🌐 Configuration Mistral pour Container

### Option A : Via Network Docker
Si Mistral est aussi dans Docker sur le même réseau :

```json
{
  "mcpServers": {
    "powerpoint": {
      "command": "docker",
      "args": [
        "exec", 
        "mcp-powerpoint-mistral", 
        "node", 
        "dist/index.js"
      ]
    }
  }
}
```

### Option B : Via HTTP (si exposé)
Si vous exposez le port 3000 :

```json
{
  "mcpServers": {
    "powerpoint": {
      "url": "http://localhost:3000",
      "type": "http"
    }
  }
}
```

### Option C : Via commande directe
```json
{
  "mcpServers": {
    "powerpoint": {
      "command": "docker",
      "args": [
        "run", 
        "--rm", 
        "--env-file", 
        "/path/to/.env",
        "mcp-powerpoint-mistral:latest"
      ]
    }
  }
}
```

## 🔍 Monitoring et Logs

### Via Portainer UI
1. Allez dans **"Containers"**
2. Cliquez sur votre container `mcp-powerpoint-mistral`
3. Onglet **"Logs"** pour voir les logs en temps réel
4. Onglet **"Stats"** pour les métriques

### Via Docker CLI
```bash
# Logs en temps réel
docker logs -f mcp-powerpoint-mistral

# Status du container
docker ps | grep mcp-powerpoint-mistral

# Santé du container
docker inspect mcp-powerpoint-mistral | grep Health
```

## ✅ Test de déploiement

### 1. Vérification du container
```bash
curl http://localhost:3000/health
# ou
docker exec mcp-powerpoint-mistral node -e "console.log('Test OK')"
```

### 2. Test MCP
```bash
# Test de connexion MCP
docker exec -it mcp-powerpoint-mistral node dist/index.js --test
```

## 🚨 Troubleshooting

### Container ne démarre pas
- ✅ Vérifiez les logs : `docker logs mcp-powerpoint-mistral`
- ✅ Vérifiez les variables d'environnement
- ✅ Assurez-vous que l'image est bien buildée

### Erreurs d'authentification
- ✅ Vérifiez les credentials Azure AD
- ✅ Testez la connexion à Microsoft Graph
- ✅ Vérifiez les permissions dans Azure

### Problèmes réseau
- ✅ Vérifiez que le port 3000 est bien exposé
- ✅ Testez la connectivité réseau Docker
- ✅ Vérifiez les firewall/proxy

## 📊 Scripts utiles

### Build et deploy automatique
```bash
#!/bin/bash
# build-and-deploy.sh

echo "🏗️ Building Docker image..."
docker build -t mcp-powerpoint-mistral:latest .

echo "🛑 Stopping existing container..."
docker stop mcp-powerpoint-mistral 2>/dev/null || true
docker rm mcp-powerpoint-mistral 2>/dev/null || true

echo "🚀 Starting new container..."
docker run -d \
  --name mcp-powerpoint-mistral \
  --restart unless-stopped \
  --env-file .env \
  -p 3000:3000 \
  mcp-powerpoint-mistral:latest

echo "✅ Deployment complete!"
docker ps | grep mcp-powerpoint-mistral
```

Quel méthode préférez-vous pour le déploiement sur Portainer ? 🐳