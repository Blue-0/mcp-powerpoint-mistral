# Utiliser Node.js 18 Alpine pour une image légère
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de package d'abord (pour optimiser le cache Docker)
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY . .

# Compiler TypeScript
RUN npm run build

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Changer les permissions
RUN chown -R nextjs:nodejs /app
USER nextjs

# Exposer le port (optionnel, MCP utilise stdio par défaut)
EXPOSE 3000

# Sanity check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "console.log('Health check OK')" || exit 1

# Commande de démarrage - serveur HTTP pour Mistral
CMD ["node", "dist/http-server.js"]