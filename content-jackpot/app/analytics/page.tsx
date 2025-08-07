'use client';

import React from 'react';
import { 
  TrophyIcon, 
  DollarSignIcon, 
  UsersIcon, 
  TrendingUpIcon,
  PieChartIcon,
  BarChart3Icon,
  AlertTriangleIcon
} from 'lucide-react';

// Mock analytics data
const analyticsData = {
  overview: {
    totalRevenue: 45250,
    totalParticipants: 342,
    averageEngagement: 8.7,
    conversionRate: 12.3
  },
  topPerformers: [
    { name: 'CreatorAlpha', revenue: 5240, campaigns: 3, avgViews: 125000 },
    { name: 'InfluencerBeta', revenue: 4180, campaigns: 2, avgViews: 98000 },
    { name: 'ContentPro', revenue: 3920, campaigns: 4, avgViews: 76000 },
  ],
  platformStats: [
    { platform: 'TikTok', participants: 156, revenue: 18600, share: 41.1 },
    { platform: 'Instagram', participants: 134, revenue: 15800, share: 34.9 },
    { platform: 'YouTube', participants: 32, revenue: 7200, share: 15.9 },
    { platform: 'Twitter', participants: 20, revenue: 3650, share: 8.1 },
  ],
  recentCampaigns: [
    {
      name: 'Summer Vibes Challenge',
      status: 'Active',
      participants: 34,
      revenue: 12500,
      dangerZoneActive: true,
      stripped: 2340
    },
    {
      name: 'Tech Product Showcase',
      status: 'Completed',
      participants: 18,
      revenue: 8750,
      dangerZoneActive: false,
      stripped: 0
    },
    {
      name: 'Fitness Journey',
      status: 'Voting',
      participants: 22,
      revenue: 9200,
      dangerZoneActive: true,
      stripped: 1840
    },
  ]
};

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Track performance across all your Content Jackpot campaigns</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-green-400">${analyticsData.overview.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-400 flex items-center mt-1">
                  <TrendingUpIcon className="w-3 h-3 mr-1" />
                  +12.5% from last month
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-400/10">
                <DollarSignIcon className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Total Participants</p>
                <p className="text-2xl font-bold text-blue-400">{analyticsData.overview.totalParticipants}</p>
                <p className="text-xs text-blue-400 flex items-center mt-1">
                  <TrendingUpIcon className="w-3 h-3 mr-1" />
                  +8.3% from last month
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-400/10">
                <UsersIcon className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Avg Engagement</p>
                <p className="text-2xl font-bold text-purple-400">{analyticsData.overview.averageEngagement}%</p>
                <p className="text-xs text-purple-400 flex items-center mt-1">
                  <TrendingUpIcon className="w-3 h-3 mr-1" />
                  +2.1% from last month
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-400/10">
                <BarChart3Icon className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">Conversion Rate</p>
                <p className="text-2xl font-bold text-yellow-400">{analyticsData.overview.conversionRate}%</p>
                <p className="text-xs text-yellow-400 flex items-center mt-1">
                  <TrendingUpIcon className="w-3 h-3 mr-1" />
                  +5.7% from last month
                </p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-400/10">
                <TrophyIcon className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Performers */}
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6">Top Performers</h2>
            <div className="space-y-4">
              {analyticsData.topPerformers.map((performer, index) => (
                <div key={performer.name} className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[#3b82f6] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{performer.name}</h3>
                      <p className="text-sm text-gray-400">{performer.campaigns} campaigns</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-400">${performer.revenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-400">{(performer.avgViews / 1000).toFixed(0)}K avg views</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Distribution */}
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6">Platform Performance</h2>
            <div className="space-y-4">
              {analyticsData.platformStats.map((platform) => (
                <div key={platform.platform} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{platform.platform}</span>
                    <span className="text-gray-400">{platform.share}%</span>
                  </div>
                  <div className="w-full bg-[#2a2a2a] rounded-full h-2">
                    <div 
                      className="bg-[#3b82f6] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${platform.share}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{platform.participants} participants</span>
                    <span>${platform.revenue.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Campaigns */}
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-6">Recent Campaign Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2a2a]">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Campaign</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Participants</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Revenue</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Danger Zone</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.recentCampaigns.map((campaign) => (
                  <tr key={campaign.name} className="border-b border-[#2a2a2a]/50">
                    <td className="py-4 px-4">
                      <h3 className="font-medium text-white">{campaign.name}</h3>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.status === 'Active' ? 'bg-green-400/10 text-green-400' :
                        campaign.status === 'Completed' ? 'bg-gray-400/10 text-gray-400' :
                        'bg-blue-400/10 text-blue-400'
                      }`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-white">{campaign.participants}</td>
                    <td className="py-4 px-4 text-green-400 font-semibold">
                      ${campaign.revenue.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      {campaign.dangerZoneActive ? (
                        <div className="flex items-center space-x-2">
                          <AlertTriangleIcon className="w-4 h-4 text-red-400" />
                          <span className="text-red-400 text-sm">
                            ${campaign.stripped.toLocaleString()} stripped
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Disabled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Danger Zone Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="danger-zone p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangleIcon className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-semibold text-white">Danger Zone Impact</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-red-300">Total Stripped</span>
                <span className="text-white font-bold text-xl">$4,180</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-red-300">Affected Creators</span>
                <span className="text-white font-bold">23</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-red-300">Added to Jackpots</span>
                <span className="text-green-400 font-bold">$4,180</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-4">Engagement Metrics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Average Views per Content</span>
                <span className="text-white font-semibold">85.2K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Competition Completion Rate</span>
                <span className="text-white font-semibold">87.3%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Creator Retention Rate</span>
                <span className="text-white font-semibold">72.1%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Average ROI</span>
                <span className="text-green-400 font-semibold">340%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
