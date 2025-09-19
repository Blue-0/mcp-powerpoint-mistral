#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
  CallToolRequest,
} from '@modelcontextprotocol/sdk/types.js';
import * as dotenv from 'dotenv';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Import nos modules
import { GraphAuthManager } from './auth/graph-auth.js';
import { PowerPointTools } from './tools/powerpoint-tools.js';
import { AuthConfig } from './types/powerpoint.js';

// Charger les variables d'environnement
dotenv.config();

class PowerPointMCPServer {
  private server: Server;
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

    // Initialisation du serveur MCP
    this.server = new Server(
      {
        name: process.env.MCP_SERVER_NAME || 'mcp-powerpoint-mistral',
        version: process.env.MCP_SERVER_VERSION || '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // Handler pour lister les outils disponibles
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'create_presentation',
            description: 'Créer une nouvelle présentation PowerPoint',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Nom de la présentation',
                },
                templateId: {
                  type: 'string',
                  description: 'ID du modèle à utiliser (optionnel)',
                },
              },
              required: ['name'],
            },
          },
          {
            name: 'list_presentations',
            description: 'Lister les présentations disponibles',
            inputSchema: {
              type: 'object',
              properties: {
                limit: {
                  type: 'number',
                  description: 'Nombre maximum de présentations à retourner',
                  default: 20,
                },
                search: {
                  type: 'string',
                  description: 'Terme de recherche pour filtrer les présentations',
                },
              },
              required: [],
            },
          },
          {
            name: 'get_presentation',
            description: 'Obtenir les détails d\'une présentation',
            inputSchema: {
              type: 'object',
              properties: {
                presentationId: {
                  type: 'string',
                  description: 'ID de la présentation',
                },
                includeSlides: {
                  type: 'boolean',
                  description: 'Inclure les détails des slides',
                  default: true,
                },
              },
              required: ['presentationId'],
            },
          },
          {
            name: 'add_slide',
            description: 'Ajouter une nouvelle slide à une présentation',
            inputSchema: {
              type: 'object',
              properties: {
                presentationId: {
                  type: 'string',
                  description: 'ID de la présentation',
                },
                layout: {
                  type: 'string',
                  description: 'Layout de la slide (title, content, blank, etc.)',
                  default: 'blank',
                },
                index: {
                  type: 'number',
                  description: 'Position où insérer la slide (optionnel)',
                },
              },
              required: ['presentationId'],
            },
          },
          {
            name: 'update_slide_content',
            description: 'Mettre à jour le contenu d\'une slide',
            inputSchema: {
              type: 'object',
              properties: {
                presentationId: {
                  type: 'string',
                  description: 'ID de la présentation',
                },
                slideId: {
                  type: 'string',
                  description: 'ID de la slide',
                },
                content: {
                  type: 'object',
                  description: 'Contenu à ajouter à la slide',
                  properties: {
                    title: { type: 'string' },
                    text: { type: 'string' },
                    images: { type: 'array' },
                    charts: { type: 'array' },
                  },
                },
              },
              required: ['presentationId', 'slideId', 'content'],
            },
          },
          {
            name: 'delete_slide',
            description: 'Supprimer une slide d\'une présentation',
            inputSchema: {
              type: 'object',
              properties: {
                presentationId: {
                  type: 'string',
                  description: 'ID de la présentation',
                },
                slideId: {
                  type: 'string',
                  description: 'ID de la slide à supprimer',
                },
              },
              required: ['presentationId', 'slideId'],
            },
          },
          {
            name: 'share_presentation',
            description: 'Partager une présentation avec des utilisateurs',
            inputSchema: {
              type: 'object',
              properties: {
                presentationId: {
                  type: 'string',
                  description: 'ID de la présentation',
                },
                permissions: {
                  type: 'string',
                  enum: ['read', 'edit'],
                  description: 'Type de permissions à accorder',
                },
                emails: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Adresses email des utilisateurs à inviter',
                },
              },
              required: ['presentationId', 'permissions', 'emails'],
            },
          },
        ],
      };
    });

    // Handler pour exécuter les outils
    this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'create_presentation':
            return await this.powerpointTools.createPresentation(args as any);

          case 'list_presentations':
            return await this.powerpointTools.listPresentations(args as any);

          case 'get_presentation':
            return await this.powerpointTools.getPresentation(args as any);

          case 'add_slide':
            return await this.powerpointTools.addSlide(args as any);

          case 'update_slide_content':
            return await this.powerpointTools.updateSlideContent(args as any);

          case 'delete_slide':
            return await this.powerpointTools.deleteSlide(args as any);

          case 'share_presentation':
            return await this.powerpointTools.sharePresentation(args as any);

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        console.error(`Error executing tool ${name}:`, error);
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to execute tool: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    });
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Serveur MCP PowerPoint démarré et connecté via stdio');
  }
}

// Point d'entrée principal
async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option('stdio', {
      description: 'Use stdio transport',
      type: 'boolean',
      default: true,
    })
    .help()
    .alias('help', 'h')
    .parseAsync();

  try {
    const server = new PowerPointMCPServer();
    await server.start();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}