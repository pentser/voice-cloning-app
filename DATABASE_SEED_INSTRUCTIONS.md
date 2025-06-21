# Database Seeding Instructions

This guide will help you populate your voice cloning database with sample data including users and voice clone entries with web-accessible MP3 files.

## Prerequisites

1. **PostgreSQL Database**: Make sure you have a PostgreSQL database running locally
2. **Database Setup**: Ensure your database is created and migrations are applied
3. **Environment Variables**: Set up your `.env` file with the database connection

## Database Setup

### 1. Create Local PostgreSQL Database

If you haven't created the database yet:

```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create the database
CREATE DATABASE voice_cloning_db;

-- Create a user (optional)
CREATE USER voice_clone_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE voice_cloning_db TO voice_clone_user;
```

### 2. Environment Configuration

Create a `.env` file in the root of your project with:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/voice_cloning_db"
```

Replace:
- `username`: Your PostgreSQL username
- `password`: Your PostgreSQL password
- `voice_cloning_db`: Your database name

### 3. Run Database Migrations

```bash
# Generate migration files (if not already done)
npm run db:generate

# Apply migrations to create tables
npm run db:migrate

# Or push schema directly (alternative)
npm run db:push
```

## Running the Seed Script

### 1. Run the Seed Command

```bash
npm run db:seed
```

This will:
- Clear existing voice clone data (optional - you can modify the script to preserve existing data)
- Insert 10 sample voice clone records
- Display a summary of inserted data

### 2. Expected Output

```
🌱 Starting database seeding...
🗑️ Clearing existing voice clones...
📝 Inserting sample voice clones...
✅ Successfully inserted 10 voice clones!
📊 Seed data summary:
   👤 user_2aC8vX1fKGgTgJ3bYsW7K9mF5nL: 2 voice clones
   👤 user_3bD9wY2gLHhUhK4cZtX8L0nG6oM: 2 voice clones
   👤 user_4cE0xZ3hMIiViL5dAuY9M1oH7pN: 2 voice clones
   👤 user_5dF1yA4iNJjWjM6eBvZ0N2pI8qO: 2 voice clones
   👤 user_6eG2zB5jOKkXkN7fCwA1O3qJ9rP: 2 voice clones

🎉 Database seeding completed successfully!
```

## Sample Data Overview

The seed script creates 10 voice clone records with:

- **5 Different Users**: Each with realistic Kinde-style user IDs
- **Voice Types**: Professional voices, narrators, podcast hosts, etc.
- **Audio Files**: Web-accessible MP3 files from various sources
- **ElevenLabs Voice IDs**: Sample voice IDs (you'll need to replace these with actual ones from ElevenLabs)

### Sample Records Include:

1. **Professional Male Voice** - Corporate training style
2. **Narrator Voice Clone** - Audiobook narrator style
3. **Female Podcast Host** - Professional female voice
4. **Conference Speaker** - Business presentation style
5. **Corporate Training Voice** - Educational content style
6. **Audiobook Narrator** - Story reading style
7. **Video Game Character** - Character voice style
8. **AI Assistant Voice** - Digital assistant style
9. **Meditation Guide** - Calm, soothing voice
10. **Commercial Voice Over** - Advertisement style

## Customizing the Seed Data

To modify the seed data:

1. **Edit the script**: Open `scripts/seed.js`
2. **Update `sampleVoiceClones` array**: Modify user IDs, voice names, or audio URLs
3. **Replace audio URLs**: Use your own MP3 files or better voice samples
4. **Add/Remove records**: Modify the array to include more or fewer records

### Important Notes

- **User IDs**: Replace the sample user IDs with actual Kinde user IDs from your authentication system
- **ElevenLabs Voice IDs**: Replace the sample voice IDs with actual ones after creating voice clones in ElevenLabs
- **Audio Files**: The sample URLs may not always be available; consider hosting your own voice samples
- **Preserving Data**: Comment out the `await db.delete(voiceClones);` line if you want to keep existing data

## Verifying the Data

After seeding, you can verify the data using:

1. **Drizzle Studio**: `npm run db:studio`
2. **Database Query**: Connect directly to your PostgreSQL database
3. **Your Application**: Check if the data appears in your voice cloning app

## Troubleshooting

### Common Issues:

1. **Connection Error**: Check your `DATABASE_URL` in the `.env` file
2. **Table Not Found**: Run migrations first: `npm run db:migrate`
3. **Permission Issues**: Ensure your database user has proper permissions
4. **Audio URLs**: Some sample URLs might be unavailable; replace with working ones

### Database Reset

If you need to reset and reseed:

```bash
# Drop and recreate tables
npm run db:push

# Run seed again
npm run db:seed
```

## Production Considerations

- **Never run this seed script in production**
- **Use real user IDs and voice IDs for production data**
- **Host your own audio files instead of relying on external URLs**
- **Implement proper error handling and validation** 