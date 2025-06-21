import { NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db } from '@/lib/db';
import { voiceClones } from '@/lib/schema';
import { ElevenLabsAPI } from '@/lib/elevenlabs';

export async function POST(request) {
  try {
    // Check authentication
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { voiceName, audioFileUrl } = body;

    if (!voiceName || !audioFileUrl) {
      return NextResponse.json(
        { error: 'Voice name and audio file URL are required' },
        { status: 400 }
      );
    }

    // Initialize ElevenLabs API
    const elevenLabs = new ElevenLabsAPI();

    // Clone voice using ElevenLabs
    const cloneResult = await elevenLabs.cloneVoice(
      voiceName,
      `Voice clone for ${user.email || user.id}`,
      audioFileUrl
    );

    if (!cloneResult.success) {
      const errorMessage = typeof cloneResult.error === 'object' 
        ? JSON.stringify(cloneResult.error) 
        : cloneResult.error || 'Unknown error occurred';
      return NextResponse.json(
        { error: `Failed to clone voice: ${errorMessage}` },
        { status: 500 }
      );
    }

    // Save to database
    const voiceClone = await db.insert(voiceClones).values({
      userId: user.id,
      voiceName,
      originalFileUrl: audioFileUrl,
      elevenLabsVoiceId: cloneResult.voiceId,
    }).returning();

    return NextResponse.json({
      success: true,
      voiceClone: voiceClone[0],
      elevenLabsData: cloneResult.data,
    });
  } catch (error) {
    console.error('Voice clone error:', error);
    const errorMessage = typeof error === 'object' 
      ? error.message || JSON.stringify(error) 
      : error || 'Internal server error';
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    );
  }
} 