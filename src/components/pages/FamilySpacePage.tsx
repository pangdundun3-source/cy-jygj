import React from 'react';
import { useFamily } from '../../context/FamilyContext';
import { FamilyMember } from '../../types';
import {
  Users2,
  ShieldCheck,
  UserPlus,
  Clock,
  Sparkles,
  ChevronRight,
  HardDrive,
  CheckCircle2,
  Lock,
  Plus,
  Award,
} from 'lucide-react';

export const FamilySpacePage: React.FC = () => {
  const {
    activeFamilySpace,
    members,
    setCurrentSubView,
    setSelectedMemberId,
    currentUserMember,
    showToast,
  } = useFamily();

  const coreFamilyMembers = members.filter((m) => m.role !== 'temporary_service');
  const tempServiceMembers = members.filter((m) => m.role === 'temporary_service');

  const handleMemberClick = (member: FamilyMember) => {
    setSelectedMemberId(member.id);
    setCurrentSubView('member_permission');
  };

  return (
    <div className="pb-6 pt-2 px-4 space-y-4 max-w-md mx-auto animate-fadeIn">
      {/* 空间核心理念介绍横幅 */}
      <div className="bg-gradient-to-br from-emerald-700 via-teal-700 to-emerald-800 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold mb-2 border border-white/30">
              <Sparkles className="w-3 h-3 text-emerald-200" />
              <span>核心创新架构</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              {activeFamilySpace.name}
            </h2>
            <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
              “家庭不是单一账号，是一个安全可控的数字协作空间。”
            </p>
          </div>
          <span className="text-3xl p-2 bg-white/15 rounded-2xl border border-white/20">
            🏡
          </span>
        </div>

        {/* 空间容量与权限状态 */}
        <div className="mt-4 pt-3.5 border-t border-white/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <HardDrive className="w-3.5 h-3.5 text-emerald-200" />
            <span className="text-emerald-100">
              空间存储：
              <strong className="text-white font-medium">
                {activeFamilySpace.storageUsedMB}MB / {activeFamilySpace.storageTotalMB}MB
              </strong>
            </span>
          </div>
          <button
            onClick={() => showToast('免费版支持5位常驻成员+1GB永久空间，家庭会员享100GB与AI深度报告', 'info')}
            className="text-emerald-400 font-semibold hover:underline text-[11px]"
          >
            空间扩容 &gt;
          </button>
        </div>
      </div>

      {/* 快速操作按钮组 */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          id="btn-invite-service-provider"
          onClick={() => {
            if (currentUserMember.role === 'owner') {
              setCurrentSubView('invite_service');
            } else {
              showToast('仅管理员可发起外部服务人员邀请', 'info');
            }
          }}
          className="flex items-center justify-between p-3.5 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl shadow-sm hover:from-emerald-700 hover:to-teal-800 transition active:scale-[0.98]"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-base">
              ⭐
            </div>
            <div className="text-left">
              <div className="font-bold text-xs">邀请服务人员</div>
              <div className="text-[10px] text-emerald-100/90">育儿嫂/陪诊/保洁</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-emerald-200" />
        </button>

        <button
          id="btn-invite-family-member"
          onClick={() => setCurrentSubView('invite_service')}
          className="flex items-center justify-between p-3.5 bg-white border border-stone-200 rounded-2xl text-stone-800 shadow-xs hover:border-stone-300 transition active:scale-[0.98]"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-base text-stone-700">
              👨‍👩‍👧
            </div>
            <div className="text-left">
              <div className="font-bold text-xs">邀请家庭成员</div>
              <div className="text-[10px] text-stone-500">微信分享加入</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>
      </div>

      {/* 1. 核心家庭成员 (Core Family Members) */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Users2 className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-sm text-stone-900">核心家庭成员</h3>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            共 {coreFamilyMembers.length} 人
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {coreFamilyMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => handleMemberClick(member)}
              className="py-3 flex items-center justify-between hover:bg-stone-50/80 rounded-xl px-2 -mx-2 transition cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-xs ${member.avatarBg}`}
                >
                  {member.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-stone-900">{member.name}</h4>
                    {member.role === 'owner' && (
                      <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md flex items-center gap-0.5">
                        <Award className="w-2.5 h-2.5" /> 管理员
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {member.relation || member.roleLabel}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                  {member.role === 'owner' ? '全部权限' : '成员档案'}
                </span>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-700 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 临时服务人员 (Temporary Service Personnel - 核心亮点) */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <h3 className="font-bold text-sm text-stone-900">临时服务人员 (权限隔离)</h3>
          </div>
          <span className="text-xs text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-md">
            有期限 · 限权限
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {tempServiceMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => handleMemberClick(member)}
              className="py-3 flex items-center justify-between hover:bg-stone-50/80 rounded-xl px-2 -mx-2 transition cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-xs ${member.avatarBg}`}
                >
                  {member.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-stone-900">{member.name}</h4>
                    <span className="px-1.5 py-0.5 bg-teal-100 text-teal-800 text-[10px] font-semibold rounded">
                      {member.serviceTitle || '服务人员'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>剩余有效：</span>
                    <strong className="text-amber-700 font-semibold">
                      {member.daysRemaining || 15} 天
                    </strong>
                    <span className="text-stone-400 text-[10px]">
                      ({member.startDate?.slice(5)} - {member.endDate?.slice(5)})
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-[10px] block font-semibold text-emerald-700">
                    权限受限
                  </span>
                  <span className="text-[10px] text-stone-400">点击查看</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-teal-700 transition" />
              </div>
            </div>
          ))}
        </div>

        {/* 权限说明提示 */}
        <div className="bg-teal-50/70 border border-teal-200/70 rounded-xl p-3 text-xs text-teal-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <Lock className="w-3.5 h-3.5 text-teal-700" />
            <span>服务人员隔离机制</span>
          </div>
          <p className="text-stone-600 text-[11px] leading-relaxed">
            服务人员仅可访问您明确勾选的模块（如宝宝成长、陪诊记录），服务期结束后将自动退出空间，所有服务档案永久保存在家庭中。
          </p>
        </div>
      </div>
    </div>
  );
};
