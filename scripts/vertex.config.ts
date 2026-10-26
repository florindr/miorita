// scripts/vertex.config.ts — Central configuration for Vertex AI build-time pipeline
// Single source of truth for GCP project and Model Garden model IDs (CON-004)

export const VERTEX_CONFIG = {
  project: process.env.GOOGLE_CLOUD_PROJECT || 'antigravity-512715',
  location: process.env.GOOGLE_CLOUD_LOCATION || 'global',
  mediaLocation: process.env.VERTEX_MEDIA_LOCATION || 'us-central1',

  models: {
    // Text item drafting and contrastive bridge synthesis
    text: process.env.VERTEX_TEXT_MODEL || 'gemini-2.5-flash',

    // Linocut / gouache illustrations
    imageEdit: process.env.VERTEX_IMAGE_EDIT_MODEL || 'imagen-3.0-generate-002',
    imageGen: process.env.VERTEX_IMAGE_GEN_MODEL || 'imagen-3.0-generate-002',

    // Micro-animations (image-to-video for station rewards)
    video: process.env.VERTEX_VIDEO_MODEL || 'veo-2.0-generate-001',

    // Romanian neural Cloud TTS voice
    ttsModel: 'tts-1',
    ttsVoice: 'ro-RO-Wavenet-A',
  },
};
