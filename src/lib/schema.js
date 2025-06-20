import { pgTable, text, uuid, timestamp, varchar } from 'drizzle-orm/pg-core';

// Voice clones table
export const voiceClones = pgTable('voice_clones', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  voiceName: varchar('voice_name', { length: 100 }).notNull(),
  originalFileUrl: text('original_file_url').notNull(),
  elevenLabsVoiceId: text('eleven_labs_voice_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}); 