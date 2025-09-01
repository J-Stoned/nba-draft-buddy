# 🚀 NBA Draft Buddy Deployment Guide

## Quick Start: Get Your Elite Draft Engine Live in 20 Minutes!

### Prerequisites Checklist
- [x] Supabase project created
- [x] Upstash Redis database created  
- [x] Vercel account ready
- [x] Environment variables prepared

---

## 🏗️ STEP 1: Database Setup (5 minutes)

### Supabase Configuration
1. **Create Supabase Project**
   ```bash
   # Go to https://supabase.com/dashboard
   # Click "New Project"
   # Choose organization and region (US East recommended)
   ```

2. **Run Database Migration**
   ```bash
   cd infrastructure/supabase
   # Copy the SQL from migrations/001_initial_schema.sql
   # Paste and run in Supabase SQL Editor
   ```

3. **Seed with Sample Data**
   ```bash
   # Copy the SQL from seed.sql  
   # Run in Supabase SQL Editor for test data
   ```

### Get Your Supabase Keys
```bash
# From Supabase Dashboard > Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
```

---

## ⚡ STEP 2: Redis Cache Setup (3 minutes)

### Upstash Redis Configuration
1. **Create Redis Database**
   ```bash
   # Go to https://console.upstash.com/redis
   # Click "Create Database"
   # Choose region close to your users
   ```

2. **Get Redis Credentials**
   ```bash
   UPSTASH_REDIS_URL=https://your-redis.upstash.io
   UPSTASH_REDIS_TOKEN=your_redis_token
   ```

---

## 🔧 STEP 3: Environment Setup (5 minutes)

### Create Production Environment File
```bash
# Create apps/api/.env.local
cp apps/api/.env.example apps/api/.env.local

# Fill in your actual values:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJ0eXAiOiJKV1QiLCJhbGci...
UPSTASH_REDIS_URL=https://your-redis.upstash.io
UPSTASH_REDIS_TOKEN=your_token_here
DATA_REFRESH_API_KEY=your-secure-api-key-123
```

### Yahoo Fantasy API (Optional - for full integration)
```bash
YAHOO_CLIENT_ID=your_yahoo_client_id
YAHOO_CLIENT_SECRET=your_yahoo_client_secret
```

---

## 🚀 STEP 4: Deploy to Vercel (7 minutes)

### Option A: Automatic Deployment (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel --prod

# Set environment variables in Vercel dashboard
# Go to Project Settings > Environment Variables
```

### Option B: GitHub Integration
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Vercel Environment Variables
Add these in your Vercel project dashboard:
```
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_KEY  
UPSTASH_REDIS_URL
UPSTASH_REDIS_TOKEN
DATA_REFRESH_API_KEY
NODE_ENV=production
```

---

## 🧪 STEP 5: Test Your Live API (5 minutes)

### Health Check
```bash
curl https://your-app.vercel.app/api/trpc/health.check
```

Expected Response:
```json
{
  "status": "ok",
  "timestamp": "2025-09-01T...",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "cache": "connected", 
    "draftEngine": "ready"
  }
}
```

### Load Sample Data
```bash
curl -X POST https://your-app.vercel.app/api/data/refresh \
  -H "Authorization: Bearer your-api-key"
```

### Test Draft Recommendations
```bash
curl https://your-app.vercel.app/api/test/draft-engine
```

Expected Response:
```json
{
  "success": true,
  "message": "Draft Engine testing completed successfully. Average response time: 245ms",
  "testResults": [...]
}
```

---

## 📊 Performance Validation

### Response Time Targets
- ✅ Draft recommendations: < 500ms
- ✅ Player search: < 200ms  
- ✅ Health checks: < 100ms

### Load Testing
```bash
# Test concurrent requests
for i in {1..10}; do
  curl -s https://your-app.vercel.app/api/test/draft-engine &
done
wait
```

---

## 🔍 Monitoring & Debugging

### Vercel Function Logs
```bash
vercel logs https://your-app.vercel.app
```

### Database Performance
```sql
-- Run in Supabase SQL Editor
SELECT schemaname,tablename,attname,n_distinct,correlation 
FROM pg_stats 
WHERE tablename = 'players';
```

### Redis Cache Status
```bash
# Check cache hit rates in Upstash Console
# Monitor memory usage and connection count
```

---

## 🚨 Troubleshooting

### Common Issues

**❌ "Database connection failed"**
- Check Supabase service key
- Verify project URL is correct
- Ensure Row Level Security policies allow service role

**❌ "Redis connection timeout"**  
- Verify Upstash Redis URL and token
- Check region compatibility
- Confirm database is not paused

**❌ "Function timeout"**
- Increase Vercel function timeout in vercel.json
- Optimize database queries
- Enable connection pooling

**❌ "Rate limit exceeded"**
- Implement request queuing
- Add exponential backoff
- Upgrade Upstash plan if needed

### Debug Mode
```bash
# Enable debug logging
export DEBUG=nba-draft-buddy:*
vercel dev
```

---

## 📈 Scaling Considerations

### Database Optimization
```sql
-- Add composite indexes for common queries
CREATE INDEX CONCURRENTLY idx_players_search 
ON players (is_active, adp, team, positions);

-- Analyze query performance  
EXPLAIN ANALYZE SELECT * FROM players WHERE is_active = true ORDER BY adp;
```

### Cache Strategy
```javascript
// Implement cache warming for popular queries
await cacheService.warmCache([
  { key: 'top-players', ttl: 3600, data: getTopPlayers() },
  { key: 'league-averages', ttl: 7200, data: getLeagueAverages() }
]);
```

### CDN Configuration
- Enable Vercel Edge Cache for static assets
- Use ISR (Incremental Static Regeneration) for player pages
- Implement cache invalidation on data updates

---

## ✅ Production Checklist

### Before Going Live
- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] Sample data loaded and verified
- [ ] API endpoints tested
- [ ] Performance benchmarks met
- [ ] Error monitoring configured
- [ ] Backup strategy implemented

### Post-Deployment
- [ ] Monitor function execution time
- [ ] Track cache hit rates  
- [ ] Monitor database connection pool
- [ ] Set up automated data refresh schedule
- [ ] Configure alerting for API errors

---

## 🎯 Next Steps

### Immediate (Week 1)
- [ ] Set up automated data refresh (daily)
- [ ] Implement error alerting
- [ ] Add request logging and analytics

### Short Term (Month 1)  
- [ ] Build frontend draft assistant UI
- [ ] Add real-time WebSocket updates
- [ ] Implement user authentication

### Long Term (Quarter 1)
- [ ] Machine learning model training
- [ ] Advanced opponent modeling
- [ ] Mobile app development

---

**🏆 Congratulations! Your elite NBA Draft Buddy API is now live and ready to dominate fantasy drafts!**

For support or questions, check the logs first, then create an issue in the project repository.