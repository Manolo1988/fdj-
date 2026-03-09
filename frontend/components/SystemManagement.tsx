
import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, Database, Activity, Workflow } from 'lucide-react';
import { DefectType } from '../types';
import { createDefectType, deleteDefectType, fetchDefectTypes } from '../services/api';

const SystemManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'types' | 'defects' | 'processes'>('types');
  const [engineTypes] = useState(['柴油发动机', '汽油发动机', '混动总成', '电驱系统']);
  const [defectTypes, setDefectTypes] = useState<DefectType[]>([]);
  const [newDefectName, setNewDefectName] = useState('');
  const [defectError, setDefectError] = useState('');
  const [processTypes] = useState(['喷漆表面检测', '隔热层厚度检测', '缸体精密扫描', '焊接质量分析']);

  useEffect(() => {
    const load = async () => {
      try {
        const items = await fetchDefectTypes();
        setDefectTypes(items);
      } catch (err) {
        setDefectError(err instanceof Error ? err.message : '缺陷类型加载失败');
      }
    };
    load();
  }, []);

  const handleCreateDefect = async () => {
    if (!newDefectName.trim()) {
      setDefectError('请输入缺陷类型名称');
      return;
    }
    try {
      const created = await createDefectType(newDefectName.trim());
      setDefectTypes((prev) => [created, ...prev]);
      setNewDefectName('');
      setDefectError('');
    } catch (err) {
      setDefectError(err instanceof Error ? err.message : '创建失败');
    }
  };

  const handleDeleteDefect = async (id: number) => {
    try {
      await deleteDefectType(id);
      setDefectTypes((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setDefectError(err instanceof Error ? err.message : '删除失败');
    }
  };

  const renderList = (data: string[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {data.map((item, i) => (
        <div key={i} className="group p-4 bg-purple-50/50 border border-purple-100 rounded-2xl flex items-center justify-between hover:bg-white hover:shadow-md transition-all">
          <span className="font-bold text-gray-700 text-sm">{item}</span>
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 text-gray-400 hover:text-purple-600"><Edit3 className="w-3.5 h-3.5" /></button>
            <button className="p-1.5 text-gray-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">系统管理</h1>
        <p className="text-sm text-gray-500 mt-1">维护全局基础元数据及业务字典配置。</p>
      </header>

      <div className="flex space-x-2 mb-6 p-1 bg-gray-100 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('types')}
          className={`flex items-center space-x-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'types' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Database className="w-4 h-4" /> <span>发动机类型</span>
        </button>
        <button 
          onClick={() => setActiveTab('defects')}
          className={`flex items-center space-x-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'defects' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Activity className="w-4 h-4" /> <span>缺陷类型</span>
        </button>
        <button 
          onClick={() => setActiveTab('processes')}
          className={`flex items-center space-x-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'processes' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Workflow className="w-4 h-4" /> <span>工艺类型</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-purple-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">
            {activeTab === 'types' && '发动机类型库'}
            {activeTab === 'defects' && '缺陷类型字典'}
            {activeTab === 'processes' && '工艺环节字典'}
          </h2>
          <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md">
            <Plus className="w-4 h-4" /> <span>新增项</span>
          </button>
        </div>

        {activeTab === 'types' && renderList(engineTypes)}
        {activeTab === 'defects' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={newDefectName}
                onChange={(event) => setNewDefectName(event.target.value)}
                placeholder="新增缺陷类型"
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:border-purple-300 outline-none text-sm"
              />
              <button
                type="button"
                onClick={handleCreateDefect}
                className="px-6 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-purple-700"
              >
                添加
              </button>
            </div>
            {defectError && <p className="text-xs text-red-500">{defectError}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {defectTypes.map((item) => (
                <div
                  key={item.id}
                  className="group p-4 bg-purple-50/50 border border-purple-100 rounded-2xl flex items-center justify-between hover:bg-white hover:shadow-md transition-all"
                >
                  <div>
                    <span className="font-bold text-gray-700 text-sm">{item.name}</span>
                    {!item.is_active && <p className="text-[10px] text-gray-400">未启用</p>}
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-gray-400 hover:text-purple-600" title="编辑暂未开放">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteDefect(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'processes' && renderList(processTypes)}
      </div>
    </div>
  );
};

export default SystemManagement;
