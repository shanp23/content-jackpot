'use client';

import { useState, useEffect } from 'react';

export default function AuthComponent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking authentication status
    // In a real app, this would check with Whop SDK
    const checkAuth = async () => {
      try {
        // Mock authentication check
        setIsLoading(false);
        setIsAuthenticated(process.env.NODE_ENV === 'development'); // Show as authenticated in dev
      } catch (error) {
        setIsLoading(false);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3b82f6]"></div>
        <span className="ml-2 text-gray-400">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-6">
        <h3 className="text-amber-400 font-semibold mb-2">Authentication Required</h3>
        <p className="text-amber-300 text-sm">
          Please install this app in your Whop to access all features.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
      <h3 className="text-green-400 font-semibold mb-2">✅ Connected to Whop</h3>
      <div className="text-green-300 text-sm">
        <p><strong>Status:</strong> Ready to create Content Jackpots</p>
        <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
      </div>
    </div>
  );
}
