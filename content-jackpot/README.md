# Content Jackpot 🏆

A competitive layer for Content Rewards campaigns where participants compete for jackpot prizes while keeping their base earnings. Built with Next.js, TypeScript, Prisma, and the Whop SDK.

![Content Jackpot Banner](https://via.placeholder.com/1200x400/0a0a0a/3b82f6?text=Content+Jackpot)

## 🚀 Core Concept

Transform your Content Rewards campaigns into competitive tournaments where creators compete for jackpot prizes while earning their base payments. Add an optional "Danger Zone" where bottom performers can have their earnings stripped and added to the jackpot pool.

## ✨ Key Features

- 🏆 **Competitive Campaigns** - Turn Content Rewards into tournaments with leaderboards
- 💰 **Dual Earnings** - Participants keep base Content Rewards + compete for jackpot bonuses
- ⚠️ **Danger Zone** - Optional mechanic where bottom performers lose earnings to the jackpot
- 📊 **Live Leaderboards** - Real-time ranking and performance tracking
- 🎯 **Prize Distribution** - Flexible prize splits (1st: 60%, 2nd: 30%, 3rd: 10%, etc.)
- 📱 **Multi-Platform** - Support for TikTok, Instagram, YouTube, Twitter/X
- 📈 **Analytics Dashboard** - Comprehensive performance metrics and insights
- 🎨 **Dark Theme UI** - Matches Content Rewards design system exactly

## 🛠️ Technical Stack

- ✅ **Next.js 15** - React framework with App Router
- ✅ **TypeScript** - Complete type safety throughout
- ✅ **Tailwind CSS** - Utility-first CSS framework
- ✅ **Prisma** - Database ORM with PostgreSQL
- ✅ **Whop SDK** - Authentication and API integration
- ✅ **React Hook Form** - Form management and validation
- ✅ **Zod** - Schema validation
- ✅ **Lucide React** - Beautiful icons

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm
- PostgreSQL database
- Whop developer account

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/content-jackpot.git
cd content-jackpot
```

### 2. Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 3. Environment Setup

Copy the environment template:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Whop Configuration
NEXT_PUBLIC_WHOP_APP_ID=your_app_id_here
WHOP_API_KEY=your_api_key_here
NEXT_PUBLIC_WHOP_AGENT_USER_ID=your_agent_user_id_here
NEXT_PUBLIC_WHOP_COMPANY_ID=your_company_id_here

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/content_jackpot"
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed
```

### 5. Start Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app!

## 📁 Project Structure

```
content-jackpot/
├── app/                     # Next.js App Router
│   ├── api/                 # API routes
│   │   ├── jackpots/       # Jackpot CRUD operations
│   │   ├── submissions/    # Content submission tracking
│   │   └── user/           # User management
│   ├── components/         # React components
│   │   ├── ui/             # Reusable form components
│   │   ├── AuthComponent.tsx
│   │   ├── JackpotCard.tsx
│   │   ├── JackpotStats.tsx
│   │   └── Navigation.tsx
│   ├── create/             # Create jackpot page
│   ├── jackpots/[id]/      # Individual jackpot pages
│   ├── analytics/          # Analytics dashboard
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── lib/                    # Shared utilities
│   ├── validations/        # Zod schemas
│   ├── prisma.ts          # Database client
│   └── whop-sdk.ts        # Whop SDK configuration
├── prisma/                 # Database schema and migrations
│   └── schema.prisma
├── public/                 # Static assets
├── .env.example           # Environment variables template
└── package.json           # Dependencies and scripts
```

## 🗄️ Database Schema

### Jackpots Table
Stores campaign information, budget settings, danger zone configuration, and prize distribution rules.

### Submissions Table
Tracks user content submissions, platform data, view counts, rankings, and earnings calculations.

### ExtensionVotes Table
Manages campaign deadline extension voting and user participation.

## 🎯 Key Features Overview

### 1. Create Jackpot Campaign
- **Two-panel interface**: Form on left, live preview on right
- **Comprehensive settings**: Budget, platforms, danger zone, prize distribution
- **Real-time validation**: Instant feedback with Zod schemas

### 2. Dashboard
- **Campaign overview**: Active jackpots, total prize pools, participant stats
- **Campaign cards**: Quick view of each jackpot's status and performance
- **Authentication integration**: Seamless Whop SDK integration

### 3. Analytics
- **Performance metrics**: Platform breakdowns, danger zone impact
- **Revenue tracking**: Total payouts, stripped earnings, top performers
- **Visual insights**: Charts and graphs for data visualization

### 4. Leaderboard & Submissions
- **Real-time rankings**: Live view counts and performance tracking
- **Danger zone indicators**: Visual warnings for bottom performers
- **Prize calculations**: Automatic earning computations

## 🔧 Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript compiler
```

### Adding New Features

1. **API Routes**: Add to `app/api/` directory
2. **Pages**: Create in `app/` directory structure
3. **Components**: Add to `app/components/`
4. **Database**: Modify `prisma/schema.prisma` and run migrations

### Whop SDK Integration

#### Client-Side (React Components)
```tsx
import { useWhop } from '@whop/react';

function MyComponent() {
  const { user, isLoading } = useWhop();
  // Use user data
}
```

#### Server-Side (API Routes)
```tsx
import { whopSdk } from '@/lib/whop-sdk';

// Get user information
const user = await whopSdk.withUser(userId).retrieveUser();
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to GitHub**: Link your repository to Vercel
2. **Environment Variables**: Add all `.env` variables in Vercel dashboard
3. **Database**: Set up PostgreSQL (Vercel Postgres, Supabase, etc.)
4. **Deploy**: Automatic deployment on git push

### Manual Deployment

1. **Build the app**: `pnpm build`
2. **Set environment variables** on your hosting platform
3. **Run migrations**: `npx prisma migrate deploy`
4. **Start the server**: `pnpm start`

## 🔗 Getting Whop Credentials

### 1. Create Whop App
1. Visit [Whop Developer Dashboard](https://whop.com/dashboard)
2. Navigate to Developer section
3. Create new app
4. Copy App ID and API Key

### 2. Configure Agent User
1. In app settings, create agent user
2. Copy agent user ID
3. Add to environment variables

### 3. Install App
Visit: `https://whop.com/apps/YOUR_APP_ID/install`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 [Whop Documentation](https://dev.whop.com)
- 📖 [Next.js Documentation](https://nextjs.org/docs)
- 📖 [Prisma Documentation](https://www.prisma.io/docs)
- 📖 [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🎉 Acknowledgments

- Built with [Whop SDK](https://dev.whop.com) for seamless integration
- UI inspired by Content Rewards design system
- Icons by [Lucide](https://lucide.dev)

---

**Ready to turn your Content Rewards into competitive jackpots?** 🏆

[Create Your First Jackpot](http://localhost:3000/create) • [View Demo](http://localhost:3000) • [Report Issues](https://github.com/your-username/content-jackpot/issues)