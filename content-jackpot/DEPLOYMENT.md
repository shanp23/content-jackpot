# 🚀 Deployment Guide

This guide covers deploying Content Jackpot to various platforms.

## 📋 Pre-deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Whop app created and configured
- [ ] SSL certificate ready (for production)
- [ ] Domain name configured (if applicable)

## 🔷 Vercel Deployment (Recommended)

Vercel provides the easiest deployment experience for Next.js applications.

### 1. Connect Repository

1. Push your code to GitHub
2. Visit [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository

### 2. Configure Environment Variables

In Vercel dashboard, add these environment variables:

```env
# Whop Configuration
NEXT_PUBLIC_WHOP_APP_ID=your_app_id_here
WHOP_API_KEY=your_api_key_here
NEXT_PUBLIC_WHOP_AGENT_USER_ID=your_agent_user_id_here
NEXT_PUBLIC_WHOP_COMPANY_ID=your_company_id_here

# Database (Vercel Postgres recommended)
DATABASE_URL=your_postgres_connection_string
```

### 3. Database Setup

**Option A: Vercel Postgres**
1. In project settings, go to "Storage"
2. Create new Postgres database
3. Copy connection string to `DATABASE_URL`

**Option B: External Database (Supabase, PlanetScale, etc.)**
1. Create database on your provider
2. Get connection string
3. Add to environment variables

### 4. Deploy

```bash
# Automatic deployment on git push
git push origin main

# Or deploy manually
npx vercel --prod
```

### 5. Run Migrations

After first deployment:

```bash
# Connect to production database
npx prisma migrate deploy
```

## 🐳 Docker Deployment

### Dockerfile

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN yarn build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/content_jackpot
      - NEXT_PUBLIC_WHOP_APP_ID=${NEXT_PUBLIC_WHOP_APP_ID}
      - WHOP_API_KEY=${WHOP_API_KEY}
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=content_jackpot
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

### Deploy with Docker

```bash
# Build and run
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma migrate deploy
```

## ☁️ AWS Deployment

### Using AWS Amplify

1. **Connect Repository**
   - Open AWS Amplify Console
   - Connect your GitHub repository

2. **Configure Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
           - npx prisma generate
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Environment Variables**
   - Add all required environment variables in Amplify console

### Using AWS EC2

1. **Launch EC2 Instance**
   - Choose Ubuntu 20.04 LTS
   - Configure security groups (HTTP, HTTPS, SSH)

2. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2
   sudo npm install -g pm2
   ```

3. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/your-username/content-jackpot.git
   cd content-jackpot

   # Install dependencies
   npm ci

   # Generate Prisma client
   npx prisma generate

   # Build application
   npm run build

   # Start with PM2
   pm2 start npm --name "content-jackpot" -- start
   pm2 startup
   pm2 save
   ```

## 🌐 Custom Server Deployment

### Using PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start npm --name "content-jackpot" -- start

# Configure auto-restart
pm2 startup
pm2 save

# Monitor
pm2 monit
```

### Using systemd

Create `/etc/systemd/system/content-jackpot.service`:

```ini
[Unit]
Description=Content Jackpot
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/content-jackpot
ExecStart=/usr/bin/node server.js
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable content-jackpot
sudo systemctl start content-jackpot
sudo systemctl status content-jackpot
```

## 🔒 Security Considerations

### Environment Variables

- Never commit `.env` files
- Use secure random values for secrets
- Rotate API keys regularly
- Use different keys for different environments

### Database Security

- Use connection pooling
- Enable SSL connections
- Restrict database access by IP
- Regular backups
- Monitor for suspicious activity

### Application Security

- Keep dependencies updated
- Use HTTPS in production
- Implement rate limiting
- Validate all user input
- Use Content Security Policy headers

## 📊 Monitoring and Maintenance

### Health Checks

Create `app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
```

### Logging

Set up logging with tools like:
- **Vercel**: Built-in analytics and logs
- **AWS**: CloudWatch
- **Self-hosted**: Winston + ELK stack

### Backup Strategy

- **Database backups**: Daily automated backups
- **Code backups**: Git repository with multiple remotes
- **Environment configs**: Secure backup of environment variables

## 🚨 Troubleshooting

### Common Issues

**Build Failures**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm ci
npm run build
```

**Database Connection Issues**
```bash
# Test connection
npx prisma db pull

# Reset database (development only)
npx prisma migrate reset
```

**Environment Variable Issues**
```bash
# Check if variables are loaded
node -e "console.log(process.env.NEXT_PUBLIC_WHOP_APP_ID)"
```

### Performance Optimization

- Enable gzip compression
- Use CDN for static assets
- Implement caching strategies
- Monitor Core Web Vitals
- Use database connection pooling

## 📈 Scaling

### Horizontal Scaling

- Use load balancers
- Implement session management
- Use Redis for caching
- Consider microservices architecture

### Database Scaling

- Read replicas for read operations
- Database sharding for large datasets
- Connection pooling
- Query optimization

---

**Need help with deployment?** Check our [Contributing Guide](CONTRIBUTING.md) or create an issue!
