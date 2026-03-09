
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DeviceManagement from './components/DeviceManagement';
import EngineManagement from './components/EngineManagement';
import UserManagement from './components/UserManagement';
import SystemManagement from './components/SystemManagement';
import ReportsManagement from './components/ReportsManagement';
import SampleLibrary from './components/SampleLibrary';
import ModelManagement from './components/ModelManagement';
import DetectionWorkspace from './components/DetectionWorkspace';
import { MenuKey, SystemStats, ActiveTask, HistoryStats } from './types';
import { Plus, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<MenuKey>('home');
  
  // Mock Data
  const [systemStats] = useState<SystemStats>({
    version: 'v2.4.1-stable',
    deviceCount: 18,
    sampleCount: 12450,
    reportCount: 3821,
  });

  const [activeTask, setActiveTask] = useState<ActiveTask>({
    deviceName: 'A2026型发动机',
    processName: '曲轴箱表面精密扫描',
    durationSeconds: 3605, // 1 hour 5 seconds
    detectedBatches: 12,
    totalPieces: 144,
  });

  const [historyStats] = useState<HistoryStats>({
    deviceTypes: 6,
    totalBatches: 4280,
    totalProducts: 51290,
  });

  // Simple timer for duration
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTask(prev => ({
        ...prev,
        durationSeconds: prev.durationSeconds + 1
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleQuickStart = () => {
    alert('正在初始化快速检测流程...');
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'home':
        return (
          <Dashboard 
            systemStats={systemStats}
            activeTask={activeTask}
            historyStats={historyStats}
          />
        );
      case 'engines':
        return <EngineManagement />;
      case 'devices':
        return <DeviceManagement />;
      case 'detect':
        return <DetectionWorkspace />;
      case 'reports':
        return <ReportsManagement />;
      case 'samples':
        return <SampleLibrary />;
      case 'models':
        return <ModelManagement />;
      case 'users':
        return <UserManagement />;
      case 'system':
        return <SystemManagement />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
            <div className="p-8 bg-purple-50 rounded-full mb-4">
              <Plus className="w-12 h-12 text-purple-200" />
            </div>
            <p className="text-lg font-medium">功能 [{activeMenu}] 正在整合中...</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#FCFAFF]">
      {/* Sidebar */}
      <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 relative flex flex-col">
        {/* Top Right Info Bar */}
        <div className="absolute top-8 right-8 flex items-center space-x-4 z-10">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full uppercase tracking-wider border border-purple-200">
            {systemStats.version}
          </span>
          <div className="w-10 h-10 rounded-full bg-purple-200 border-2 border-white shadow-sm overflow-hidden ring-1 ring-purple-100">
            <img src="https://picsum.photos/seed/user1/100/100" alt="Avatar" />
          </div>
        </div>

        <div className="pt-2 flex-1 flex flex-col">
          {renderContent()}
        </div>

        {/* Floating Action Button */}
        <button
          onClick={handleQuickStart}
          className="fixed bottom-8 right-8 w-16 h-16 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group z-20"
          title="快速开始检测"
        >
          <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </main>
    </div>
  );
};

export default App;
