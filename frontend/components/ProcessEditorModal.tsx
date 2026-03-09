
import React, { useState } from 'react';
import { 
  X, 
  FolderOpen, 
  Save, 
  Trash2, 
  BarChart2, 
  CheckCircle2, 
  PlusSquare, 
  FilePlus, 
  ArrowUp, 
  ArrowDown, 
  Plus,
  Monitor,
  Camera,
  MapPin,
  Search
} from 'lucide-react';

interface ProcessStep {
  id: string;
  remark: string;
  command: string;
  params: string[];
}

interface DetectionSite {
  id: string;
  name: string;
}

interface ProcessEditorModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const ProcessEditorModal: React.FC<ProcessEditorModalProps> = ({ onClose, onSave }) => {
  const [deviceType, setDeviceType] = useState('');
  const [processName, setProcessName] = useState('');
  
  // Detection Sites State
  const [sites, setSites] = useState<DetectionSite[]>([
    { id: 's1', name: '缸盖侧壁-01' },
    { id: 's2', name: '密封面边缘' },
  ]);
  const [siteSearch, setSiteSearch] = useState('');

  // Process Steps State
  const [steps, setSteps] = useState<ProcessStep[]>([
    { id: '1', remark: '初始化相机', command: 'INIT_CAM', params: ['C01', '30fps', '', '', '', '', ''] },
    { id: '2', remark: '移动至位置A', command: 'MOVE_POS', params: ['120.5', '45.0', '10.0', '', '', '', ''] },
  ]);

  const addSite = () => {
    const newSite = { id: Date.now().toString(), name: `新检测点-${sites.length + 1}` };
    setSites([...sites, newSite]);
  };

  const removeSite = (id: string) => {
    setSites(sites.filter(s => s.id !== id));
  };

  const addEmptyRow = () => {
    const newStep: ProcessStep = {
      id: Date.now().toString(),
      remark: '',
      command: '',
      params: Array(7).fill(''),
    };
    setSteps([...steps, newStep]);
  };

  const addStep = () => {
    const newStep: ProcessStep = {
      id: Date.now().toString(),
      remark: '新增步骤',
      command: 'NEW_CMD',
      params: Array(7).fill(''),
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === steps.length - 1) return;
    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    setSteps(newSteps);
  };

  const clearSteps = () => {
    if (confirm('确定要清空所有流程内容吗？')) {
      setSteps([]);
      setSites([]);
    }
  };

