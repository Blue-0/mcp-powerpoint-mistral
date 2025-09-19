#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupEnvironment() {
  console.log('🔧 Configuration du serveur MCP PowerPoint pour Mistral\n');
  
  // Vérifier si .env existe déjà
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const overwrite = await question('Un fichier .env existe déjà. Voulez-vous le remplacer ? (y/N): ');
    if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
      console.log('Configuration annulée.');
      rl.close();
      return;
    }
  }
  
  console.log('📋 Veuillez fournir les informations de votre application Azure AD :\n');
  
  const clientId = await question('Client ID (Application ID): ');
  const clientSecret = await question('Client Secret: ');
  const tenantId = await question('Tenant ID (Directory ID): ');
  
  const envContent = `# Configuration Microsoft Graph API
MICROSOFT_CLIENT_ID=${clientId}
MICROSOFT_CLIENT_SECRET=${clientSecret}
MICROSOFT_TENANT_ID=${tenantId}

# Configuration du serveur MCP
MCP_SERVER_NAME=mcp-powerpoint-mistral
MCP_SERVER_VERSION=1.0.0

# Mode de développement
NODE_ENV=production

# Ports et configuration réseau
PORT=3000
`;

  // Écrire le fichier .env
  fs.writeFileSync(envPath, envContent);
  console.log('\n✅ Fichier .env créé avec succès !');
  
  // Mettre à jour la configuration Mistral
  const configPath = path.join(__dirname, '..', 'mistral-config.json');
  const currentDir = path.join(__dirname, '..');
  const distPath = path.join(currentDir, 'dist', 'index.js');
  
  const mistralConfig = {
    mcpServers: {
      powerpoint: {
        command: 'node',
        args: [distPath],
        env: {
          MICROSOFT_CLIENT_ID: clientId,
          MICROSOFT_CLIENT_SECRET: clientSecret,
          MICROSOFT_TENANT_ID: tenantId
        }
      }
    }
  };
  
  fs.writeFileSync(configPath, JSON.stringify(mistralConfig, null, 2));
  console.log('✅ Configuration Mistral mise à jour !');
  
  console.log('\n📝 Prochaines étapes :');
  console.log('1. Compiler le projet : npm run build');
  console.log('2. Tester le serveur : npm start');
  console.log('3. Ajouter la configuration à Mistral');
  console.log('\n🔗 Chemin de configuration pour Mistral :');
  console.log(configPath);
  
  rl.close();
}

if (require.main === module) {
  setupEnvironment().catch(console.error);
}