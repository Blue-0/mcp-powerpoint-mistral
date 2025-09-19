# Multi-stage build pour optimiser l'image finale
FROM node:18-alpine AS builder

# Installer des dépendances système nécessaires pour la compilation
RUN apk add --no-cache python3 make g++ git

# Vérifier que npm est disponible
RUN node --version && npm --version

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de package d'abord (pour optimiser le cache Docker)
COPY package*.json ./
COPY tsconfig.json ./

# Installer TOUS les packages (y compris devDependencies pour TypeScript)
RUN npm ci --verbose

# Copier le code source
COPY src/ ./src/

# Compiler TypeScript manuellement
RUN npx tsc

# Stage final - runtime
FROM node:18-alpine AS runtime

# Installer seulement les dépendances runtime nécessaires
RUN apk add --no-cache dumb-init

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S mcpuser -u 1001 -G nodejs

# Définir le répertoire de travail
WORKDIR /app

# Copier seulement les fichiers nécessaires pour le runtime
COPY package*.json ./

# Installer seulement les dépendances de production
RUN npm ci --only=production --omit=dev --no-optional && \
    npm cache clean --force

# Copier le code compilé depuis le builder
COPY --from=builder --chown=mcpuser:nodejs /app/dist ./dist

# Basculer vers l'utilisateur non-root
USER mcpuser

# Exposer le port
EXPOSE 3000

# Sanity check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "console.log('Health check OK')" || exit 1

# Utiliser dumb-init pour une gestion propre des signaux
ENTRYPOINT ["dumb-init", "--"]

# Commande de démarrage - serveur HTTP pour Mistral
CMD ["node", "dist/http-server.js"]