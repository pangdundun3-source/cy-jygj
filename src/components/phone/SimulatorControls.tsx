import React from 'react';
import { useFamily } from '../../context/FamilyContext';
import {
  Smartphone,
  Sparkles,
  ShieldCheck,
  Baby,
  HeartPulse,
  UserCheck,
  CheckCircle2,
  Users,
  Info,
  User,
  FolderLock,
  FolderArchive,
} from 'lucide-react';

export const SimulatorControls: React.FC = () => {
  const {
    currentRolePersona,
    setCurrentRolePersona,
    isPhoneFrameEnabled,
    setIsPhoneFrameEnabled,
    setCurrentSubView,
    setActiveTab,
    showToast,
  } = useFamily();

  const handleScenario = (scenario: string) => {
    if (scenario === 'invite_nanny') {
      setActiveTab('profile');
      setCurrentSubView('invite_service');
      showToast('已打开【邀请临时育儿嫂】4步向导流程', 'info');
    } else if (scenario === 'baby_report') {
      setActiveTab('home');
      setCurrentSubView('baby_archive');
      showToast('已打开【宝宝成长档案】，可点击右上角生成AI报告', 'info');
    } else if (scenario === 'grandpa_health') {
      setActiveTab('home');
      setCurrentSubView('elderly_health');
      showToast('已打开【爷爷健康档案】与三甲门诊复诊记录', 'info');
    } else if (scenario === 'switch_nanny') {
      setCurrentRolePersona('nanny_wang');
      setActiveTab('home');
      setCurrentSubView('none');
      showToast('已切换至【育儿嫂王阿姨】受限视角：已隔离老人与财务档案', 'warning');
    } else if (scenario === 'permission_matrix') {
      setActiveTab('profile');
      setCurrentSubView('member_permission');
      showToast('已打开【空间成员权限总控台】', 'info');
    } else if (scenario === 'brother_profile') {
      setCurrentRolePersona('brother');
      setActiveTab('profile');
      setCurrentSubView('personal_profile_detail');
      showToast('已切换至【哥哥视角】并打开【个人信息详情页】', 'success');
    } else if (scenario === 'space_management') {
      setCurrentRolePersona('mom');
      setActiveTab('profile');
      setCurrentSubView('family_space_detail');
      showToast('已进入【家庭空间管理与档案详情】界面', 'success');
    } else if (scenario === 'family_archives') {
      setCurrentRolePersona('mom');
      setActiveTab('profile');
      setCurrentSubView('family_archives_manage');
      showToast('已进入【家庭全员档案管理中心】', 'success');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-2 px-3 pt-2">
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl px-4 py-2.5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Brand & Space info */}
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-sm shadow-xs font-bold">
              🏡
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-slate-900 tracking-tight">家有管家</span>
                <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded-md border border-emerald-200">
                  手机模拟
                </span>
              </div>
            </div>
          </div>

          {/* Persona Switcher Pills */}
          <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 overflow-x-auto no-scrollbar">
            {[
              { id: 'mom', label: '👩 妈妈 (主控)', desc: '家庭主成员 · 控权人' },
              { id: 'dad', label: '👨 爸爸', desc: '家庭成员' },
              { id: 'brother', label: '👦 哥哥', desc: '家庭成员' },
              { id: 'escort_zhang', label: '🩺 陪诊张阿姨', desc: '受限服务人员' },
              { id: 'nanny_wang', label: '🧑‍🍳 育儿王阿姨', desc: '受限服务人员' },
            ].map((role) => {
              const isSelected = currentRolePersona === role.id;
              return (
                <button
                  key={role.id}
                  id={`role-btn-${role.id}`}
                  onClick={() => {
                    setCurrentRolePersona(role.id as any);
                    showToast(`已切换身份：${role.label}`, isSelected ? 'info' : 'success');
                  }}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-emerald-600/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                  title={role.desc}
                >
                  {role.label}
                </button>
              );
            })}
          </div>

          {/* Quick toggle frame */}
          <div className="flex items-center gap-1.5">
            <button
              id="btn-toggle-phone-frame"
              onClick={() => setIsPhoneFrameEnabled(!isPhoneFrameEnabled)}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition"
              title="切换外壳模式"
            >
              <Smartphone className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">{isPhoneFrameEnabled ? '手机机模' : '纯净视图'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
