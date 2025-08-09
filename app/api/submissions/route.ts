import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const submissionSchema = z.object({
  jackpotId: z.string(),
  userId: z.string(),
  userName: z.string(),
  contentUrl: z.string().url(),
  platform: z.enum(['TIKTOK', 'INSTAGRAM', 'YOUTUBE', 'TWITTER']),
  viewsCount: z.number().min(0).optional().default(0)
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jackpotId = searchParams.get('jackpotId');
    const userId = searchParams.get('userId');

    let whereClause: any = {};
    
    if (jackpotId) {
      whereClause.jackpotId = jackpotId;
    }
    
    if (userId) {
      whereClause.userId = userId;
    }

    const submissions = await prisma.submission.findMany({
      where: whereClause,
      include: {
        jackpot: {
          select: {
            campaignName: true,
            rewardRate: true,
            currency: true,
            dangerZoneEnabled: true,
            stripPercentage: true,
            status: true
          }
        }
      },
      orderBy: {
        viewsCount: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      submissions
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = submissionSchema.parse(body);

    // Check if user already has a submission for this jackpot
    const existingSubmission = await prisma.submission.findUnique({
      where: {
        jackpotId_userId: {
          jackpotId: validatedData.jackpotId,
          userId: validatedData.userId
        }
      }
    });

    if (existingSubmission) {
      return NextResponse.json(
        { error: 'User already has a submission for this jackpot' },
        { status: 409 }
      );
    }

    // Get jackpot details for calculations
    const jackpot = await prisma.jackpot.findUnique({
      where: { id: validatedData.jackpotId }
    });

    if (!jackpot) {
      return NextResponse.json(
        { error: 'Jackpot not found' },
        { status: 404 }
      );
    }

    if (jackpot.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Jackpot is not active for submissions' },
        { status: 400 }
      );
    }

    const baseEarnings = (validatedData.viewsCount / 1000) * jackpot.rewardRate;

    const submission = await prisma.submission.create({
      data: {
        ...validatedData,
        baseEarnings,
        lastUpdated: new Date()
      }
    });

    // Update rankings after new submission
    await updateSubmissionRankings(validatedData.jackpotId);

    return NextResponse.json({
      success: true,
      submission
    });
  } catch (error) {
    console.error('Error creating submission:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, viewsCount, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    const submission = await prisma.submission.findUnique({
      where: { id },
      include: { jackpot: true }
    });

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Recalculate base earnings if views count changed
    let baseEarnings = submission.baseEarnings;
    if (viewsCount !== undefined && viewsCount !== submission.viewsCount) {
      baseEarnings = (viewsCount / 1000) * submission.jackpot.rewardRate;
    }

    const updatedSubmission = await prisma.submission.update({
      where: { id },
      data: {
        ...updateData,
        viewsCount: viewsCount ?? submission.viewsCount,
        baseEarnings,
        lastUpdated: new Date()
      }
    });

    // Update rankings after views change
    if (viewsCount !== undefined) {
      await updateSubmissionRankings(submission.jackpotId);
    }

    return NextResponse.json({
      success: true,
      submission: updatedSubmission
    });
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    );
  }
}

async function updateSubmissionRankings(jackpotId: string) {
  try {
    // Get all submissions for this jackpot ordered by views
    const submissions = await prisma.submission.findMany({
      where: { jackpotId },
      orderBy: { viewsCount: 'desc' },
      include: { jackpot: true }
    });

    if (submissions.length === 0) return;

    const jackpot = submissions[0].jackpot;
    const totalSubmissions = submissions.length;
    const dangerZoneThreshold = Math.ceil(totalSubmissions * (jackpot.stripPercentage / 100));

    // Update each submission with new ranking and danger zone status
    for (let i = 0; i < submissions.length; i++) {
      const submission = submissions[i];
      const rank = i + 1;
      const inDangerZone = jackpot.dangerZoneEnabled && rank > (totalSubmissions - dangerZoneThreshold);
      
      const strippedAmount = inDangerZone ? 
        (jackpot.stripType === 'FULL' ? submission.baseEarnings : 
         jackpot.stripType === 'PARTIAL' ? submission.baseEarnings * 0.5 : 
         submission.baseEarnings * (rank / totalSubmissions)) : 0;

      const potentialJackpot = rank <= jackpot.winnersCount ? 
        (jackpot.jackpotBudget * (getPrizePercentage(rank, jackpot.prizeDistribution) / 100)) : 0;

      await prisma.submission.update({
        where: { id: submission.id },
        data: {
          rank,
          inDangerZone,
          strippedAmount,
          potentialJackpot
        }
      });
    }
  } catch (error) {
    console.error('Error updating submission rankings:', error);
  }
}

function getPrizePercentage(rank: number, distribution: any): number {
  const places = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
  const place = places[rank - 1];
  return distribution[place] || 0;
}
