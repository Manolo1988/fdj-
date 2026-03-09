
import React, { useState } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Edit3, 
  Trash2, 
  Plus,
  Monitor,
  Calendar,
  User,
  ChevronDown,
  ArrowRight,
  Camera,
  MapPin,
  Zap
} from 'lucide-react';
import ProcessEditorModal from './ProcessEditorModal';
import StartDetectionModal from './StartDetectionModal';
import { DeviceProcess } from '../types';

const generateMockData = (): DeviceProcess[] => {
  const creators = ['张工', '李工', '王主管', '陈工'];
  const data: DeviceProcess[] = [];
  for (let i = 1; i <= 32; i++) {
    const paddedId = i.toString().padStart(2, '0');
    data.push({
      id: i.toString(),
      deviceName: `A2026型发动机-${paddedId}`,
      processName: i % 2 === 0 ? `内腔检测${i}` : `表面检测${i}`,
      createDate: `2024-${(10 + Math.floor(i / 10)).toString().padStart(2, '0')}-${(1 + (i % 28)).toString().padStart(2, '0')}`,
      creator: creators[i % creators.length],
      sitesCount: 4 + (i % 6)
    });
  }
  return data;
};

const DeviceManagement: React.FC = () => {
  const [data, setData] = useState<DeviceProcess[]>(generateMockData());
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeProcessForStart, setActiveProcessForStart] = useState<DeviceProcess | null>(null);
  const itemsPerPage = 8;

  const [filterName, setFilterName] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterCreator, setFilterCreator] = useState('');

  const filteredData = data.filter(item => {
    return (
      item.deviceName.toLowerCase().includes(filterName.toLowerCase()) &&
      (filterDate === '' || item.createDate === filterDate) &&
      (filterCreator === '' || item.creator === filterCreator)
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleStartDetection = (process: DeviceProcess) => {
    setActiveProcessForStart(process);
  };

  const handleSampleCollection = (id: string) => {
    alert(`正在启动设备 ID: ${id} 的相机进行快速样本采集...`);
  };

  const handleSaveProcess = (newProcess: any) => {
    const newItem: DeviceProcess = {
      id: Date.now().toString(),
      deviceName: newProcess.deviceType || '未知设备',
      processName: newProcess.processName || '新流程',
      createDate: new Date().toISOString().split('T')[0],
      creator: '管理员',
      sitesCount: newProcess.sites?.length || 0
    };
    setData([newItem, ...data]);
    setIsEditorOpen(false);
  };

  const triggerDetectionTask = (taskName: string) => {
    alert(`任务 [${taskName}] 已成功启动！`);
    setActiveProcessForStart(null);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">检测流程</h1>
        <p className="text-sm text-gray-500 mt-1">配置和维护针对不同设备型号的自动化检测流程步骤。</p>
      </header>

      {/* Multi-Condition Filters Area */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-purple-50 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center">
              <Monitor className="w-3 h-3 mr-1.5 text-purple-500" /> 设备名称
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="搜索设备..." 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:border-purple-300 focus:bg-white outline-none transition-all text-sm"
                value={filterName}
                onChange={(e) => {setFilterName(e.target.value); setCurrentPage(1);}}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center">
              <Calendar className="w-3 h-3 mr-1.5 text-purple-500" /> 创建日期
            </label>
            <input 
              type="date" 
              className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:border-purple-300 focus:bg-white outline-none transition-all text-sm text-gray-600 cursor-pointer"
              value={filterDate}
              onChange={(e) => {setFilterDate(e.target.value); setCurrentPage(1);}}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center">
              <User className="w-3 h-3 mr-1.5 text-purple-500" /> 创建人
            </label>
            <div className="relative">
              <select 
                className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:border-purple-300 focus:bg-white outline-none transition-all text-sm text-gray-600 appearance-none cursor-pointer pr-10"
                value={filterCreator}
                onChange={(e) => {setFilterCreator(e.target.value); setCurrentPage(1);}}
              >
                <option value="">全部人员</option>
                <option value="张工">张工</option>
                <option value="李工">李工</option>
                <option value="王主管">王主管</option>
                <option value="陈工">陈工</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              onClick={() => setIsEditorOpen(true)}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all font-semibold text-sm w-full md:w-auto justify-center active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>增加流程</span>
            </button>
          </div>
        </div>
      </div>

      {/* Device List Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-purple-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-purple-50/50">
              <th className="px-6 py-5 text-xs font-bold text-purple-600 uppercase tracking-wider">
                检测流程名称
              </th>
              <th className="px-6 py-5 text-xs font-bold text-purple-600 uppercase tracking-wider">
                <div className="flex items-center space-x-1 cursor-pointer hover:text-purple-800 transition-colors">
                  <span>设备名称</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="px-6 py-5 text-xs font-bold text-purple-600 uppercase tracking-wider">
                检测部位数
              </th>
              <th className="px-6 py-5 text-xs font-bold text-purple-600 uppercase tracking-wider">
                创建日期
              </th>
              <th className="px-6 py-5 text-xs font-bold text-purple-600 uppercase tracking-wider">
                创建人
              </th>
              <th className="px-6 py-5 text-xs font-bold text-purple-600 uppercase tracking-wider text-right">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-50">
            {paginatedData.length > 0 ? paginatedData.map((item) => (
              <tr key={item.id} className="hover:bg-purple-50/20 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100/50 rounded-lg text-purple-600"><Zap className="w-4 h-4" /></div>
                    <span className="text-sm font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
                      {item.processName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Monitor className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-800 text-sm">{item.deviceName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-sm font-bold">{item.sitesCount}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                  {item.createDate}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 border border-indigo-200">
                      {item.creator.charAt(0)}
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{item.creator}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <button 
                      onClick={() => handleStartDetection(item)}
                      className="p-2 text-purple-600 hover:text-white hover:bg-purple-600 rounded-lg transition-all group/btn shadow-sm hover:shadow-md" 
                      title="开始新检测"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleSampleCollection(item.id)}
                      className="p-2 text-indigo-500 hover:text-white hover:bg-indigo-500 rounded-lg transition-all group/btn shadow-sm hover:shadow-md" 
                      title="采集检测样本"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all" title="编辑流程">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="删除">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-gray-400 italic">未找到匹配的检测流程</td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Pagination Section */}
        <div className="p-6 border-t border-purple-50 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 gap-4 bg-gray-50/30">
          <div>显示 {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredData.length)} 条，共 {filteredData.length} 条</div>
          <div className="flex items-center space-x-1">
            <button onClick={() => setCurrentPage(1)} className="px-3 py-1 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled={currentPage === 1}>首页</button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = i + 1;
                return (
                  <button key={p} onClick={() => setCurrentPage(p)} className={`w-8 h-8 rounded-lg font-bold ${currentPage === p ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-400 hover:bg-white border border-transparent hover:border-purple-100'}`}>{p}</button>
                );
              })}
            </div>
            <button onClick={() => setCurrentPage(totalPages)} className="px-3 py-1 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled={currentPage === totalPages || totalPages === 0}>末页</button>
          </div>
        </div>
      </div>

      {isEditorOpen && (
        <ProcessEditorModal 
          onClose={() => setIsEditorOpen(false)} 
          onSave={handleSaveProcess} 
        />
      )}

      {activeProcessForStart && (
        <StartDetectionModal 
          process={activeProcessForStart}
          onClose={() => setActiveProcessForStart(null)}
          onStart={triggerDetectionTask}
        />
      )}
    </div>
  );
};

export default DeviceManagement;
