import React, { useEffect, useMemo, useState } from 'react';
import { ImagePlus, PlayCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { DetectionMetrics, DetectionResult, DetectionStats, Device, ProcessPoint } from '../types';
import { fetchDevices, fetchProcessPoints, runDetection } from '../services/api';

const pageSize = 6;

const defectOptions = ['表面缺陷', '锁丝方向', '零件缺失', '箭头方向'] as const;

const DetectionWorkspace: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [processPoints, setProcessPoints] = useState<ProcessPoint[]>([]);

  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [selectedProcessPointId, setSelectedProcessPointId] = useState<string>('');
  const [selectedDefectType, setSelectedDefectType] = useState<string>(defectOptions[0]);
  const [testMode, setTestMode] = useState(true);
  const [uploadMode, setUploadMode] = useState<'files' | 'folder'>('files');

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [labelFiles, setLabelFiles] = useState<File[]>([]);
  const [results, setResults] = useState<DetectionResult[]>([]);
  const [stats, setStats] = useState<DetectionStats | null>(null);
  const [metrics, setMetrics] = useState<DetectionMetrics | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      try {
        const deviceData = await fetchDevices();
        setDevices(deviceData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载设备数据失败');
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!selectedDeviceId) {
      setProcessPoints([]);
      setSelectedProcessPointId('');
      return;
    }
    const load = async () => {
      try {
        const processData = await fetchProcessPoints(selectedDeviceId);
        setProcessPoints(processData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载点位失败');
      }
    };
    load();
  }, [selectedDeviceId]);

  useEffect(() => {
    if (!testMode) {
      setLabelFiles([]);
    }
  }, [testMode]);

  const previewMap = useMemo(() => {
    const map: Record<string, string> = {};
    imageFiles.forEach((file) => {
      map[file.name] = URL.createObjectURL(file);
    });
    return map;
  }, [imageFiles]);

  useEffect(() => {
    return () => {
      (Object.values(previewMap) as string[]).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewMap]);

  const pagedResults = results.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(results.length / pageSize));

  const handleFilesSelected = (files: FileList | null) => {
    setResults([]);
    setStats(null);
    setMetrics(null);
    setPage(1);
    if (!files) {
      setImageFiles([]);
      return;
    }
    setImageFiles(Array.from(files));
  };

  const handleLabelsSelected = (files: FileList | null) => {
    if (!files) {
      setLabelFiles([]);
      return;
    }
    setLabelFiles(Array.from(files));
  };

  const handleDetect = async () => {
    if (!testMode && (!selectedDeviceId || !selectedProcessPointId)) {
      setError('请先选择设备和工艺点位');
      return;
    }
    if (imageFiles.length === 0) {
      setError('请先选择待检测图片');
      return;
    }
    setError('');
    setIsDetecting(true);
    try {
      const formData = new FormData();
      if (!testMode) {
        formData.append('device', selectedDeviceId);
        formData.append('process_point', selectedProcessPointId);
      }
      formData.append('test_mode', testMode ? 'true' : 'false');
      formData.append('defect_type', selectedDefectType);
      imageFiles.forEach((file) => formData.append('images', file));
      if (testMode) {
        labelFiles.forEach((file) => formData.append('labels', file));
      }

      const response = await runDetection(formData);
      const enriched = response.results.map((item) => ({
        ...item,
        preview_url: previewMap[item.filename] ?? null,
      }));
      setResults(enriched);
      setStats(response.stats);
      setMetrics(response.metrics ?? null);
      setPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : '检测失败');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleReset = () => {
    setImageFiles([]);
    setLabelFiles([]);
    setResults([]);
    setStats(null);
    setMetrics(null);
    setPage(1);
    setError('');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">检测任务</h1>
        <p className="text-sm text-gray-500 mt-1">选择设备和工艺点位，上传待检图片并查看结果。</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-purple-100 space-y-6">
          <div>
            <h2 className="text-sm font-bold text-gray-700 mb-3">检测参数</h2>
            <div className="space-y-3">
              {!testMode && (
                <>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">设备</label>
                    <select
                      className="w-full mt-2 px-4 py-2.5 bg-gray-50 rounded-xl text-sm outline-none border border-transparent focus:border-purple-300"
                      value={selectedDeviceId}
                      onChange={(event) => setSelectedDeviceId(event.target.value)}
                    >
                      <option value="">请选择设备</option>
                      {devices.map((device) => (
                        <option key={device.id} value={device.id}>
                          {device.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">工艺点位</label>
                    <select
                      className="w-full mt-2 px-4 py-2.5 bg-gray-50 rounded-xl text-sm outline-none border border-transparent focus:border-purple-300"
                      value={selectedProcessPointId}
                      onChange={(event) => setSelectedProcessPointId(event.target.value)}
                      disabled={!selectedDeviceId}
                    >
                      <option value="">请选择点位</option>
                      {processPoints.map((point) => (
                        <option key={point.id} value={point.id}>
                          {point.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">缺陷类型</label>
                <select
                  className="w-full mt-2 px-4 py-2.5 bg-gray-50 rounded-xl text-sm outline-none border border-transparent focus:border-purple-300"
                  value={selectedDefectType}
                  onChange={(event) => setSelectedDefectType(event.target.value)}
                >
                  {defectOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-semibold text-gray-600">测试模式</span>
                <button
                  type="button"
                  onClick={() => setTestMode((prev) => !prev)}
                  className={`w-12 h-6 rounded-full transition-all ${testMode ? 'bg-purple-600' : 'bg-gray-200'}`}
                >
                  <span
                    className={`block w-5 h-5 bg-white rounded-full shadow-sm transform transition-all ${
                      testMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-4 text-xs text-purple-700">
                测试模式下无需选择设备与工艺点位，默认启用测试模式。
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-gray-700 mb-3">图片上传</h2>
            <div className="space-y-3">
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setUploadMode('files')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    uploadMode === 'files' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  文件
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('folder')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    uploadMode === 'folder' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  文件夹
                </button>
              </div>

              {uploadMode === 'files' ? (
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(event) => handleFilesSelected(event.target.files)}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              ) : (
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  // @ts-ignore webkitdirectory is supported in Chromium-based browsers
                  webkitdirectory="true"
                  directory="true"
                  onChange={(event) => handleFilesSelected(event.target.files)}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              )}

              {testMode && (
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">标签文件</label>
                  <input
                    type="file"
                    multiple
                    onChange={(event) => handleLabelsSelected(event.target.files)}
                    className="w-full mt-2 text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>
              )}

              <div className="text-xs text-gray-500">
                已选择图片 {imageFiles.length} 张，标签 {labelFiles.length} 个
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {error && (
              <div className="flex items-center space-x-2 text-xs text-red-500 bg-red-50 rounded-xl p-3">
                <AlertTriangle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
            <button
              type="button"
              onClick={handleDetect}
              disabled={isDetecting}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl bg-purple-600 text-white font-semibold text-sm shadow-md hover:bg-purple-700 transition-all disabled:opacity-60"
            >
              <PlayCircle className="w-5 h-5" />
              <span>{isDetecting ? '检测中...' : '开始检测'}</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl bg-gray-100 text-gray-600 font-semibold text-sm hover:bg-gray-200 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>清空任务</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-purple-100 min-h-[320px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">检测结果</h2>
              <span className="text-xs text-gray-400">
                {results.length > 0 ? `共 ${results.length} 张` : '等待检测'}
              </span>
            </div>

            {results.length === 0 ? (
              <div className="h-56 flex flex-col items-center justify-center text-gray-400 text-sm">
                <ImagePlus className="w-10 h-10 mb-3" />
                <span>上传图片后开始检测</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pagedResults.map((result) => (
                    <div key={`${result.index}-${result.filename}`} className="border border-purple-100 rounded-2xl overflow-hidden">
                      <div className="aspect-video bg-gray-100">
                        {result.preview_url ? (
                          <img
                            src={result.preview_url}
                            alt={result.filename}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                            无预览
                          </div>
                        )}
                      </div>
                      <div className="p-3 space-y-1">
                        <p className="text-xs text-gray-500 truncate">{result.filename}</p>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${result.status === '正常' ? 'text-green-600' : 'text-red-500'}`}>
                            {result.status}
                          </span>
                          <span className="text-xs text-gray-600">{result.defect_type}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    第 {page} / {totalPages} 页
                  </span>
                  <div className="space-x-2">
                    <button
                      type="button"
                      onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                      className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200"
                      disabled={page === 1}
                    >
                      上一页
                    </button>
                    <button
                      type="button"
                      onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                      className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200"
                      disabled={page === totalPages}
                    >
                      下一页
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-purple-100">
              <h3 className="text-sm font-bold text-gray-700 mb-4">统计概览</h3>
              {stats ? (
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>总计</span>
                    <span className="font-semibold text-gray-800">{stats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>正常</span>
                    <span className="font-semibold text-green-600">{stats.normal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>缺陷</span>
                    <span className="font-semibold text-red-500">{stats.defects}</span>
                  </div>
                  <div className="pt-2 text-xs text-gray-400">
                    {Object.entries(stats.by_defect).map(([name, count]) => (
                      <div key={name} className="flex justify-between">
                        <span>{name}</span>
                        <span>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400">暂无统计</p>
              )}
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-purple-100">
              <h3 className="text-sm font-bold text-gray-700 mb-4">测试指标</h3>
              {metrics ? (
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>准确率</span>
                    <span className="font-semibold text-gray-800">{metrics.accuracy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>精确率</span>
                    <span className="font-semibold text-gray-800">{metrics.precision}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>召回率</span>
                    <span className="font-semibold text-gray-800">{metrics.recall}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400">仅在测试模式下展示</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectionWorkspace;
