import { NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db } from '@/lib/db';
import { voiceClones } from '@/lib/schema';
import { eq, desc, and } from 'drizzle-orm';
import { ElevenLabsAPI } from '@/lib/elevenlabs';

export async function GET() {
  try {
    // Check authentication
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's voice clones
    const userVoiceClones = await db
      .select()
      .from(voiceClones)
      .where(eq(voiceClones.userId, user.id))
      .orderBy(desc(voiceClones.createdAt));

    return NextResponse.json({
      success: true,
      voiceClones: userVoiceClones,
    });
  } catch (error) {
    console.error('Get voice clones error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    // Check authentication
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { voiceCloneId } = body;

    if (!voiceCloneId) {
      return NextResponse.json(
        { error: 'Voice clone ID is required' },
        { status: 400 }
      );
    }

    // Get voice clone to verify ownership and get ElevenLabs voice ID
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

    // Delete from ElevenLabs
    const elevenLabs = new ElevenLabsAPI();
    const deleteResult = await elevenLabs.deleteVoice(clone.elevenLabsVoiceId);

    if (!deleteResult.success) {
      console.warn('Failed to delete from ElevenLabs:', deleteResult.error);
      // Continue with database deletion even if ElevenLabs deletion fails
    }

    // Delete from database
    await db
      .delete(voiceClones)
      .where(and(
        eq(voiceClones.id, voiceCloneId),
        eq(voiceClones.userId, user.id)
      ));

    return NextResponse.json({
      success: true,
      message: 'Voice clone deleted successfully',
    });
  } catch (error) {
    console.error('Delete voice clone error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 