
import React, { useState } from 'react';
import { FileText, Eye, Trash2, Calendar, User, Zap, Activity, Clock } from 'lucide-react';

const ReportsManagement: React.FC = () => {
  const [reports] = useState([
    { 
      id: 'DET-20240321-001', 
      flow: '缸盖侧面精密扫描', 
      device: 'A2026型发动机-01', 
      start: '2024-03-21 14:10:00', 
      end: '-', 
      creator: '张工',
      isActive: true
    },
    { 
      id: 'DET-20240320-142', 
      flow: '底座铸造缺陷检查', 
      device: 'V8核心检测线', 
      start: '2024-03-20 09:15:20', 
      end: '2024-03-20 09:25:40', 
      creator: '李工',
      isActive: false
    },
    { 
      id: 'DET-20240320-120', 
      flow: '表面涂装均匀性检测', 
      device: 'A2026型发动机-04', 
      start: '2024-03-20 08:00:10', 
      end: '2024-03-20 08:30:15', 
      creator: '管理员',
      isActive: false
    },
  ]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">历史检测 & 检测报告</h1>
        <p className="text-sm text-gray-500 mt-1">追溯历史检测记录，生成并导出专业检测报告。</p>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-purple-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-purple-50/50 text-xs font-bold text-purple-600 uppercase">
              <th className="px-6 py-5">检测编号</th>
              <th className="px-6 py-5">流程名称</th>
              <th className="px-6 py-5">设备名称</th>
              <th className="px-6 py-5">创建时间</th>
              <th className="px-6 py-5">结束时间</th>
              <th className="px-6 py-5">创建人</th>
              <th className="px-6 py-5 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-50 text-sm">
            {reports.map((r, i) => (
              <tr key={r.id} className={`${r.isActive ? 'bg-purple-50/40 ring-2 ring-inset ring-purple-200' : 'hover:bg-gray-50/50'}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Zap className={`w-4 h-4 ${r.isActive ? 'text-purple-600 animate-pulse' : 'text-gray-300'}`} />
                    <span className="font-mono font-bold text-gray-700">{r.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-800">{r.flow}</td>
                <td className="px-6 py-4 text-gray-600">{r.device}</td>
                <td className="px-6 py-4 text-gray-400 font-mono text-xs">{r.start}</td>
                <td className="px-6 py-4 text-gray-400 font-mono text-xs">{r.end}</td>
                <td className="px-6 py-4 text-gray-600">{r.creator}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="p-2 bg-white border border-gray-100 text-purple-500 hover:bg-purple-50 rounded-lg shadow-sm transition-all" title="查看详情">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      disabled={r.isActive}
                      className={`p-2 border border-gray-100 rounded-lg shadow-sm transition-all ${r.isActive ? 'bg-gray-50 text-gray-300' : 'bg-white text-blue-500 hover:bg-blue-50'}`} 
                      title="检测报告"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-white border border-gray-100 text-red-400 hover:bg-red-50 rounded-lg shadow-sm transition-all" title="删除">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsManagement;
