import { Client } from '@microsoft/microsoft-graph-client';
import { GraphAuthManager } from '../auth/graph-auth.js';
import {
  Presentation,
  Slide,
  CreatePresentationArgs,
  AddSlideArgs,
  UpdateSlideContentArgs,
  DeleteSlideArgs,
  GetPresentationArgs,
  ListPresentationsArgs,
  SharePresentationArgs,
} from '../types/powerpoint.js';

export class PowerPointTools {
  constructor(private authManager: GraphAuthManager) {}

  async createPresentation(args: CreatePresentationArgs): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      const client = await this.authManager.getGraphClient();
      
      // Créer un nouveau fichier PowerPoint dans OneDrive
      const presentation = {
        name: `${args.name}.pptx`,
        file: {
          mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        }
      };

      const response = await client
        .api('/me/drive/root/children')
        .post(presentation);

      return {
        content: [
          {
            type: 'text',
            text: `Présentation "${args.name}" créée avec succès. ID: ${response.id}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Erreur lors de la création de la présentation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
          }
        ]
      };
    }
  }

  async listPresentations(args: ListPresentationsArgs): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      const client = await this.authManager.getGraphClient();
      
      let query = "/me/drive/root/children?$filter=file/mimeType eq 'application/vnd.openxmlformats-officedocument.presentationml.presentation'";
      
      if (args.limit) {
        query += `&$top=${args.limit}`;
      }

      if (args.search) {
        query += `&$search="${args.search}"`;
      }

      const response = await client.api(query).get();
      
      const presentations = response.value.map((item: any) => ({
        id: item.id,
        name: item.name,
        createdDateTime: item.createdDateTime,
        lastModifiedDateTime: item.lastModifiedDateTime,
        webUrl: item.webUrl
      }));

      return {
        content: [
          {
            type: 'text',
            text: `Trouvé ${presentations.length} présentation(s):\n${presentations.map((p: any) => `- ${p.name} (ID: ${p.id})`).join('\n')}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Erreur lors de la récupération des présentations: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
          }
        ]
      };
    }
  }

  async getPresentation(args: GetPresentationArgs): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      const client = await this.authManager.getGraphClient();
      
      const response = await client
        .api(`/me/drive/items/${args.presentationId}`)
        .get();

      let result = `Présentation: ${response.name}\n`;
      result += `Créée le: ${new Date(response.createdDateTime).toLocaleDateString()}\n`;
      result += `Modifiée le: ${new Date(response.lastModifiedDateTime).toLocaleDateString()}\n`;
      result += `URL: ${response.webUrl}\n`;

      if (args.includeSlides) {
        // Note: L'API Graph ne donne pas directement accès aux slides PowerPoint
        // Il faudrait utiliser l'API Office.js ou une autre approche pour les détails des slides
        result += '\nPour accéder aux détails des slides, veuillez ouvrir la présentation dans PowerPoint Online.';
      }

      return {
        content: [
          {
            type: 'text',
            text: result
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Erreur lors de la récupération de la présentation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
          }
        ]
      };
    }
  }

  async addSlide(args: AddSlideArgs): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      // Note: L'ajout de slides nécessite l'API Office.js ou PowerPoint REST API
      // Avec Microsoft Graph seul, nous ne pouvons que manipuler les fichiers
      
      return {
        content: [
          {
            type: 'text',
            text: 'L\'ajout de slides nécessite d\'ouvrir la présentation dans PowerPoint Online. ' +
                  'Cette fonctionnalité sera disponible avec l\'intégration Office.js.'
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Erreur lors de l'ajout de la slide: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
          }
        ]
      };
    }
  }

  async updateSlideContent(args: UpdateSlideContentArgs): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      // Note: La modification du contenu des slides nécessite l'API Office.js
      
      return {
        content: [
          {
            type: 'text',
            text: 'La modification du contenu des slides nécessite d\'ouvrir la présentation dans PowerPoint Online. ' +
                  'Cette fonctionnalité sera disponible avec l\'intégration Office.js.'
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Erreur lors de la mise à jour de la slide: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
          }
        ]
      };
    }
  }

  async deleteSlide(args: DeleteSlideArgs): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      // Note: La suppression de slides nécessite l'API Office.js
      
      return {
        content: [
          {
            type: 'text',
            text: 'La suppression de slides nécessite d\'ouvrir la présentation dans PowerPoint Online. ' +
                  'Cette fonctionnalité sera disponible avec l\'intégration Office.js.'
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Erreur lors de la suppression de la slide: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
          }
        ]
      };
    }
  }

  async sharePresentation(args: SharePresentationArgs): Promise<{ content: Array<{ type: string; text: string }> }> {
    try {
      const client = await this.authManager.getGraphClient();
      
      // Créer des invitations de partage
      const invitations = args.emails.map(email => ({
        requireSignIn: true,
        sendInvitation: true,
        roles: [args.permissions === 'edit' ? 'write' : 'read'],
        recipients: [
          {
            email: email
          }
        ]
      }));

      const results = [];
      for (const invitation of invitations) {
        try {
          const response = await client
            .api(`/me/drive/items/${args.presentationId}/invite`)
            .post(invitation);
          
          results.push(`Invitation envoyée à ${invitation.recipients[0].email}`);
        } catch (error) {
          results.push(`Erreur pour ${invitation.recipients[0].email}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: `Partage de la présentation:\n${results.join('\n')}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Erreur lors du partage de la présentation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
          }
        ]
      };
    }
  }
}