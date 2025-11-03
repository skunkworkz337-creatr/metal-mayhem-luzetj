
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
  private isUpdating: boolean = false;

  constructor() {
    console.log('ScrapingScheduler initialized with Gumloop integration');
    console.log('Gumloop API URL:', GUMLOOP_API_URL);
    
    // Perform initial force update on startup
    this.forceUpdate();
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

  // Force update - fetch immediately regardless of schedule
  async forceUpdate(): Promise<PriceData[]> {
    if (this.isUpdating) {
      console.log('Update already in progress, skipping force update');
      return this.cachedPrices;
    }

    console.log('🔄 FORCE UPDATE: Fetching latest pricing from Gumloop...');
    this.isUpdating = true;

    try {
      const prices = await this.executeScraping();
      this.config.lastRun = new Date();
      console.log('✅ Force update completed successfully');
      console.log(`📊 Updated ${prices.length} metal prices`);
      return prices;
    } catch (error) {
      console.error('❌ Force update failed:', error);
      throw error;
    } finally {
      this.isUpdating = false;
    }
  }

  // Fetch pricing data from Gumloop
  private async fetchFromGumloop(): Promise<PriceData[]> {
    console.log('Fetching pricing data from Gumloop API...');
    console.log('API URL:', GUMLOOP_API_URL);
    
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
      console.log('Response structure:', Object.keys(data));
      
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
      } else if (data.rows && Array.isArray(data.rows)) {
        pricesArray = data.rows;
      } else if (data.items && Array.isArray(data.items)) {
        pricesArray = data.items;
      } else {
        console.warn('Unexpected Gumloop response format:', data);
        console.log('Available keys:', Object.keys(data));
        
        // Try to extract any array from the response
        const firstArrayKey = Object.keys(data).find(key => Array.isArray(data[key]));
        if (firstArrayKey) {
          console.log(`Found array at key: ${firstArrayKey}`);
          pricesArray = data[firstArrayKey];
        } else {
          return this.getMockPrices();
        }
      }
      
      console.log(`Found ${pricesArray.length} items in response`);
      
      // Map to PriceData format with flexible field mapping
      const prices: PriceData[] = pricesArray.map((item: any, index: number) => {
        // Try multiple field name variations for each property
        const metalId = item.metalId || item.id || item.metal_id || item.metalID || item.ID || `metal-${index}`;
        const metalName = item.metalName || item.name || item.metal_name || item.metaltype || item.type || item.metal || 'Unknown Metal';
        const grade = item.grade || item.type || item.metal_grade || item.metalGrade || item.category || item.subtype || 'Standard';
        
        // Price parsing - handle various formats
        let nationalPrice = 0;
        const priceValue = item.nationalPrice || item.price || item.national_price || item.value || 
                          item.pricePerLb || item.price_per_lb || item.rate || item.amount || 0;
        
        if (typeof priceValue === 'string') {
          // Remove currency symbols and parse
          nationalPrice = parseFloat(priceValue.replace(/[$,]/g, ''));
        } else {
          nationalPrice = parseFloat(priceValue);
        }
        
        // Timestamp parsing
        let timestamp = new Date();
        const timeValue = item.timestamp || item.updated_at || item.date || item.lastUpdated || item.last_updated;
        if (timeValue) {
          timestamp = new Date(timeValue);
        }
        
        return {
          metalId: String(metalId),
          metalName: String(metalName),
          grade: String(grade),
          nationalPrice: isNaN(nationalPrice) ? 0 : nationalPrice,
          timestamp,
          source: 'gumloop',
        };
      });
      
      // Filter out invalid entries
      const validPrices = prices.filter(p => p.nationalPrice > 0);
      
      console.log(`Parsed ${validPrices.length} valid prices from Gumloop response`);
      
      if (validPrices.length > 0) {
        console.log('Sample parsed data:', validPrices[0]);
      }
      
      return validPrices.length > 0 ? validPrices : this.getMockPrices();
      
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
        metalId: 'copper-insulated',
        metalName: 'Insulated Copper Wire',
        grade: 'ICW / THHN',
        nationalPrice: 1.85,
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
        metalId: 'aluminum-6061',
        metalName: 'Aluminum',
        grade: '6061 Aluminum',
        nationalPrice: 0.75,
        timestamp: now,
        source: 'mock',
      },
      {
        metalId: 'aluminum-cast',
        metalName: 'Aluminum',
        grade: 'Cast Aluminum',
        nationalPrice: 0.50,
        timestamp: now,
        source: 'mock',
      },
      {
        metalId: 'aluminum-sheet',
        metalName: 'Aluminum',
        grade: 'Aluminum Sheet',
        nationalPrice: 0.55,
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
        metalId: 'brass-shell-casings',
        metalName: 'Brass',
        grade: 'Brass Shell Casings',
        nationalPrice: 1.90,
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
        metalId: 'steel-shredded',
        metalName: 'Steel',
        grade: 'Shredded Steel',
        nationalPrice: 0.10,
        timestamp: now,
        source: 'mock',
      },
      {
        metalId: 'steel-tin',
        metalName: 'Steel',
        grade: 'Tin Cans',
        nationalPrice: 0.05,
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
      {
        metalId: 'stainless-430',
        metalName: 'Stainless Steel',
        grade: '430 Stainless',
        nationalPrice: 0.35,
        timestamp: now,
        source: 'mock',
      },
      {
        metalId: 'lead-soft',
        metalName: 'Lead',
        grade: 'Soft Lead',
        nationalPrice: 0.45,
        timestamp: now,
        source: 'mock',
      },
      {
        metalId: 'lead-batteries',
        metalName: 'Lead',
        grade: 'Lead Acid Batteries',
        nationalPrice: 0.25,
        timestamp: now,
        source: 'mock',
      },
      {
        metalId: 'zinc-die-cast',
        metalName: 'Zinc',
        grade: 'Zinc Die Cast',
        nationalPrice: 0.85,
        timestamp: now,
        source: 'mock',
      },
      {
        metalId: 'nickel-alloy',
        metalName: 'Nickel',
        grade: 'Nickel Alloy',
        nationalPrice: 4.50,
        timestamp: now,
        source: 'mock',
      },
      {
        metalId: 'titanium',
        metalName: 'Titanium',
        grade: 'Titanium Scrap',
        nationalPrice: 2.75,
        timestamp: now,
        source: 'mock',
      },
      {
        metalId: 'electric-motors',
        metalName: 'Electric Motors',
        grade: 'Electric Motors',
        nationalPrice: 0.18,
        timestamp: now,
        source: 'mock',
      },
      {
        metalId: 'transformers',
        metalName: 'Transformers',
        grade: 'Copper Transformers',
        nationalPrice: 0.35,
        timestamp: now,
        source: 'mock',
      },
      {
        metalId: 'radiators-copper',
        metalName: 'Radiators',
        grade: 'Copper/Brass Radiators',
        nationalPrice: 1.85,
        timestamp: now,
        source: 'mock',
      },
      {
        metalId: 'radiators-aluminum',
        metalName: 'Radiators',
        grade: 'Aluminum Radiators',
        nationalPrice: 0.55,
        timestamp: now,
        source: 'mock',
      },
      {
        metalId: 'catalytic-converters',
        metalName: 'Catalytic Converters',
        grade: 'Catalytic Converters',
        nationalPrice: 150.00,
        timestamp: now,
        source: 'mock',
      },
      {
        metalId: 'computer-boards',
        metalName: 'Computer Boards',
        grade: 'Circuit Boards',
        nationalPrice: 2.50,
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
    return await this.forceUpdate();
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

  // Check if update is in progress
  isUpdateInProgress(): boolean {
    return this.isUpdating;
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
