#!/usr/bin/env node

import express, { Request, Response } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { GraphAuthManager } from './auth/graph-auth.js';
import { PowerPointTools } from './tools/powerpoint-tools.js';
import { AuthConfig } from './types/powerpoint.js';

// Charger les variables d'environnement
dotenv.config();

class PowerPointHttpServer {
  private app: express.Application;
  private authManager: GraphAuthManager;
  private powerpointTools: PowerPointTools;

  constructor() {
    // Configuration de l'authentification
    const authConfig: AuthConfig = {
      clientId: process.env.MICROSOFT_CLIENT_ID || '',
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET || '',
      tenantId: process.env.MICROSOFT_TENANT_ID || '',
    };

    if (!authConfig.clientId || !authConfig.clientSecret || !authConfig.tenantId) {
      throw new Error('Microsoft Graph API credentials are required. Please check your environment variables.');
    }

    this.authManager = new GraphAuthManager(authConfig);
    this.powerpointTools = new PowerPointTools(this.authManager);

    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
    
    // Middleware de logging
    this.app.use((req: Request, res: Response, next) => {
      console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
      next();
    });
  }

  private setupRoutes(): void {
    // Route de santé
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({ 
        status: 'healthy',
        name: 'MCP PowerPoint Mistral',
        version: process.env.MCP_SERVER_VERSION || '1.0.0',
        timestamp: new Date().toISOString()
      });
    });

    // Route d'information du serveur (pour Mistral)
    this.app.get('/', (req: Request, res: Response) => {
      res.json({
        name: 'MCP PowerPoint Mistral',
        version: process.env.MCP_SERVER_VERSION || '1.0.0',
        description: 'Serveur MCP pour intégration PowerPoint avec Mistral',
        capabilities: ['tools'],
        tools: [
          {
            name: 'create_presentation',
            description: 'Créer une nouvelle présentation PowerPoint'
          },
          {
            name: 'list_presentations',
            description: 'Lister les présentations disponibles'
          },
          {
            name: 'get_presentation',
            description: 'Obtenir les détails d\'une présentation'
          },
          {
            name: 'share_presentation',
            description: 'Partager une présentation avec des utilisateurs'
          }
        ]
      });
    });

    // Route pour créer une présentation
    this.app.post('/tools/create_presentation', async (req: Request, res: Response) => {
      try {
        const result = await this.powerpointTools.createPresentation(req.body);
        res.json(result);
      } catch (error) {
        res.status(500).json({
          error: 'Failed to create presentation',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Route pour lister les présentations
    this.app.post('/tools/list_presentations', async (req: Request, res: Response) => {
      try {
        const result = await this.powerpointTools.listPresentations(req.body);
        res.json(result);
      } catch (error) {
        res.status(500).json({
          error: 'Failed to list presentations',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Route pour obtenir une présentation
    this.app.post('/tools/get_presentation', async (req: Request, res: Response) => {
      try {
        const result = await this.powerpointTools.getPresentation(req.body);
        res.json(result);
      } catch (error) {
        res.status(500).json({
          error: 'Failed to get presentation',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Route pour partager une présentation
    this.app.post('/tools/share_presentation', async (req: Request, res: Response) => {
      try {
        const result = await this.powerpointTools.sharePresentation(req.body);
        res.json(result);
      } catch (error) {
        res.status(500).json({
          error: 'Failed to share presentation',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });

    // Route générique pour tous les outils
    this.app.post('/tools/:toolName', async (req: Request, res: Response) => {
      const { toolName } = req.params;
      
      try {
        let result;
        switch (toolName) {
          case 'create_presentation':
            result = await this.powerpointTools.createPresentation(req.body);
            break;
          case 'list_presentations':
            result = await this.powerpointTools.listPresentations(req.body);
            break;
          case 'get_presentation':
            result = await this.powerpointTools.getPresentation(req.body);
            break;
          case 'add_slide':
            result = await this.powerpointTools.addSlide(req.body);
            break;
          case 'update_slide_content':
            result = await this.powerpointTools.updateSlideContent(req.body);
            break;
          case 'delete_slide':
            result = await this.powerpointTools.deleteSlide(req.body);
            break;
          case 'share_presentation':
            result = await this.powerpointTools.sharePresentation(req.body);
            break;
          default:
            return res.status(404).json({ error: `Tool '${toolName}' not found` });
        }
        
        res.json(result);
      } catch (error) {
        res.status(500).json({
          error: `Failed to execute tool '${toolName}'`,
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
  }

  public start(port: number = 3000): void {
    this.app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Serveur MCP PowerPoint HTTP démarré sur le port ${port}`);
      console.log(`📋 Info: http://localhost:${port}/`);
      console.log(`❤️ Health: http://localhost:${port}/health`);
      console.log(`🔧 Tools: http://localhost:${port}/tools/{tool_name}`);
      console.log('✅ Prêt pour Mistral Custom Connector !');
    });
  }
}

// Point d'entrée
async function main() {
  try {
    const port = parseInt(process.env.PORT || '3000');
    const server = new PowerPointHttpServer();
    server.start(port);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { PowerPointHttpServer };