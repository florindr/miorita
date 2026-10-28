// src/storage/syncTypes.ts — Types for Miorița Local-First Delta Synchronization
// Adapts the cross-device sync architecture for Tudor's Tab A9+ and parent dashboard

export type MioritaDomain =
  | 'attempts'
  | 'srs'
  | 'caiet'
  | 'rug'
  | 'settings'
  | 'tutor_progress';

export interface DomainDelta {
  domain: MioritaDomain;
  version: number;
  payload: Record<string, any>;
  clientUpdatedAt: number;
}

export interface SyncPushRequest {
  userId: string;
  deltas: DomainDelta[];
}

export interface SyncPushResponse {
  success: boolean;
  syncedDomains: string[];
  serverTimestamp: number;
  errors?: Record<string, string>;
}

export interface SyncPullRequest {
  userId: string;
  domainVersions: Partial<Record<MioritaDomain, number>>;
}

export interface SyncPullResponse {
  success: boolean;
  deltas: DomainDelta[];
  serverTimestamp: number;
}

export type SyncStatusState = 'synced' | 'syncing' | 'offline' | 'error';
