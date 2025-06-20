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
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
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
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
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
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
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
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  }
}

export default ElevenLabsAPI; 