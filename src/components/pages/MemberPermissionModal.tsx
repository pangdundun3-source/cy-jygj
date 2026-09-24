import React, { useState } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { FamilyMember, PermissionSettings } from '../../types';
import {
  ShieldCheck,
  Check,
  X,
  Clock,
  ChevronLeft,
  Calendar,
  AlertTriangle,
  Lock,
  UserCheck,
  Trash2,
  RefreshCw,
} from 'lucide-react';

export const MemberPermissionModal: React.FC = () => {
  const {
    members,
    selectedMemberId,
    setSelectedMemberId,
    setCurrentSubView,
    endServiceEarly,
    renewService,
    setCurrentRolePersona,
    showToast,
  } = useFamily();

  const [activeMemberTabId, setActiveMemberTabId] = useState<string>(
    selectedMemberId || 'm_nanny_wang'
  );

  const currentInspectedMember =
    members.find((m) => m.id === activeMemberTabId) || members[0];

  const isTempStaff = currentInspectedMember.role === 'temporary_service';
  const isAdmin = currentInspectedMember.role === 'owner';

  const permissionItems: {
    key: keyof PermissionSettings;
    category: string;
    title: string;
    description: string;
  }[] = [
    {
      key: 'babyArchiveView',
      category: '宝宝档案',
      title: '查看宝宝成长记录与相册',
      description: '允许浏览小宝的成长里程碑与健康体征',
    },
    {
      key: 'babyArchiveUpload',
      category: '宝宝档案',
      title: '上传育儿打卡与照片',
      description: '允许上传日常作息、餐食及穿鞋玩耍记录',
    },
    {
      key: 'elderlyHealthView',
      category: '老人健康',
      title: '查看老人健康档案与病历',
      description: '包含李爷爷血压、血糖、历史门诊及用药',
    },
    {
      key: 'elderlyHealthUpload',
      category: '老人健康',
      title: '上传陪诊报告与测量指标',
      description: '允许上传医院化验单、心电图及用药打卡',
    },
    {
      key: 'familyTasksParticipate',
      category: '家庭事务',
      title: '参与并完成指派的家庭任务',
      description: '如宝宝接送、陪诊就医、保洁打卡',
    },
    {
      key: 'familyTasksManage',
      category: '家庭事务',
      title: '创建与指派家庭任务',
      description: '仅管理员与核心家庭成员可创建',
    },
    {
      key: 'familyFeedViewAll',
      category: '家庭动态',
      title: '查看全家私密动态与互动',
      description: '临时人员仅可见自己发布的服务打卡',
    },
    {
      key: 'financeAccess',
      category: '隐私与资产',
      title: '家庭账本与财务资料',
      description: '核心资产信息，对外部服务人员严格隔离',
    },
  ];

  const handleSimulateView = () => {
    if (currentInspectedMember.id === 'm_nanny_wang') {
      setCurrentRolePersona('nanny_wang');
      setCurrentSubView('none');
      showToast('已切换至【王阿姨 (育儿嫂)】视角，请体验受限页面！', 'info');
    } else if (currentInspectedMember.id === 'm_escort_zhang') {
      setCurrentRolePersona('escort_zhang');
      setCurrentSubView('none');
      showToast('已切换至【张阿姨 (陪诊员)】视角！', 'info');
    } else if (currentInspectedMember.id === 'm_mom') {
      setCurrentRolePersona('mom');
      setCurrentSubView('none');
      showToast('已切换至【妈妈 (管理员)】视角！', 'success');
    } else {
      setCurrentRolePersona('dad');
      setCurrentSubView('none');
      showToast('已切换至【爸爸】视角！', 'success');
    }
  };

  return (
    <div className="pb-6 pt-2 px-4 space-y-4 max-w-md mx-auto animate-fadeIn">
      {/* 顶部返回导航 */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            setCurrentSubView('none');
            setSelectedMemberId(null);
          }}
          className="flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>返回家庭空间</span>
        </button>
        <span className="text-xs font-bold text-stone-800">成员权限管理</span>
      </div>

      {/* 成员切换 Tab (横向滚动) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {members.map((m) => {
          const isSelected = m.id === currentInspectedMember.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveMemberTabId(m.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <span>{m.avatar}</span>
              <span>{m.name.split(' ')[0]}</span>
              {m.role === 'temporary_service' && (
                <span
                  className={`text-[9px] px-1 py-0.2 rounded ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-800'
                  }`}
                >
                  临时
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 成员名片与角色概况 */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xs ${currentInspectedMember.avatarBg}`}
            >
              {currentInspectedMember.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-stone-900">
                  {currentInspectedMember.name}
                </h3>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                    isAdmin
                      ? 'bg-emerald-100 text-emerald-800'
                      : isTempStaff
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {currentInspectedMember.roleLabel}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                联系电话：{currentInspectedMember.phone || '家庭内部档案'}
              </p>
            </div>
          </div>
        </div>

        {/* 临时服务人员有效期状态卡片 */}
        {isTempStaff && (
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-3 border border-teal-200/70 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-teal-900">
                <Clock className="w-4 h-4 text-teal-700" />
                <span>服务有效期</span>
              </div>
              <span className="font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded text-[11px]">
                剩余 {currentInspectedMember.daysRemaining || 15} 天
              </span>
            </div>
            <div className="text-[11px] text-stone-600 flex items-center justify-between">
              <span>
                服务周期：{currentInspectedMember.startDate} ~{' '}
                {currentInspectedMember.endDate}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => renewService(currentInspectedMember.id, 30)}
                className="flex-1 py-1.5 bg-white border border-teal-300 hover:bg-teal-50 text-teal-800 rounded-lg font-semibold text-xs transition flex items-center justify-center gap-1 shadow-2xs"
              >
                <RefreshCw className="w-3 h-3" />
                <span>延长30天</span>
              </button>
              <button
                onClick={() => {
                  if (confirm(`确定要立即终止【${currentInspectedMember.name}】的服务授权吗？`)) {
                    endServiceEarly(currentInspectedMember.id);
                    setCurrentSubView('none');
                  }
                }}
                className="py-1.5 px-3 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 rounded-lg font-semibold text-xs transition flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>提前解约退出</span>
              </button>
            </div>
          </div>
        )}

        {/* 切换模拟按钮 */}
        <button
          id="btn-simulate-persona"
          onClick={handleSimulateView}
          className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center justify-center gap-2"
        >
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span>以【{currentInspectedMember.name.split(' ')[0]}】的身份体验界面</span>
        </button>
      </div>

      {/* 权限清单矩阵 (Permission Matrix) */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <h4 className="font-bold text-sm text-stone-900">权限配置清单</h4>
          </div>
          <span className="text-[11px] text-stone-500">
            {isAdmin ? '管理员全权生效' : '精细受控'}
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {permissionItems.map((item) => {
            const isGranted = isAdmin || !!currentInspectedMember.permissions[item.key];
            return (
              <div key={item.key} className="py-2.5 flex items-center justify-between">
                <div className="pr-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.2 bg-stone-100 text-stone-600 rounded">
                      {item.category}
                    </span>
                    <span className="font-bold text-xs text-stone-900">{item.title}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">{item.description}</p>
                </div>

                <div className="shrink-0">
                  {isGranted ? (
                    <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200/60">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>已允许</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-rose-600 font-semibold text-xs bg-rose-50 px-2 py-1 rounded-md border border-rose-200/60">
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>已禁止</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
