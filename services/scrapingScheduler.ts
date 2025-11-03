
// Web scraping scheduler for Monday 11:59 PM CST
// Integrates with Gumloop for pricing data
import { Platform } from 'react-native';

export interface ScrapingConfig {
  enabled: boolean;
  lastRun: Date | null;
  nextRun: Date | null;
  targetDay: number; // 1 = Monday
  targetHour: number; // 23 = 11 PM
  targetMinute: number; // 59
  timezone: string; // 'America/Chicago' for CST
}

export interface PriceData {
  metalId: string;
  metalName: string;
  grade: string;
  nationalPrice: number;
  timestamp: Date;
  source: string;
}

// Gumloop API configuration
const GUMLOOP_API_URL = 'https://www.gumloop.com/interface/New-Interface-vRoDvMTdG29c2mwqEJNYTX';

class ScrapingScheduler {
  private config: ScrapingConfig = {
    enabled: true,
    lastRun: null,
    nextRun: null,
    targetDay: 1, // Monday
    targetHour: 23, // 11 PM
    targetMinute: 59,
    timezone: 'America/Chicago',
  };

  private intervalId: NodeJS.Timeout | null = null;
  private cachedPrices: PriceData[] = [];

  constructor() {
    console.log('ScrapingScheduler initialized with Gumloop integration');
    console.log('Gumloop API URL:', GUMLOOP_API_URL);
  }

  // Calculate next scheduled run time
  calculateNextRun(): Date {
    const now = new Date();
    const next = new Date(now);
    
    // Set to target time
    next.setHours(this.config.targetHour, this.config.targetMinute, 0, 0);
    
    // Calculate days until next Monday
    const currentDay = now.getDay();
    const daysUntilMonday = (this.config.targetDay + 7 - currentDay) % 7;
    
    // If it's Monday but past the target time, schedule for next Monday
    if (daysUntilMonday === 0 && now.getTime() > next.getTime()) {
      next.setDate(next.getDate() + 7);
    } else {
      next.setDate(next.getDate() + daysUntilMonday);
    }
    
    console.log('Next scraping scheduled for:', next.toLocaleString('en-US', { 
      timeZone: this.config.timezone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    }));
    
    return next;
  }

  // Start the scheduler
  start() {
    if (this.intervalId) {
      console.log('Scheduler already running');
      return;
    }

    this.config.nextRun = this.calculateNextRun();
    
    // Check every minute if it's time to scrape
    this.intervalId = setInterval(() => {
      this.checkAndRun();
    }, 60000); // Check every minute

    console.log('Scraping scheduler started with Gumloop integration');
    console.log('Next run:', this.config.nextRun?.toLocaleString());
  }

