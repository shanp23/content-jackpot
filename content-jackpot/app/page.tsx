import Link from 'next/link';
import AuthComponent from './components/AuthComponent';
import JackpotStats from './components/JackpotStats';
import JackpotCard from './components/JackpotCard';
import { TrophyIcon, PlusIcon, Target, DollarSign, AlertTriangle } from 'lucide-react';

// Mock data - in real app this would come from API
const mockStats = {
  totalJackpots: 12,
  activeJackpots: 4,
  totalPrizePool: 15750,
  totalParticipants: 89,
  currency: 'USD'
};

const mockJackpots = [
  {
    id: '1',
    campaignName: 'Summer Vibes Content Challenge',
    type: 'UGC',
    category: 'Lifestyle',
    thumbnailUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop',
    jackpotBudget: 5000,
    currency: 'USD',
    status: 'ACTIVE',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-02-01T00:00:00Z',
    dangerZoneEnabled: true,
    stripPercentage: 25,
    submissionCount: 34,
    topSubmission: {
      userName: 'CreatorAlpha',
      viewsCount: 125000,
      platform: 'TIKTOK'
    },
    platforms: {
      tiktok: true,
      instagram: true,
      youtube: false,
      twitter: false
    }
  },
  {
    id: '2',
    campaignName: 'Tech Product Showcase',
    type: 'PROMOTIONAL',
    category: 'Technology',
    jackpotBudget: 3500,
    currency: 'USD',
    status: 'ACTIVE',
    startDate: '2024-01-10T00:00:00Z',
    endDate: '2024-02-10T00:00:00Z',
    dangerZoneEnabled: false,
    stripPercentage: 0,
    submissionCount: 18,
    topSubmission: {
      userName: 'TechReviewer',
      viewsCount: 87000,
      platform: 'YOUTUBE'
    },
    platforms: {
      tiktok: false,
      instagram: true,
      youtube: true,
      twitter: true
    }
  },
  {
    id: '3',
    campaignName: 'Fitness Transformation Stories',
    type: 'UGC',
    category: 'Fitness',
    jackpotBudget: 2750,
    currency: 'USD',
    status: 'VOTING',
    startDate: '2023-12-15T00:00:00Z',
    endDate: '2024-01-15T00:00:00Z',
    dangerZoneEnabled: true,
    stripPercentage: 30,
    submissionCount: 22,
    topSubmission: {
      userName: 'FitnessMom',
      viewsCount: 95000,
      platform: 'INSTAGRAM'
    },
    platforms: {
      tiktok: true,
      instagram: true,
      youtube: false,
      twitter: false
    }
  }
];

