
// Zoho API integration for cloud storage and ticket submission
import { Platform } from 'react-native';

export interface ZohoConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiry: Date | null;
}

export interface PricingTicket {
  id?: string;
  userId: string;
  userName: string;
  yardName: string;
  yardAddress: string;
  metalType: string;
  metalGrade: string;
  pricePerPound: number;
  quantity?: number;
  totalAmount?: number;
  timestamp: Date;
  verified: boolean;
  notes?: string;
  receiptImage?: string;
}

export interface YardData {
  id?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  hours: string;
  acceptedMetals: string[];
  verified: boolean;
  addedBy: string;
  addedDate: Date;
}

class ZohoApiService {
  private config: ZohoConfig = {
    clientId: '',
    clientSecret: '',
    redirectUri: '',
    accessToken: null,
    refreshToken: null,
    tokenExpiry: null,
  };

  private baseUrl = 'https://www.zohoapis.com/crm/v3';
  private authUrl = 'https://accounts.zoho.com/oauth/v2';

  constructor() {
    console.log('ZohoApiService initialized');
    console.log('Note: Configure Zoho credentials before using');
  }

  // Initialize with credentials
  initialize(clientId: string, clientSecret: string, redirectUri: string) {
    this.config.clientId = clientId;
    this.config.clientSecret = clientSecret;
    this.config.redirectUri = redirectUri;
    console.log('Zoho API configured');
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return !!(
      this.config.accessToken &&
      this.config.tokenExpiry &&
      this.config.tokenExpiry > new Date()
    );
  }