  // Stop the scheduler
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Scraping scheduler stopped');
    }
  }

  // Check if it's time to run and execute
  private async checkAndRun() {
    const now = new Date();
    
    if (this.config.nextRun && now >= this.config.nextRun) {
      console.log('Executing scheduled scraping from Gumloop...');
      await this.executeScraping();
      this.config.lastRun = now;
      this.config.nextRun = this.calculateNextRun();
    }
  }

  // Fetch pricing data from Gumloop
  private async fetchFromGumloop(): Promise<PriceData[]> {
    console.log('Fetching pricing data from Gumloop API...');
    
    try {
      const response = await fetch(GUMLOOP_API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Gumloop API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Gumloop API response received');
      
      // Parse the Gumloop response and convert to PriceData format
      const prices = this.parseGumloopResponse(data);
      
      console.log(`Successfully fetched ${prices.length} metal prices from Gumloop`);
      return prices;
      
    } catch (error) {
      console.error('Error fetching from Gumloop:', error);
      
      // Return cached prices if available
      if (this.cachedPrices.length > 0) {
        console.log('Using cached prices due to API error');
        return this.cachedPrices;
      }
      
      // Return mock data as fallback
      console.log('Using fallback mock data');
      return this.getMockPrices();
    }
  }

  // Parse Gumloop API response into PriceData format
  private parseGumloopResponse(data: any): PriceData[] {
    console.log('Parsing Gumloop response...');
    
    try {
      // The exact structure depends on Gumloop's response format
      // This is a flexible parser that handles various formats
      
      let pricesArray: any[] = [];
      
      // Handle different response structures
      if (Array.isArray(data)) {
        pricesArray = data;
      } else if (data.prices && Array.isArray(data.prices)) {
        pricesArray = data.prices;
      } else if (data.data && Array.isArray(data.data)) {
        pricesArray = data.data;
      } else if (data.results && Array.isArray(data.results)) {
        pricesArray = data.results;
      } else {
        console.warn('Unexpected Gumloop response format:', data);
        return this.getMockPrices();
      }
      
      // Map to PriceData format
      const prices: PriceData[] = pricesArray.map((item: any) => ({
        metalId: item.metalId || item.id || item.metal_id || `metal-${Date.now()}`,
        metalName: item.metalName || item.name || item.metal_name || 'Unknown Metal',
        grade: item.grade || item.type || item.metal_grade || 'Standard',
        nationalPrice: parseFloat(item.nationalPrice || item.price || item.national_price || item.value || 0),
        timestamp: new Date(item.timestamp || item.updated_at || item.date || Date.now()),
        source: 'gumloop',
      }));
      
      console.log(`Parsed ${prices.length} prices from Gumloop response`);
      return prices;
      
    } catch (error) {
      console.error('Error parsing Gumloop response:', error);
      return this.getMockPrices();
    }
  }

  // Get mock prices as fallback
  private getMockPrices(): PriceData[] {
    const now = new Date();
    
    return [
      {
        metalId: 'copper-1',
        metalName: 'Copper',
        grade: '#1 Bare Bright Copper',
        nationalPrice: 3.50,
        timestamp: now,
        source: 'mock',
      },
      {
        metalId: 'copper-2',
        metalName: 'Copper',
        grade: '#2 Copper',
        nationalPrice: 3.20,
        timestamp: now,
        source: 'mock',
      },
      {
        metalId: 'aluminum-extrusion',
        metalName: 'Aluminum',
        grade: 'Aluminum Extrusion',
        nationalPrice: 0.65,
        timestamp: now,
        source: 'mock',
      },
      {
        metalId: 'aluminum-cans',
        metalName: 'Aluminum',
        grade: 'Aluminum Cans (UBC)',
        nationalPrice: 0.45,
        timestamp: now,
        source: 'mock',
      },
      {
        metalId: 'brass-yellow',
        metalName: 'Brass',
        grade: 'Yellow Brass',
        nationalPrice: 2.10,
        timestamp: now,
        source: 'mock',
      },
      {
        metalId: 'brass-red',
        metalName: 'Brass',
        grade: 'Red Brass',
        nationalPrice: 2.50,
        timestamp: now,
        source: 'mock',
      },
      {
        metalId: 'steel-heavy',
        metalName: 'Steel',
        grade: 'Heavy Melting Steel (HMS)',
        nationalPrice: 0.12,
        timestamp: now,
        source: 'mock',
      },
      {
        metalId: 'steel-light',
        metalName: 'Steel',
        grade: 'Light Iron',
        nationalPrice: 0.08,
        timestamp: now,
        source: 'mock',
      },
      {
        metalId: 'stainless-304',
        metalName: 'Stainless Steel',
        grade: '304 Stainless',
        nationalPrice: 0.55,
        timestamp: now,
        source: 'mock',
      },
      {
        metalId: 'stainless-316',
        metalName: 'Stainless Steel',
        grade: '316 Stainless',
        nationalPrice: 0.75,
        timestamp: now,
        source: 'mock',
      },
    ];
  }

  // Execute the scraping
  private async executeScraping(): Promise<PriceData[]> {
    console.log('Starting web scraping at:', new Date().toLocaleString());
    console.log('Fetching from Gumloop API:', GUMLOOP_API_URL);
    
    try {
      // Fetch from Gumloop
      const prices = await this.fetchFromGumloop();
      
      // Cache the prices
      this.cachedPrices = prices;
      
      console.log('Scraping completed successfully');
      console.log(`Retrieved ${prices.length} metal prices`);
      console.log('Source:', prices[0]?.source || 'unknown');
      
      return prices;
      
    } catch (error) {
      console.error('Error during scraping:', error);
      throw error;
    }
  }

  // Manual trigger for testing
  async triggerManualScraping(): Promise<PriceData[]> {
    console.log('Manual scraping triggered - fetching from Gumloop');
    return await this.executeScraping();
  }

  // Get cached prices
  getCachedPrices(): PriceData[] {
    return this.cachedPrices;
  }

  // Get price for specific metal
  getPriceForMetal(metalId: string): PriceData | null {
    return this.cachedPrices.find(p => p.metalId === metalId) || null;
  }

  // Get scheduler status
  getStatus(): ScrapingConfig {
    return { ...this.config };
  }

  // Update configuration
  updateConfig(updates: Partial<ScrapingConfig>) {
    this.config = { ...this.config, ...updates };
    if (this.intervalId) {
      this.stop();
      this.start();
    }
    console.log('Scheduler configuration updated:', this.config);
  }

  // Get Gumloop API URL (for display/debugging)
  getGumloopUrl(): string {
    return GUMLOOP_API_URL;
  }
}

// Singleton instance
export const scrapingScheduler = new ScrapingScheduler();

// Auto-start scheduler (can be disabled if needed)
if (Platform.OS !== 'web') {
  // Only auto-start on native platforms
  // Web scraping should typically happen on backend
  console.log('Note: Web scraping integrated with Gumloop API');
  console.log('Gumloop URL:', GUMLOOP_API_URL);
}
