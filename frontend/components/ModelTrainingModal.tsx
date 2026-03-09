
import React, { useState } from 'react';
import { X, Play, RefreshCw, BarChart2, Info, Activity, Database, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ModelTrainingModalProps {
  onClose: () => void;
}

const ModelTrainingModal: React.FC<ModelTrainingModalProps> = ({ onClose }) => {
  const [logs] = useState(['[10:00:01] 开始模型初始化...', '[10:00:15] 加载数据集 1200 张图像...', '[10:00:25] 轮次 1/100 开始训练...']);
  
  const mockCurveData = Array.from({ length: 50 }).map((_, i) => ({
    epoch: i * 10,
    train: Math.max(0.4, 1.0 - (i / 60)),
    validation: Math.max(0.42, 1.0 - (i / 65) + Math.random() * 0.05)
  }));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#f3f0ff] w-full max-w-6xl rounded-[40px] shadow-2xl overflow-hidden border-4 border-white flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center space-x-4 p-5 bg-white/60">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <h2 className="text-purple-900 font-bold text-base flex items-center">
            <Activity className="w-5 h-5 mr-2 text-purple-600" />
            发动机外观缺陷检测系统 - 模型训练与优化
          </h2>
          <div className="flex-1" />
          <button onClick={onClose} className="text-purple-300 hover:text-purple-600 transition-colors">
            <X className="w-7 h-7" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 pt-4">
          <div className="grid grid-cols-12 gap-8">
            {/* Left Col: Config & Control */}
            <div className="col-span-4 space-y-6">
              {/* Training Config */}
              <div className="bg-purple-200 p-6 rounded-[32px] space-y-5 shadow-sm border border-purple-300">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-purple-800 uppercase tracking-widest flex items-center"><CheckCircle className="w-3 h-3 mr-1.5" /> 加载模型</label>
                  <select className="w-full px-4 py-2.5 bg-white rounded-xl text-sm border-none outline-none focus:ring-2 ring-purple-400">
                    <option>-请选择基础模型-</option>
                    <option>EngineResNet-V2</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-purple-800 uppercase tracking-widest flex items-center"><Database className="w-3 h-3 mr-1.5" /> 加载数据</label>
                  <select className="w-full px-4 py-2.5 bg-white rounded-xl text-sm border-none outline-none focus:ring-2 ring-purple-400">
                    <option>-请选择数据集-</option>
                    <option>2024_Q1_Full_Dataset</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-purple-800 uppercase tracking-widest">训练参数 (Batch/LR/Epoch)</label>
                  <input className="w-full px-4 py-2.5 bg-white rounded-xl text-sm border-none outline-none focus:ring-2 ring-purple-400" placeholder="16 / 1e-4 / 500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-800 uppercase tracking-widest">数据集张数</span>
                  <div className="bg-white/40 border border-purple-300 w-32 h-8 rounded-lg flex items-center px-3 text-xs font-bold text-purple-700">1,250</div>
                </div>
                <button className="w-full py-3.5 bg-purple-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-purple-200 hover:bg-purple-700 transition-all active:scale-95 flex items-center justify-center space-x-2">
                  <Play className="w-4 h-4 fill-current" /> <span>开始训练</span>
                </button>
              </div>

              {/* Model Testing */}
              <div className="bg-purple-200 p-6 rounded-[32px] space-y-5 shadow-sm border border-purple-300">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-purple-800 uppercase tracking-widest flex items-center"><BarChart2 className="w-3 h-3 mr-1.5" /> 选择测试集</label>
                  <select className="w-full px-4 py-2.5 bg-white rounded-xl text-sm border-none outline-none focus:ring-2 ring-purple-400">
                    <option>-请选择测试数据集-</option>
                    <option>Validation_Set_2024</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-800 uppercase tracking-widest">测试张数</span>
                  <div className="bg-white/40 border border-purple-300 w-32 h-8 rounded-lg flex items-center px-3 text-xs font-bold text-purple-700">200</div>
                </div>
                <button className="w-full py-3.5 bg-white border border-purple-300 text-purple-600 rounded-2xl font-bold text-sm hover:bg-purple-50 transition-all shadow-sm">
                  测试模型效果
                </button>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-purple-800 uppercase tracking-widest">新工件准确率</span>
                    <div className="bg-white/40 border border-purple-300 w-32 h-8 rounded-lg flex items-center px-3 text-xs font-bold text-green-600">98.5%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-purple-800 uppercase tracking-widest">总工件准确率</span>
                    <div className="bg-white/40 border border-purple-300 w-32 h-8 rounded-lg flex items-center px-3 text-xs font-bold text-green-600">99.2%</div>
                  </div>
                </div>
                <button className="w-full py-3.5 bg-purple-500 text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-purple-600 transition-all flex items-center justify-center space-x-2">
                  <RefreshCw className="w-4 h-4" /> <span>更新到生产模型</span>
                </button>
              </div>
            </div>

            {/* Right Col: Stats & Logs */}
            <div className="col-span-8 space-y-6">
              {/* Curve Chart */}
              <div className="bg-white p-6 rounded-[40px] shadow-sm border border-purple-100 flex flex-col">
                <h3 className="text-center font-bold text-gray-800 text-lg mb-4">损失曲线 (Loss Convergence)</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockCurveData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="epoch" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} domain={[0, 1]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="train" stroke="#6366f1" strokeWidth={2} dot={false} name="训练集" />
                      <Line type="monotone" dataKey="validation" stroke="#f59e0b" strokeWidth={2} dot={false} name="验证集" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Logs */}
              <div className="bg-purple-200 p-6 rounded-[40px] shadow-sm border border-purple-300 flex flex-col h-48">
                <div className="flex items-center space-x-2 mb-3 text-purple-900">
                  <Info className="w-4 h-4" />
                  <span className="text-sm font-bold uppercase tracking-wider">实时训练日志</span>
                </div>
                <div className="flex-1 bg-white/80 rounded-2xl p-4 overflow-y-auto font-mono text-[11px] text-purple-700/80 space-y-2 shadow-inner">
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

export default ModelTrainingModal;
