// Test du serveur MCP PowerPoint
// Pour tester le serveur en dehors de Mistral

import { PowerPointMCPServer } from '../src/index.js';

async function testServer() {
  console.log('🧪 Test du serveur MCP PowerPoint...');
  
  try {
    // Simuler l'environnement
    process.env.MICROSOFT_CLIENT_ID = 'test-client-id';
    process.env.MICROSOFT_CLIENT_SECRET = 'test-client-secret';
    process.env.MICROSOFT_TENANT_ID = 'test-tenant-id';
    
    const server = new PowerPointMCPServer();
    
    console.log('✅ Serveur initialisé avec succès');
    console.log('📋 Outils disponibles :');
    console.log('  - create_presentation');
    console.log('  - list_presentations');
    console.log('  - get_presentation');
    console.log('  - add_slide');
    console.log('  - update_slide_content');
    console.log('  - delete_slide');
    console.log('  - share_presentation');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation :', error);
  }
}

// Exemples de requêtes MCP
const exampleRequests = {
  listTools: {
    method: 'tools/list',
    params: {}
  },
  
  createPresentation: {
    method: 'tools/call',
    params: {
      name: 'create_presentation',
      arguments: {
        name: 'Ma présentation de test',
        templateId: 'template123'
      }
    }
  },
  
  listPresentations: {
    method: 'tools/call',
    params: {
      name: 'list_presentations',
      arguments: {
        limit: 10,
        search: 'test'
      }
    }
  }
};

console.log('📝 Exemples de requêtes MCP :');
console.log(JSON.stringify(exampleRequests, null, 2));

if (require.main === module) {
  testServer();
}