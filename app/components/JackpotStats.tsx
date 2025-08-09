'use client';

import React from 'react';
import { TrophyIcon, DollarSignIcon, UsersIcon, PlayIcon } from 'lucide-react';

interface JackpotStatsProps {
  stats: {
    totalJackpots: number;
    activeJackpots: number;
    totalPrizePool: number;
    totalParticipants: number;
    currency: string;
  };
}

export default function JackpotStats({ stats }: JackpotStatsProps) {
  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'USD': 
      default: return '$';
    }
  };

  const statCards = [
    {
      label: 'Total Jackpots',
      value: stats.totalJackpots.toLocaleString(),
      icon: TrophyIcon,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    },
    {
      label: 'Active Campaigns',
      value: stats.activeJackpots.toLocaleString(),
      icon: PlayIcon,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    {
      label: 'Total Prize Pool',
      value: `${getCurrencySymbol(stats.currency)}${stats.totalPrizePool.toLocaleString()}`,
      icon: DollarSignIcon,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      label: 'Total Participants',
      value: stats.totalParticipants.toLocaleString(),
      icon: UsersIcon,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
