'use client';

import { useState, useEffect } from 'react';

export default function VoiceClonesList() {
  const [voiceClones, setVoiceClones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVoiceClones();
  }, []);

  const fetchVoiceClones = async () => {
    try {
      const response = await fetch('/api/voice-clones');
      const data = await response.json();

      if (data.success) {
        setVoiceClones(data.voiceClones);
      } else {
        setError('Failed to fetch voice clones');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to fetch voice clones');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={fetchVoiceClones}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (voiceClones.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
          <p className="mt-2">No voice clones yet</p>
          <p className="text-sm text-gray-400">Upload an audio file to create your first voice clone</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="space-y-4">
          {voiceClones.map((clone) => (
            <div key={clone.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{clone.voiceName}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Created: {formatDate(clone.createdAt)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Voice ID: {clone.elevenLabsVoiceId}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Listen to Original
                  </button>
                  <span className="text-gray-300">|</span>
                  <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                    Generate Speech
                  </button>
                </div>
                <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 