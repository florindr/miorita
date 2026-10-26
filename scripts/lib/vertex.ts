// scripts/lib/vertex.ts — Vertex AI client initialized with ADC for project antigravity-512715
import { GoogleGenAI } from '@google/genai';
import { VERTEX_CONFIG } from '../vertex.config';

let _ai: GoogleGenAI | null = null;
let _aiMedia: GoogleGenAI | null = null;

export function getVertexAI(): GoogleGenAI {
  if (!_ai) {
    _ai = new GoogleGenAI({
      vertexai: true,
      project: VERTEX_CONFIG.project,
      location: VERTEX_CONFIG.location,
    });
  }
  return _ai;
}

export function getVertexMediaAI(): GoogleGenAI {
  if (!_aiMedia) {
    _aiMedia = new GoogleGenAI({
      vertexai: true,
      project: VERTEX_CONFIG.project,
      location: VERTEX_CONFIG.mediaLocation,
    });
  }
  return _aiMedia;
}
