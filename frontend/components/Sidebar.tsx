
import React from 'react';
import { 
  Home,
  Monitor, 
  Settings,
  Box, 
  FileText, 
  Layers, 
  UserCircle, 
  ShieldCheck,
  Zap,
  Cpu
} from 'lucide-react';
import { MenuKey } from '../types';

interface SidebarProps {
  activeMenu: MenuKey;
  onMenuChange: (key: MenuKey) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeMenu, onMenuChange }) => {
  const menuItems = [
    { key: 'home', label: '主页', icon: Home },
    { key: 'engines', label: '设备', icon: Cpu },
    { key: 'devices', label: '检测流程', icon: Zap },
    { key: 'detect', label: '检测', icon: Monitor },
    { key: 'samples', label: '样本库', icon: Box },
    { key: 'reports', label: '历史检测&检测报告', icon: FileText },
    { key: 'models', label: '模型管理', icon: Layers },
    { key: 'users', label: '用户角色', icon: UserCircle },
    { key: 'system', label: '系统管理', icon: Settings },
  ];

  return (
    <aside className="w-64 h-full bg-white border-r border-purple-100 flex flex-col shadow-sm">
      {/* Brand Header */}
      <div className="p-6 border-b border-purple-50">
        <div className="flex items-center space-x-3 text-purple-600 mb-2">
          <ShieldCheck className="w-8 h-8" />
          <div className="font-bold text-lg leading-tight text-gray-800">
            发动机外观<br/>缺陷检测系统
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 mt-6 px-4 space-y-1.5 overflow-y-auto pb-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onMenuChange(item.key as MenuKey)}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-gray-500 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-purple-600'}`} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom info */}
      <div className="p-6 border-t border-purple-50 text-center">
        <div className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
          Engine Defect v2.4
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