export default function Page() {
	return (
		<div className="min-h-screen bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-6xl mx-auto">
				{/* Hero Section */}
				<div className="text-center mb-16">
					<div className="flex justify-center mb-6">
						<TrophyIcon className="w-16 h-16 text-[#3b82f6]" />
					</div>
					<h1 className="text-5xl font-bold text-white mb-6">
						Welcome to Content Jackpot
					</h1>
					<p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
						Add a competitive layer to your Content Rewards campaigns. 
						Participants compete for jackpot prizes while keeping their base earnings.
					</p>
					<div className="flex justify-center space-x-4">
						<Link href="/create" className="btn btn-primary px-8 py-3 text-lg">
							<PlusIcon className="w-5 h-5 mr-2" />
							Create Your First Jackpot
						</Link>
						<Link href="#how-it-works" className="btn btn-secondary px-8 py-3 text-lg">
							Learn More
						</Link>
					</div>
				</div>

				{/* Authentication Status */}
				<AuthComponent />

				{/* Dashboard Stats */}
				<JackpotStats stats={mockStats} />

				{/* Active Jackpots */}
				<div className="mb-16">
					<div className="flex items-center justify-between mb-8">
						<h2 className="text-2xl font-bold text-white">Your Jackpots</h2>
						<Link href="/create" className="btn btn-primary">
							<PlusIcon className="w-4 h-4 mr-2" />
							Create New Jackpot
						</Link>
					</div>
					
					{mockJackpots.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{mockJackpots.map((jackpot) => (
								<JackpotCard key={jackpot.id} jackpot={jackpot} />
							))}
						</div>
					) : (
						<div className="card text-center py-12">
							<TrophyIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
							<h3 className="text-xl font-semibold text-white mb-2">No Jackpots Yet</h3>
							<p className="text-gray-400 mb-6">Create your first competitive campaign to get started</p>
							<Link href="/create" className="btn btn-primary">
								<PlusIcon className="w-4 h-4 mr-2" />
								Create Your First Jackpot
							</Link>
						</div>
					)}
				</div>

				{/* Key Features */}
				<div className="grid md:grid-cols-3 gap-8 mb-16">
					<div className="card text-center">
						<div className="flex justify-center mb-4">
							<Target className="w-12 h-12 text-[#10b981]" />
						</div>
						<h3 className="text-xl font-semibold text-white mb-3">Competitive Edge</h3>
						<p className="text-gray-400">
							Transform your Content Rewards into competitive tournaments where creators compete for jackpot prizes.
						</p>
					</div>
					
					<div className="card text-center">
						<div className="flex justify-center mb-4">
							<DollarSign className="w-12 h-12 text-[#3b82f6]" />
						</div>
						<h3 className="text-xl font-semibold text-white mb-3">Double Earnings</h3>
						<p className="text-gray-400">
							Winners can earn 2-3x more per view than standard Content Rewards while everyone keeps their base pay.
						</p>
					</div>
					
					<div className="card text-center">
						<div className="flex justify-center mb-4">
							<AlertTriangle className="w-12 h-12 text-[#ef4444]" />
						</div>
						<h3 className="text-xl font-semibold text-white mb-3">Danger Zone</h3>
						<p className="text-gray-400">
							Optional mechanic where bottom performers' earnings are stripped and added to the jackpot pool.
						</p>
					</div>
				</div>

				{/* How It Works */}
				<div id="how-it-works" className="mb-16">
					<h2 className="text-3xl font-bold text-white text-center mb-12">How Content Jackpot Works</h2>
					
					<div className="space-y-8">
						<div className="card">
							<div className="flex items-start space-x-4">
								<div className="flex-shrink-0 w-10 h-10 bg-[#3b82f6] rounded-full flex items-center justify-center text-white font-bold">
									1
								</div>
								<div>
									<h3 className="text-xl font-semibold text-white mb-2">Connect Your Content Rewards Campaign</h3>
									<p className="text-gray-400">
										Link your existing Content Rewards campaign to Content Jackpot. Your base reward structure remains unchanged.
									</p>
								</div>
							</div>
						</div>

						<div className="card">
							<div className="flex items-start space-x-4">
								<div className="flex-shrink-0 w-10 h-10 bg-[#3b82f6] rounded-full flex items-center justify-center text-white font-bold">
									2
								</div>
								<div>
									<h3 className="text-xl font-semibold text-white mb-2">Set Your Jackpot Prize Pool</h3>
									<p className="text-gray-400">
										Define your total jackpot budget and how prizes are distributed among winners (1st place: 60%, 2nd: 30%, 3rd: 10%, etc.)
									</p>
								</div>
							</div>
						</div>

						<div className="card">
							<div className="flex items-start space-x-4">
								<div className="flex-shrink-0 w-10 h-10 bg-[#3b82f6] rounded-full flex items-center justify-center text-white font-bold">
									3
								</div>
								<div>
									<h3 className="text-xl font-semibold text-white mb-2">Creators Compete for Views</h3>
									<p className="text-gray-400">
										Participants create content as normal but now compete on a leaderboard. Everyone earns their base Content Rewards rate PLUS competes for jackpot bonuses.
									</p>
								</div>
							</div>
						</div>

						<div className="card danger-zone">
							<div className="flex items-start space-x-4">
								<div className="flex-shrink-0 w-10 h-10 bg-[#ef4444] rounded-full flex items-center justify-center text-white font-bold">
									4
								</div>
								<div>
									<h3 className="text-xl font-semibold text-white mb-2">Danger Zone (Optional)</h3>
									<p className="text-gray-400">
										Enable the danger zone where bottom 25% of performers lose part or all of their base earnings, which gets added to the jackpot pool for top performers.
									</p>
								</div>
							</div>
						</div>

						<div className="card success-zone">
							<div className="flex items-start space-x-4">
								<div className="flex-shrink-0 w-10 h-10 bg-[#10b981] rounded-full flex items-center justify-center text-white font-bold">
									5
								</div>
								<div>
									<h3 className="text-xl font-semibold text-white mb-2">Winners Hit the Jackpot</h3>
									<p className="text-gray-400">
										Top performers earn their base Content Rewards payments PLUS their share of the jackpot, effectively earning 2-3x more per view.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Setup Steps */}
				<div className="mb-16">
					<h2 className="text-3xl font-bold text-white text-center mb-12">Get Started</h2>
					
					<div className="grid md:grid-cols-2 gap-8">
						<div className="card">
							<h3 className="text-xl font-semibold text-white mb-4">1. Set Up Your Whop App</h3>
							<p className="text-gray-400 mb-4">
								Create your app in the{" "}
								<a
									href="https://whop.com/dashboard"
									target="_blank"
									rel="noopener noreferrer"
									className="text-[#3b82f6] hover:text-[#2563eb] underline"
								>
									Whop Dashboard
								</a>{" "}
								and configure your environment variables.
							</p>
							
							{process.env.NODE_ENV === "development" && (
								<div className="bg-[#2a2a2a] p-3 rounded text-xs">
									<strong>Current configuration:</strong>
									<br />
									App ID: {process.env.NEXT_PUBLIC_WHOP_APP_ID || 'Not set'}
									<br />
									API Key: {process.env.WHOP_API_KEY?.slice(0, 5) || 'Not set'}...
									<br />
									Database: {process.env.DATABASE_URL ? 'Connected' : 'Not configured'}
								</div>
							)}
						</div>

						<div className="card">
							<h3 className="text-xl font-semibold text-white mb-4">2. Install the App</h3>
							<p className="text-gray-400 mb-4">
								Install Content Jackpot into your Whop to start creating competitive campaigns.
							</p>
							
							{process.env.NEXT_PUBLIC_WHOP_APP_ID ? (
								<a
									href={`https://whop.com/apps/${process.env.NEXT_PUBLIC_WHOP_APP_ID}/install`}
									target="_blank"
									rel="noopener noreferrer"
									className="btn btn-primary w-full"
								>
									Install Content Jackpot
								</a>
							) : (
								<div className="bg-[#2a2a2a] p-3 rounded text-amber-400 text-sm">
									⚠️ Please configure your environment variables to enable installation
								</div>
							)}
						</div>
					</div>
				</div>

				{/* CTA Section */}
				<div className="text-center">
					<div className="card bg-gradient-to-r from-[#3b82f6] to-[#10b981] p-8">
						<h2 className="text-2xl font-bold text-white mb-4">
							Ready to Turn Your Content Rewards Into Jackpots?
						</h2>
						<p className="text-blue-100 mb-6">
							Create your first competitive campaign and watch engagement soar
						</p>
						<Link href="/create" className="btn bg-white text-[#3b82f6] hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
							<TrophyIcon className="w-5 h-5 mr-2" />
							Create Jackpot Campaign
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
