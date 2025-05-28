import { NextResponse } from 'next/server';

import { chatWithOpenAI } from '@/utils/ai/openai-service';

export async function POST(request: Request) {
  try {
    const { messages, userId } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 },
      );
    }

    const userIdentifier = userId || 'anonymous';

    const response = await chatWithOpenAI(messages, userIdentifier);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in laminGPT API:', error);

    return NextResponse.json(
      {
        error: `Failed to get chat response: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 },
    );
  }
}
