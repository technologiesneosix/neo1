import axios from 'axios';
import type { MediaAsset } from '@/types';
import { api } from '@/api/services';
import { apiBaseUrl } from '@/api/client';

interface CloudinaryUploadResponse {
  secure_url: string;
}

/** Detect the stored asset type from the file's MIME type. */
export function detectAssetType(file: File): MediaAsset['type'] {
  if (file.type.startsWith('video/')) return 'video';
  if (file.type === 'application/pdf') return 'pdf';
  return 'image';
}

/**
 * Uploads a file to the backend `/media/upload` endpoint (which optimizes and hosts on Cloudinary)
 * and returns the secure Cloudinary URL.
 */
export async function getUploadUrl(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  form.append('folder', 'general');

  const token = localStorage.getItem('neosix.auth.token');
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const baseURL = apiBaseUrl || 'http://localhost:5000/api/v1';
  const response = await axios.post(
    `${baseURL}/media/upload`,
    form,
    { headers }
  );

  return response.data.data.url;
}

/**
 * Full upload pipeline: uploads a file to the backend `/media/upload` endpoint
 * and returns the mapped MediaAsset representation of the stored Cloudinary document.
 */
export async function uploadMedia(file: File, folder = 'uploads'): Promise<MediaAsset> {
  const form = new FormData();
  form.append('file', file);
  form.append('folder', folder);

  const token = localStorage.getItem('neosix.auth.token');
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const baseURL = apiBaseUrl || 'http://localhost:5000/api/v1';
  const response = await axios.post(
    `${baseURL}/media/upload`,
    form,
    { headers }
  );

  const backendMedia = response.data.data;

  return {
    id: backendMedia._id || backendMedia.id,
    name: backendMedia.originalName || backendMedia.fileName || 'file',
    url: backendMedia.url,
    type: detectAssetType(file),
    folder: backendMedia.folder || folder,
    size: backendMedia.fileSize || 0,
    createdAt: backendMedia.createdAt || '',
    updatedAt: backendMedia.updatedAt || '',
  };
}
