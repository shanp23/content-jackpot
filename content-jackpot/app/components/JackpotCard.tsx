'use client';

import React from 'react';
import Link from 'next/link';
import { 
  TrophyIcon, 
  UsersIcon, 
  DollarSignIcon, 
  CalendarIcon, 
  AlertTriangleIcon,
  PlayIcon,
  PauseIcon,
  CheckCircleIcon,
  ClockIcon
} from 'lucide-react';

interface JackpotCardProps {
  jackpot: {
    id: string;
    campaignName: string;
    type: string;
    category: string;
    thumbnailUrl?: string;
    jackpotBudget: number;
    currency: string;
    status: string;
    startDate: string;
    endDate: string;
    dangerZoneEnabled: boolean;
    stripPercentage: number;
    submissionCount: number;
    topSubmission?: {
      userName: string;
      viewsCount: number;
      platform: string;
    } | null;
    platforms: {
      tiktok: boolean;
      instagram: boolean;
      youtube: boolean;
      twitter: boolean;
    };
  };
}

export default function JackpotCard({ jackpot }: JackpotCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-400 bg-green-400/10';
      case 'DRAFT': return 'text-gray-400 bg-gray-400/10';
      case 'VOTING': return 'text-blue-400 bg-blue-400/10';
      case 'EXTENDED': return 'text-yellow-400 bg-yellow-400/10';
      case 'COMPLETED': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <PlayIcon className="w-4 h-4" />;
      case 'DRAFT': return <PauseIcon className="w-4 h-4" />;
      case 'VOTING': return <ClockIcon className="w-4 h-4" />;
      case 'EXTENDED': return <ClockIcon className="w-4 h-4" />;
      case 'COMPLETED': return <CheckCircleIcon className="w-4 h-4" />;
      default: return <PauseIcon className="w-4 h-4" />;
    }
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'USD': 
      default: return '$';
    }
  };

  const activePlatforms = Object.entries(jackpot.platforms)
    .filter(([_, enabled]) => enabled)
    .map(([platform]) => platform);

  const isActive = jackpot.status === 'ACTIVE';
  const isUpcoming = new Date(jackpot.startDate) > new Date();
  const isEnded = new Date(jackpot.endDate) < new Date();

  return (
    <Link href={`/jackpots/${jackpot.id}`}>
      <div className="card hover:border-[#3b82f6] transition-all duration-200 cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-white group-hover:text-[#3b82f6] transition-colors">
                {jackpot.campaignName}
              </h3>
              <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(jackpot.status)}`}>
                {getStatusIcon(jackpot.status)}
                <span className="capitalize">{jackpot.status.toLowerCase()}</span>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              {jackpot.type} • {jackpot.category}
            </p>
          </div>
          
          {jackpot.thumbnailUrl && (
            <img 
              src={jackpot.thumbnailUrl} 
              alt={jackpot.campaignName}
              className="w-16 h-16 rounded-lg object-cover ml-4"
            />
          )}
        </div>

        {/* Prize Pool */}
        <div className="bg-[#2a2a2a] p-4 rounded-lg mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400 mb-1">Prize Pool</div>
              <div className="text-2xl font-bold text-green-400">
                {getCurrencySymbol(jackpot.currency)}{jackpot.jackpotBudget.toLocaleString()}
              </div>
            </div>
            <TrophyIcon className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <UsersIcon className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-lg font-semibold text-white">{jackpot.submissionCount}</div>
            <div className="text-xs text-gray-400">Participants</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <CalendarIcon className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-lg font-semibold text-white">
              {Math.ceil((new Date(jackpot.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="text-xs text-gray-400">Days Left</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <DollarSignIcon className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-lg font-semibold text-white">
              {jackpot.topSubmission?.viewsCount?.toLocaleString() || '0'}
            </div>
            <div className="text-xs text-gray-400">Top Views</div>
          </div>
        </div>

        {/* Top Performer */}
        {jackpot.topSubmission && (
          <div className="bg-[#2a2a2a] p-3 rounded mb-4">
            <div className="text-xs text-gray-400 mb-1">Current Leader</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">{jackpot.topSubmission.userName}</div>
                <div className="text-xs text-gray-400 capitalize">{jackpot.topSubmission.platform.toLowerCase()}</div>
              </div>
              <div className="text-sm font-semibold text-green-400">
                {jackpot.topSubmission.viewsCount.toLocaleString()} views
              </div>
            </div>
          </div>
        )}

        {/* Danger Zone Warning */}
        {jackpot.dangerZoneEnabled && (
          <div className="danger-zone p-3 rounded mb-4">
            <div className="flex items-center space-x-2">
              <AlertTriangleIcon className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400 font-medium">Danger Zone Active</span>
            </div>
            <div className="text-xs text-red-300 mt-1">
              Bottom {jackpot.stripPercentage}% lose earnings
            </div>
          </div>
        )}

        {/* Platforms */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {activePlatforms.slice(0, 3).map((platform) => (
              <span 
                key={platform}
                className="px-2 py-1 bg-[#3b82f6] text-white text-xs rounded capitalize"
              >
                {platform}
              </span>
            ))}
            {activePlatforms.length > 3 && (
              <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded">
                +{activePlatforms.length - 3}
              </span>
            )}
          </div>
          
          <div className="text-xs text-gray-400">
            {isUpcoming && 'Starts soon'}
            {isActive && !isEnded && 'Live now'}
            {isEnded && 'Ended'}
          </div>
        </div>
      </div>
    </Link>
  );
}
