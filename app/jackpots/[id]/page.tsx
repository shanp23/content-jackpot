'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  TrophyIcon, 
  ArrowLeftIcon, 
  CalendarIcon, 
  DollarSignIcon,
  UsersIcon,
  AlertTriangleIcon,
  PlayIcon,
  PauseIcon,
  ExternalLinkIcon,
  CrownIcon,
  MedalIcon,
  AwardIcon
} from 'lucide-react';
import Comments from '@/app/components/Comments';
import Chatbot from '@/app/components/Chatbot';

// Mock data - in real app this would come from API
const mockJackpot = {
  id: '1',
  campaignName: 'Summer Vibes Content Challenge',
  type: 'UGC',
  category: 'Lifestyle',
  contentRewardsCampaignUrl: 'https://example.com/content-rewards',
  thumbnailUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop',
  jackpotBudget: 5000,
  currency: 'USD',
  rewardRate: 2.50,
  status: 'ACTIVE',
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-02-01T00:00:00Z',
  dangerZoneEnabled: true,
  stripPercentage: 25,
  stripType: 'PARTIAL',
  winnersCount: 3,
  prizeDistribution: {
    first: 60,
    second: 30,
    third: 10
  },
  platforms: {
    tiktok: true,
    instagram: true,
    youtube: false,
    twitter: false
  },
  contentRequirements: 'Create engaging summer content showcasing lifestyle and fun activities. Use hashtags #SummerVibes #ContentJackpot and tag @ourBrand.',
  submissions: [
    {
      id: '1',
      userName: 'CreatorAlpha',
      contentUrl: 'https://tiktok.com/@creator/video1',
      platform: 'TIKTOK',
      viewsCount: 125000,
      rank: 1,
      inDangerZone: false,
      baseEarnings: 312.50,
      potentialJackpot: 3000,
      strippedAmount: 0
    },
    {
      id: '2',
      userName: 'InfluencerBeta',
      contentUrl: 'https://instagram.com/p/example',
      platform: 'INSTAGRAM',
      viewsCount: 98000,
      rank: 2,
      inDangerZone: false,
      baseEarnings: 245.00,
      potentialJackpot: 1500,
      strippedAmount: 0
    },
    {
      id: '3',
      userName: 'ContentCreator3',
      contentUrl: 'https://tiktok.com/@creator3/video1',
      platform: 'TIKTOK',
      viewsCount: 76000,
      rank: 3,
      inDangerZone: false,
      baseEarnings: 190.00,
      potentialJackpot: 500,
      strippedAmount: 0
    },
    {
      id: '4',
      userName: 'CreatorDelta',
      contentUrl: 'https://instagram.com/p/example2',
      platform: 'INSTAGRAM',
      viewsCount: 45000,
      rank: 4,
      inDangerZone: false,
      baseEarnings: 112.50,
      potentialJackpot: 0,
      strippedAmount: 0
    },
    {
      id: '5',
      userName: 'SmallCreator',
      contentUrl: 'https://tiktok.com/@small/video1',
      platform: 'TIKTOK',
      viewsCount: 12000,
      rank: 5,
      inDangerZone: true,
      baseEarnings: 30.00,
      potentialJackpot: 0,
      strippedAmount: 15.00
    }
  ]
};

