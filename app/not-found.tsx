import Link from 'next/link';
import { TrophyIcon, HomeIcon } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <TrophyIcon className="w-20 h-20 text-[#3b82f6] mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-white mb-4">404 - Page Not Found</h1>
        <p className="text-lg text-gray-400 mb-8">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <Link href="/" className="btn btn-primary px-8 py-3 text-lg">
          <HomeIcon className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
