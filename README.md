# Content Jackpot

A competitive layer for Content Rewards campaigns with jackpot prizes.

## Getting Started

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Fill in your Whop API keys and database URL.

3. **Set up database:**
   ```bash
   pnpm run db:generate
   pnpm run db:migrate
   ```

4. **Start development server:**
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Features

- **Create Campaigns**: Set up Content Jackpot campaigns with custom budgets and rewards
- **Campaign Dashboard**: View and manage all your active campaigns
- **Real-time Stats**: Track submissions, views, and earnings
- **Multi-platform Support**: TikTok, Instagram, YouTube, Twitter/X

## Creator UI

- Creator route: `/creator`
- Link multiple social accounts and receive a 7-letter bio code for verification.
- Submit content to active jackpots and track leaderboard.
- EarningsMeter: visual scale showing danger take, current earnings, and top-3 max. Add your own GIF here showing the markers moving as stats change.

## Tech Stack

- **Framework**: Next.js 15
- **Database**: PostgreSQL with Prisma
- **Authentication**: Whop SDK
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation

## Payments (Pre‑launch)

Stripe integration (demo):
- Set env in `.env.local`:
  - `STRIPE_SECRET_KEY=sk_test_...`
- Budget collection (creator funds pot):
  - `POST /api/pay` with `{ amount, currency }` returns `clientSecret` for a PaymentIntent.
  - Collect card details using Stripe.js Elements in Whop or a parent host.
- Commission (10%):
  - `POST /api/payouts` computes `{ total, fee (10%), net }` for a payout batch.
  - For production, use Stripe Connect: set `application_fee_amount` to 10% and transfer to creators’ connected accounts.

Note: This repo does not include a card collection UI. It exposes server endpoints to integrate with Whop’s checkout or your own Elements integration.

## Database Scripts

- `pnpm run db:generate` - Generate Prisma client
- `pnpm run db:migrate` - Run database migrations
- `pnpm run db:studio` - Open Prisma Studio
- `pnpm run db:reset` - Reset database
