'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrophyIcon, PlusIcon, HomeIcon, BarChart3Icon } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="navbar sticky top-0 z-50" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <TrophyIcon className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-app">Content Jackpot</span>
          </Link>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/')
                  ? 'bg-primary text-white border border-subtle'
                  : 'text-muted hover:text-app hover:bg-card hover:border-subtle border border-transparent'
              }`}
            >
              <HomeIcon className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/create"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/create')
                  ? 'bg-primary text-white border border-subtle'
                  : 'text-muted hover:text-app hover:bg-card hover:border-subtle border border-transparent'
              }`}
            >
              <PlusIcon className="h-4 w-4" />
              <span>Create Jackpot</span>
            </Link>

            <Link
              href="/analytics"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/analytics')
                  ? 'bg-primary text-white border border-subtle'
                  : 'text-muted hover:text-app hover:bg-card hover:border-subtle border border-transparent'
              }`}
            >
              <BarChart3Icon className="h-4 w-4" />
              <span>Analytics</span>
            </Link>
          </div>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-muted hover:text-app">
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

function ThemeToggle() {
  const [mode, setMode] = React.useState<'light' | 'dark' | 'auto'>(() => {
    if (typeof window === 'undefined') return 'dark';
    return (localStorage.getItem('theme') as any) || 'auto';
  });

  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    if (mode === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.dataset.theme = prefersDark ? 'dark' : 'light';
    } else {
      document.documentElement.dataset.theme = mode;
    }
    localStorage.setItem('theme', mode);
  }, [mode]);

  return (
    <div className="ml-2 flex items-center gap-1" suppressHydrationWarning>
      <button onClick={() => setMode('light')} className={`text-xs px-2 py-1 rounded ${mode==='light'?'bg-primary text-white':'text-muted hover:text-app hover:bg-card'}`}>Light</button>
      <button onClick={() => setMode('dark')} className={`text-xs px-2 py-1 rounded ${mode==='dark'?'bg-primary text-white':'text-muted hover:text-app hover:bg-card'}`}>Dark</button>
      <button onClick={() => setMode('auto')} className={`text-xs px-2 py-1 rounded ${mode==='auto'?'bg-primary text-white':'text-muted hover:text-app hover:bg-card'}`}>Auto</button>
    </div>
  );
}