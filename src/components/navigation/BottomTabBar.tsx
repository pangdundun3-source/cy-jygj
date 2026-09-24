import React from 'react';
import { useFamily, ActiveTab } from '../../context/FamilyContext';
import {
  Home,
  FolderHeart,
  CheckSquare,
  Activity,
  User,
} from 'lucide-react';

export const BottomTabBar: React.FC = () => {
  const { activeTab, setActiveTab, setCurrentSubView, tasks } = useFamily();

  const pendingTasksCount = tasks.filter((t) => t.status !== 'completed').length;

  const navItems: {
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | boolean;
  }[] = [
    {
      id: 'home',
      label: '首页',
      icon: Home,
    },
    {
      id: 'archives',
      label: '健康档案',
      icon: FolderHeart,
    },
    {
      id: 'tasks',
      label: '任务',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
    },
    {
      id: 'feed',
      label: '动态',
      icon: Activity,
    },
    {
      id: 'profile',
      label: '我的',
      icon: User,
    },
  ];

  return (
    <nav className="w-full px-1 pt-1 pb-1">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`tab-${item.id}`}
              onClick={() => {
                setActiveTab(item.id);
                setCurrentSubView('none');
              }}
              className={`relative flex flex-col items-center justify-center flex-1 py-0.5 rounded-xl transition-all ${
                isActive ? 'text-emerald-700 font-semibold' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isActive ? 'scale-105 text-emerald-700 stroke-[2.3]' : 'stroke-[1.8]'
                  }`}
                />
                {typeof item.badge === 'number' && (
                  <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center border border-white shadow-xs">
                    {item.badge}
                  </span>
                )}
                {item.badge === true && (
                  <span className="absolute -top-0.5 -right-1 bg-emerald-500 rounded-full w-2 h-2 ring-2 ring-stone-50" />
                )}
              </div>
              <span
                className={`text-[10px] mt-0.5 tracking-tight ${
                  isActive ? 'text-emerald-800 font-bold' : 'text-stone-500'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1 bg-emerald-700 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
