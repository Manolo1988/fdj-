
import React, { useState } from 'react';
import { Search, UserPlus, Edit3, Trash2, UserCheck, Shield } from 'lucide-react';

const UserManagement: React.FC = () => {
  const [users] = useState([
    { id: 1, name: '管理员', role: '超级管理员', status: '在线', email: 'admin@engine.com' },
    { id: 2, name: '张工', role: '检测员', status: '离线', email: 'zhang@engine.com' },
    { id: 3, name: '李工', role: '设备工程师', status: '在线', email: 'li@engine.com' },
  ]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">用户角色管理</h1>
          <p className="text-sm text-gray-500 mt-1">管理系统访问权限及人员配置信息。</p>
        </div>
        <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl shadow-md transition-all font-semibold text-sm">
          <UserPlus className="w-5 h-5" />
          <span>新增用户</span>
        </button>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-purple-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-purple-50/50 text-xs font-bold text-purple-600 uppercase">
              <th className="px-6 py-5">姓名</th>
              <th className="px-6 py-5">角色</th>
              <th className="px-6 py-5">状态</th>
              <th className="px-6 py-5">邮箱</th>
              <th className="px-6 py-5 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-50">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-purple-50/20 transition-colors">
                <td className="px-6 py-4 flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs uppercase">
                    {u.name.charAt(0)}
                  </div>
                  <span className="font-bold text-gray-800">{u.name}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center text-sm text-gray-600">
                    <Shield className="w-3.5 h-3.5 mr-1 text-purple-400" /> {u.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.status === '在线' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">{u.email}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