  // Get authorization URL
  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: 'ZohoCRM.modules.ALL,ZohoCRM.settings.ALL',
      access_type: 'offline',
    });

    return `${this.authUrl}/auth?${params.toString()}`;
  }

  // Exchange authorization code for tokens
  async exchangeCodeForTokens(code: string): Promise<void> {
    try {
      const response = await fetch(`${this.authUrl}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          redirect_uri: this.config.redirectUri,
          code: code,
        }).toString(),
      });

      const data = await response.json();

      if (data.access_token) {
        this.config.accessToken = data.access_token;
        this.config.refreshToken = data.refresh_token;
        this.config.tokenExpiry = new Date(Date.now() + data.expires_in * 1000);
        console.log('Zoho authentication successful');
      } else {
        throw new Error('Failed to obtain access token');
      }
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      throw error;
    }
  }

  // Refresh access token
  async refreshAccessToken(): Promise<void> {
    if (!this.config.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(`${this.authUrl}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          refresh_token: this.config.refreshToken,
        }).toString(),
      });

      const data = await response.json();

      if (data.access_token) {
        this.config.accessToken = data.access_token;
        this.config.tokenExpiry = new Date(Date.now() + data.expires_in * 1000);
        console.log('Access token refreshed');
      } else {
        throw new Error('Failed to refresh access token');
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw error;
    }
  }

  // Make authenticated API request
  private async makeRequest(
    endpoint: string,
    method: string = 'GET',
    body?: any
  ): Promise<any> {
    // Check and refresh token if needed
    if (!this.isAuthenticated()) {
      if (this.config.refreshToken) {
        await this.refreshAccessToken();
      } else {
        throw new Error('Not authenticated. Please login first.');
      }
    }

    const headers: Record<string, string> = {
      'Authorization': `Zoho-oauthtoken ${this.config.accessToken}`,
      'Content-Type': 'application/json',
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Submit pricing ticket
  async submitPricingTicket(ticket: PricingTicket): Promise<string> {
    console.log('Submitting pricing ticket to Zoho:', ticket);

    const recordData = {
      data: [
        {
          User_Name: ticket.userName,
          Yard_Name: ticket.yardName,
          Yard_Address: ticket.yardAddress,
          Metal_Type: ticket.metalType,
          Metal_Grade: ticket.metalGrade,
          Price_Per_Pound: ticket.pricePerPound,
          Quantity: ticket.quantity || 0,
          Total_Amount: ticket.totalAmount || 0,
          Timestamp: ticket.timestamp.toISOString(),
          Verified: ticket.verified,
          Notes: ticket.notes || '',
        },
      ],
    };

    try {
      const response = await this.makeRequest(
        '/Pricing_Tickets',
        'POST',
        recordData
      );

      const recordId = response.data[0].details.id;
      console.log('Pricing ticket submitted successfully:', recordId);
      return recordId;
    } catch (error) {
      console.error('Error submitting pricing ticket:', error);
      throw error;
    }
  }

  // Get pricing tickets for a yard
  async getPricingTicketsForYard(yardName: string): Promise<PricingTicket[]> {
    console.log('Fetching pricing tickets for yard:', yardName);

    try {
      const response = await this.makeRequest(
        `/Pricing_Tickets/search?criteria=(Yard_Name:equals:${encodeURIComponent(yardName)})`
      );

      const tickets: PricingTicket[] = response.data.map((record: any) => ({
        id: record.id,
        userId: record.User_Id || '',
        userName: record.User_Name,
        yardName: record.Yard_Name,
        yardAddress: record.Yard_Address,
        metalType: record.Metal_Type,
        metalGrade: record.Metal_Grade,
        pricePerPound: record.Price_Per_Pound,
        quantity: record.Quantity,
        totalAmount: record.Total_Amount,
        timestamp: new Date(record.Timestamp),
        verified: record.Verified,
        notes: record.Notes,
      }));

      console.log('Retrieved', tickets.length, 'pricing tickets');
      return tickets;
    } catch (error) {
      console.error('Error fetching pricing tickets:', error);
      throw error;
    }
  }

  // Submit new yard data
  async submitYardData(yard: YardData): Promise<string> {
    console.log('Submitting yard data to Zoho:', yard);

    const recordData = {
      data: [
        {
          Name: yard.name,
          Address: yard.address,
          City: yard.city,
          State: yard.state,
          Zip_Code: yard.zipCode,
          Phone: yard.phone,
          Hours: yard.hours,
          Accepted_Metals: yard.acceptedMetals.join(', '),
          Verified: yard.verified,
          Added_By: yard.addedBy,
          Added_Date: yard.addedDate.toISOString(),
        },
      ],
    };

    try {
      const response = await this.makeRequest('/Yards', 'POST', recordData);

      const recordId = response.data[0].details.id;
      console.log('Yard data submitted successfully:', recordId);
      return recordId;
    } catch (error) {
      console.error('Error submitting yard data:', error);
      throw error;
    }
  }

  // Get all yards
  async getAllYards(): Promise<YardData[]> {
    console.log('Fetching all yards from Zoho');

    try {
      const response = await this.makeRequest('/Yards');

      const yards: YardData[] = response.data.map((record: any) => ({
        id: record.id,
        name: record.Name,
        address: record.Address,
        city: record.City,
        state: record.State,
        zipCode: record.Zip_Code,
        phone: record.Phone,
        hours: record.Hours,
        acceptedMetals: record.Accepted_Metals?.split(', ') || [],
        verified: record.Verified,
        addedBy: record.Added_By,
        addedDate: new Date(record.Added_Date),
      }));

      console.log('Retrieved', yards.length, 'yards');
      return yards;
    } catch (error) {
      console.error('Error fetching yards:', error);
      throw error;
    }
  }

  // Store scraped pricing data
  async storePricingData(prices: any[]): Promise<void> {
    console.log('Storing scraped pricing data to Zoho');

    const recordData = {
      data: prices.map(price => ({
        Metal_ID: price.metalId,
        Metal_Name: price.metalName,
        Grade: price.grade,
        National_Price: price.nationalPrice,
        Regional_Price: price.regionalPrice,
        State_Price: price.statePrice,
        Timestamp: price.timestamp.toISOString(),
        Source: price.source,
      })),
    };

    try {
      await this.makeRequest('/Metal_Prices', 'POST', recordData);
      console.log('Pricing data stored successfully');
    } catch (error) {
      console.error('Error storing pricing data:', error);
      throw error;
    }
  }
}

// Singleton instance
export const zohoApi = new ZohoApiService();

// Instructions for setup
export const ZOHO_SETUP_INSTRUCTIONS = `
To enable Zoho API integration:

1. Create a Zoho CRM account at https://www.zoho.com/crm/
2. Go to Setup > Developer Space > APIs > Self Client
3. Create a new Self Client to get your Client ID and Client Secret
4. Set up the following modules in Zoho CRM:
   - Pricing_Tickets (for user-submitted pricing)
   - Yards (for scrap yard information)
   - Metal_Prices (for scraped pricing data)
5. Configure the required fields in each module
6. Initialize the API with your credentials in the app

Note: For production, implement OAuth flow with proper redirect handling.
For development, you can use the Self Client for testing.
`;
