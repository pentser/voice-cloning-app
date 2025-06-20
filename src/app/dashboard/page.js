import { redirect } from 'next/navigation';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import VoiceCloneUploader from '@/components/VoiceCloneUploader';
import VoiceClonesList from '@/components/VoiceClonesList';

export default async function Dashboard() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect('/api/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Voice Cloning Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.given_name || user.email}!</span>
              <a
                href="/api/auth/logout"
                className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Logout
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload New Voice Clone */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Voice Clone</h2>
            <VoiceCloneUploader />
          </div>

          {/* Your Voice Clones */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Voice Clones</h2>
            <VoiceClonesList />
          </div>
        </div>
      </main>
    </div>
  );
} 