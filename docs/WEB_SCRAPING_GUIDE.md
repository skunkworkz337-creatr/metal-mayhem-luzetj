
# Web Scraping Implementation Guide

## Overview
This guide explains how to implement reliable web scraping for MetalMayhem to ensure it runs as scheduled every Monday at 11:59 PM CST.

## Current Implementation
The current implementation in `services/scrapingScheduler.ts` uses device-based scheduling with `setInterval`. This approach has limitations:

- **Unreliable on Mobile**: Apps can be killed by the OS, preventing scheduled tasks from running
- **Battery Drain**: Continuous background processes drain device battery
- **Network Dependency**: Requires the device to have active internet connection
- **No Guarantee**: No guarantee the scraping will run at the exact scheduled time

## Recommended Production Implementation

### Option 1: Cloud Functions (Recommended)

#### AWS Lambda
1. **Create Lambda Function**:
   - Write a Lambda function in Node.js to scrape metal prices
   - Use libraries like `axios` and `cheerio` for web scraping
   - Store results in Zoho CRM via API

2. **Schedule with EventBridge**:
   ```javascript
   // EventBridge rule: cron(59 23 ? * MON *)
   // Runs every Monday at 11:59 PM UTC (adjust for CST)
   ```

3. **Error Handling**:
   - Implement retry logic for failed scrapes
   - Send notifications on failures (SNS, email)
   - Log all activities to CloudWatch

#### Google Cloud Functions
1. **Create Cloud Function**:
   - Similar to Lambda, write scraping logic
   - Deploy to Google Cloud

2. **Schedule with Cloud Scheduler**:
   ```
   Schedule: 59 23 * * 1
   Timezone: America/Chicago (CST)
   ```

3. **Monitoring**:
   - Use Cloud Logging for monitoring
   - Set up alerts for failures

### Option 2: Backend Server with Cron Jobs

1. **Set Up Server**:
   - Deploy a Node.js server (Express, Fastify, etc.)
   - Can use services like Heroku, DigitalOcean, AWS EC2

2. **Implement Cron Job**:
   ```javascript
   const cron = require('node-cron');
   
   // Run every Monday at 11:59 PM CST
   cron.schedule('59 23 * * 1', async () => {
     console.log('Starting scheduled scraping...');
     await scrapePrices();
   }, {
     timezone: "America/Chicago"
   });
   ```

3. **Scraping Logic**:
   ```javascript
   async function scrapePrices() {
     try {
       // Scrape metal pricing websites
       const prices = await scrapeMetalPrices();
       
       // Store in Zoho CRM
       await zohoApi.storePricingData(prices);
       
       // Log success
       console.log('Scraping completed successfully');
     } catch (error) {
       console.error('Scraping failed:', error);
       // Send alert notification
       await sendErrorNotification(error);
     }
   }
   ```

### Option 3: Third-Party Services

#### Zapier
- Create a Zap that triggers on schedule
- Use webhooks to call your scraping endpoint
- Limited customization but easy to set up

#### Make (formerly Integromat)
- Similar to Zapier with more flexibility
- Can handle complex workflows

## Web Scraping Best Practices

### 1. Respect robots.txt
Always check and respect the website's robots.txt file:
```javascript
const robotsParser = require('robots-parser');

const robots = robotsParser('https://example.com/robots.txt', userAgent);
if (!robots.isAllowed(url, userAgent)) {
  console.log('Scraping not allowed by robots.txt');
  return;
}
```

### 2. Rate Limiting
Implement delays between requests to avoid overwhelming servers:
```javascript
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

for (const url of urls) {
  await scrapeUrl(url);
  await delay(2000); // 2 second delay between requests
}
```

### 3. User Agent
Use a proper user agent string:
```javascript
const headers = {
  'User-Agent': 'MetalMayhem Price Scraper (contact@metalmayhem.com)'
};
```

### 4. Error Handling
Implement robust error handling:
```javascript
async function scrapeWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await scrapeUrl(url);
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === maxRetries - 1) throw error;
      await delay(5000 * (i + 1)); // Exponential backoff
    }
  }
}
```

### 5. Data Validation
Validate scraped data before storing:
```javascript
function validatePrice(price) {
  const parsed = parseFloat(price);
  if (isNaN(parsed) || parsed < 0 || parsed > 100) {
    throw new Error(`Invalid price: ${price}`);
  }
  return parsed;
}
```

