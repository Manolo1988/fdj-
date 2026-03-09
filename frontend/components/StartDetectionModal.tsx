
import React, { useState } from 'react';
import { X, Play, Info, MapPin } from 'lucide-react';
import { DeviceProcess } from '../types';

interface StartDetectionModalProps {
  process: DeviceProcess;
  onClose: () => void;
  onStart: (taskName: string) => void;
}

const StartDetectionModal: React.FC<StartDetectionModalProps> = ({ process, onClose, onStart }) => {
  const defaultTaskName = `DET_${new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)}_${process.deviceName}_${process.processName}`;
  const [taskName, setTaskName] = useState(defaultTaskName);

  // Mock sites for preview
  const mockSites = Array.from({ length: process.sitesCount }).map((_, i) => ({
    id: i + 1,
    name: `检测位-${(i + 1).toString().padStart(2, '0')}`,
    status: '待绪'
  }));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="bg-purple-600 p-6 flex justify-between items-center text-white">
          <div className="flex items-center space-x-3">
            <Play className="w-6 h-6 fill-current" />
            <h2 className="text-xl font-bold">开始新检测</h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-purple-50 p-4 rounded-2xl flex items-start space-x-4 border border-purple-100">
            <Info className="w-5 h-5 text-purple-600 mt-1 shrink-0" />
            <div>
              <p className="text-xs text-purple-400 font-bold uppercase">关联设备与流程</p>
              <p className="text-sm font-bold text-gray-800">{process.deviceName} / {process.processName}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">检测任务名称</label>
            <input 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-purple-500 focus:bg-white outline-none transition-all"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="请输入任务名称..."
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-700 flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-purple-600" /> 待检部位预览 ({process.sitesCount}个)
            </h3>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
              {mockSites.map(site => (
                <div key={site.id} className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-600">{site.name}</span>
                  <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-bold">{site.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t flex justify-end space-x-4">
          <button onClick={onClose} className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-all">取消</button>
          <button 
            onClick={() => onStart(taskName)}
            className="px-10 py-2.5 bg-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:bg-purple-700 transition-all font-bold flex items-center"
          >
            <Play className="w-4 h-4 mr-2 fill-current" /> 立即启动
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartDetectionModal;
