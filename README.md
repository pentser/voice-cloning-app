# Voice Cloning App

A modern web application for voice cloning using AI technology. Built with Next.js, powered by ElevenLabs API, and featuring secure authentication and file upload capabilities.

## Features

- 🎤 **Voice Cloning**: Upload audio samples and create AI voice clones using ElevenLabs technology
- 🔐 **Authentication**: Secure user authentication with Kinde
- 📁 **File Upload**: Drag-and-drop audio file uploads with UploadThing
- 🗄️ **Database**: PostgreSQL with Drizzle ORM for data persistence
- 🎨 **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- 🔊 **Audio Processing**: Support for MP3 and WAV audio formats

## Tech Stack

- **Frontend**: Next.js 15 with App Router, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Kinde Auth
- **File Storage**: UploadThing
- **AI Voice Cloning**: ElevenLabs API
- **Deployment**: Vercel (recommended)

## Prerequisites

Before running this application, make sure you have:

- Node.js 18+ installed
- PostgreSQL database (local or remote)
- Kinde account and application setup
- UploadThing account and app setup
- ElevenLabs API account and key

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/voice_cloning_db

# Kinde Auth
KINDE_CLIENT_ID=your_kinde_client_id
KINDE_CLIENT_SECRET=your_kinde_client_secret
KINDE_ISSUER_URL=https://your_domain.kinde.com
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard

# UploadThing
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id

# ElevenLabs API
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd voice-cloning-app
npm install
```

### 2. Database Setup

1. Create a PostgreSQL database
2. Update the `DATABASE_URL` in your `.env.local` file
3. Generate and run database migrations:

```bash
npm run db:generate
npm run db:push
```

### 3. Authentication Setup (Kinde)

1. Go to [Kinde](https://kinde.com) and create an account
2. Create a new application
3. Configure the following settings:
   - **Allowed callback URLs**: `http://localhost:3000/api/auth/kinde_callback`
   - **Allowed logout redirect URLs**: `http://localhost:3000`
4. Copy your credentials to `.env.local`

### 4. File Upload Setup (UploadThing)

1. Go to [UploadThing](https://uploadthing.com) and create an account
2. Create a new app
3. Get your App ID and Secret from the dashboard
4. Add them to your `.env.local` file

### 5. ElevenLabs API Setup

1. Go to [ElevenLabs](https://elevenlabs.io) and create an account
2. Navigate to your profile settings
3. Generate an API key
4. Add it to your `.env.local` file

### 6. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following database schema:

```javascript
// voice_clones table
{
  id: uuid (primary key),
  userId: text (not null),
  voiceName: varchar(100) (not null),
  originalFileUrl: text (not null),
  elevenLabsVoiceId: text (not null),
  createdAt: timestamp (default: now),
  updatedAt: timestamp (default: now)
}
```

## API Endpoints

### Authentication
- `GET /api/auth/[kindeAuth]` - Kinde authentication handler

### File Upload
- `GET|POST /api/uploadthing` - UploadThing file upload handler

### Voice Cloning
- `POST /api/voice-clone` - Create a new voice clone
- `GET /api/voice-clones` - Get user's voice clones

## Usage

### Creating a Voice Clone

1. **Sign Up/Login**: Create an account or log in using Kinde authentication
2. **Navigate to Dashboard**: Go to the dashboard after successful authentication
3. **Upload Audio**: Upload a clear, high-quality audio sample (MP3 or WAV)
   - Recommended: At least 1 minute of clear speech
   - Avoid background noise and music
   - Include varied emotions and tones
4. **Name Your Clone**: Enter a descriptive name for your voice clone
5. **Create Clone**: Click "Create Voice Clone" and wait for processing
6. **Manage Clones**: View and manage your voice clones in the dashboard

### Best Practices for Voice Cloning

- **Audio Quality**: Use high-quality, clear recordings
- **Duration**: Upload at least 1-2 minutes of audio for better results
- **Content**: Include varied speech patterns, emotions, and tones
- **Environment**: Record in a quiet environment without background noise
- **Single Speaker**: Ensure only one person is speaking in the recording

## Development

### Database Operations

```bash
# Generate migrations after schema changes
npm run db:generate

# Push schema changes to database
npm run db:push

# Open Drizzle Studio for database management
npm run db:studio
```

### Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[kindeAuth]/
│   │   ├── uploadthing/
│   │   ├── voice-clone/
│   │   └── voice-clones/
│   ├── dashboard/
│   ├── layout.js
│   └── page.js
├── components/
│   ├── VoiceCloneUploader.js
│   └── VoiceClonesList.js
└── lib/
    ├── db.js
    ├── elevenlabs.js
    ├── kinde.js
    ├── schema.js
    └── uploadthing.js
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add all environment variables in Vercel dashboard
3. Deploy with automatic CI/CD

### Environment Variables for Production

Make sure to update the following for production:

```env
KINDE_SITE_URL=https://your-production-domain.com
KINDE_POST_LOGOUT_REDIRECT_URL=https://your-production-domain.com
KINDE_POST_LOGIN_REDIRECT_URL=https://your-production-domain.com/dashboard
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify `DATABASE_URL` format and credentials
   - Ensure PostgreSQL is running
   - Check firewall settings

2. **Authentication Issues**
   - Verify Kinde configuration and URLs
   - Check callback URLs match exactly
   - Ensure environment variables are set

3. **File Upload Problems**
   - Verify UploadThing credentials
   - Check file size limits (32MB max)
   - Ensure supported file formats (MP3, WAV)

4. **ElevenLabs API Errors**
   - Verify API key is valid
   - Check your ElevenLabs account limits
   - Ensure audio file is accessible

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team.