export default function JackpotDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState('leaderboard');
  const id = params.id as string;
  
  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'USD': 
      default: return '$';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <CrownIcon className="w-5 h-5 text-yellow-500" />;
      case 2: return <MedalIcon className="w-5 h-5 text-gray-400" />;
      case 3: return <AwardIcon className="w-5 h-5 text-orange-500" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-gray-400 font-bold">{rank}</span>;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'TIKTOK': return 'bg-black text-white';
      case 'INSTAGRAM': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      case 'YOUTUBE': return 'bg-red-600 text-white';
      case 'TWITTER': return 'bg-blue-500 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const daysLeft = Math.ceil((new Date(mockJackpot.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const totalSubmissions = mockJackpot.submissions.length;
  const dangerZoneCount = mockJackpot.submissions.filter(s => s.inDangerZone).length;
  const totalViews = mockJackpot.submissions.reduce((sum, s) => sum + s.viewsCount, 0);

  return (
    <div className="min-h-screen bg-app py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/" className="btn btn-secondary p-2">
            <ArrowLeftIcon className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">{mockJackpot.campaignName}</h1>
            <p className="text-gray-400">{mockJackpot.type} • {mockJackpot.category}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="card text-center">
                <TrophyIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {getCurrencySymbol(mockJackpot.currency)}{mockJackpot.jackpotBudget.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Prize Pool</div>
              </div>
              
              <div className="card text-center">
                <UsersIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{totalSubmissions}</div>
                <div className="text-sm text-gray-400">Participants</div>
              </div>
              
              <div className="card text-center">
                <CalendarIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{daysLeft}</div>
                <div className="text-sm text-gray-400">Days Left</div>
              </div>
              
              <div className="card text-center">
                <DollarSignIcon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{(totalViews / 1000).toFixed(0)}K</div>
                <div className="text-sm text-gray-400">Total Views</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-subtle mb-6">
              <nav className="flex space-x-8">
                {['leaderboard', 'details', 'submissions', 'community'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors capitalize ${
                      activeTab === tab
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted hover:text-app hover:border-subtle'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'leaderboard' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Live Leaderboard</h2>
                  <div className="flex items-center space-x-2 text-green-400">
                    <PlayIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Live</span>
                  </div>
                </div>

                {mockJackpot.submissions.map((submission) => (
                  <div 
                    key={submission.id} 
                    className={`card transition-all ${submission.inDangerZone ? 'danger-zone' : ''} ${submission.rank <= 3 ? 'ring-1 ring-yellow-500/20' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10">
                          {getRankIcon(submission.rank)}
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-white">{submission.userName}</h3>
                            <span className={`px-2 py-1 text-xs rounded ${getPlatformColor(submission.platform)}`}>
                              {submission.platform}
                            </span>
                          </div>
                          <a 
                            href={submission.contentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                          >
                            <span>View Content</span>
                            <ExternalLinkIcon className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-white">
                          {submission.viewsCount.toLocaleString()} views
                        </div>
                        <div className="text-sm text-gray-400">
                          Base: {getCurrencySymbol(mockJackpot.currency)}{submission.baseEarnings.toFixed(2)}
                          {submission.potentialJackpot > 0 && (
                            <span className="text-green-400 ml-2">
                              + {getCurrencySymbol(mockJackpot.currency)}{submission.potentialJackpot.toFixed(2)}
                            </span>
                          )}
                          {submission.strippedAmount > 0 && (
                            <span className="text-red-400 ml-2">
                              -{getCurrencySymbol(mockJackpot.currency)}{submission.strippedAmount.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-6">
                <div className="card">
                  <h3 className="text-lg font-semibold text-white mb-4">Campaign Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-400">Content Rewards Campaign</label>
                      <a 
                        href={mockJackpot.contentRewardsCampaignUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
                      >
                        <span>View Original Campaign</span>
                        <ExternalLinkIcon className="w-4 h-4" />
                      </a>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-400">Base Reward Rate</label>
                      <p className="text-white">
                        {getCurrencySymbol(mockJackpot.currency)}{mockJackpot.rewardRate} per 1,000 views
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-400">Content Requirements</label>
                      <p className="text-white">{mockJackpot.contentRequirements}</p>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-white mb-4">Prize Distribution</h3>
                  <div className="space-y-3">
                    {Object.entries(mockJackpot.prizeDistribution).map(([place, percentage], index) => {
                      const amount = (mockJackpot.jackpotBudget * percentage) / 100;
                      return (
                        <div key={place} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getRankIcon(index + 1)}
                            <span className="text-white capitalize">{place} Place</span>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-semibold">
                              {getCurrencySymbol(mockJackpot.currency)}{amount.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-400">{percentage}%</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'submissions' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">All Submissions ({totalSubmissions})</h2>
                
                {mockJackpot.submissions.map((submission) => (
                  <div key={submission.id} className="card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-white">{submission.userName}</h3>
                          <span className={`px-2 py-1 text-xs rounded ${getPlatformColor(submission.platform)}`}>
                            {submission.platform}
                          </span>
                          {submission.rank <= 3 && (
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                              Winner
                            </span>
                          )}
                          {submission.inDangerZone && (
                            <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">
                              Danger Zone
                            </span>
                          )}
                        </div>
                        
                        <a 
                          href={submission.contentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1"
                        >
                          <span>View Content</span>
                          <ExternalLinkIcon className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-white">
                          #{submission.rank}
                        </div>
                        <div className="text-sm text-gray-400">
                          {submission.viewsCount.toLocaleString()} views
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'community' && (
              <div className="space-y-4">
                <div className="card">
                  <h3 className="text-lg font-semibold text-app mb-3">Reviews & Comments</h3>
                  <Comments campaignId={mockJackpot.id} />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Campaign Status */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Campaign Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className="px-2 py-1 bg-green-400/10 text-green-400 text-sm rounded">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Ends In</span>
                  <span className="text-white font-semibold">{daysLeft} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Participants</span>
                  <span className="text-white font-semibold">{totalSubmissions}</span>
                </div>
              </div>
            </div>

            {/* Danger Zone Info */}
            {mockJackpot.dangerZoneEnabled && (
              <div className="danger-zone p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertTriangleIcon className="w-5 h-5 text-red-400" />
                  <h3 className="text-lg font-semibold text-white">Danger Zone</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-red-300">At Risk:</span>
                    <span className="text-white font-semibold">{dangerZoneCount} creators</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-300">Strip Rate:</span>
                    <span className="text-white font-semibold">{mockJackpot.stripPercentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-300">Strip Type:</span>
                    <span className="text-white font-semibold">{mockJackpot.stripType}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
              <div className="space-y-3">
                <button className="btn btn-secondary w-full">
                  <PauseIcon className="w-4 h-4 mr-2" />
                  Pause Campaign
                </button>
                <button className="btn btn-primary w-full">
                  Edit Settings
                </button>
                <button className="btn btn-success w-full">
                  Export Results
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Chatbot threadKey={`campaign_${mockJackpot.id}`} />
    </div>
  );
}
