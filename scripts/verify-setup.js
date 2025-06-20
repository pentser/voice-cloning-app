#!/usr/bin/env node

// Simple script to verify that all required environment variables are set
const requiredEnvVars = [
  'DATABASE_URL',
  'KINDE_CLIENT_ID',
  'KINDE_CLIENT_SECRET',
  'KINDE_ISSUER_URL',
  'KINDE_SITE_URL',
  'KINDE_POST_LOGOUT_REDIRECT_URL',
  'KINDE_POST_LOGIN_REDIRECT_URL',
  'UPLOADTHING_TOKEN',
  'ELEVENLABS_API_KEY'
];

console.log('🔍 Verifying Voice Cloning App Setup...\n');

let allGood = true;

// Check for .env.local file
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found');
  console.log('   Please copy env.template to .env.local and fill in your values\n');
  allGood = false;
} else {
  console.log('✅ .env.local file found');
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Check each required environment variable
console.log('\n📋 Checking Environment Variables:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value.startsWith('your_')) {
    console.log(`❌ ${varName} - Not set or using placeholder value`);
    allGood = false;
  } else {
    console.log(`✅ ${varName} - Set`);
  }
});

// Check database connection format
if (process.env.DATABASE_URL) {
  if (process.env.DATABASE_URL.startsWith('postgresql://')) {
    console.log('✅ DATABASE_URL format looks correct');
  } else {
    console.log('⚠️  DATABASE_URL should start with postgresql://');
  }
}

console.log('\n🔧 Next Steps:');
if (!allGood) {
  console.log('1. Copy env.template to .env.local');
  console.log('2. Fill in all the required values from your service providers');
  console.log('3. Run this script again to verify');
} else {
  console.log('1. Set up your PostgreSQL database');
  console.log('2. Run: npm run db:generate');
  console.log('3. Run: npm run db:push');
  console.log('4. Run: npm run dev');
}

console.log('\n📚 Setup Documentation:');
console.log('- Kinde: https://kinde.com');
console.log('- UploadThing: https://uploadthing.com');
console.log('- ElevenLabs: https://elevenlabs.io');

if (allGood) {
  console.log('\n🎉 Setup verification complete! You\'re ready to start developing.');
  process.exit(0);
} else {
  console.log('\n❌ Setup incomplete. Please check the items above.');
  process.exit(1);
} 