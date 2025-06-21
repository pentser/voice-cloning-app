import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { voiceClones } from '../src/lib/schema.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Check if DATABASE_URL is provided
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required!');
  console.error('📝 Please create a .env file with:');
  console.error('   DATABASE_URL="postgresql://username:password@localhost:5432/voice_cloning_db"');
  process.exit(1);
}

// Create connection pool with better error handling
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Additional connection options for better reliability
  max: 1, // Limit connections for seeding
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Create drizzle instance
const db = drizzle(pool, { schema: { voiceClones } });

// Sample seed data with realistic voice samples
const sampleVoiceClones = [
  {
    userId: 'user_2aC8vX1fKGgTgJ3bYsW7K9mF5nL', // Sample Kinde user ID format
    voiceName: 'Professional Male Voice',
    originalFileUrl: 'https://file-examples.com/storage/fec855a3b96c1e4b04b10f5/2017/11/file_example_MP3_700KB.mp3', // Sample voice file
    elevenLabsVoiceId: 'voice_sample_001', // This would be actual ElevenLabs voice ID after cloning
  },
  {
    userId: 'user_2aC8vX1fKGgTgJ3bYsW7K9mF5nL',
    voiceName: 'Narrator Voice Clone',
    originalFileUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
    elevenLabsVoiceId: 'voice_sample_002',
  },
  {
    userId: 'user_3bD9wY2gLHhUhK4cZtX8L0nG6oM',
    voiceName: 'Female Podcast Host',
    originalFileUrl: 'https://sample-videos.com/zip/10/mp3/mp3-SampleAudio_0.4mb.mp3',
    elevenLabsVoiceId: 'voice_sample_003',
  },
  {
    userId: 'user_3bD9wY2gLHhUhK4cZtX8L0nG6oM',
    voiceName: 'Conference Speaker',
    originalFileUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3', // Placeholder - you can replace with actual voice samples
    elevenLabsVoiceId: 'voice_sample_004',
  },
  {
    userId: 'user_4cE0xZ3hMIiViL5dAuY9M1oH7pN',
    voiceName: 'Corporate Training Voice',
    originalFileUrl: 'https://audio-samples.github.io/samples/mp3/blizzard_unconditional/sample-0.mp3',
    elevenLabsVoiceId: 'voice_sample_005',
  },
  {
    userId: 'user_4cE0xZ3hMIiViL5dAuY9M1oH7pN',
    voiceName: 'Audiobook Narrator',
    originalFileUrl: 'https://audio-samples.github.io/samples/mp3/blizzard_unconditional/sample-1.mp3',
    elevenLabsVoiceId: 'voice_sample_006',
  },
  {
    userId: 'user_5dF1yA4iNJjWjM6eBvZ0N2pI8qO',
    voiceName: 'Video Game Character',
    originalFileUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav', // You may want to convert this to MP3
    elevenLabsVoiceId: 'voice_sample_007',
  },
  {
    userId: 'user_5dF1yA4iNJjWjM6eBvZ0N2pI8qO',
    voiceName: 'AI Assistant Voice',
    originalFileUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/PinkPanther30.wav',
    elevenLabsVoiceId: 'voice_sample_008',
  },
  {
    userId: 'user_6eG2zB5jOKkXkN7fCwA1O3qJ9rP',
    voiceName: 'Meditation Guide',
    originalFileUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/StarWars3.wav',
    elevenLabsVoiceId: 'voice_sample_009',
  },
  {
    userId: 'user_6eG2zB5jOKkXkN7fCwA1O3qJ9rP',
    voiceName: 'Commercial Voice Over',
    originalFileUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/taunt.wav',
    elevenLabsVoiceId: 'voice_sample_010',
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Test database connection
    console.log('🔌 Testing database connection...');
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    client.release();
    
    // Clear existing data (optional - remove if you want to keep existing data)
    console.log('🗑️ Clearing existing voice clones...');
    await db.delete(voiceClones);
    
    // Insert sample data
    console.log('📝 Inserting sample voice clones...');
    const insertedClones = await db.insert(voiceClones).values(sampleVoiceClones).returning();
    
    console.log(`✅ Successfully inserted ${insertedClones.length} voice clones!`);
    console.log('📊 Seed data summary:');
    
    // Group by userId to show user statistics
    const userStats = {};
    insertedClones.forEach(clone => {
      if (!userStats[clone.userId]) {
        userStats[clone.userId] = 0;
      }
      userStats[clone.userId]++;
    });
    
    Object.entries(userStats).forEach(([userId, count]) => {
      console.log(`   👤 ${userId}: ${count} voice clones`);
    });
    
    console.log('\n🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    // Close the connection pool
    await pool.end();
  }
}

// Run the seed function
seedDatabase(); 