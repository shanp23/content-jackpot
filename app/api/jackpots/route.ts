import { NextRequest, NextResponse } from 'next/server';
import { jackpotFormSchema } from '@/lib/validations/jackpot';
import { prisma } from '@/lib/prisma';

// GET /api/jackpots → list jackpots with aggregate metrics
export async function GET() {
  try {
    const jackpots = await prisma.jackpot.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        submissions: {
          orderBy: { viewsCount: 'desc' },
        },
      },
    });

    const shaped = jackpots.map((j) => {
      const totalViews = j.submissions.reduce((s, p) => s + (p.viewsCount || 0), 0);
      const totalSubs = j.submissions.length;
      const topParticipants = j.submissions.slice(0, 50).map((s) => ({
        id: s.id,
        name: s.userName,
        views: s.viewsCount,
      }));
      return {
        id: j.id,
        campaignName: j.campaignName,
        contentRewardsCampaignUrl: j.contentRewardsCampaignUrl,
        jackpotBudget: j.jackpotBudget,
        currency: j.currency,
        startDate: j.startDate.toISOString(),
        endDate: j.endDate.toISOString(),
        platforms: j.platforms as any,
        contentRequirements: j.contentRequirements,
        status: j.status,
        rewardRatePer1k: j.rewardRate,
        views: totalViews,
        submissions: totalSubs,
        participants: topParticipants,
        jackpotPool: (j as any).jackpotPool ?? undefined,
        prizeSplit: (j as any).prizeSplit ?? undefined,
        winners: (j as any).winners ?? undefined,
        dangerZonePhases: (j as any).dangerZonePhases ?? undefined,
        stripPercentage: j.stripPercentage,
      };
    });

    return NextResponse.json({ success: true, jackpots: shaped });
  } catch (error) {
    console.error('Jackpots list error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch jackpots' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = jackpotFormSchema.parse(body);

    // Map form → Prisma model
    const created = await prisma.jackpot.create({
      data: {
        contentRewardsCampaignUrl: validated.contentRewardsCampaignUrl,
        creatorId: 'unknown', // set from auth when available
        campaignName: validated.campaignName,
        type: 'UGC',
        category: 'GENERAL',
        thumbnailUrl: '',
        jackpotBudget: validated.jackpotBudget,
        currency: validated.currency as any,
        rewardRate: validated.rewardRatePer1k,
        minimumPayout: 0,
        maximumPayout: validated.jackpotBudget,
        flatFeeBonus: null,
        dangerZoneEnabled: true,
        stripPercentage: validated.baseDanger.stripPercentage,
        stripType: 'PARTIAL',
        prizeDistribution: { first: 0, second: 0, third: 0 } as any,
        winnersCount: 3,
        status: 'ACTIVE',
        startDate: new Date(validated.startDate),
        endDate: new Date(validated.endDate),
        extensionsUsed: 0,
        maxExtensions: 3,
        platforms: validated.platforms as any,
        contentRequirements: validated.contentRequirements,
        availableContent: validated.guidelinesLink || '',
        dangerZonePhases: validated.progressiveEnabled ? (validated.dangerZonePhases as any) : null,
      },
    });

    return NextResponse.json({ success: true, jackpot: { id: created.id } });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ success: false, error: 'Invalid data provided', details: error }, { status: 400 });
    }
    console.error('Jackpot creation error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create jackpot' }, { status: 500 });
  }
}