  const handleCaptureSample = (siteName: string) => {
    alert(`正在启动相机采集 [${siteName}] 的样本...`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="bg-purple-600 p-5 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center space-x-3">
            <PlusSquare className="w-6 h-6" />
            <h2 className="text-lg font-bold">自动流程编辑器</h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Form Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-purple-700 flex items-center uppercase tracking-wider">
                <Monitor className="w-3.5 h-3.5 mr-1.5" /> 设备类型
              </label>
              <input 
                list="device-types"
                className="w-full px-4 py-2 bg-white border border-purple-200 rounded-xl focus:border-purple-500 outline-none transition-all shadow-sm text-sm"
                placeholder="选择或输入设备型号..."
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}
              />
              <datalist id="device-types">
                <option value="A2026型发动机" />
                <option value="B-Series智能站" />
                <option value="V8核心检测线" />
              </datalist>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-purple-700 uppercase tracking-wider">流程名称</label>
              <input 
                className="w-full px-4 py-2 bg-white border border-purple-200 rounded-xl focus:border-purple-500 outline-none transition-all shadow-sm text-sm"
                placeholder="输入检测流程名称..."
                value={processName}
                onChange={(e) => setProcessName(e.target.value)}
              />
            </div>
          </div>

          {/* Section 1: Detection Sites List */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-purple-600" /> 检测点列表 (管理与样本采集)
              </h3>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <input 
                    className="pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:bg-white focus:border-purple-300 w-40"
                    placeholder="搜索点位..."
                    value={siteSearch}
                    onChange={(e) => setSiteSearch(e.target.value)}
                  />
                </div>
                <button 
                  onClick={addSite}
                  className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all font-bold text-xs flex items-center"
                >
                  <Plus className="w-3 h-3 mr-1" /> 增加检测点
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-40 overflow-y-auto p-1">
              {sites.filter(s => s.name.includes(siteSearch)).map((site) => (
                <div key={site.id} className="group relative bg-white border border-purple-100 rounded-xl p-3 shadow-sm hover:border-purple-400 transition-all flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700 truncate mr-2">{site.name}</span>
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={() => handleCaptureSample(site.name)}
                      className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
                      title="采集样本"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => removeSite(site.id)}
                      className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {sites.length === 0 && <div className="col-span-full py-6 text-center text-gray-400 text-xs italic">暂无检测点位信息</div>}
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Section 2: Step Editor */}
          <section className="space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
              <h3 className="text-sm font-bold text-gray-700 mr-4">流程执行步骤</h3>
              <button onClick={addEmptyRow} className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all font-bold text-[10px] uppercase tracking-wider">
                <Plus className="w-3 h-3" /> <span>插入空行</span>
              </button>
              <button onClick={addStep} className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all font-bold text-[10px] uppercase tracking-wider">
                <PlusSquare className="w-3 h-3" /> <span>插入流程步骤</span>
              </button>
              <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all font-bold text-[10px] uppercase tracking-wider">
                <FilePlus className="w-3 h-3" /> <span>插入文件</span>
              </button>
              
              <div className="flex-1 flex justify-end space-x-2">
                <button className="px-3 py-1.5 bg-purple-600 text-white rounded-lg shadow-sm hover:bg-purple-700 transition-all text-xs font-bold flex items-center"><FolderOpen className="w-3 h-3 mr-1" /> 打开</button>
                <button className="px-3 py-1.5 bg-purple-600 text-white rounded-lg shadow-sm hover:bg-purple-700 transition-all text-xs font-bold flex items-center"><Save className="w-3 h-3 mr-1" /> 保存</button>
                <button onClick={clearSteps} className="px-3 py-1.5 bg-white text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-all text-xs font-bold flex items-center"><Trash2 className="w-3 h-3 mr-1" /> 清空</button>
                <button className="px-3 py-1.5 bg-green-500 text-white rounded-lg shadow-sm hover:bg-green-600 transition-all text-xs font-bold flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" /> 检查</button>
              </div>
            </div>

            <div className="border border-purple-100 rounded-2xl overflow-hidden shadow-inner bg-gray-50/20">
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr className="bg-purple-50 text-purple-800">
                    <th className="px-2 py-2.5 font-bold border-r border-purple-100 w-10 text-center">编号</th>
                    <th className="px-3 py-2.5 font-bold border-r border-purple-100 w-32">备注</th>
                    <th className="px-3 py-2.5 font-bold border-r border-purple-100 w-32">命令名称</th>
                    {[1, 2, 3, 4, 5, 6, 7].map(n => (
                      <th key={n} className="px-2 py-2.5 font-bold border-r border-purple-100">参数{n}</th>
                    ))}
                    <th className="px-2 py-2.5 font-bold text-center w-24">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {steps.map((step, idx) => (
                    <tr key={step.id} className="border-b border-purple-50 group hover:bg-purple-50/10">
                      <td className="px-1 py-1 text-center text-gray-400 font-mono font-bold bg-gray-50/30">{(idx + 1).toString().padStart(2, '0')}</td>
                      <td className="px-1 py-1"><input className="w-full px-2 py-1 text-gray-700 focus:bg-purple-50 outline-none rounded" defaultValue={step.remark} /></td>
                      <td className="px-1 py-1"><input className="w-full px-2 py-1 text-purple-700 font-bold focus:bg-purple-50 outline-none rounded uppercase" defaultValue={step.command} /></td>
                      {step.params.map((p, pIdx) => (
                        <td key={pIdx} className="px-1 py-1">
                          <input className="w-full px-2 py-1 text-gray-500 focus:bg-purple-50 outline-none rounded" defaultValue={p} />
                        </td>
                      ))}
                      <td className="px-1 py-1">
                        <div className="flex items-center justify-center space-x-0.5 opacity-30 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => moveStep(idx, 'up')} className="p-1 hover:text-purple-600 hover:bg-purple-50 rounded"><ArrowUp className="w-3 h-3" /></button>
                          <button onClick={() => moveStep(idx, 'down')} className="p-1 hover:text-purple-600 hover:bg-purple-50 rounded"><ArrowDown className="w-3 h-3" /></button>
                          <button onClick={() => removeStep(step.id)} className="p-1 hover:text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 p-5 flex justify-end space-x-4 border-t border-gray-200 shrink-0">
          <button onClick={onClose} className="px-8 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 transition-all font-bold text-sm">退出</button>
          <button 
            onClick={() => onSave({ deviceType, processName, steps, sites })} 
            className="px-10 py-2.5 bg-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:bg-purple-700 transition-all font-bold text-sm"
          >
            完成配置并保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessEditorModal;
