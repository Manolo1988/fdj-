
export interface SystemStats {
  version: string;
  deviceCount: number;
  sampleCount: number;
  reportCount: number;
}

export interface ActiveTask {
  deviceName: string;
  processName: string;
  durationSeconds: number;
  detectedBatches: number;
  totalPieces: number;
}

export interface HistoryStats {
  deviceTypes: number;
  totalBatches: number;
  totalProducts: number;
}

export interface DeviceProcess {
  id: string;
  deviceName: string;
  processName: string;
  createDate: string;
  creator: string;
  sitesCount: number;
}

export interface EngineDevice {
  id: string;
  type: string;
  model: string;
  sitesCount: number;
  addDate: string;
  creator: string;
}

export type ModelStatus = '微训练' | '训练中' | '训练失败' | '已完成';

export interface AIModel {
  id: string;
  type: string;
  model: string;
  name: string;
  sitesCount: number;
  status: ModelStatus;
}

export interface Device {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface ProcessPointType {
  id: number;
  name: string;
  description: string;
}

export interface ProcessPoint {
  id: number;
  device: number;
  device_name: string;
  name: string;
  point_type: number | null;
  point_type_name: string | null;
  created_at: string;
}

export interface DefectType {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
}

export interface SampleImage {
  id: number;
  device: number | null;
  device_name: string | null;
  process_point: number | null;
  process_point_name: string | null;
  defect_type: number | null;
  defect_type_name: string | null;
  image: string;
  label_file: string | null;
  notes: string;
  created_at: string;
}

export interface DetectionResult {
  index: number;
  filename: string;
  status: string;
  defect_type: string;
  preview_url: string | null;
  output_type?: string;
  output_value?: string | number | null;
}

export interface DetectionStats {
  total: number;
  normal: number;
  defects: number;
  by_defect: Record<string, number>;
}

export interface DetectionMetrics {
  accuracy: number;
  precision: number;
  recall: number;
}

export interface DetectionResponse {
  device: string | null;
  process_point: string | null;
  test_mode: boolean;
  defect_type: string;
  results: DetectionResult[];
  stats: DetectionStats;
  metrics: DetectionMetrics | null;
}

export type MenuKey =
  | 'home'
  | 'engines'
  | 'devices'
  | 'detect'
  | 'samples'
  | 'reports'
  | 'models'
  | 'users'
  | 'system';
