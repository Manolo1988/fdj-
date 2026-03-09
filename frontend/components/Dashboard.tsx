
import React from 'react';
import { SystemStats, ActiveTask, HistoryStats } from '../types';
import { 
  Cpu, 
  Archive, 
  FileCheck, 
  Activity, 
  Clock, 
  BarChart3,
  History,
  Workflow,
  AlertTriangle,
  Target,
  Percent
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LabelList
} from 'recharts';

interface DashboardProps {
  systemStats: SystemStats;
  activeTask: ActiveTask;
  historyStats: HistoryStats;
}

const qualifiedData = [
  { name: '合格', value: 99.8 },
  { name: '缺陷', value: 0.2 },
];
const COLORS = ['#9333ea', '#f87171'];

const defectSitesData = [
  { name: '缸盖密封面', rate: 0.08 },
  { name: '主轴承座', rate: 0.05 },
  { name: '曲轴箱体', rate: 0.04 },
];

const defectTypesData = [
  { name: '表面划痕', count: 124, ratio: (124 / 12450) * 100 },
  { name: '铸造气孔', count: 89, ratio: (89 / 12450) * 100 },
  { name: '加工裂纹', count: 42, ratio: (42 / 12450) * 100 },
];

const Dashboard: React.FC<DashboardProps> = ({ systemStats, activeTask, historyStats }) => {
  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">系统概览</h1>
        <p className="text-sm text-gray-500 mt-1">欢迎回来，今日系统运行状态良好。</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          icon={<Cpu className="w-6 h-6 text-purple-600" />} 
          title="系统管理设备" 
          value={systemStats.deviceCount} 
          unit="台"
          color="bg-purple-100"
        />
        <StatCard 
          icon={<Archive className="w-6 h-6 text-indigo-600" />} 
          title="样本总数" 
          value={systemStats.sampleCount.toLocaleString()} 
          unit="个"
          color="bg-indigo-100"
        />
        <StatCard 
          icon={<FileCheck className="w-6 h-6 text-blue-600" />} 
          title="检测报告数" 
          value={systemStats.reportCount.toLocaleString()} 
          unit="份"
          color="bg-blue-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-purple-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
            <Activity className="w-32 h-32 text-purple-800" />
          </div>
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
              当前运行信息
            </h3>
            <span className="text-xs font-semibold px-2 py-1 bg-green-50 text-green-700 rounded-md">
              运行中
            </span>
          </div>

          <div className="space-y-6 relative z-10">
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider mb-1">设备 & 流程</p>
              <div className="flex items-start space-x-3">
                <div className="mt-1 p-2 bg-purple-50 rounded-lg text-purple-600">
                  <Workflow className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{activeTask.deviceName}</h4>
                  <p className="text-sm text-gray-500">{activeTask.processName}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-2xl">
                <div className="flex items-center text-gray-400 mb-1">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  <span className="text-[10px] font-bold uppercase">工作时长</span>
                </div>
                <div className="text-lg font-mono font-bold text-purple-700">
                  {formatDuration(activeTask.durationSeconds)}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl">
                <div className="flex items-center text-gray-400 mb-1">
                  <BarChart3 className="w-3.5 h-3.5 mr-1" />
                  <span className="text-[10px] font-bold uppercase">已检批次</span>
                </div>
                <div className="text-xl font-bold text-gray-800">
                  {activeTask.detectedBatches} <span className="text-xs text-gray-400 font-normal">Batch</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-600 text-white p-4 rounded-2xl flex justify-between items-center shadow-md">
              <div>
                <p className="text-[10px] font-bold uppercase opacity-80">当前批次已检测总件数</p>
                <div className="text-2xl font-bold">{activeTask.totalPieces}</div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-purple-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">当前执行检测批次质量数据统计</h3>
            <div className="flex items-center text-purple-600 space-x-1">
              <Target className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">实时分析中</span>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex flex-col items-center justify-center p-4 bg-purple-50/30 rounded-2xl border border-purple-50">
              <span className="text-xs font-bold text-gray-400 uppercase mb-2">合格率占比</span>
              <div className="relative w-full h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={qualifiedData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {qualifiedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-700">99.8%</div>
                    <div className="text-[8px] text-gray-400 font-bold uppercase">合格率</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col p-4 bg-purple-50/30 rounded-2xl border border-purple-50">
              <span className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1 text-purple-600" />
                TOP 3 缺陷部位率 (%)
              </span>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    layout="vertical" 
                    data={defectSitesData} 
                    margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#6b7280' }} 
                      width={70}
                    />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="rate" fill="#a855f7" radius={[0, 4, 4, 0]} barSize={12}>
                      <LabelList dataKey="rate" position="right" fontSize={10} fill="#6b7280" formatter={(val: number) => `${val}%`} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex flex-col p-4 bg-purple-50/30 rounded-2xl border border-purple-50">
              <span className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center">
                <Percent className="w-3 h-3 mr-1 text-purple-600" />
                TOP 3 缺陷类型比
              </span>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    layout="vertical" 
                    data={defectTypesData} 
                    margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#6b7280' }} 
                      width={60}
                    />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="ratio" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={12}>
                      <LabelList dataKey="ratio" position="right" fontSize={10} fill="#6b7280" formatter={(val: number) => `${val.toFixed(2)}%`} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 text-[9px] text-gray-400 text-center font-medium italic">
                * 计算比例: 缺陷数 / 样本总数
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-gray-100 rounded-2xl">
            <History className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">历史统计概览</h3>
            <p className="text-sm text-gray-400">系统自上线以来的全量生产数据沉淀</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-400 mb-2">设备覆盖种类</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-extrabold text-gray-800">{historyStats.deviceTypes}</span>
              <span className="text-lg text-purple-600 font-bold">类</span>
            </div>
            <div className="mt-4 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full w-2/3"></div>
            </div>
            <span className="text-xs text-gray-400 mt-2">已适配主流 85% 发动机型号</span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-400 mb-2">累计检测批次</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-extrabold text-gray-800">{historyStats.totalBatches.toLocaleString()}</span>
              <span className="text-lg text-purple-600 font-bold">批</span>
            </div>
            <div className="mt-4 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full w-3/4"></div>
            </div>
            <span className="text-xs text-gray-400 mt-2">较上月增长 12.4%</span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-400 mb-2">历史检测总件数</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-extrabold text-gray-800">{historyStats.totalProducts.toLocaleString()}</span>
              <span className="text-lg text-purple-600 font-bold">件</span>
            </div>
            <div className="mt-4 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full w-4/5"></div>
            </div>
            <span className="text-xs text-gray-400 mt-2">缺陷检出率维持在 99.98%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  unit: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, unit, color }) => (
  <div className="bg-white rounded-3xl p-6 shadow-sm border border-purple-50 flex items-center space-x-5 hover:shadow-md transition-shadow">
    <div className={`p-4 ${color} rounded-2xl`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-400">{title}</p>
      <div className="flex items-baseline space-x-1">
        <span className="text-2xl font-bold text-gray-800">{value}</span>
        <span className="text-xs text-gray-400 font-medium">{unit}</span>
      </div>
    </div>
  </div>
);

export default Dashboard;
