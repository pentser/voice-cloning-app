import { NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db } from '@/lib/db';
import { voiceClones } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { ElevenLabsAPI } from '@/lib/elevenlabs';

export async function GET(request, { params }) {
  try {
    // Check authentication
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { voiceCloneId } = params;

    if (!voiceCloneId) {
      return NextResponse.json(
        { error: 'Voice clone ID is required' },
        { status: 400 }
      );
    }

    // Get voice clone to verify ownership
    const voiceClone = await db
      .select()
      .from(voiceClones)
      .where(and(
        eq(voiceClones.id, voiceCloneId),
        eq(voiceClones.userId, user.id)
      ))
      .limit(1);

    if (voiceClone.length === 0) {
      return NextResponse.json(
        { error: 'Voice clone not found or access denied' },
        { status: 404 }
      );
    }

    const clone = voiceClone[0];

    // Initialize ElevenLabs API
    const elevenLabs = new ElevenLabsAPI();

    try {
      // Option 1: Try voice conversion (if available)
      const conversionResult = await elevenLabs.convertVoice(
        clone.originalFileUrl,
        clone.elevenLabsVoiceId
      );

      if (conversionResult.success) {
        return new NextResponse(conversionResult.audioBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'audio/mpeg',
            'Content-Disposition': `inline; filename="transformed_${clone.voiceName}.mp3"`,
            'Cache-Control': 'public, max-age=3600',
          },
        });
      }

      // Option 2: Fallback to generating a voice sample
      const sampleResult = await elevenLabs.getVoiceSample(
        clone.elevenLabsVoiceId,
        `This is a sample of the ${clone.voiceName} voice clone.`
      );

      if (sampleResult.success) {
        return new NextResponse(sampleResult.audioBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'audio/mpeg',
            'Content-Disposition': `inline; filename="sample_${clone.voiceName}.mp3"`,
            'Cache-Control': 'public, max-age=3600',
          },
        });
      }

      // If both methods fail, return error
      return NextResponse.json(
        { error: 'Failed to generate voice sample or convert audio' },
        { status: 500 }
      );

    } catch (processError) {
      console.error('Error processing voice:', processError);
      return NextResponse.json(
        { error: 'Failed to process voice transformation' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Voice transform error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 