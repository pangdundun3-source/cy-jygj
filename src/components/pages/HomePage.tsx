import React from 'react';
import { useFamily } from '../../context/FamilyContext';
import {
  Baby,
  HeartPulse,
  CheckSquare,
  Sparkles,
  ChevronRight,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Activity,
  Plus,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  FolderHeart,
  UserCheck,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    activeFamilySpace,
    members,
    babyProfile,
    elderlyProfile,
    memberBaseProfiles,
    stageTasks,
    tasks,
    careFeeds,
    setCurrentSubView,
    setActiveTab,
    currentUserMember,
    navigateToMemberArchive,
    updateTaskStatus,
    showToast,
  } = useFamily();

  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  const latestCareFeed = careFeeds[0];

  // Core family members
  const coreFamilyMembers = members.filter((m) => m.role !== 'temporary_service');
  const isExternalStaff = currentUserMember.role === 'temporary_service';

  // Helper to get quick status for member card
  const getMemberStatusSummary = (memberId: string) => {
    if (memberId === 'm_grandpa') {
      return {
        tag: '慢病照料',
        tagBg: 'bg-rose-50 text-rose-700 border-rose-200',
        detail: `血压 ${elderlyProfile.currentBloodPressure.systolic}/${elderlyProfile.currentBloodPressure.diastolic} · 门诊复诊`,
      };
    }
    if (memberId === 'm_baby') {
      return {
        tag: '幼儿成长',
        tagBg: 'bg-amber-50 text-amber-700 border-amber-200',
        detail: `${babyProfile.ageText} · 身高${babyProfile.heightCm}cm`,
      };
    }
    if (memberId === 'm_brother') {
      return {
        tag: '习惯养成',
        tagBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        detail: '9岁 · 每日习惯打卡与学生手表',
      };
    }
    if (memberId === 'm_dad') {
      return {
        tag: '成员共管',
        tagBg: 'bg-blue-50 text-blue-700 border-blue-200',
        detail: '健康档案健全 · 协助照护',
      };
    }
    return {
      tag: '空间主控',
      tagBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      detail: '主成员控权 · 空间管理员',
    };
  };

  return (
    <div className="pb-8 pt-2 px-4 space-y-4 max-w-md mx-auto animate-fadeIn">
      {/* 1. 顶部空间标识与欢迎卡片 */}
      <div className="bg-gradient-to-br from-emerald-700 via-teal-700 to-emerald-800 text-white rounded-3xl p-4.5 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-xl shadow-inner border border-white/20">
              🏡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-white">
                  {activeFamilySpace.name}
                </h2>
                <span className="px-2 py-0.5 bg-white/20 text-white text-[10px] font-medium rounded-full border border-white/25">
                  数字空间
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/90 mt-0.5">
                {coreFamilyMembers.length}位家人 · 2位协同服务人员
              </p>
            </div>
          </div>

          <button
            id="home-btn-goto-archives"
            onClick={() => {
              setActiveTab('archives');
              setCurrentSubView('none');
            }}
            className="px-3 py-1.5 bg-white/15 hover:bg-white/25 active:scale-95 rounded-xl transition text-xs font-bold text-white flex items-center gap-1 border border-white/25 shadow-xs"
          >
            <FolderHeart className="w-3.5 h-3.5" />
            <span>全家档案</span>
          </button>
        </div>

        {/* 当前操作人与权限身份说明 */}
        <div className="mt-3.5 pt-2.5 border-t border-white/15 flex items-center justify-between text-xs text-emerald-100">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{currentUserMember.avatar}</span>
            <span>
              当前身份：<strong className="text-white">{currentUserMember.name}</strong>
            </span>
          </div>
          <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded-full font-medium border border-white/20">
            {currentUserMember.role === 'owner'
              ? '主成员 (控权)'
              : isExternalStaff
              ? '受限服务人员'
              : '家庭成员 (共管)'}
          </span>
        </div>
      </div>

      {/* 2. 【核心优化】家庭成员档案状态卡片 (1键直达个人档案与阶段任务) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-stone-900 font-bold text-xs tracking-tight">
            <FolderHeart className="w-4 h-4 text-emerald-700" />
            <span>家庭成员健康档案</span>
          </div>
          <button
            onClick={() => {
              setActiveTab('archives');
              setCurrentSubView('none');
            }}
            className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-0.5"
          >
            <span>档案中心</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* 成员健康卡片横向/垂直列表 */}
        <div className="grid grid-cols-1 gap-2">
          {coreFamilyMembers.map((member) => {
            const statusInfo = getMemberStatusSummary(member.id);
            const ongoingTasksCount = stageTasks.filter(
              (t) => t.memberId === member.id && !t.isArchived
            ).length;

            return (
              <div
                key={member.id}
                id={`home-member-card-${member.id}`}
                onClick={() => navigateToMemberArchive(member.id)}
                className="bg-white hover:bg-stone-50/80 active:scale-[0.99] rounded-2xl p-3 border border-stone-200/90 shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${member.avatarBg}`}
                  >
                    {member.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-stone-900 truncate">
                        {member.name}
                      </span>
                      <span className="text-[10px] text-stone-500 font-normal">
                        ({member.relation})
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold border ${statusInfo.tagBg}`}
                      >
                        {statusInfo.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 truncate mt-0.5">
                      {statusInfo.detail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 text-stone-400 group-hover:text-emerald-700 transition">
                  {ongoingTasksCount > 0 && (
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded-md border border-emerald-200">
                      {ongoingTasksCount}项照护
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. 今日待办与照护协作 (轻量快捷打卡) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-stone-900 font-bold text-xs tracking-tight">
            <CheckSquare className="w-4 h-4 text-teal-700" />
            <span>今日家庭待办 ({pendingTasks.length})</span>
          </div>
          <button
            onClick={() => {
              setActiveTab('tasks');
              setCurrentSubView('none');
            }}
            className="text-[11px] text-teal-700 hover:text-teal-800 font-bold flex items-center gap-0.5"
          >
            <span>全部待办</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs divide-y divide-stone-100 overflow-hidden">
          {pendingTasks.slice(0, 3).map((task) => (
            <div
              key={task.id}
              className="p-3 flex items-center justify-between gap-2.5 hover:bg-stone-50/70 transition"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  onClick={() => {
                    updateTaskStatus(task.id, 'completed');
                    showToast(`已完成任务：${task.title}！`, 'success');
                  }}
                  className="w-5 h-5 rounded-md border border-stone-300 hover:border-emerald-600 flex items-center justify-center shrink-0 transition"
                  title="标记为完成"
                >
                  <span className="opacity-0 hover:opacity-100 text-emerald-600 text-xs">✓</span>
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-stone-900 truncate">
                      {task.title}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 text-stone-600">
                      {task.scheduledTime}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 truncate mt-0.5">
                    执行人：{task.assigneeAvatar} {task.assigneeName} ({task.assigneeRole})
                  </p>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  task.status === 'in_progress'
                    ? 'bg-sky-50 text-sky-800 border border-sky-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                {task.status === 'in_progress' ? '进行中' : '待处理'}
              </span>
            </div>
          ))}

          {pendingTasks.length === 0 && (
            <div className="p-4 text-center text-xs text-stone-400">
              🎉 今日所有照护与待办事项均已完成！
            </div>
          )}
        </div>
      </div>

      {/* 4. 最新照料记录留痕 (Service Activity Stream) */}
      {latestCareFeed && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-stone-900 font-bold text-xs tracking-tight">
              <Activity className="w-4 h-4 text-emerald-700" />
              <span>最新服务动态</span>
            </div>
            <button
              onClick={() => {
                setActiveTab('feed');
                setCurrentSubView('none');
              }}
              className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-0.5"
            >
              <span>查看全部</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div
            onClick={() => {
              setActiveTab('feed');
              setCurrentSubView('none');
            }}
            className="bg-white rounded-2xl p-3 border border-stone-200/90 shadow-xs hover:border-emerald-300 transition cursor-pointer text-xs space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{latestCareFeed.authorAvatar}</span>
                <span className="font-bold text-stone-900">{latestCareFeed.authorName}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                  {latestCareFeed.typeLabel}
                </span>
              </div>
              <span className="text-[10px] text-stone-400">{latestCareFeed.time}</span>
            </div>
            <p className="text-stone-700 text-[11px] line-clamp-2 leading-relaxed">
              {latestCareFeed.content}
            </p>
          </div>
        </div>
      )}

      {/* 5. 智能健康助手快速提问 (AI Assistant Banner) */}
      <div
        id="home-ai-assistant-banner"
        onClick={() => {
          setCurrentSubView('ai_assistant');
          showToast('已进入AI家庭管家，随时解答健康、用药与生活照护疑问', 'info');
        }}
        className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 rounded-2xl p-3.5 border border-emerald-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:shadow-md transition active:scale-[0.99]"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-sm shadow-xs">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-stone-900">AI家庭健康管家</span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                已同步健康数据
              </span>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              “爷爷高血压用药注意什么？” · 一键提问
            </p>
          </div>
        </div>
        <div className="w-6 h-6 rounded-full bg-white shadow-xs border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
          <Sparkles className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};
