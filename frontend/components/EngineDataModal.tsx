
import React, { useState } from 'react';
import { X, Camera, Undo, Square, Info } from 'lucide-react';

interface EngineDataModalProps {
  onClose: () => void;
}

const EngineDataModal: React.FC<EngineDataModalProps> = ({ onClose }) => {
  const [sampleType, setSampleType] = useState<'positive' | 'negative'>('positive');
  const [tagInfo, setTagInfo] = useState('正常');
  const [isCapturing, setIsCapturing] = useState(false);
  const [logs] = useState<string[]>(['[14:20:01] 系统就绪', '[14:20:05] 相机连接正常', '[14:21:10] 图像缓存区初始化完成']);

  const handleSampleTypeChange = (type: 'positive' | 'negative') => {
    setSampleType(type);
    setTagInfo(type === 'positive' ? '正常' : '');
  };

  const defectTypes = ['表面划痕', '铸造气孔', '加工裂纹', '锈迹', '异物'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#f3f0ff] w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border-4 border-white">
        {/* Title Bar */}
        <div className="flex items-center space-x-4 p-4 bg-white/50">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-green-400 shadow-sm" />
          </div>
          <h2 className="text-purple-800 font-bold text-sm">发动机外观缺陷检测系统 - 新增发动机数据</h2>
          <div className="flex-1" />
          <button onClick={onClose} className="text-purple-300 hover:text-purple-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 pt-2 space-y-4">
          {/* Top Info Bar */}
          <div className="bg-purple-200 p-4 rounded-2xl flex items-center space-x-6 shadow-sm border border-purple-300">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-bold text-purple-900">发动机类型</span>
              <input className="bg-white rounded-lg px-3 py-1.5 text-sm outline-none border-none w-32 focus:ring-2 ring-purple-400" placeholder="-请填写-" />
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-bold text-purple-900">发动机编号</span>
              <input className="bg-white rounded-lg px-3 py-1.5 text-sm outline-none border-none w-32 focus:ring-2 ring-purple-400" placeholder="-请填写-" />
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm font-bold text-purple-900">工艺环节</span>
              <input className="bg-white rounded-lg px-3 py-1.5 text-sm outline-none border-none w-32 focus:ring-2 ring-purple-400" placeholder="-请填写-" />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Left Column */}
            <div className="col-span-4 space-y-4">
              <div className="bg-purple-200 p-5 rounded-3xl space-y-4 shadow-sm border border-purple-300">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-purple-900">样本编号</span>
                  <input className="bg-white rounded-lg px-3 py-1.5 text-sm outline-none border-none w-32 focus:ring-2 ring-purple-400" placeholder="-请填写-" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-purple-900">样本类型</span>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input type="radio" className="w-3.5 h-3.5 accent-purple-600" checked={sampleType === 'positive'} onChange={() => handleSampleTypeChange('positive')} />
                      <span className="text-xs text-purple-900 font-medium">正样本</span>
                    </label>
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input type="radio" className="w-3.5 h-3.5 accent-purple-600" checked={sampleType === 'negative'} onChange={() => handleSampleTypeChange('negative')} />
                      <span className="text-xs text-purple-900 font-medium">负样本</span>
                    </label>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-purple-900">标签信息</span>
                  {sampleType === 'positive' ? (
                    <input disabled className="bg-purple-50/50 rounded-lg px-3 py-1.5 text-sm border-none w-32 text-purple-400 font-medium" value="正常" />
                  ) : (
                    <select className="bg-white rounded-lg px-3 py-1.5 text-sm outline-none border-none w-32 focus:ring-2 ring-purple-400" value={tagInfo} onChange={(e) => setTagInfo(e.target.value)}>
                      <option value="">-请选择-</option>
                      {defectTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  )}
                </div>
              </div>

              <div className="bg-purple-200 p-5 rounded-3xl space-y-4 shadow-sm border border-purple-300">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-purple-900">采集模式</span>
                  <select className="bg-white rounded-lg px-3 py-1.5 text-sm outline-none border-none w-32">
                    <option>-请选择-</option>
                    <option>自动触发</option>
                    <option>手动触发</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-purple-900">拍摄延时</span>
                  <select className="bg-white rounded-lg px-3 py-1.5 text-sm outline-none border-none w-32">
                    <option>-请选择-</option>
                    <option>0ms</option>
                    <option>500ms</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-purple-900">相机增益</span>
                  <input className="bg-white rounded-lg px-3 py-1.5 text-sm outline-none border-none w-32" placeholder="-请填写-" />
                </div>
                
                <button 
                  onClick={() => setIsCapturing(!isCapturing)}
                  className={`w-full py-3 rounded-xl shadow-lg font-bold text-sm transition-all flex items-center justify-center space-x-2 active:scale-95 ${isCapturing ? 'bg-red-500 text-white' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                >
                  <Camera className="w-5 h-5" />
                  <span>{isCapturing ? '停止采集' : '开始采集'}</span>
                </button>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">正样本数量</span>
                  <div className="bg-white/40 border border-purple-300 w-32 h-7 rounded-lg flex items-center px-3 text-xs font-bold text-purple-700">124</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">负样本数量</span>
                  <div className="bg-white/40 border border-purple-300 w-32 h-7 rounded-lg flex items-center px-3 text-xs font-bold text-purple-700">12</div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-8 space-y-4">
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-purple-100">
                <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden ring-4 ring-purple-100 shadow-inner group">
                  <img src="https://picsum.photos/seed/engine-defect-1/800/450" alt="Preview" className="w-full h-full object-cover opacity-90" />
                  <div className="absolute top-3 left-3 bg-purple-900/60 px-2 py-1 rounded text-[10px] text-white font-mono backdrop-blur-sm">Turbine HP Rotor Blade LE</div>
                  <div className="absolute top-3 right-3 bg-white/20 px-2 py-1 rounded text-[10px] text-white border border-white/40 backdrop-blur-sm">Blade 58</div>
                  
                  <div className="absolute top-1/4 left-1/3 w-24 h-24 border-2 border-purple-400 bg-purple-400/10 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all">
                    <div className="absolute -top-5 right-0 bg-purple-600 text-[10px] px-1.5 py-0.5 text-white font-bold rounded shadow-sm">TBC LOSS</div>
                  </div>
                </div>
                <div className="flex justify-center space-x-4 mt-5">
                  <button className="flex items-center space-x-2 px-8 py-2 bg-purple-500 text-white rounded-xl text-sm font-bold shadow-md hover:bg-purple-600 transition-all active:scale-95">
                    <Square className="w-4 h-4" /> <span>标记区域</span>
                  </button>
                  <button className="flex items-center space-x-2 px-8 py-2 bg-purple-500 text-white rounded-xl text-sm font-bold shadow-md hover:bg-purple-600 transition-all active:scale-95">
                    <Undo className="w-4 h-4" /> <span>撤销标记</span>
                  </button>
                </div>
              </div>

              <div className="bg-purple-200 p-5 rounded-3xl shadow-sm flex flex-col h-44 border border-purple-300">
                <div className="flex items-center space-x-2 mb-2 text-purple-900">
                  <Info className="w-4 h-4" />
                  <span className="text-sm font-bold">系统日志</span>
                </div>
                <div className="flex-1 bg-white/80 rounded-2xl p-4 overflow-y-auto font-mono text-[10px] text-purple-700/70 space-y-1.5 shadow-inner">
                  {logs.map((log, i) => <div key={i}>{log}</div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineDataModal;
