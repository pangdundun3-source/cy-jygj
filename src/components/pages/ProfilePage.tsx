import React, { useState } from 'react';
import { useFamily } from '../../context/FamilyContext';
import {
  User,
  HardDrive,
  Shield,
  FileSpreadsheet,
  ChevronRight,
  HelpCircle,
  FolderLock,
  Lock,
  BadgeCheck,
  Edit3,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Watch,
  Award,
  FolderArchive,
  Archive,
  Plus,
  RotateCcw,
  Calendar,
  FolderPlus,
  Tag,
  Activity,
  Stethoscope,
  Heart,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const {
    activeFamilySpace,
    currentUserMember,
    members,
    memberBaseProfiles,
    stageTasks,
    setCurrentSubView,
    setCurrentRolePersona,
    familyArchives,
    toggleArchiveStatus,
    showToast,
  } = useFamily();

  const [quickMemberFilter, setQuickMemberFilter] = useState<string>('all');

  // 校验当前用户是否为核心家庭成员
  const isFamilyMember = currentUserMember.role === 'owner' || currentUserMember.role === 'member';
  const isBrother = currentUserMember.id === 'm_brother';
  const coreFamilyMembers = members.filter((m) => m.role !== 'temporary_service');
  const tempServiceMembers = members.filter((m) => m.role === 'temporary_service');

  return (
    <div className="pb-10 pt-2 px-4 space-y-4 max-w-md mx-auto animate-fadeIn">
      {/* 1. 【核心优化】顶部头像卡片 —— 作为个人信息详情的专属入口 */}
      <div
        id="card-top-personal-profile-entry"
        onClick={() => {
          setCurrentSubView('personal_profile_detail');
        }}
        className="bg-white hover:bg-stone-50/80 rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-3.5 cursor-pointer transition active:scale-[0.99] group relative"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            {/* 头像带有编辑微标 */}
            <div className="relative">
              <div
                className={`w-15 h-15 rounded-2xl flex items-center justify-center text-3xl shadow-xs shrink-0 ${currentUserMember.avatarBg}`}
              >
                {currentUserMember.avatar}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xs border border-white">
                <Edit3 className="w-2.5 h-2.5" />
              </div>
            </div>

            {/* 个人身份信息 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-stone-900 group-hover:text-emerald-700 transition truncate">
                  {currentUserMember.name}
                </h2>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                    currentUserMember.role === 'owner'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : isBrother
                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      : currentUserMember.role === 'member'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {currentUserMember.roleLabel}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5 truncate">
                <span>{currentUserMember.relation || '家庭成员'}</span>
                <span className="text-stone-300">·</span>
                <span className="text-emerald-700 font-medium">
                  {isFamilyMember ? '实名已认证' : '服务人员权限受限'}
                </span>
              </p>
            </div>
          </div>

          {/* 右侧进入详情指引 */}
          <div className="flex items-center gap-1 text-xs font-semibold text-stone-500 group-hover:text-emerald-700 transition">
            <span className="hidden sm:inline">个人详情</span>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition" />
          </div>
        </div>

        {/* 底部醒目提示栏：引导用户点击查看详情页 */}
        <div
          className={`p-2.5 rounded-xl text-xs flex items-center justify-between ${
            isBrother
              ? 'bg-indigo-50 text-indigo-800 border border-indigo-200/70'
              : isFamilyMember
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/70'
              : 'bg-amber-50 text-amber-800 border border-amber-200/70'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            {isBrother ? (
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            ) : isFamilyMember ? (
              <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span className="text-[11px] truncate">
              {isBrother
                ? '点击卡片进入【个人信息详情页】，维护昵称、特长及打卡'
                : isFamilyMember
                ? '点击卡片进入【个人信息详情页】，查看与编辑详细资料'
                : '服务人员视角：点击查看个人工作证与授权卡片'}
            </span>
          </div>

          <span className="text-[10px] font-bold underline shrink-0 ml-1">
            编辑资料
          </span>
        </div>
      </div>

      {/* 2. 家庭空间管理专属入口卡片 (点击进入家庭空间详情界面) */}
      <div
        id="card-family-space-management-entry"
        onClick={() => {
          if (!isFamilyMember) {
            showToast('家庭空间管理属于私密档案，仅家庭成员可进入操作', 'warning');
            return;
          }
          setCurrentSubView('family_space_detail');
        }}
        className="bg-gradient-to-br from-emerald-800 via-teal-800 to-emerald-900 text-white rounded-3xl p-5 shadow-sm relative overflow-hidden cursor-pointer hover:shadow-md transition active:scale-[0.99] group border border-emerald-700/60"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold mb-2 border border-white/30 backdrop-blur-xs">
              <FolderLock className="w-3.5 h-3.5 text-emerald-200" />
              <span>家庭空间档案 · 详情管理</span>
            </div>
            <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
              <span>{activeFamilySpace.name}</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </h3>
            <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
              共 {coreFamilyMembers.length} 位核心成员 · {tempServiceMembers.length} 位外部受限服务人员
            </p>
          </div>
          <span className="text-3xl p-2 bg-white/15 rounded-2xl border border-white/20">
            🏡
          </span>
        </div>

        {/* 空间档案指标与跳转引导 */}
        <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-emerald-100">
            <HardDrive className="w-3.5 h-3.5 text-emerald-200" />
            <span>
              档案存储：{activeFamilySpace.storageUsedMB}MB / {activeFamilySpace.storageTotalMB}MB
            </span>
          </div>
          <span className="text-[11px] font-bold text-white bg-white/20 group-hover:bg-white/30 px-3 py-1 rounded-xl transition flex items-center gap-1 border border-white/20">
            <span>进入空间详情</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* 3. 【核心入口】家庭全员基础档案与阶段任务管理中心 */}
      <div
        id="card-family-archives-manager-entry"
        className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-3.5"
      >
        <div className="flex items-start justify-between pb-2 border-b border-stone-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold mb-1 border border-emerald-200/60">
              <FolderArchive className="w-3 h-3 text-emerald-600" />
              <span>家庭档案与阶段任务 · 全家共管与主成员控权</span>
            </div>
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <span>家庭成员基础档案与阶段任务</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
              全员基础档案共管 · 主成员控外来开放权限 · 阶段就医陪诊/慢病任务及完成归档
            </p>
          </div>

          <button
            id="btn-goto-archives-manager"
            onClick={() => {
              if (!isFamilyMember) {
                showToast('受限服务人员无权查阅或管理家庭私密档案', 'warning');
                return;
              }
              setCurrentSubView('family_archives_manage');
            }}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 shrink-0 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-xl transition border border-emerald-200/60"
          >
            <span>进入档案中心</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 档案与任务关键指标概览 */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div
            onClick={() => {
              if (isFamilyMember) setCurrentSubView('family_archives_manage');
            }}
            className="p-2.5 bg-stone-50 hover:bg-stone-100 rounded-2xl border border-stone-200/70 transition cursor-pointer"
          >
            <span className="text-[10px] text-stone-500 block leading-tight">成员基础档案</span>
            <span className="text-xs font-bold text-stone-900 leading-tight">{memberBaseProfiles.length} 人 · 全家</span>
          </div>

          <div
            onClick={() => {
              if (isFamilyMember) setCurrentSubView('family_archives_manage');
            }}
            className="p-2.5 bg-emerald-50/70 hover:bg-emerald-100/80 rounded-2xl border border-emerald-100 transition cursor-pointer"
          >
            <span className="text-[10px] text-emerald-700 block leading-tight">进行中阶段任务</span>
            <span className="text-xs font-bold text-emerald-800 leading-tight">
              {stageTasks.filter((t) => !t.isArchived).length} 项
              <span className="block text-[10px] font-semibold">陪诊 / 慢病</span>
            </span>
          </div>

          <div
            onClick={() => {
              if (isFamilyMember) setCurrentSubView('family_archives_manage');
            }}
            className="p-2.5 bg-amber-50/70 hover:bg-amber-100/80 rounded-2xl border border-amber-100 transition cursor-pointer"
          >
            <span className="text-[10px] text-amber-700 block leading-tight">已归档历史任务</span>
            <span className="text-xs font-bold text-amber-800 leading-tight">
              {stageTasks.filter((t) => t.isArchived).length} 项结案
            </span>
          </div>
        </div>

        {/* 阶段任务快捷条目展示 */}
        <div className="p-3 bg-gradient-to-r from-stone-50 to-emerald-50/50 rounded-2xl border border-stone-200/80 space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold text-[11px] text-stone-700">
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span>当前重点照料阶段任务：</span>
            </span>
            <span
              onClick={() => {
                if (isFamilyMember) setCurrentSubView('family_archives_manage');
              }}
              className="text-emerald-700 hover:text-emerald-800 cursor-pointer flex items-center gap-0.5 text-[10px]"
            >
              <span>查看全部任务与打卡</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>

          <div className="space-y-1.5">
            {stageTasks.filter((t) => !t.isArchived).slice(0, 2).map((task) => (
              <div
                key={task.id}
                onClick={() => {
                  if (isFamilyMember) setCurrentSubView('family_archives_manage');
                }}
                className="p-2 bg-white rounded-xl border border-stone-200/80 flex items-center justify-between cursor-pointer hover:border-emerald-300 transition"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-xs">{task.memberAvatar}</span>
                  <span className="font-bold text-stone-900 truncate">
                    【{task.memberName}】{task.title}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                    {task.taskTypeLabel}
                  </span>
                </div>
                <span className="text-[10px] text-stone-400 shrink-0 ml-2">
                  {task.records.length} 条服务留痕
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 快捷家庭成员标签筛选 */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] text-stone-500">
            <span className="font-semibold text-stone-700">按成员查看档案：</span>
            <span>共 {coreFamilyMembers.length} 位家人档案</span>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => setQuickMemberFilter('all')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                quickMemberFilter === 'all'
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              全部 ({familyArchives.length})
            </button>

            {coreFamilyMembers.map((member) => {
              const count = familyArchives.filter((a) => a.memberId === member.id).length;
              return (
                <button
                  key={member.id}
                  onClick={() => setQuickMemberFilter(member.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1 border ${
                    quickMemberFilter === member.id
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <span>{member.avatar}</span>
                  <span>{member.name}</span>
                  <span className="text-[10px] opacity-80">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 档案快捷展示卡片列表（前2-3项） */}
        <div className="space-y-2 pt-1">
          {familyArchives
            .filter((arc) => (quickMemberFilter === 'all' ? true : arc.memberId === quickMemberFilter))
            .slice(0, 3)
            .map((archive) => (
              <div
                key={archive.id}
                className={`p-3 rounded-2xl border transition text-xs space-y-2 ${
                  archive.isArchived
                    ? 'bg-stone-50/70 border-stone-200/80'
                    : 'bg-white border-stone-200 hover:border-emerald-400'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-stone-100 flex items-center justify-center text-sm shrink-0">
                      {archive.memberAvatar}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-stone-900 text-xs">
                          {archive.memberName}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 text-stone-600">
                          {archive.categoryLabel}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-2.5 h-2.5" />
                        <span>{archive.date}</span>
                      </span>
                    </div>
                  </div>

                  {/* 状态标识与直接归档操作按钮 */}
                  <div className="flex items-center gap-1.5">
                    {archive.isArchived ? (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-stone-200 text-stone-700">
                        <Archive className="w-2.5 h-2.5 text-stone-500" />
                        <span>已归档</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        <span>活跃</span>
                      </span>
                    )}

                    {/* 快捷归档/恢复切换 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isFamilyMember) {
                          showToast('受限服务人员无权修改归档状态', 'warning');
                          return;
                        }
                        toggleArchiveStatus(archive.id);
                      }}
                      className={`p-1 px-2 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                        archive.isArchived
                          ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
                      }`}
                      title={archive.isArchived ? '点击恢复为活跃' : '点击设置归档'}
                    >
                      {archive.isArchived ? (
                        <>
                          <RotateCcw className="w-2.5 h-2.5 text-emerald-700" />
                          <span>解档</span>
                        </>
                      ) : (
                        <>
                          <Archive className="w-2.5 h-2.5 text-stone-500" />
                          <span>归档</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <p className="font-bold text-stone-800 line-clamp-1">
                  {archive.title}
                </p>
                <p className="text-stone-500 text-[11px] line-clamp-1">
                  {archive.description}
                </p>
              </div>
            ))}
        </div>

        {/* 底部操作行：新建档案 与 查看全部 */}
        <div className="pt-2 border-t border-stone-100 flex gap-2">
          <button
            id="btn-quick-create-archive"
            onClick={() => {
              if (!isFamilyMember) {
                showToast('受限服务人员无权为家庭成员新建档案', 'warning');
                return;
              }
              setCurrentSubView('family_archives_manage');
            }}
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            <FolderPlus className="w-4 h-4" />
            <span>+ 为家庭成员新建档案</span>
          </button>

          <button
            id="btn-view-all-family-archives"
            onClick={() => {
              if (!isFamilyMember) {
                showToast('受限服务人员无权查阅家庭私密档案', 'warning');
                return;
              }
              setCurrentSubView('family_archives_manage');
            }}
            className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 active:scale-[0.99] text-stone-700 rounded-xl text-xs font-bold transition flex items-center gap-1"
          >
            <span>全部档案 ({familyArchives.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. 个人状态与快捷联动卡片 */}
      {isBrother ? (
        /* 哥哥个人进度概览卡片 */
        <div
          id="card-brother-quick-summary"
          onClick={() => setCurrentSubView('personal_profile_detail')}
          className="bg-white rounded-3xl p-5 border border-indigo-200/80 shadow-xs space-y-3 cursor-pointer hover:bg-indigo-50/30 transition group"
        >
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>哥哥今日好习惯与个人设备</span>
            </div>
            <span className="text-xs text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-md flex items-center gap-1">
              <span>进入详情打卡</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-1">
              <div className="flex items-center gap-1.5 text-indigo-800 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>好习惯进度</span>
              </div>
              <p className="text-stone-600 text-[11px]">
                今日已完成 2/4 项，累计获 10 颗成长星
              </p>
            </div>

            <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100 space-y-1">
              <div className="flex items-center gap-1.5 text-indigo-800 font-semibold">
                <Watch className="w-3.5 h-3.5 text-indigo-600" />
                <span>智能电话手表</span>
              </div>
              <p className="text-stone-600 text-[11px]">
                小天才 Z9 · 在线 · 电量 88%
              </p>
            </div>
          </div>
        </div>
      ) : isFamilyMember ? (
        /* 成人家庭成员视角：哥哥个人档案体验入口 */
        <div className="bg-gradient-to-br from-indigo-50 to-sky-50 rounded-3xl p-5 border border-indigo-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl shadow-2xs shrink-0">
              👦
            </div>
            <div>
              <h4 className="text-sm font-bold text-indigo-950">
                查看【哥哥 (李浩然)】专属个人档案
              </h4>
              <p className="text-xs text-indigo-700 mt-0.5">
                长子9岁自主维护昵称、兴趣特长、学生电话手表及每日习惯打卡
              </p>
            </div>
          </div>

          <button
            id="btn-switch-to-brother-view"
            onClick={() => {
              setCurrentRolePersona('brother');
              setCurrentSubView('personal_profile_detail');
              showToast('已切换至【哥哥 (李浩然)】个人信息详情页', 'success');
            }}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            <User className="w-4 h-4" />
            <span>进入哥哥视角并打开个人信息详情</span>
          </button>
        </div>
      ) : (
        /* 服务人员期限信息 */
        <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100 text-amber-800">
            <Clock className="w-4 h-4 text-amber-600" />
            <h4 className="font-bold text-sm">服务人员授权信息</h4>
          </div>
          <div className="space-y-2 text-xs text-stone-600">
            <div className="flex justify-between py-1 border-b border-stone-50">
              <span className="text-stone-400">服务岗位</span>
              <span className="font-semibold text-stone-800">{currentUserMember.serviceTitle || '服务人员'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-50">
              <span className="text-stone-400">服务期限</span>
              <span className="font-semibold text-amber-700">剩余 {currentUserMember.daysRemaining || 15} 天</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. 账号与通用工具列表 */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs divide-y divide-stone-100 text-xs">
        <div
          id="btn-open-member-permissions"
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
          id="btn-export-archive-from-profile"
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
            <span className="font-semibold text-stone-800">关于《家有管家》</span>
          </div>
          <span className="text-stone-400 text-[11px]">V1.0 Demo</span>
        </div>
      </div>
    </div>
  );
};
