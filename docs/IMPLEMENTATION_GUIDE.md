
# MetalMayhem Implementation Guide

## Overview

This guide explains the implementation of the enhanced MetalMayhem app with comprehensive metal database, web scraping scheduling, and Zoho API integration.

## Features Implemented

### 1. Comprehensive Metal Database

**Location:** `data/metalTypes.ts`

The app now includes 30+ metal types with detailed information:

- **Metal Categories:**
  - Non-Ferrous (Copper, Aluminum, Brass, Zinc)
  - Ferrous (Steel, Iron)
  - Precious (Catalytic Converters, Circuit Boards)
  - Specialty (Stainless Steel, Lead, Titanium, Electric Motors)

- **Each Metal Includes:**
  - Specific grade (e.g., #1 Bare Bright Copper, 6061 Aluminum)
  - Detailed description
  - Common sources (e.g., "Washers and dryers", "Car radiators")
  - Category classification
  - Icon for visual identification

**Example Metals:**
- Copper: #1 Bare Bright, #2 Copper, Insulated Wire
- Aluminum: Extrusion, 6061, Cast, Sheet, Cans
- Brass: Yellow Brass, Red Brass, Shell Casings
- Steel: Heavy Melting, Light Iron, Stainless 304/316/430
- Specialty: Electric Motors, Transformers, Radiators

### 2. Web Scraping Scheduler

**Location:** `services/scrapingScheduler.ts`

Automated scheduling system for price updates:

- **Schedule:** Every Monday at 11:59 PM CST
- **Features:**
  - Automatic calculation of next run time
  - Manual trigger option for testing
  - Status monitoring (last run, next run)
  - Enable/disable toggle
  - Timezone-aware scheduling

**How It Works:**
1. Scheduler checks every minute if it's time to run
2. When scheduled time arrives, executes scraping
3. Stores results in Zoho CRM
4. Calculates next Monday 11:59 PM CST
5. Repeats cycle

**Usage:**
```typescript
import { scrapingScheduler } from '@/services/scrapingScheduler';

// Start scheduler
scrapingScheduler.start();

// Get status
const status = scrapingScheduler.getStatus();

// Manual trigger
await scrapingScheduler.triggerManualScraping();

// Stop scheduler
scrapingScheduler.stop();
```

### 3. Zoho API Integration

**Location:** `services/zohoApi.ts`

Cloud storage and data management via Zoho CRM:

- **Features:**
  - OAuth 2.0 authentication
  - Automatic token refresh
  - Pricing ticket submission
  - Yard data storage
  - Scraped price data storage
  - Cross-device data sync

**Zoho CRM Modules Required:**
1. **Pricing_Tickets** - User-submitted pricing
   - Fields: User_Name, Yard_Name, Metal_Type, Metal_Grade, Price_Per_Pound, Quantity, Timestamp, Verified, Notes

2. **Yards** - Scrap yard information
   - Fields: Name, Address, City, State, Zip_Code, Phone, Hours, Accepted_Metals, Verified, Added_By, Added_Date

3. **Metal_Prices** - Scraped pricing data
   - Fields: Metal_ID, Metal_Name, Grade, National_Price, Regional_Price, State_Price, Timestamp, Source

**Setup Instructions:**
1. Create Zoho CRM account at https://www.zoho.com/crm/
2. Go to Setup > Developer Space > APIs > Self Client
3. Create Self Client for Client ID and Secret
4. Set up the three modules listed above
5. Configure fields in each module
6. Initialize API in app with credentials

**Usage:**
```typescript
import { zohoApi } from '@/services/zohoApi';

// Initialize
zohoApi.initialize(clientId, clientSecret, redirectUri);

// Submit pricing ticket
await zohoApi.submitPricingTicket(ticket);

// Get tickets for yard
const tickets = await zohoApi.getPricingTicketsForYard(yardName);

// Submit yard data
await zohoApi.submitYardData(yard);

// Get all yards
const yards = await zohoApi.getAllYards();
```

## User Interface Updates

### Metal Types Screen (`app/(tabs)/metalTypes.tsx`)

Enhanced with:
- Search functionality (searches names, grades, descriptions, sources)
- Category filtering (All, Non-Ferrous, Ferrous, Precious, Specialty)
- Expandable cards showing full details
- Common sources listed with bullet points
- Current pricing display (National, Regional, State)
- Last update timestamp

### Yard Info Screen (`app/(tabs)/yardInfo.tsx`)

Enhanced with:
- Submit Pricing button on each yard card
- Modal form for ticket submission
- Fields: Metal Type, Grade, Price/lb, Quantity, Notes
- Zoho setup instructions banner
- Integration with Zoho API for ticket storage

### Profile/Settings Screen (`app/(tabs)/profile.tsx`)

New screen featuring:
- Web scraping scheduler controls
- Enable/disable auto-scraping toggle
- Status display (last run, next run)
- Manual scraping trigger button
- Zoho integration status
- Setup instructions access
- App information and statistics

## Data Flow

### Pricing Update Flow:
1. Scheduler triggers at Monday 11:59 PM CST
2. Scraping service fetches prices from sources
3. Data normalized and processed
4. Stored in Zoho CRM Metal_Prices module
5. App fetches updated prices on next launch
6. Displays in Metal Types screen

### Ticket Submission Flow:
1. User visits yard and gets pricing
2. Opens Yard Info screen
3. Taps "Submit Pricing" on yard card
4. Fills out ticket form
5. Submits to Zoho CRM Pricing_Tickets module
6. Admin verifies ticket
7. Verified pricing displayed to community

## Important Notes

### Web Scraping
- **Production Implementation:** Web scraping should be implemented on a backend server, not in the mobile app
- **Current Implementation:** Provides scheduling framework and mock data
- **Recommended Approach:** Use cloud functions (AWS Lambda, Google Cloud Functions) triggered by scheduler
- **Legal Compliance:** Ensure scraping complies with website terms of service

### Zoho API
- **Authentication:** Requires OAuth 2.0 flow with user consent
- **Rate Limits:** Zoho has API rate limits - implement caching
- **Error Handling:** Network errors should be handled gracefully
- **Security:** Never store credentials in app code - use secure storage

### Performance
- **Metal Database:** 30+ metals loaded efficiently with search/filter
- **Lazy Loading:** Expandable cards prevent rendering all details at once
- **Caching:** Consider caching Zoho data locally to reduce API calls

## Testing

### Test Scraping Scheduler:
1. Go to Profile/Settings screen
2. Enable auto-scraping
3. Check "Next Run" time
4. Tap "Trigger Manual Scraping" to test immediately
5. Check console logs for execution

### Test Zoho Integration:
1. Set up Zoho CRM account and modules
2. Configure API credentials
3. Go to Yard Info screen
4. Tap "Submit Pricing" on any yard
5. Fill out form and submit
6. Check Zoho CRM for new record

### Test Metal Database:
1. Go to Metal Types screen
2. Try searching for "copper", "washer", "dryer"
3. Filter by different categories
4. Expand cards to see full details
5. Verify all information displays correctly

## Future Enhancements

1. **Backend Service:** Implement actual web scraping on backend
2. **Real-time Updates:** Push notifications when prices update
3. **User Authentication:** Implement user accounts and profiles
4. **Verification System:** Admin panel for verifying tickets
5. **Analytics:** Track price trends over time
6. **Geolocation:** Auto-detect nearby yards
7. **Photo Upload:** Allow receipt photos with tickets
8. **Rewards System:** Implement achievement badges

## Support

For questions or issues:
- Check console logs for detailed error messages
- Review Zoho API documentation
- Verify all modules and fields are set up correctly
- Ensure network connectivity for API calls

## License

MetalMayhem - Community-driven scrap metal pricing app
