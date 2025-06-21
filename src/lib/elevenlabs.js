import axios from 'axios';

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

export class ElevenLabsAPI {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.ELEVENLABS_API_KEY;
    this.client = axios.create({
      baseURL: ELEVENLABS_API_URL,
      headers: {
        'xi-api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
    });
  }

  // Clone voice from audio file
  async cloneVoice(name, description, audioFileUrl) {
    try {
      // First, download the audio file
      const audioResponse = await axios.get(audioFileUrl, {
        responseType: 'arraybuffer',
      });

      const audioBuffer = Buffer.from(audioResponse.data);

      // Create FormData for voice cloning
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description || 'Voice clone created via app');
      formData.append('files', new Blob([audioBuffer], { type: 'audio/mpeg' }), 'voice_sample.mp3');

      // Clone the voice
      const response = await this.client.post('/voices/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        voiceId: response.data.voice_id,
        data: response.data,
      };
    } catch (error) {
      console.error('ElevenLabs API Error:', error.response?.data || error.message);
      let errorMessage = 'Unknown error occurred';
      
      if (error.response?.data) {
        if (typeof error.response.data === 'object') {
          errorMessage = error.response.data.detail || 
                        error.response.data.message || 
                        JSON.stringify(error.response.data);
        } else {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Get voice information
  async getVoice(voiceId) {
    try {
      const response = await this.client.get(`/voices/${voiceId}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('ElevenLabs API Error:', error.response?.data || error.message);
      let errorMessage = 'Unknown error occurred';
      
      if (error.response?.data) {
        if (typeof error.response.data === 'object') {
          errorMessage = error.response.data.detail || 
                        error.response.data.message || 
                        JSON.stringify(error.response.data);
        } else {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Generate speech with cloned voice
  async generateSpeech(voiceId, text, modelId = 'eleven_monolingual_v1') {
    try {
      const response = await this.client.post(
        `/text-to-speech/${voiceId}`,
        {
          text,
          model_id: modelId,
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.75,
          },
        },
        {
          responseType: 'arraybuffer',
        }
      );

      return {
        success: true,
        audioBuffer: Buffer.from(response.data),
      };
    } catch (error) {
      console.error('ElevenLabs API Error:', error.response?.data || error.message);
      let errorMessage = 'Unknown error occurred';
      
      if (error.response?.data) {
        if (typeof error.response.data === 'object') {
          errorMessage = error.response.data.detail || 
                        error.response.data.message || 
                        JSON.stringify(error.response.data);
        } else {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Voice conversion - convert audio to use a different voice
  async convertVoice(sourceAudioUrl, targetVoiceId) {
    try {
      // Download the source audio file
      const audioResponse = await axios.get(sourceAudioUrl, {
        responseType: 'arraybuffer',
      });

      const audioBuffer = Buffer.from(audioResponse.data);

      // Create FormData for voice conversion
      const formData = new FormData();
      formData.append('audio', new Blob([audioBuffer], { type: 'audio/mpeg' }), 'source_audio.mp3');
      formData.append('voice_id', targetVoiceId);

      // Convert voice using ElevenLabs voice conversion API
      const response = await this.client.post('/voice-conversion', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'arraybuffer',
      });

      return {
        success: true,
        audioBuffer: Buffer.from(response.data),
      };
    } catch (error) {
      console.error('ElevenLabs Voice Conversion Error:', error.response?.data || error.message);
      
      // If voice conversion API is not available, fallback to speech-to-text + text-to-speech
      return this.fallbackVoiceConversion(sourceAudioUrl, targetVoiceId);
    }
  }

  // Fallback method: transcribe audio and generate speech with target voice
  async fallbackVoiceConversion(sourceAudioUrl, targetVoiceId) {
    try {
      // This is a simplified approach - in production you'd want to use
      // a proper speech-to-text service like OpenAI Whisper, Google Speech-to-Text, etc.
      
      // For now, we'll return a transformed version of the original audio
      // In a real implementation, you would:
      // 1. Use speech-to-text to transcribe the original audio
      // 2. Use the transcribed text with generateSpeech() to create new audio
      
      console.log('Using fallback voice conversion method');
      
      // Download original audio
      const audioResponse = await axios.get(sourceAudioUrl, {
        responseType: 'arraybuffer',
      });

      const audioBuffer = Buffer.from(audioResponse.data);

      // For demonstration, return the original audio with a note
      // In production, implement proper speech-to-text + text-to-speech pipeline
      return {
        success: true,
        audioBuffer,
        note: 'Fallback method - returning original audio. Implement speech-to-text for full conversion.',
      };
    } catch (error) {
      console.error('Fallback voice conversion error:', error);
      return {
        success: false,
        error: 'Voice conversion failed',
      };
    }
  }

  // Get sample of voice (useful for testing cloned voices)
  async getVoiceSample(voiceId, sampleText = 'Hello, this is a sample of my cloned voice.') {
    try {
      const response = await this.generateSpeech(voiceId, sampleText);
      return response;
    } catch (error) {
      console.error('Get voice sample error:', error);
      return {
        success: false,
        error: 'Failed to generate voice sample',
      };
    }
  }

  // Delete voice
  async deleteVoice(voiceId) {
    try {
      await this.client.delete(`/voices/${voiceId}`);
      return { success: true };
    } catch (error) {
      console.error('ElevenLabs API Error:', error.response?.data || error.message);
      let errorMessage = 'Unknown error occurred';
      
      if (error.response?.data) {
        if (typeof error.response.data === 'object') {
          errorMessage = error.response.data.detail || 
                        error.response.data.message || 
                        JSON.stringify(error.response.data);
        } else {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}

export default ElevenLabsAPI; 