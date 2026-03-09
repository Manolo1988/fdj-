
import React, { useState } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Edit3, 
  Trash2, 
  Plus,
  Cpu,
  Calendar,
  User,
  ChevronDown,
  MapPin
} from 'lucide-react';
import { EngineDevice } from '../types';
import EngineDataModal from './EngineDataModal';

const generateMockEngines = (): EngineDevice[] => {
  const types = ['柴油发动机', '汽油发动机', '混动总成'];
  const models = ['V6-TwinTurbo', 'Inline4-Eco', 'W12-Performance', 'Hybrid-Core-X'];
  const creators = ['张工', '李工', '王主管', '陈工'];
  const data: EngineDevice[] = [];
  for (let i = 1; i <= 20; i++) {
    data.push({
      id: i.toString(),
      type: types[i % types.length],
      model: `${models[i % models.length]}-${i.toString().padStart(2, '0')}`,
      sitesCount: 8 + (i % 12),
      addDate: `2024-11-${(1 + (i % 28)).toString().padStart(2, '0')}`,
      creator: creators[i % creators.length],
    });
  }
  return data;
};

const EngineManagement: React.FC = () => {
  const [data] = useState<EngineDevice[]>(generateMockEngines());
  const [filterType, setFilterType] = useState('');
  const [filterModel, setFilterModel] = useState('');
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  const filteredData = data.filter(item => 
    (filterType === '' || item.type.includes(filterType)) &&
    (filterModel === '' || item.model.toLowerCase().includes(filterModel.toLowerCase()))
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">设备管理</h1>
        <p className="text-sm text-gray-500 mt-1">录入和管理待检发动机的型号与结构信息。</p>
      </header>

      {/* Filter Area */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-purple-50 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center">
              发动机类型
            </label>
            <div className="relative">
              <select 
                className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:border-purple-300 focus:bg-white outline-none transition-all text-sm appearance-none pr-10"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">全部类型</option>
                <option value="柴油发动机">柴油发动机</option>
                <option value="汽油发动机">汽油发动机</option>
                <option value="混动总成">混动总成</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center">
              型号搜索
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="搜索型号..." 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:border-purple-300 focus:bg-white outline-none transition-all text-sm"
                value={filterModel}
                onChange={(e) => setFilterModel(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button 
              onClick={() => setIsDataModalOpen(true)}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl shadow-md font-semibold text-sm w-full md:w-auto justify-center active:scale-95 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>增加新设备</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-purple-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-purple-50/50">
              <th className="px-6 py-5 text-xs font-bold text-purple-600 uppercase tracking-wider">发动机类型</th>
              <th className="px-6 py-5 text-xs font-bold text-purple-600 uppercase tracking-wider">发动机型号</th>
              <th className="px-6 py-5 text-xs font-bold text-purple-600 uppercase tracking-wider">检查点位数目</th>
              <th className="px-6 py-5 text-xs font-bold text-purple-600 uppercase tracking-wider">添加日期</th>
              <th className="px-6 py-5 text-xs font-bold text-purple-600 uppercase tracking-wider">添加人</th>
              <th className="px-6 py-5 text-xs font-bold text-purple-600 uppercase tracking-wider text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-50">
            {filteredData.map((item) => (
              <tr key={item.id} className="hover:bg-purple-50/20 transition-colors group">
                <td className="px-6 py-4">
                  <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">{item.type}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Cpu className="w-4 h-4" /></div>
                    <span className="font-semibold text-gray-800 text-sm">{item.model}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-sm font-bold">{item.sitesCount}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 font-mono">{item.addDate}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{item.creator}</td>
                <td className="px-6 py-4 text-right space-x-1">
                  <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"><Edit3 className="w-4 h-4" /></button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isDataModalOpen && <EngineDataModal onClose={() => setIsDataModalOpen(false)} />}
    </div>
  );
};

export default EngineManagement;
