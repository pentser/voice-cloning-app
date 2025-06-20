import { NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db } from '@/lib/db';
import { voiceClones } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

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