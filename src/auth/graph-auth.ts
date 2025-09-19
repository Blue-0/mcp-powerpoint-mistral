import { ConfidentialClientApplication } from '@azure/msal-node';
import { Client } from '@microsoft/microsoft-graph-client';
import { AuthConfig, GraphAuthToken } from '../types/powerpoint.js';

export class GraphAuthManager {
  private clientApp: ConfidentialClientApplication;
  private client: Client | null = null;

  constructor(private authConfig: AuthConfig) {
    this.clientApp = new ConfidentialClientApplication({
      auth: {
        clientId: authConfig.clientId,
        clientSecret: authConfig.clientSecret,
        authority: `https://login.microsoftonline.com/${authConfig.tenantId}`,
      },
    });
  }

  async getAccessToken(): Promise<string> {
    try {
      const clientCredentialRequest = {
        scopes: ['https://graph.microsoft.com/.default'],
      };

      // Pour les applications (pas d'utilisateur), on utilise directement acquireTokenByClientCredential
      const tokenResponse = await this.clientApp.acquireTokenByClientCredential(clientCredentialRequest);
      if (!tokenResponse) {
        throw new Error('Failed to acquire access token');
      }

      return tokenResponse.accessToken;
    } catch (error) {
      console.error('Error acquiring access token:', error);
      throw new Error('Authentication failed');
    }
  }

  async getGraphClient(): Promise<Client> {
    if (!this.client) {
      const accessToken = await this.getAccessToken();
      
      this.client = Client.init({
        authProvider: async (done) => {
          done(null, accessToken);
        },
      });
    }

    return this.client;
  }

  async validateToken(): Promise<boolean> {
    try {
      const client = await this.getGraphClient();
      await client.api('/me').get();
      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

  resetClient(): void {
    this.client = null;
  }
}