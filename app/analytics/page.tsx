import Link from 'next/link';
import { BarChart2Icon, DollarSignIcon, UsersIcon, TrophyIcon, PlusIcon } from 'lucide-react';

export default function AnalyticsPage() {
  const totals = getTotals();
  return (
    <div className="min-h-screen bg-app py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-app mb-4">Analytics Dashboard</h1>
          <p className="text-muted">Track your jackpot performance and earnings</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <DollarSignIcon className="w-8 h-8 text-[#10b981] mx-auto mb-3" />
            <p className="text-sm text-muted">Total Payouts</p>
            <h3 className="text-2xl font-bold text-app">${totals.totalPayout.toFixed(2)}</h3>
          </div>
          <div className="card text-center">
            <UsersIcon className="w-8 h-8 text-primary mx-auto mb-3" />
            <p className="text-sm text-muted">Total Participants</p>
            <h3 className="text-2xl font-bold text-app">{totals.totalParticipants}</h3>
          </div>
          <div className="card text-center">
            <TrophyIcon className="w-8 h-8 text-[#f59e0b] mx-auto mb-3" />
            <p className="text-sm text-muted">Active Jackpots</p>
            <h3 className="text-2xl font-bold text-app">{totals.activeJackpots}</h3>
          </div>
        </div>

        {/* No Data State */}
        <div className="card text-center py-12">
          <BarChart2Icon className="w-16 h-16 text-muted mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-app mb-2">No Analytics Data Yet</h3>
          <p className="text-muted mb-6">Create your first jackpot to start seeing performance data</p>
          <Link href="/create" className="btn btn-primary">
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Your First Jackpot
          </Link>
        </div>
      </div>
    </div>
  );
}

function getTotals() {
  try {
    const raw = localStorage.getItem('jackpots');
    const arr: any[] = raw ? JSON.parse(raw) : [];
    const activeJackpots = arr.filter(j => new Date(j.endDate) > new Date()).length;
    const totalParticipants = arr.reduce((s, j) => s + (Array.isArray(j.participants) ? j.participants.length : 0), 0);
    // In per-1k model, payouts come from approved submissions' view-based amounts; we keep placeholder here (0) until actual views per submission are tracked
    const totalPayout = arr.reduce((s, j) => s + 0, 0);
    return { activeJackpots, totalParticipants, totalPayout };
  } catch {
    return { activeJackpots: 0, totalParticipants: 0, totalPayout: 0 };
  }
}