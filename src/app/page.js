import Link from 'next/link';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { LoginLink, RegisterLink, LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';

export default async function Home() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">VoiceClone AI</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Welcome, {user.given_name || user.email}!</span>
                  <Link
                    href="/dashboard"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <LogoutLink className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors">
                    Logout
                  </LogoutLink>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <LoginLink className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors">
                    Sign In
                  </LoginLink>
                  <RegisterLink className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Sign Up
                  </RegisterLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Clone Your Voice with
            <span className="text-blue-600"> AI Technology</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Upload a short audio sample and create a realistic AI voice clone using ElevenLabs technology. 
            Generate speech in your own voice for any text you want.
          </p>
          
          {!user ? (
            <div className="flex justify-center space-x-4">
              <RegisterLink className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
                Get Started Free
              </RegisterLink>
              <LoginLink className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
                Sign In
              </LoginLink>
            </div>
          ) : (
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
            >
              Go to Dashboard
            </Link>
          )}
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Upload</h3>
            <p className="text-gray-600">
              Simply upload a short audio sample (MP3 or WAV) to get started with voice cloning.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Cloning</h3>
            <p className="text-gray-600">
              Advanced ElevenLabs technology creates a highly realistic clone of your voice.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 14h14l-2-14M11 9v6M13 9v6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Generate Speech</h3>
            <p className="text-gray-600">
              Create natural-sounding speech from any text using your cloned voice.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-semibold">1</div>
              <h3 className="font-semibold text-gray-900 mb-2">Sign Up</h3>
              <p className="text-gray-600 text-sm">Create your account to get started</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-semibold">2</div>
              <h3 className="font-semibold text-gray-900 mb-2">Upload Audio</h3>
              <p className="text-gray-600 text-sm">Upload a clear audio sample of your voice</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-semibold">3</div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Processing</h3>
              <p className="text-gray-600 text-sm">Our AI analyzes and clones your voice</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-semibold">4</div>
              <h3 className="font-semibold text-gray-900 mb-2">Generate Speech</h3>
              <p className="text-gray-600 text-sm">Create speech from any text you want</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 VoiceClone AI. Powered by ElevenLabs technology.</p>
        </div>
      </footer>
    </div>
  );
} 