
import React, { useEffect, useMemo, useState } from 'react';
import { Search, ChevronDown, Monitor, Activity, Workflow, Grid, UploadCloud, Trash2 } from 'lucide-react';
import SampleDetailModal from './SampleDetailModal';
import { DefectType, Device, ProcessPoint, SampleImage } from '../types';
import {
  createSample,
  deleteSample,
  fetchDefectTypes,
  fetchDevices,
  fetchProcessPoints,
  fetchSamples,
  resolveMediaUrl,
} from '../services/api';

const SampleLibrary: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [filterPoints, setFilterPoints] = useState<ProcessPoint[]>([]);
  const [uploadPoints, setUploadPoints] = useState<ProcessPoint[]>([]);
  const [defectTypes, setDefectTypes] = useState<DefectType[]>([]);
  const [samples, setSamples] = useState<SampleImage[]>([]);
  const [activeSample, setActiveSample] = useState<SampleImage | null>(null);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    device: '',
    process_point: '',
    defect_type: '',
    keyword: '',
  });

  const [uploadForm, setUploadForm] = useState({
    device: '',
    process_point: '',
    defect_type: '',
    notes: '',
    image: null as File | null,
    label: null as File | null,
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [deviceData, defectData] = await Promise.all([
          fetchDevices(),
          fetchDefectTypes(),
        ]);
        setDevices(deviceData);
        setDefectTypes(defectData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载样本信息失败');
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!filters.device) {
      setFilterPoints([]);
      setFilters((prev) => ({ ...prev, process_point: '' }));
      return;
    }
    const load = async () => {
      try {
        const processData = await fetchProcessPoints(filters.device);
        setFilterPoints(processData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载工艺点位失败');
      }
    };
    load();
  }, [filters.device]);

  useEffect(() => {
    if (!uploadForm.device) {
      setUploadPoints([]);
      setUploadForm((prev) => ({ ...prev, process_point: '' }));
      return;
    }
    const load = async () => {
      try {
        const processData = await fetchProcessPoints(uploadForm.device);
        setUploadPoints(processData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载上传点位失败');
      }
    };
    load();
  }, [uploadForm.device]);

  const query = useMemo(() => {
    const payload: Record<string, string> = {};
    if (filters.device) payload.device = filters.device;
    if (filters.process_point) payload.process_point = filters.process_point;
    if (filters.defect_type) payload.defect_type = filters.defect_type;
    return payload;
  }, [filters.device, filters.defect_type, filters.process_point]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchSamples(query);
        const filtered = filters.keyword
          ? data.filter((item) =>
              item.id.toString().includes(filters.keyword) ||
              item.notes.toLowerCase().includes(filters.keyword.toLowerCase())
            )
          : data;
        setSamples(filtered);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载样本失败');
      }
    };
    load();
  }, [filters.keyword, query]);

  const handleUpload = async () => {
    if (!uploadForm.image) {
      setError('请先选择样本图片');
      return;
    }
    setError('');
    setIsUploading(true);
    try {
      const formData = new FormData();
      if (uploadForm.device) formData.append('device', uploadForm.device);
      if (uploadForm.process_point) formData.append('process_point', uploadForm.process_point);
      if (uploadForm.defect_type) formData.append('defect_type', uploadForm.defect_type);
      formData.append('image', uploadForm.image);
      if (uploadForm.label) formData.append('label_file', uploadForm.label);
      if (uploadForm.notes) formData.append('notes', uploadForm.notes);

      const created = await createSample(formData);
      setSamples((prev) => [created, ...prev]);
      setUploadForm({
        device: '',
        process_point: '',
        defect_type: '',
        notes: '',
        image: null,
        label: null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSample(id);
      setSamples((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除失败');
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 h-full flex flex-col">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">样本库</h1>
        <p className="text-sm text-gray-500 mt-1">管理全量检测点位采集及合成的样本资源。</p>
      </header>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-purple-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center">
              <Monitor className="w-3 h-3 mr-1.5" /> 设备
            </label>
            <div className="relative">
              <select
                className="w-full px-4 py-2 bg-gray-50 rounded-xl text-sm appearance-none pr-10 outline-none border border-transparent focus:border-purple-300"
                value={filters.device}
                onChange={(event) => setFilters((prev) => ({ ...prev, device: event.target.value }))}
              >
                <option value="">全部设备</option>
                {devices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center">
              <Activity className="w-3 h-3 mr-1.5" /> 缺陷类型
            </label>
            <div className="relative">
              <select
                className="w-full px-4 py-2 bg-gray-50 rounded-xl text-sm appearance-none pr-10 outline-none border border-transparent focus:border-purple-300"
                value={filters.defect_type}
                onChange={(event) => setFilters((prev) => ({ ...prev, defect_type: event.target.value }))}
              >
                <option value="">全部类型</option>
                {defectTypes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center">
              <Workflow className="w-3 h-3 mr-1.5" /> 工艺点位
            </label>
            <div className="relative">
              <select
                className="w-full px-4 py-2 bg-gray-50 rounded-xl text-sm appearance-none pr-10 outline-none border border-transparent focus:border-purple-300"
                value={filters.process_point}
                onChange={(event) => setFilters((prev) => ({ ...prev, process_point: event.target.value }))}
              >
                <option value="">全部点位</option>
                {filterPoints.map((point) => (
                  <option key={point.id} value={point.id}>
                    {point.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-sm outline-none border border-transparent focus:border-purple-300"
              placeholder="搜索样本编号/备注"
              value={filters.keyword}
              onChange={(event) => setFilters((prev) => ({ ...prev, keyword: event.target.value }))}
            />
          </div>
          <div className="text-xs text-gray-400">共 {samples.length} 条记录</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-purple-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-700">上传样本</h2>
          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <select
            className="px-4 py-2 bg-gray-50 rounded-xl text-sm outline-none border border-transparent focus:border-purple-300"
            value={uploadForm.device}
            onChange={(event) => setUploadForm((prev) => ({ ...prev, device: event.target.value }))}
          >
            <option value="">选择设备</option>
            {devices.map((device) => (
              <option key={device.id} value={device.id}>
                {device.name}
              </option>
            ))}
          </select>
          <select
            className="px-4 py-2 bg-gray-50 rounded-xl text-sm outline-none border border-transparent focus:border-purple-300"
            value={uploadForm.process_point}
            onChange={(event) => setUploadForm((prev) => ({ ...prev, process_point: event.target.value }))}
          >
            <option value="">选择点位</option>
            {uploadPoints.map((point) => (
              <option key={point.id} value={point.id}>
                {point.name}
              </option>
            ))}
          </select>
          <select
            className="px-4 py-2 bg-gray-50 rounded-xl text-sm outline-none border border-transparent focus:border-purple-300"
            value={uploadForm.defect_type}
            onChange={(event) => setUploadForm((prev) => ({ ...prev, defect_type: event.target.value }))}
          >
            <option value="">缺陷类型</option>
            {defectTypes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={(event) =>
              setUploadForm((prev) => ({
                ...prev,
                image: event.target.files ? event.target.files[0] : null,
              }))
            }
            className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          />
          <input
            type="file"
            onChange={(event) =>
              setUploadForm((prev) => ({
                ...prev,
                label: event.target.files ? event.target.files[0] : null,
              }))
            }
            className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-3 mt-4">
          <input
            value={uploadForm.notes}
            onChange={(event) => setUploadForm((prev) => ({ ...prev, notes: event.target.value }))}
            placeholder="备注"
            className="flex-1 px-4 py-2 bg-gray-50 rounded-xl text-sm outline-none border border-transparent focus:border-purple-300"
          />
          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-purple-700 disabled:opacity-60"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{isUploading ? '上传中' : '上传'}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-purple-100 flex flex-col overflow-hidden">
        <div className="p-4 bg-purple-50/50 border-b border-purple-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Grid className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">样本列表</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {samples.map((sample) => (
              <div
                key={sample.id}
                className="group relative aspect-square bg-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all border border-purple-50"
              >
                <button
                  type="button"
                  onClick={() => setActiveSample(sample)}
                  className="absolute inset-0"
                />
                <img
                  src={resolveMediaUrl(sample.image)}
                  alt={`Sample ${sample.id}`}
                  className="w-full h-full object-cover group-hover:opacity-90"
                />
                <div className="absolute top-2 left-2 flex flex-col space-y-1">
                  <span className="bg-purple-600 text-[8px] text-white px-1.5 py-0.5 rounded-md font-bold">
                    {sample.defect_type_name ?? '正常'}
                  </span>
                  <span className="bg-black/60 backdrop-blur-sm text-[8px] text-white px-1.5 py-0.5 rounded-md font-medium">
                    #{sample.id}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(sample.id)}
                  className="absolute top-2 right-2 p-1.5 bg-white/80 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="absolute inset-0 bg-purple-900/0 group-hover:bg-purple-900/10 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeSample && <SampleDetailModal sample={activeSample} onClose={() => setActiveSample(null)} />}
    </div>
  );
};

export default SampleLibrary;
