
import React, { useState } from 'react';
import { Plus, Search, Layers, ChevronDown, Monitor, Trash2, Edit3, RefreshCw, BarChart2 } from 'lucide-react';
import { AIModel } from '../types';
import ModelTrainingModal from './ModelTrainingModal';

const ModelManagement: React.FC = () => {
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);
  const [models] = useState<AIModel[]>([
    { id: '1', type: '柴油发动机', model: 'V6-TwinTurbo', name: 'EngineDefect_V3.1_Lrg', sitesCount: 12, status: '已完成' },
    { id: '2', type: '混动总成', model: 'Hybrid-Core-X', name: 'CoreX_Seal_Check_v1', sitesCount: 8, status: '训练中' },
    { id: '3', type: '汽油发动机', model: 'Inline4-Eco', name: 'I4_Basic_Scan', sitesCount: 15, status: '训练失败' },
    { id: '4', type: '柴油发动机', model: 'V8-HighPerf', name: 'V8_FineTune_01', sitesCount: 20, status: '微训练' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case '已完成': return 'bg-green-100 text-green-700';
      case '训练中': return 'bg-blue-100 text-blue-700 animate-pulse';
      case '训练失败': return 'bg-red-100 text-red-700';
      case '微训练': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">模型管理</h1>
          <p className="text-sm text-gray-500 mt-1">训练、验证及部署针对不同部位的 AI 缺陷检测模型。</p>
        </div>
        <button 
          onClick={() => setIsTrainingModalOpen(true)}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl shadow-md transition-all font-semibold text-sm active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>新增训练模型</span>
        </button>
      </header>

      {/* Filters */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-purple-50 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm outline-none border border-transparent focus:border-purple-300 transition-all" placeholder="搜索模型名称或型号..." />
          </div>
          <div className="relative">
            <select className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm appearance-none outline-none border border-transparent focus:border-purple-300 pr-10">
              <option>全部状态</option>
              <option>已完成</option>
              <option>训练中</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Model List Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-purple-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-purple-50/50 text-xs font-bold text-purple-600 uppercase tracking-wider">
              <th className="px-6 py-5">模型名称</th>
              <th className="px-6 py-5">发动机类型 / 型号</th>
              <th className="px-6 py-5">点位数</th>
              <th className="px-6 py-5">状态</th>
              <th className="px-6 py-5 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-50">
            {models.map(m => (
              <tr key={m.id} className="hover:bg-purple-50/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-xl text-purple-600"><Layers className="w-4 h-4" /></div>
                    <span className="font-bold text-gray-800 text-sm">{m.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">{m.type}</p>
                    <p className="text-sm text-gray-600 font-medium">{m.model}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-gray-700">{m.sitesCount}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(m.status)}`}>
                    {m.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <button className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg" title="查看详情"><BarChart2 className="w-4 h-4" /></button>
                    <button className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg" title="重新训练"><RefreshCw className="w-4 h-4" /></button>
                    <button className="p-2 text-red-400 hover:bg-red-50 rounded-lg" title="删除模型"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isTrainingModalOpen && <ModelTrainingModal onClose={() => setIsTrainingModalOpen(false)} />}
    </div>
  );
};

export default ModelManagement;
