import {
  DefectType,
  DetectionResponse,
  Device,
  ProcessPoint,
  SampleImage,
} from '../types';

const env = (import.meta as { env?: Record<string, string> }).env;
const API_BASE_URL = env?.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api';

export const MEDIA_BASE_URL = env?.VITE_MEDIA_BASE_URL ?? 'http://127.0.0.1:8000';

const ensureOk = async (responsePromise: Promise<Response>) => {
  const response = await responsePromise;
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }
  return response;
};

export const fetchDevices = async (): Promise<Device[]> => {
  const response = await ensureOk(fetch(`${API_BASE_URL}/devices/`));
  return response.json();
};

export const fetchProcessPoints = async (deviceId?: string): Promise<ProcessPoint[]> => {
  const query = deviceId ? `?device=${deviceId}` : '';
  const response = await ensureOk(fetch(`${API_BASE_URL}/process-points/${query}`));
  return response.json();
};

export const fetchDefectTypes = async (): Promise<DefectType[]> => {
  const response = await ensureOk(fetch(`${API_BASE_URL}/defect-types/`));
  return response.json();
};

export const createDefectType = async (name: string): Promise<DefectType> => {
  const response = await ensureOk(
    fetch(`${API_BASE_URL}/defect-types/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, is_active: true }),
    })
  );
  return response.json();
};

export const deleteDefectType = async (id: number): Promise<void> => {
  await ensureOk(
    fetch(`${API_BASE_URL}/defect-types/${id}/`, {
      method: 'DELETE',
    })
  );
};

export const fetchSamples = async (query: Record<string, string>): Promise<SampleImage[]> => {
  const params = new URLSearchParams(query);
  const suffix = params.toString() ? `?${params.toString()}` : '';
  const response = await ensureOk(fetch(`${API_BASE_URL}/samples/${suffix}`));
  return response.json();
};

export const createSample = async (formData: FormData): Promise<SampleImage> => {
  const response = await ensureOk(
    fetch(`${API_BASE_URL}/samples/`, {
      method: 'POST',
      body: formData,
    })
  );
  return response.json();
};

export const deleteSample = async (id: number): Promise<void> => {
  await ensureOk(
    fetch(`${API_BASE_URL}/samples/${id}/`, {
      method: 'DELETE',
    })
  );
};

export const runDetection = async (formData: FormData): Promise<DetectionResponse> => {
  const response = await ensureOk(
    fetch(`${API_BASE_URL}/detect/`, {
      method: 'POST',
      body: formData,
    })
  );
  return response.json();
};

export const resolveMediaUrl = (path?: string | null): string => {
  if (!path) {
    return '';
  }
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  if (path.startsWith('/')) {
    return `${MEDIA_BASE_URL}${path}`;
  }
  return `${MEDIA_BASE_URL}/${path}`;
};
