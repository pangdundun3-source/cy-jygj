import React, { useState } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { FamilyMember } from '../../types';
import {
  ArrowLeft,
  HardDrive,
  Crown,
  Shield,
  FileSpreadsheet,
  ChevronRight,
  HelpCircle,
  Users2,
  FolderLock,
  Lock,
  ShieldCheck,
  Award,
  Clock,
  UserPlus,
  Share2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  HeartPulse,
  Baby,
} from 'lucide-react';

export const FamilySpaceDetailPage: React.FC = () => {
  const {
    activeFamilySpace,
    currentUserMember,
    members,
    setCurrentSubView,
    setSelectedMemberId,
    setCurrentRolePersona,
    setActiveTab,
    showToast,
  } = useFamily();

  const [copiedInvite, setCopiedInvite] = useState(false);

  // 校验当前用户是否为核心家庭成员
  const isFamilyMember = currentUserMember.role === 'owner' || currentUserMember.role === 'member';
  const coreFamilyMembers = members.filter((m) => m.role !== 'temporary_service');
  const tempServiceMembers = members.filter((m) => m.role === 'temporary_service');

  const handleMemberClick = (member: FamilyMember) => {
    if (!isFamilyMember) {
      showToast('家庭档案与权限总控仅限家庭成员操作', 'warning');
      return;
    }

    if (member.id === 'm_brother') {
      // 切换至哥哥视角并返回我的页面查看个人信息
      setCurrentRolePersona('brother');
      setCurrentSubView('none');
      setActiveTab('profile');
      showToast('已切换至【哥哥 (李浩然)】个人信息管理', 'success');
      return;
    }

    if (member.id === 'm_baby') {
      setCurrentSubView('baby_archive');
      showToast('已进入小宝成长档案', 'info');
      return;
    }

    if (member.id === 'm_grandpa') {
      setCurrentSubView('elderly_health');
      showToast('已进入爷爷健康档案', 'info');
      return;
    }

    setSelectedMemberId(member.id);
    setCurrentSubView('member_permission');
  };

  const handleShareFamilyInvite = () => {
    setCopiedInvite(true);
    showToast('已生成【李家空间】家庭成员微信邀请码与专属加入链接！', 'success');
    setTimeout(() => setCopiedInvite(false), 3000);
  };

  return (
    <div className="pb-10 pt-2 px-4 space-y-4 max-w-md mx-auto animate-fadeIn">
      {/* 顶部导航返回栏 */}
      <div className="flex items-center justify-between py-1 border-b border-stone-200/70 pb-3">
        <button
          id="btn-back-to-profile"
          onClick={() => {
            setCurrentSubView('none');
            setActiveTab('profile');
          }}
          className="flex items-center gap-1 text-xs font-bold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-2.5 py-1.5 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回我的</span>
        </button>
        <div className="text-center">
          <h1 className="text-sm font-bold text-stone-900">家庭空间管理</h1>
          <p className="text-[10px] text-stone-500">空间档案 · 成员与权限管控</p>
        </div>
        <div className="w-16 flex justify-end">
          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
            档案详情
          </span>
        </div>
      </div>

      {/* 权限保护拦截：外部服务人员无权操作家庭档案 */}
      {!isFamilyMember ? (
        <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 text-amber-800 font-bold text-sm pb-2 border-b border-stone-100">
            <Lock className="w-4 h-4 text-amber-600" />
            <h3>家庭空间档案（仅家庭成员可操作）</h3>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2.5 text-xs text-stone-600">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <p className="font-semibold text-stone-800 mb-1">
                  当前处于服务人员受限视角
                </p>
                <p>
                  家庭空间档案包含所有家庭成员名册、服务人员聘期与权限管控、家庭健康成长总档案等私密资产。依据空间隔离安全机制，仅核心家庭成员可进入配置。
                </p>
              </div>
            </div>
          </div>

          <button
            id="btn-switch-to-member-for-space"
            onClick={() => {
              setCurrentRolePersona('mom');
              showToast('已切换至【妈妈 (家庭管理员)】视角，已解锁家庭档案完整操作权限', 'success');
            }}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Users2 className="w-4 h-4" />
            <span>切换至家庭成员 (妈妈) 视角体验空间管理</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* A. 空间档案概览横幅 */}
          <div className="bg-gradient-to-br from-emerald-700 via-teal-700 to-emerald-800 text-white rounded-3xl p-5 shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold mb-2 border border-white/30">
                  <FileText className="w-3 h-3 text-emerald-200" />
                  <span>家庭数字空间 · 档案资产总控</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white">
                  {activeFamilySpace.name}
                </h3>
                <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
                  “家庭不是单一账号，是一个安全可控的数字协作档案库”
                </p>
              </div>
              <span className="text-3xl p-2 bg-white/15 rounded-2xl border border-white/20">
                🏡
              </span>
            </div>

            {/* 档案容量与统计 */}
            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-emerald-100">
                <HardDrive className="w-3.5 h-3.5 text-emerald-200" />
                <span>
                  档案空间：
                  <strong className="text-white font-medium">
                    {activeFamilySpace.storageUsedMB}MB / {activeFamilySpace.storageTotalMB}MB
                  </strong>
                </span>
              </div>
              <span className="text-[11px] text-emerald-200 bg-white/10 px-2 py-0.5 rounded-md">
                核心成员 {coreFamilyMembers.length}人 · 服务人员 {tempServiceMembers.length}人
              </span>
            </div>
          </div>

          {/* B. 快速档案操作按钮组 */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              id="btn-space-invite-service"
              onClick={() => {
                if (currentUserMember.role === 'owner') {
                  setCurrentSubView('invite_service');
                } else {
                  showToast('仅家庭管理员可发起外部服务人员邀请流程', 'info');
                }
              }}
              className="flex items-center justify-between p-3.5 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl shadow-xs hover:from-emerald-700 hover:to-teal-800 transition active:scale-[0.98]"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-base">
                  ⭐
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold block">聘请/邀请阿姨</span>
                  <span className="text-[10px] text-emerald-100 block">育儿嫂 / 陪诊员</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-200" />
            </button>

            <button
              id="btn-space-share-invite"
              onClick={handleShareFamilyInvite}
              className="flex items-center justify-between p-3.5 bg-white border border-stone-200/90 text-stone-800 rounded-2xl shadow-xs hover:bg-stone-50 transition active:scale-[0.98]"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-base">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold block">邀请家人入驻</span>
                  <span className="text-[10px] text-stone-500 block">生成专属家庭码</span>
                </div>
              </div>
              <Share2 className="w-4 h-4 text-stone-400" />
            </button>
          </div>

          {copiedInvite && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>已生成家庭邀请链接与专属暗号，配偶或长辈点击即可一键同步入驻！</span>
            </div>
          )}

          {/* C. 核心家庭成员档案 (Core Family Members) */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Users2 className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-sm text-stone-900">核心家庭成员档案</h3>
              </div>
              <span className="text-xs text-stone-500 font-medium">
                共 {coreFamilyMembers.length} 人 (档案共管)
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
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-2xs ${member.avatarBg}`}
                    >
                      {member.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-stone-900">{member.name}</h4>
                        {member.role === 'owner' && (
                          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md flex items-center gap-0.5">
                            <Award className="w-2.5 h-2.5" /> 管理员
                          </span>
                        )}
                        {member.id === 'm_brother' && (
                          <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded-md flex items-center gap-0.5">
                            自主维护
                          </span>
                        )}
                        {member.id === 'm_baby' && (
                          <span className="px-1.5 py-0.5 bg-pink-100 text-pink-800 text-[10px] font-bold rounded-md flex items-center gap-0.5">
                            成长档案
                          </span>
                        )}
                        {member.id === 'm_grandpa' && (
                          <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded-md flex items-center gap-0.5">
                            健康档案
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
                      {member.id === 'm_brother'
                        ? '个人信息管理'
                        : member.id === 'm_baby'
                        ? '查看成长记录'
                        : member.id === 'm_grandpa'
                        ? '查看健康监控'
                        : member.role === 'owner'
                        ? '空间管理员'
                        : '成员档案'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-700 transition" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* D. 临时服务人员档案 (权限隔离亮点) */}
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
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-2xs ${member.avatarBg}`}
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
                      <span className="text-[10px] text-stone-400">点击调整</span>
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
                外部服务人员仅能查看和操作其被授权的业务卡片（如育儿嫂仅看宝宝记录，陪诊员仅上传老人就医报告）。服务到期后自动注销访问，全部历史档案永存于家庭空间。
              </p>
            </div>
          </div>

          {/* E. 空间存储容量与会员权益 */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-stone-800">
                <Crown className="w-4 h-4 text-amber-500" />
                <span>家庭档案存储与权益</span>
              </div>
              <span className="text-[11px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">
                免费版 (可升级VIP)
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-stone-500">
                <span>云端档案使用情况</span>
                <span>
                  {activeFamilySpace.storageUsedMB}MB / {activeFamilySpace.storageTotalMB}MB (34%)
                </span>
              </div>
              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                <div className="w-[34%] h-full bg-emerald-600 rounded-full" />
              </div>
            </div>

            <div className="text-[11px] text-stone-500 leading-relaxed pt-0.5">
              • 免费版：支持1个家庭、6位常驻成员、1GB永久归档
              <br />
              • 家庭VIP：无限成员、100GB专属云盘、AI综合成长与健康跨期趋势报告
            </div>
          </div>

          {/* F. 档案工具与安全管理列表 */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs divide-y divide-stone-100 text-xs">
            <div
              id="btn-member-permissions-overview"
              onClick={() => {
                if (isFamilyMember) {
                  setCurrentSubView('member_permission');
                } else {
                  showToast('仅家庭成员可查看与调整成员权限总览', 'warning');
                }
              }}
              className="p-3.5 flex items-center justify-between hover:bg-stone-50 transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-emerald-700" />
                <span className="font-semibold text-stone-800">家庭成员与权限总览</span>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </div>

            <div
              id="btn-export-family-archive"
              onClick={() => {
                if (isFamilyMember) {
                  showToast('已生成家庭数字档案全套数据包 (加密PDF/Excel)', 'success');
                } else {
                  showToast('受限服务人员无权导出家庭档案', 'warning');
                }
              }}
              className="p-3.5 flex items-center justify-between hover:bg-stone-50 transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4 text-sky-700" />
                <span className="font-semibold text-stone-800">家庭数字档案一键导出备份</span>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </div>

            <div
              onClick={() => {
                showToast('《家有管家》V1.0 · 一个家庭数字空间，让家人共同管理孩子成长、老人健康和家庭事务', 'info');
              }}
              className="p-3.5 flex items-center justify-between hover:bg-stone-50 transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-amber-700" />
                <span className="font-semibold text-stone-800">关于《家有管家》数字空间</span>
              </div>
              <span className="text-stone-400 text-[11px]">V1.0</span>
            </div>
          </div>

          {/* G. 空间隔离保证安全承诺 */}
          <div className="p-3.5 bg-stone-100/90 rounded-2xl text-[11px] text-stone-600 flex items-start gap-2 border border-stone-200/80">
            <FolderLock className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>数据主权与隐私保障：</strong>
              家庭空间采用端到端角色访问控制（RBAC）。育儿嫂与陪诊人员仅能在服务周期内查看指定业务板块，无权查看家庭其他档案；到期权限自动失效，档案永久沉淀归属于家庭所有。
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
