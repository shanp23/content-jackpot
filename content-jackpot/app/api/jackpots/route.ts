import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jackpotFormSchema } from '@/lib/validations/jackpot';
import { whopSdk } from '@/lib/whop-sdk';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('creatorId');
    const status = searchParams.get('status');

    let whereClause: any = {};
    
    if (creatorId) {
      whereClause.creatorId = creatorId;
    }
    
    if (status) {
      whereClause.status = status;
    }

    const jackpots = await prisma.jackpot.findMany({
      where: whereClause,
      include: {
        submissions: {
          orderBy: {
            viewsCount: 'desc'
          }
        },
        _count: {
          select: {
            submissions: true,
            extensionVotes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      jackpots: jackpots.map(jackpot => ({
        ...jackpot,
        submissionCount: jackpot._count.submissions,
        voteCount: jackpot._count.extensionVotes,
        topSubmission: jackpot.submissions[0] || null
      }))
    });
  } catch (error) {
    console.error('Error fetching jackpots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jackpots' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received data:', body);

    // Validate the data (dates are now handled as strings)
    const validatedData = jackpotFormSchema.parse(body);
    console.log('Validated data:', validatedData);

    // TODO: Get creator ID from authenticated user via Whop SDK
    const creatorId = "temp_creator_id"; // Replace with actual user ID from Whop auth

    const jackpot = await prisma.jackpot.create({
      data: {
        contentRewardsCampaignUrl: validatedData.contentRewardsCampaignUrl,
        creatorId,
        campaignName: validatedData.campaignName,
        type: validatedData.type,
        category: validatedData.category,
        thumbnailUrl: validatedData.thumbnailUrl || '',
        jackpotBudget: validatedData.jackpotBudget,
        currency: validatedData.currency,
        rewardRate: validatedData.rewardRate,
        minimumPayout: validatedData.minimumPayout,
        maximumPayout: validatedData.maximumPayout,
        flatFeeBonus: validatedData.flatFeeBonus || null,
        dangerZoneEnabled: validatedData.dangerZoneEnabled,
        stripPercentage: validatedData.stripPercentage,
        stripType: validatedData.stripType,
        winnersCount: validatedData.winnersCount,
        prizeDistribution: validatedData.prizeDistribution,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
        maxExtensions: validatedData.maxExtensions,
        platforms: validatedData.platforms,
        contentRequirements: validatedData.contentRequirements,
        availableContent: validatedData.availableContent || '',
      }
    });

    console.log('Created jackpot:', jackpot);

    return NextResponse.json({
      success: true,
      jackpot
    });
  } catch (error) {
    console.error('Error creating jackpot:', error);
    
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: `Failed to create jackpot: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
