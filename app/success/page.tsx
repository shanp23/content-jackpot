import Link from 'next/link';
import { CheckCircleIcon, TrophyIcon, BarChart2Icon } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <CheckCircleIcon className="w-20 h-20 text-[#10b981] mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">
            Jackpot Created Successfully! 🎉
          </h1>
          <p className="text-lg text-gray-400">
            Your competitive campaign is now ready to launch
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/" className="card hover:border-[#3b82f6] transition-colors text-center p-6">
            <TrophyIcon className="w-8 h-8 text-[#3b82f6] mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">View Dashboard</h3>
            <p className="text-gray-400 text-sm">See all your jackpots</p>
          </Link>

          <Link href="/analytics" className="card hover:border-[#10b981] transition-colors text-center p-6">
            <BarChart2Icon className="w-8 h-8 text-[#10b981] mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Track Performance</h3>
            <p className="text-gray-400 text-sm">Monitor your analytics</p>
          </Link>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Next Steps:</h3>
          <ul className="text-left text-gray-400 space-y-2">
            <li>• Share your campaign with creators</li>
            <li>• Monitor submissions and leaderboard</li>
            <li>• Track performance analytics</li>
            <li>• Celebrate the winners! 🏆</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
