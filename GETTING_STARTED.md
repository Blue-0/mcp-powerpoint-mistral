# Guide de démarrage rapide

## 1. Installation

```bash
cd "c:\Users\GPE-041\OneDrive - GROUPE SEMAFOR\Documents\Projet\MCP\mcpgslide"
npm install
```

## 2. Configuration

```bash
# Configuration interactive
npm run setup

# Ou manuellement, copiez .env.example vers .env et remplissez les valeurs
cp .env.example .env
```

## 3. Configuration Azure AD

1. Allez sur [Azure Portal](https://portal.azure.com)
2. Créez une nouvelle application dans Azure Active Directory
3. Notez le Client ID, Client Secret et Tenant ID
4. Ajoutez les permissions Microsoft Graph :
   - `Files.ReadWrite.All` (Application)
   - `Sites.ReadWrite.All` (Application)

## 4. Compilation et test

```bash
# Compilation
npm run build

# Test local
npm start

# Mode développement
npm run dev
```

## 5. Configuration dans Mistral

Copiez le contenu de `mistral-config.json` dans la configuration de Mistral ou utilisez le chemin direct :

```json
{
  "mcpServers": {
    "powerpoint": {
      "command": "node",
      "args": ["c:\\Users\\GPE-041\\OneDrive - GROUPE SEMAFOR\\Documents\\Projet\\MCP\\mcpgslide\\dist\\index.js"],
      "env": {
        "MICROSOFT_CLIENT_ID": "votre_client_id",
        "MICROSOFT_CLIENT_SECRET": "votre_client_secret", 
        "MICROSOFT_TENANT_ID": "votre_tenant_id"
      }
    }
  }
}
```

## 6. Test avec Mistral

Une fois configuré, vous pouvez demander à Mistral :

- "Crée une nouvelle présentation PowerPoint appelée 'Test'"
- "Montre-moi toutes mes présentations"
- "Partage ma dernière présentation avec example@domain.com"

## Fonctionnalités disponibles

✅ **Fonctionnel maintenant :**
- Créer des présentations
- Lister les présentations
- Obtenir les détails d'une présentation
- Partager des présentations

🔄 **En développement (nécessite Office.js) :**
- Ajouter des slides
- Modifier le contenu des slides
- Supprimer des slides

## Dépannage

Si vous rencontrez des problèmes :

1. Vérifiez que Node.js est installé (version 18+)
2. Vérifiez les credentials Azure AD
3. Assurez-vous que les permissions sont accordées
4. Consultez les logs avec `npm run dev`