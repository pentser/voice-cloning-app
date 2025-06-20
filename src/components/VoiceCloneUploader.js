'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadButton } from '@uploadthing/react';

export default function VoiceCloneUploader() {
  const [voiceName, setVoiceName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isCloning, setIsCloning] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleUploadComplete = useCallback((res) => {
    console.log('Files: ', res);
    if (res && res.length > 0) {
      setUploadedFile(res[0]);
      setMessage('File uploaded successfully! Now enter a voice name to clone.');
    }
  }, []);

  const handleUploadError = useCallback((error) => {
    console.error('Upload error:', error);
    setMessage('Upload failed. Please try again.');
  }, []);

  const handleCloneVoice = async () => {
    if (!voiceName.trim()) {
      setMessage('Please enter a voice name');
      return;
    }

    if (!uploadedFile) {
      setMessage('Please upload an audio file first');
      return;
    }

    setIsCloning(true);
    setMessage('Creating voice clone...');

    try {
      const response = await fetch('/api/voice-clone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voiceName: voiceName.trim(),
          audioFileUrl: uploadedFile.url,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Voice clone created successfully!');
        setVoiceName('');
        setUploadedFile(null);
        // Refresh the voice clones list
        window.location.reload();
      } else {
        setMessage(`Failed to clone voice: ${data.error}`);
      }
    } catch (error) {
      console.error('Clone error:', error);
      setMessage('Failed to clone voice. Please try again.');
    } finally {
      setIsCloning(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="space-y-6">
        {/* Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Audio Sample
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {!uploadedFile ? (
              <div>
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="mt-4">
                  <UploadButton
                    endpoint="audioUploader"
                    onClientUploadComplete={handleUploadComplete}
                    onUploadError={handleUploadError}
                    appearance={{
                      button: 
                        "ut-ready:bg-blue-600 ut-ready:hover:bg-blue-700 ut-uploading:cursor-not-allowed rounded-lg bg-blue-600 px-4 py-2 text-white",
                      allowedContent: "text-gray-600 text-sm"
                    }}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Upload MP3 or WAV files (max 32MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ✓ File uploaded: {uploadedFile.name}
                </div>
                <button
                  onClick={() => setUploadedFile(null)}
                  className="ml-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Voice Name Input */}
        <div>
          <label htmlFor="voiceName" className="block text-sm font-medium text-gray-700 mb-2">
            Voice Name
          </label>
          <input
            type="text"
            id="voiceName"
            value={voiceName}
            onChange={(e) => setVoiceName(e.target.value)}
            placeholder="Enter a name for your voice clone"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isCloning}
          />
        </div>

        {/* Clone Button */}
        <button
          onClick={handleCloneVoice}
          disabled={!uploadedFile || !voiceName.trim() || isCloning}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isCloning ? 'Creating Voice Clone...' : 'Create Voice Clone'}
        </button>

        {/* Message */}
        {message && (
          <div className={`p-3 rounded-md text-sm ${
            message.includes('successfully') 
              ? 'bg-green-100 text-green-700' 
              : message.includes('Failed') || message.includes('error')
              ? 'bg-red-100 text-red-700'
              : 'bg-blue-100 text-blue-700'
          }`}>
            {message}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Tips for best results:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Use clear, high-quality audio (at least 1 minute long)</li>
            <li>• Speak naturally without background noise</li>
            <li>• Include varied emotions and tones</li>
            <li>• Avoid music or other voices in the recording</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 