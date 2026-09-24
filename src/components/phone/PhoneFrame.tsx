import React from 'react';
import { useFamily } from '../../context/FamilyContext';
import { BottomTabBar } from '../navigation/BottomTabBar';
import { HomePage } from '../pages/HomePage';
import { TaskCenterPage } from '../pages/TaskCenterPage';
import { FamilyFeedPage } from '../pages/FamilyFeedPage';
import { ProfilePage } from '../pages/ProfilePage';
import { BabyArchivePage } from '../pages/BabyArchivePage';
import { ElderlyHealthPage } from '../pages/ElderlyHealthPage';
import { AIAssistantPage } from '../pages/AIAssistantPage';
import { InviteServiceModal } from '../pages/InviteServiceModal';
import { MemberPermissionModal } from '../pages/MemberPermissionModal';
import { AIGrowthReportModal } from '../modals/AIGrowthReportModal';
import { FamilySpaceDetailPage } from '../pages/FamilySpaceDetailPage';
import { PersonalProfileDetailPage } from '../pages/PersonalProfileDetailPage';
import { FamilyArchivesManagePage } from '../pages/FamilyArchivesManagePage';
import {
  Wifi,
  Signal,
  Battery,
  AlertCircle,
  CheckCircle2,
  Info,
} from 'lucide-react';

export const PhoneFrame: React.FC = () => {
  const {
    activeTab,
    currentSubView,
    isPhoneFrameEnabled,
    toasts,
  } = useFamily();

  const renderActiveScreen = () => {
    // 1. Sub-views override tab views
    if (currentSubView === 'baby_archive') {
      return <BabyArchivePage />;
    }
    if (currentSubView === 'elderly_health') {
      return <ElderlyHealthPage />;
    }
    if (currentSubView === 'ai_assistant') {
      return <AIAssistantPage />;
    }
    if (currentSubView === 'invite_service') {
      return <InviteServiceModal />;
    }
    if (currentSubView === 'member_permission') {
      return <MemberPermissionModal />;
    }
    if (currentSubView === 'ai_growth_report') {
      return <AIGrowthReportModal />;
    }
    if (currentSubView === 'family_space_detail') {
      return <FamilySpaceDetailPage />;
    }
    if (currentSubView === 'personal_profile_detail') {
      return <PersonalProfileDetailPage />;
    }
    if (currentSubView === 'family_archives_manage') {
      return <FamilyArchivesManagePage />;
    }

    // 2. Primary Tabs
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'archives':
        return <FamilyArchivesManagePage />;
      case 'space':
        return <ProfilePage />;
      case 'tasks':
        return <TaskCenterPage />;
      case 'feed':
        return <FamilyFeedPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  const isSubViewActive = currentSubView !== 'none';

  return (
    <div className="flex justify-center items-center w-full h-full">
      {/* Phone fills the window leftover space, then grows or shrinks with it */}
      <div
        data-phone-frame
        className={`h-[min(100cqh,calc(100cqw*13/6))] w-[min(100cqw,calc(100cqh*6/13))] bg-[#FBFBF9] relative flex flex-col ${
          isPhoneFrameEnabled
            ? 'rounded-[2.4rem] shadow-[0_22px_50px_-16px_rgba(0,0,0,0.28),0_0_0_10px_#1e1e1e,0_0_0_12px_#3a3a3a] border-4 border-stone-800 ring-1 ring-black/10 overflow-hidden'
            : 'rounded-3xl shadow-xl border border-stone-300/80 overflow-hidden'
        }`}
      >
        {/* iOS / Mobile Status Bar & Dynamic Island */}
        <div className="shrink-0 bg-[#FBFBF9]/95 backdrop-blur-md pt-3 pb-1.5 px-6 flex items-center justify-between text-xs font-semibold text-stone-900 border-b border-stone-200/60 select-none z-30">
          <span className="font-bold tracking-tight text-xs">9:41</span>

          {/* Dynamic Island / Speaker */}
          <div className="w-24 h-5 bg-neutral-900 rounded-full flex items-center justify-between px-2.5 shadow-inner">
            <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-800 border border-neutral-700" />
          </div>

          <div className="flex items-center gap-1.5 text-stone-700">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 fill-stone-700 stroke-none" />
          </div>
        </div>

        {/* Screen Content View (Scrollable).
            Pages were laid out for a 420px phone. Scale them into the narrower frame
            so type, cards, and spacing shrink together instead of wrapping apart. */}
        <main className="[container-type:size] flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar relative">
          <div className="w-[420px] h-[calc(100cqh*420/100cqw)] [zoom:calc(100cqw/420px)]">
            {renderActiveScreen()}
          </div>
        </main>

        {/* Bottom Tab Bar & Home Indicator Dock - tightly attached to phone simulator */}
        {!isSubViewActive && (
          <div className="shrink-0 w-full bg-[#FBFBF9]/95 backdrop-blur-md border-t border-stone-200/80 z-40">
            <BottomTabBar />
            {isPhoneFrameEnabled && (
              <div className="w-full pb-2 pt-0.5 flex justify-center shrink-0">
                <div className="w-32 h-1 bg-stone-300 rounded-full" />
              </div>
            )}
          </div>
        )}

        {/* Home Indicator when in SubView (like sub-pages) */}
        {isSubViewActive && isPhoneFrameEnabled && (
          <div className="shrink-0 w-full bg-[#FBFBF9]/95 backdrop-blur-md py-2 flex justify-center border-t border-stone-200/40 z-40">
            <div className="w-32 h-1 bg-stone-300 rounded-full" />
          </div>
        )}

        {/* Toast Notifications Overlay inside Phone Screen */}
        <div className="absolute top-14 left-4 right-4 z-50 pointer-events-none space-y-1.5">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`p-3 rounded-2xl shadow-lg text-xs font-bold flex items-center gap-2 pointer-events-auto border animate-fadeIn ${
                toast.type === 'warning'
                  ? 'bg-amber-900 text-amber-100 border-amber-700'
                  : toast.type === 'info'
                  ? 'bg-neutral-900 text-white border-neutral-700'
                  : 'bg-emerald-800 text-white border-emerald-700'
              }`}
            >
              {toast.type === 'warning' ? (
                <AlertCircle className="w-4 h-4 text-amber-300 shrink-0" />
              ) : toast.type === 'info' ? (
                <Info className="w-4 h-4 text-sky-300 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              )}
              <span className="leading-snug">{toast.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
