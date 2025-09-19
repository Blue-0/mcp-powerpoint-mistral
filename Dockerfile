# Utiliser Node.js 18 Alpine pour une image légère
FROM node:18-alpine

# Installer des dépendances système nécessaires
RUN apk add --no-cache python3 make g++

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de package d'abord (pour optimiser le cache Docker)
COPY package*.json ./

# Installer les dépendances avec npm ci
RUN npm ci --only=production --no-optional

# Copier le code source
COPY . .

# Compiler TypeScript
RUN npm run build

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S mcpuser -u 1001 -G nodejs

# Changer les permissions
RUN chown -R mcpuser:nodejs /app
USER mcpuser

# Exposer le port
EXPOSE 3000

# Sanity check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "console.log('Health check OK')" || exit 1

# Commande de démarrage - serveur HTTP pour Mistral
CMD ["node", "dist/http-server.js"]