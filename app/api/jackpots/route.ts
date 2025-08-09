import { NextRequest, NextResponse } from 'next/server';
import { jackpotFormSchema } from '@/lib/validations/jackpot';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = jackpotFormSchema.parse(body);

    // For now, always return demo data to avoid database issues
    const demoJackpot = {
      id: 'demo_' + Date.now(),
      ...validatedData,
      createdAt: new Date().toISOString(),
      status: 'DRAFT',
      submissionCount: 0,
    };

    return NextResponse.json({
      success: true,
      message: 'Jackpot created successfully! (Demo mode)',
      jackpot: demoJackpot
    });

  } catch (error) {
    console.error('Jackpot creation error:', error);
    
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid data provided', 
          details: error 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: `Failed to create jackpot: ${error instanceof Error ? error.message : 'Unknown error'}` 
      },
      { status: 500 }
    );
  }
}