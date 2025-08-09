import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const jackpot = await prisma.jackpot.findUnique({
      where: { id },
      include: {
        submissions: {
          orderBy: {
            viewsCount: 'desc'
          }
        },
        extensionVotes: true,
        _count: {
          select: {
            submissions: true,
            extensionVotes: true
          }
        }
      }
    });

    if (!jackpot) {
      return NextResponse.json(
        { error: 'Jackpot not found' },
        { status: 404 }
      );
    }

    // Calculate rankings and danger zone status
    const submissionsWithRanks = jackpot.submissions.map((submission, index) => {
      const rank = index + 1;
      const totalSubmissions = jackpot.submissions.length;
      const dangerZoneThreshold = Math.ceil(totalSubmissions * (jackpot.stripPercentage / 100));
      const inDangerZone = jackpot.dangerZoneEnabled && rank > (totalSubmissions - dangerZoneThreshold);
      
      const baseEarnings = (submission.viewsCount / 1000) * jackpot.rewardRate;
      const strippedAmount = inDangerZone ? 
        (jackpot.stripType === 'FULL' ? baseEarnings : 
         jackpot.stripType === 'PARTIAL' ? baseEarnings * 0.5 : 
         baseEarnings * (rank / totalSubmissions)) : 0;

      return {
        ...submission,
        rank,
        inDangerZone,
        baseEarnings,
        strippedAmount: inDangerZone ? strippedAmount : 0,
        potentialJackpot: rank <= jackpot.winnersCount ? 
          (jackpot.jackpotBudget * (getPrizePercentage(rank, jackpot.prizeDistribution) / 100)) : 0
      };
    });

    return NextResponse.json({
      success: true,
      jackpot: {
        ...jackpot,
        submissions: submissionsWithRanks,
        submissionCount: jackpot._count.submissions,
        voteCount: jackpot._count.extensionVotes
      }
    });
  } catch (error) {
    console.error('Error fetching jackpot:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jackpot' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { status, ...updateData } = body;

    const jackpot = await prisma.jackpot.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      jackpot
    });
  } catch (error) {
    console.error('Error updating jackpot:', error);
    return NextResponse.json(
      { error: 'Failed to update jackpot' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.jackpot.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Jackpot deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting jackpot:', error);
    return NextResponse.json(
      { error: 'Failed to delete jackpot' },
      { status: 500 }
    );
  }
}

function getPrizePercentage(rank: number, distribution: any): number {
  const places = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
  const place = places[rank - 1];
  return distribution[place] || 0;
}