## Timezone Considerations

### CST/CDT Handling
Central Time observes Daylight Saving Time:
- **CST**: UTC-6 (November - March)
- **CDT**: UTC-5 (March - November)

Use timezone-aware scheduling:
```javascript
// For cron jobs
cron.schedule('59 23 * * 1', task, {
  timezone: "America/Chicago" // Automatically handles DST
});

// For AWS EventBridge
// Use cron expression with timezone parameter
```

## Monitoring and Logging

### Essential Logs
1. **Start Time**: When scraping begins
2. **URLs Scraped**: Which sites were accessed
3. **Data Points**: Number of prices collected
4. **Errors**: Any failures or issues
5. **End Time**: When scraping completes
6. **Duration**: Total time taken

### Example Logging
```javascript
const logger = {
  info: (message, data) => {
    console.log(JSON.stringify({
      level: 'info',
      timestamp: new Date().toISOString(),
      message,
      data
    }));
  },
  error: (message, error) => {
    console.error(JSON.stringify({
      level: 'error',
      timestamp: new Date().toISOString(),
      message,
      error: error.message,
      stack: error.stack
    }));
  }
};
```

## Notification System

### Success Notifications
Send confirmation when scraping completes:
```javascript
async function sendSuccessNotification(stats) {
  await sendEmail({
    to: 'admin@metalmayhem.com',
    subject: 'Weekly Scraping Completed',
    body: `
      Scraping completed successfully!
      - Prices collected: ${stats.pricesCollected}
      - Duration: ${stats.duration}ms
      - Timestamp: ${new Date().toISOString()}
    `
  });
}
```

### Error Notifications
Alert admins when scraping fails:
```javascript
async function sendErrorNotification(error) {
  await sendEmail({
    to: 'admin@metalmayhem.com',
    subject: 'ALERT: Scraping Failed',
    body: `
      Scraping failed with error:
      ${error.message}
      
      Stack trace:
      ${error.stack}
    `
  });
}
```

## Integration with Mobile App

### Status Updates
The mobile app can check scraping status via API:
```javascript
// Backend endpoint
app.get('/api/scraping/status', async (req, res) => {
  const status = await getScrapingStatus();
  res.json(status);
});

// Mobile app
const status = await fetch('/api/scraping/status').then(r => r.json());
```

### Manual Trigger (Admin Only)
Allow admins to manually trigger scraping:
```javascript
// Backend endpoint (with admin authentication)
app.post('/api/scraping/trigger', authenticateAdmin, async (req, res) => {
  await triggerScraping();
  res.json({ success: true });
});
```

## Cost Considerations

### AWS Lambda
- **Free Tier**: 1M requests/month, 400,000 GB-seconds compute
- **Estimated Cost**: $0-5/month for weekly scraping

### Google Cloud Functions
- **Free Tier**: 2M invocations/month
- **Estimated Cost**: $0-5/month for weekly scraping

### Backend Server
- **Heroku**: $7/month for basic dyno
- **DigitalOcean**: $5/month for basic droplet
- **AWS EC2**: $3-10/month for t2.micro

## Security Considerations

1. **API Keys**: Store Zoho API keys in environment variables
2. **Authentication**: Protect admin endpoints with authentication
3. **Rate Limiting**: Implement rate limiting on API endpoints
4. **HTTPS**: Always use HTTPS for API communication
5. **Input Validation**: Validate all inputs to prevent injection attacks

## Testing

### Local Testing
```javascript
// Test scraping locally
npm run test:scraping

// Test with specific date/time
SCRAPE_DATE="2024-01-15T23:59:00" npm run test:scraping
```

### Staging Environment
- Set up staging environment with test data
- Run scraping on different schedule (e.g., daily)
- Verify data quality and error handling

## Conclusion

For production use, implement web scraping on a backend server or cloud function rather than on the mobile device. This ensures:

- ✅ Reliable execution at scheduled times
- ✅ Better error handling and monitoring
- ✅ No battery drain on user devices
- ✅ Centralized logging and debugging
- ✅ Easier maintenance and updates

The current device-based implementation in `services/scrapingScheduler.ts` is suitable for development and testing but should not be used in production.
