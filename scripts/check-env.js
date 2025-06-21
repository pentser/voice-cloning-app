import dotenv from 'dotenv';
import { Pool } from 'pg';

// Load environment variables
dotenv.config();

console.log('🔍 Environment Variable Check\n');

// Check if DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set!');
  console.log('\n📝 To fix this:');
  console.log('1. Create a .env file in your project root');
  console.log('2. Add the following line:');
  console.log('   DATABASE_URL="postgresql://username:password@localhost:5432/voice_cloning_db"');
  console.log('\n🔧 Replace with your actual database credentials:');
  console.log('   - username: Your PostgreSQL username');
  console.log('   - password: Your PostgreSQL password'); 
  console.log('   - localhost: Your database host (localhost for local)');
  console.log('   - 5432: Your PostgreSQL port (5432 is default)');
  console.log('   - voice_cloning_db: Your database name');
  process.exit(1);
}

console.log('✅ DATABASE_URL is set');
console.log(`📍 Connection string: ${process.env.DATABASE_URL.replace(/:[^:@]*@/, ':****@')}`);

// Test the connection
console.log('\n🔌 Testing database connection...');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
  connectionTimeoutMillis: 5000,
});

try {
  const client = await pool.connect();
  console.log('✅ Database connection successful!');
  
  // Test if voice_clones table exists
  const result = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'voice_clones'
  `);
  
  if (result.rows.length > 0) {
    console.log('✅ voice_clones table exists');
    
    // Check current record count
    const countResult = await client.query('SELECT COUNT(*) FROM voice_clones');
    console.log(`📊 Current records in voice_clones: ${countResult.rows[0].count}`);
  } else {
    console.log('⚠️  voice_clones table does not exist');
    console.log('🔧 Run migrations first: npm run db:migrate');
  }
  
  client.release();
  console.log('\n🎉 Environment check completed successfully!');
  console.log('🚀 You can now run: npm run db:seed');
  
} catch (error) {
  console.error('❌ Database connection failed!');
  console.error('💡 Error details:', error.message);
  
  if (error.code === 'ECONNREFUSED') {
    console.log('\n🔧 Possible solutions:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Check your connection details in DATABASE_URL');
    console.log('3. Verify the database exists');
  } else if (error.code === 'ENOTFOUND') {
    console.log('\n🔧 Possible solutions:');
    console.log('1. Check the hostname in your DATABASE_URL');
    console.log('2. Make sure you can reach the database server');
  } else if (error.message.includes('password authentication failed')) {
    console.log('\n🔧 Possible solutions:');
    console.log('1. Check your username and password in DATABASE_URL');
    console.log('2. Make sure the user has access to the database');
  } else if (error.message.includes('database') && error.message.includes('does not exist')) {
    console.log('\n🔧 Possible solutions:');
    console.log('1. Create the database first:');
    console.log('   psql -U postgres -c "CREATE DATABASE voice_cloning_db;"');
  }
  
  process.exit(1);
} finally {
  await pool.end();
} 