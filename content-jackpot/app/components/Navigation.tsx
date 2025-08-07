'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrophyIcon, PlusIcon, HomeIcon, BarChart3Icon } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-[#1a1a1a] border-b border-[#2a2a2a] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <TrophyIcon className="h-8 w-8 text-[#3b82f6]" />
            <span className="text-xl font-bold text-white">Content Jackpot</span>
          </Link>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-[#3b82f6] text-white'
                  : 'text-gray-300 hover:text-white hover:bg-[#2a2a2a]'
              }`}
            >
              <HomeIcon className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/create"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/create')
                  ? 'bg-[#3b82f6] text-white'
                  : 'text-gray-300 hover:text-white hover:bg-[#2a2a2a]'
              }`}
            >
              <PlusIcon className="h-4 w-4" />
              <span>Create Jackpot</span>
            </Link>

            <Link
              href="/analytics"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/analytics')
                  ? 'bg-[#3b82f6] text-white'
                  : 'text-gray-300 hover:text-white hover:bg-[#2a2a2a]'
              }`}
            >
              <BarChart3Icon className="h-4 w-4" />
              <span>Analytics</span>
            </Link>
          </div>

          {/* Mobile menu button - you can expand this later */}
          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
