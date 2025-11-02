
// Web scraping scheduler for Monday 11:59 PM CST
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
  regionalPrice: number;
  statePrice: number;
  timestamp: Date;
  source: string;
}

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

  constructor() {
    console.log('ScrapingScheduler initialized');
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

    console.log('Scraping scheduler started');
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
      console.log('Executing scheduled scraping...');
      await this.executeScraping();
      this.config.lastRun = now;
      this.config.nextRun = this.calculateNextRun();
    }
  }

  // Execute the scraping (placeholder - actual implementation would call backend)
  private async executeScraping(): Promise<PriceData[]> {
    console.log('Starting web scraping at:', new Date().toLocaleString());
    
    try {
      // In a real implementation, this would:
      // 1. Call a backend service or cloud function
      // 2. Scrape metal pricing websites
      // 3. Process and normalize the data
      // 4. Store in database (Zoho or Supabase)
      
      // For now, we'll simulate the scraping
      const mockPrices: PriceData[] = [
        {
          metalId: 'copper-1',
          metalName: 'Copper',
          grade: '#1 Bare Bright Copper',
          nationalPrice: 3.50,
          regionalPrice: 3.45,
          statePrice: 3.48,
          timestamp: new Date(),
          source: 'scraped',
        },
        // Add more mock data as needed
      ];

      console.log('Scraping completed successfully');
      console.log('Scraped prices for', mockPrices.length, 'metals');
      
      return mockPrices;
    } catch (error) {
      console.error('Error during scraping:', error);
      throw error;
    }
  }

  // Manual trigger for testing
  async triggerManualScraping(): Promise<PriceData[]> {
    console.log('Manual scraping triggered');
    return await this.executeScraping();
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
}

// Singleton instance
export const scrapingScheduler = new ScrapingScheduler();

// Auto-start scheduler (can be disabled if needed)
if (Platform.OS !== 'web') {
  // Only auto-start on native platforms
  // Web scraping should typically happen on backend
  console.log('Note: Web scraping should be implemented on backend for production');
}
