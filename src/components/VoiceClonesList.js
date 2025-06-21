'use client';

import { useState, useEffect } from 'react';

export default function VoiceClonesList() {
  const [voiceClones, setVoiceClones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

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

  const handlePlayAudio = (audioUrl, voiceName) => {
    try {
      // Option 1: Open audio file in new tab/window
      window.open(audioUrl, '_blank');
      
      // Option 2: Create and play audio element (uncomment to use instead)
      // const audio = new Audio(audioUrl);
      // audio.play().catch(error => {
      //   console.error('Error playing audio:', error);
      //   // Fallback to opening in new tab if audio play fails
      //   window.open(audioUrl, '_blank');
      // });
    } catch (error) {
      console.error('Error handling audio:', error);
      alert('Unable to play audio file. Please check if the file exists.');
    }
  };

  const handlePlayTransformedVoice = async (voiceCloneId, voiceName) => {
    try {
      // This will play a voice-transformed version of the original audio
      const response = await fetch(`/api/voice-transform/${voiceCloneId}`, {
        method: 'GET',
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Play the transformed audio
        const audio = new Audio(audioUrl);
        audio.play().catch(error => {
          console.error('Error playing transformed audio:', error);
          // Fallback to opening in new tab
          window.open(audioUrl, '_blank');
        });
        
        // Clean up the blob URL after a delay
        setTimeout(() => URL.revokeObjectURL(audioUrl), 5000);
      } else {
        const data = await response.json();
        alert(`Failed to play transformed voice: ${data.error}`);
      }
    } catch (error) {
      console.error('Transform voice error:', error);
      alert('Failed to play transformed voice. Please try again.');
    }
  };

  const handleDeleteVoiceClone = async (voiceCloneId, voiceName) => {
    const confirmed = confirm(`Are you sure you want to delete "${voiceName}"? This action cannot be undone.`);
    
    if (!confirmed) {
      return;
    }

    setDeletingId(voiceCloneId);

    try {
      const response = await fetch('/api/voice-clones', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voiceCloneId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Remove the deleted voice clone from the list
        setVoiceClones(voiceClones.filter(clone => clone.id !== voiceCloneId));
        alert('Voice clone deleted successfully!');
      } else {
        alert(`Failed to delete voice clone: ${data.error}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete voice clone. Please try again.');
    } finally {
      setDeletingId(null);
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
                  <button 
                    onClick={() => handlePlayAudio(clone.originalFileUrl, clone.voiceName)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2 0h1M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 002 2z" />
                    </svg>
                    <span>Listen to Original</span>
                  </button>
                  <span className="text-gray-300">|</span>
                  <button 
                    onClick={() => handlePlayTransformedVoice(clone.id, clone.voiceName)}
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center space-x-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    <span>Play Cloned Voice</span>
                  </button>
                </div>
                <button 
                  onClick={() => handleDeleteVoiceClone(clone.id, clone.voiceName)}
                  disabled={deletingId === clone.id}
                  className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>{deletingId === clone.id ? 'Deleting...' : 'Delete'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 