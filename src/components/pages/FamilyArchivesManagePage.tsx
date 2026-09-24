import React, { useState, useMemo, useEffect } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { ArchiveCategory, ProfileStageTask } from '../../types';
import { EditBaseProfileModal } from './archives/EditBaseProfileModal';
import { CreateStageTaskModal } from './archives/CreateStageTaskModal';
import { AddServiceRecordModal } from './archives/AddServiceRecordModal';
import { ArchiveTaskModal } from './archives/ArchiveTaskModal';
import { OwnerPermissionModal } from './archives/OwnerPermissionModal';
import {
  ArrowLeft,
  FolderArchive,
  Plus,
  Search,
  CheckCircle2,
  Archive,
  RotateCcw,
  ShieldCheck,
  Clock,
  Edit3,
  X,
  Heart,
  Activity,
  AlertCircle,
  FolderHeart,
} from 'lucide-react';

const CATEGORY_MAP: Record<ArchiveCategory, { label: string; color: string; bg: string }> = {
  health_medical: { label: '医疗健康', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
  growth_education: { label: '成长学业', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
  identity_cert: { label: '证件契约', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  insurance_finance: { label: '保险财务', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  life_memory: { label: '生活备忘', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  custom: { label: '自定义', color: 'text-stone-700', bg: 'bg-stone-50 border-stone-200' },
};

export const FamilyArchivesManagePage: React.FC = () => {
  const {
    currentUserMember,
    currentRolePersona,
    setCurrentRolePersona,
    members,
    memberBaseProfiles,
    stageTasks,
    updateMemberBaseProfile,
    updateMemberServicePermissions,
    createStageTask,
    addStageTaskServiceRecord,
    archiveStageTask,
    unarchiveStageTask,
    familyArchives,
    createFamilyArchive,
    toggleArchiveStatus,
    setCurrentSubView,
    setActiveTab,
    currentSubView,
    selectedMemberId: ctxMemberId,
    setSelectedMemberId: setCtxMemberId,
    showToast,
  } = useFamily();

  const [activeMainTab, setActiveMainTab] = useState<'stage_tasks' | 'document_archives'>('stage_tasks');
  const [selectedMemberId, setSelectedMemberIdLocal] = useState<string>(ctxMemberId || 'm_grandpa');
  const [stageTaskFilter, setStageTaskFilter] = useState<'active' | 'archived'>('active');

  const [isEditBaseProfileOpen, setIsEditBaseProfileOpen] = useState(false);
  const [isOwnerPermModalOpen, setIsOwnerPermModalOpen] = useState(false);
  const [isCreateStageTaskOpen, setIsCreateStageTaskOpen] = useState(false);
  const [activeRecordTask, setActiveRecordTask] = useState<ProfileStageTask | null>(null);
  const [activeArchiveTask, setActiveArchiveTask] = useState<ProfileStageTask | null>(null);

  const isOwner = currentUserMember.role === 'owner';
  const isFamilyMember = currentUserMember.role === 'owner' || currentUserMember.role === 'member';
  const isExternalStaff = currentUserMember.role === 'temporary_service';
  const showBackButton = currentSubView === 'family_archives_manage';

  useEffect(() => {
    if (ctxMemberId) {
      setSelectedMemberIdLocal(ctxMemberId);
    }
  }, [ctxMemberId]);

  const setSelectedMemberId = (id: string) => {
    setSelectedMemberIdLocal(id);
    setCtxMemberId(id);
  };

  const currentBaseProfile = useMemo(() => {
    return (
      memberBaseProfiles.find((p) => p.memberId === selectedMemberId) ||
      memberBaseProfiles[0]
    );
  }, [memberBaseProfiles, selectedMemberId]);

  const memberTasks = useMemo(
    () => stageTasks.filter((t) => t.memberId === selectedMemberId),
    [stageTasks, selectedMemberId]
  );
  const activeStageTasks = useMemo(() => memberTasks.filter((t) => !t.isArchived), [memberTasks]);
  const archivedStageTasks = useMemo(() => memberTasks.filter((t) => t.isArchived), [memberTasks]);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [isCreateDocModalOpen, setIsCreateDocModalOpen] = useState(false);
  const [formMemberId, setFormMemberId] = useState<string>('m_brother');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<ArchiveCategory>('growth_education');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formDescription, setFormDescription] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formImportance, setFormImportance] = useState<'normal' | 'important' | 'top_secret'>('normal');

  const filteredDocArchives = useMemo(() => {
    return familyArchives.filter((arc) => {
      if (selectedMemberFilter !== 'all' && arc.memberId !== selectedMemberFilter) return false;
      if (statusFilter === 'active' && arc.isArchived) return false;
      if (statusFilter === 'archived' && !arc.isArchived) return false;
      if (searchKeyword.trim()) {
        const query = searchKeyword.toLowerCase();
        const matchTitle = arc.title.toLowerCase().includes(query);
        const matchDesc = arc.description.toLowerCase().includes(query);
        const matchMember = arc.memberName.toLowerCase().includes(query);
        const matchTags = arc.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchTitle && !matchDesc && !matchMember && !matchTags) return false;
      }
      return true;
    });
  }, [familyArchives, selectedMemberFilter, statusFilter, searchKeyword]);

  const handleSwitchPersona = (role: 'mom' | 'dad' | 'brother' | 'nanny_wang' | 'escort_zhang') => {
    setCurrentRolePersona(role);
    const roleLabels: Record<string, string> = {
      mom: '妈妈 李婷 (主成员)',
      dad: '爸爸 李建国 (家庭成员)',
      brother: '哥哥 李浩然 (家庭成员)',
      nanny_wang: '王阿姨 (育儿嫂)',
      escort_zhang: '张阿姨 (陪诊员)',
    };
    showToast(`已切换身份至：${roleLabels[role]}`, 'info');
  };

  const roleBadge = isOwner
    ? { text: '主成员控权', cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' }
    : isExternalStaff
    ? { text: '服务人员', cls: 'bg-sky-100 text-sky-800 border-sky-200' }
    : { text: '家庭共管', cls: 'bg-stone-100 text-stone-700 border-stone-200' };

  const renderTaskCard = (task: ProfileStageTask, archived: boolean) => (
    <div
      key={task.id}
      className={`rounded-2xl p-3.5 border space-y-3 ${
        archived
          ? 'bg-stone-50/80 border-stone-200 opacity-95'
          : 'bg-white border-stone-200/90 shadow-xs'
      }`}
    >
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {archived ? (
            <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 text-[10px] font-bold flex items-center gap-1">
              <Archive className="w-3 h-3" />
              已归档
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
              {task.taskTypeLabel}
            </span>
          )}
          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[10px] font-bold border border-blue-200">
            {task.stageName}
          </span>
          {!archived && task.priority === 'urgent' && (
            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
              紧迫
            </span>
          )}
        </div>
        <h4 className="text-sm font-bold text-stone-900 leading-snug">{task.title}</h4>
        <p className="text-[11px] text-stone-500 leading-relaxed">
          {archived
            ? `归档 ${task.archivedAt} · ${task.archivedBy} · ${task.records.length} 条记录`
            : `指派 ${task.assigneeName} · ${task.startDate} 起`}
        </p>
      </div>

      {!archived && task.goal && (
        <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/70 text-[11px] text-stone-700">
          <span className="font-bold text-emerald-800">目标：</span>
          {task.goal}
        </div>
      )}

      {archived && task.archivedReason && (
        <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200/70 text-[11px] text-emerald-950">
          <div className="font-bold flex items-center gap-1 mb-0.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            结案原因
          </div>
          <p className="leading-relaxed">{task.archivedReason}</p>
        </div>
      )}

      {/* 操作记录 */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold text-stone-600 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-stone-400" />
          操作记录 ({task.records.length})
        </div>
        {task.records.length === 0 ? (
          <div className="p-2.5 text-center bg-stone-50 rounded-xl border border-dashed border-stone-200 text-[11px] text-stone-400">
            暂无记录，可提交就医或体征打卡
          </div>
        ) : (
          <div className="space-y-2">
            {(archived ? task.records.slice(0, 3) : task.records).map((rec) => (
              <div
                key={rec.id}
                className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/80 text-[11px] space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span>{rec.operatorAvatar}</span>
                    <span className="font-bold text-stone-900 truncate">{rec.operatorName}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold shrink-0">
                      {rec.actionTypeLabel}
                    </span>
                  </div>
                  <span className="text-stone-400 shrink-0 text-[10px]">{rec.timestamp}</span>
                </div>
                <p className="text-stone-600 leading-relaxed line-clamp-3">{rec.content}</p>
                {rec.vitals && (
                  <div className="flex items-center gap-1.5 text-[10px] font-medium bg-rose-50 text-rose-800 px-2 py-1 rounded-lg border border-rose-200 w-fit">
                    <Heart className="w-3 h-3 text-rose-500" />
                    {rec.vitals.systolic}/{rec.vitals.diastolic} mmHg · 心率 {rec.vitals.pulse}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 动作按钮：手机端纵向堆叠 */}
      <div className="flex flex-col gap-2 pt-0.5">
        {!archived ? (
          <>
            <button
              id={`btn-add-record-${task.id}`}
              onClick={() => setActiveRecordTask(task)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              提交操作记录
            </button>
            {isFamilyMember && (
              <button
                id={`btn-archive-task-${task.id}`}
                onClick={() => setActiveArchiveTask(task)}
                className="w-full py-2.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Archive className="w-3.5 h-3.5 text-stone-500" />
                完成并归档
              </button>
            )}
          </>
        ) : (
          isFamilyMember && (
            <button
              id={`btn-unarchive-${task.id}`}
              onClick={() => unarchiveStageTask(task.id)}
              className="w-full py-2.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              恢复为进行中
            </button>
          )
        )}
      </div>
    </div>
  );

  return (
    <div className="pb-8 pt-2 px-4 space-y-3.5 max-w-md mx-auto animate-fadeIn">
      {/* 顶栏 */}
      <div className="flex items-center justify-between gap-2">
        {showBackButton ? (
          <button
            id="btn-back-to-profile"
            onClick={() => {
              setCurrentSubView('none');
              setActiveTab('profile');
            }}
            className="flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            返回
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <FolderHeart className="w-4 h-4 text-emerald-700" />
            <h2 className="text-base font-bold text-stone-900 tracking-tight">健康档案</h2>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${roleBadge.cls}`}>
            {roleBadge.text}
          </span>
          <select
            value={currentRolePersona}
            onChange={(e) => handleSwitchPersona(e.target.value as any)}
            className="text-[10px] font-bold px-2 py-1 rounded-lg border border-stone-200 bg-white text-stone-700 max-w-[7.5rem] truncate"
            aria-label="切换测试身份"
          >
            <option value="mom">妈妈</option>
            <option value="dad">爸爸</option>
            <option value="brother">哥哥</option>
            <option value="escort_zhang">陪诊员</option>
            <option value="nanny_wang">育儿嫂</option>
          </select>
        </div>
      </div>

      {showBackButton && (
        <div className="flex items-center gap-1.5 px-0.5">
          <FolderHeart className="w-4 h-4 text-emerald-700" />
          <h2 className="text-base font-bold text-stone-900">健康档案</h2>
        </div>
      )}

      {/* 主 Tab：照护 / 证件 */}
      <div className="flex bg-stone-100 p-1 rounded-2xl">
        <button
          onClick={() => setActiveMainTab('stage_tasks')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
            activeMainTab === 'stage_tasks'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-stone-500'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          照护档案
        </button>
        <button
          onClick={() => setActiveMainTab('document_archives')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
            activeMainTab === 'document_archives'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-stone-500'
          }`}
        >
          <FolderArchive className="w-3.5 h-3.5" />
          证件归档 ({familyArchives.length})
        </button>
      </div>

      {/* ===================== 照护档案 ===================== */}
      {activeMainTab === 'stage_tasks' && currentBaseProfile && (
        <>
          {/* 横向成员选择 */}
          <div className="-mx-4 px-4 overflow-x-auto no-scrollbar">
            <div className="flex gap-2.5 pb-1 min-w-min">
              {memberBaseProfiles.map((p) => {
                const isSelected = p.memberId === selectedMemberId;
                const countTasks = stageTasks.filter(
                  (t) => t.memberId === p.memberId && !t.isArchived
                ).length;
                return (
                  <button
                    key={p.memberId}
                    onClick={() => setSelectedMemberId(p.memberId)}
                    className={`shrink-0 w-[4.75rem] flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/15'
                        : 'bg-white border-stone-200/90 hover:bg-stone-50'
                    }`}
                  >
                    <span
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl border ${
                        isSelected
                          ? 'bg-white border-emerald-200'
                          : 'bg-stone-50 border-stone-200'
                      }`}
                    >
                      {p.avatar}
                    </span>
                    <span className="text-[11px] font-bold text-stone-900 truncate w-full text-center">
                      {p.name.replace(/^李/, '')}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        countTasks > 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {countTasks > 0 ? `${countTasks}项` : '暂无'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 基础档案名片 */}
          <div className="bg-gradient-to-br from-emerald-700 via-teal-700 to-emerald-800 text-white rounded-3xl p-4 shadow-sm relative overflow-hidden">
            <div className="flex items-start gap-3">
              <span className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-3xl shrink-0">
                {currentBaseProfile.avatar}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold tracking-tight">{currentBaseProfile.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 border border-white/25">
                    {currentBaseProfile.relation}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100/90 mt-1">
                  {currentBaseProfile.age}
                  {currentBaseProfile.bloodType ? ` · ${currentBaseProfile.bloodType}型血` : ''}
                </p>
                <p className="text-[11px] text-emerald-100/80 mt-0.5 truncate">
                  紧急联系：{currentBaseProfile.emergencyContact}
                </p>
              </div>
            </div>

            <div className="mt-3.5 space-y-2">
              <div className="bg-white/10 border border-white/15 rounded-2xl p-2.5">
                <div className="text-[10px] text-emerald-100/80 font-medium flex items-center gap-1 mb-1.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  过敏禁忌
                </div>
                <div className="flex flex-wrap gap-1">
                  {currentBaseProfile.allergies?.length ? (
                    currentBaseProfile.allergies.map((alg, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-1.5 py-0.5 rounded-md bg-rose-500/90 text-white font-bold leading-snug max-w-full"
                      >
                        {alg}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-emerald-100/70">暂无记录</span>
                  )}
                </div>
              </div>
              <div className="bg-white/10 border border-white/15 rounded-2xl p-2.5">
                <div className="text-[10px] text-emerald-100/80 font-medium flex items-center gap-1 mb-1.5">
                  <Heart className="w-3 h-3 shrink-0" />
                  慢病关注
                </div>
                <div className="flex flex-wrap gap-1">
                  {currentBaseProfile.chronicConditions?.length ? (
                    currentBaseProfile.chronicConditions.map((cond, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-400/90 text-amber-950 font-bold leading-snug"
                      >
                        {cond}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-emerald-100/70">暂无随访</span>
                  )}
                </div>
              </div>
            </div>

            {currentBaseProfile.notes && (
              <p className="mt-2.5 text-[11px] text-emerald-50/90 leading-relaxed line-clamp-2">
                {currentBaseProfile.notes}
              </p>
            )}

            <div className="mt-3.5 flex gap-2">
              <button
                id="btn-edit-base-profile"
                onClick={() => setIsEditBaseProfileOpen(true)}
                className="flex-1 py-2 bg-white/15 hover:bg-white/25 active:scale-[0.99] rounded-xl text-xs font-bold border border-white/25 flex items-center justify-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                编辑信息
              </button>
              <button
                id="btn-open-permission-modal"
                onClick={() => setIsOwnerPermModalOpen(true)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 active:scale-[0.99] ${
                  currentBaseProfile.servicePermissions.isOpenToService
                    ? 'bg-white text-emerald-800 border-white'
                    : 'bg-rose-500/90 text-white border-rose-400/50'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {currentBaseProfile.servicePermissions.isOpenToService ? '权限已开' : '权限未开'}
              </button>
            </div>
          </div>

          {/* 阶段任务 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 px-0.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <Activity className="w-4 h-4 text-emerald-700 shrink-0" />
                <h3 className="text-xs font-bold text-stone-900 truncate">阶段任务</h3>
              </div>
              {isFamilyMember && (
                <button
                  id="btn-create-stage-task"
                  onClick={() => setIsCreateStageTaskOpen(true)}
                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  新建
                </button>
              )}
            </div>

            <div className="flex bg-stone-100 p-1 rounded-2xl">
              <button
                onClick={() => setStageTaskFilter('active')}
                className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold transition ${
                  stageTaskFilter === 'active'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500'
                }`}
              >
                进行中 ({activeStageTasks.length})
              </button>
              <button
                onClick={() => setStageTaskFilter('archived')}
                className={`flex-1 py-1.5 rounded-xl text-[11px] font-bold transition ${
                  stageTaskFilter === 'archived'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500'
                }`}
              >
                已归档 ({archivedStageTasks.length})
              </button>
            </div>

            {stageTaskFilter === 'active' ? (
              activeStageTasks.length === 0 ? (
                <div className="p-6 text-center bg-white rounded-2xl border border-dashed border-stone-200 space-y-2">
                  <Activity className="w-7 h-7 text-stone-300 mx-auto" />
                  <p className="text-xs text-stone-500 font-bold">暂无进行中的阶段任务</p>
                  {isFamilyMember && (
                    <button
                      onClick={() => setIsCreateStageTaskOpen(true)}
                      className="mt-1 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
                    >
                      新建第一项任务
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {activeStageTasks.map((task) => renderTaskCard(task, false))}
                </div>
              )
            ) : archivedStageTasks.length === 0 ? (
              <div className="p-6 text-center bg-white rounded-2xl border border-dashed border-stone-200 space-y-1">
                <Archive className="w-7 h-7 text-stone-300 mx-auto" />
                <p className="text-xs text-stone-500 font-bold">暂无已归档任务</p>
              </div>
            ) : (
              <div className="space-y-3">
                {archivedStageTasks.map((task) => renderTaskCard(task, true))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ===================== 证件归档 ===================== */}
      {activeMainTab === 'document_archives' && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-3.5 border border-stone-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-stone-900">证件与合同</h3>
                <p className="text-[11px] text-stone-500 mt-0.5">户口本、保单、奖状等电子凭据</p>
              </div>
              {isFamilyMember && (
                <button
                  id="btn-create-doc-archive"
                  onClick={() => setIsCreateDocModalOpen(true)}
                  className="px-2.5 py-1.5 bg-emerald-600 text-white rounded-xl text-[11px] font-bold flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  新建
                </button>
              )}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="搜索标题、标签或成员"
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-stone-50"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={selectedMemberFilter}
                onChange={(e) => setSelectedMemberFilter(e.target.value)}
                className="flex-1 px-2.5 py-2 rounded-xl border border-stone-200 text-[11px] bg-stone-50 font-bold"
              >
                <option value="all">全部成员</option>
                {memberBaseProfiles.map((m) => (
                  <option key={m.memberId} value={m.memberId}>
                    {m.name}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="flex-1 px-2.5 py-2 rounded-xl border border-stone-200 text-[11px] bg-stone-50 font-bold"
              >
                <option value="all">全部状态</option>
                <option value="active">仅活跃</option>
                <option value="archived">仅归档</option>
              </select>
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredDocArchives.length === 0 ? (
              <div className="p-6 text-center bg-white rounded-2xl border border-dashed border-stone-200 text-xs text-stone-400">
                没有匹配的电子档案
              </div>
            ) : (
              filteredDocArchives.map((arc) => {
                const catConfig = CATEGORY_MAP[arc.category] || CATEGORY_MAP.custom;
                return (
                  <div
                    key={arc.id}
                    className={`bg-white rounded-2xl p-3.5 border space-y-2 ${
                      arc.isArchived ? 'border-stone-200 bg-stone-50/70' : 'border-stone-200/90 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${catConfig.bg} ${catConfig.color}`}
                          >
                            {catConfig.label}
                          </span>
                          <span className="text-[10px] text-stone-500 font-bold">{arc.memberName}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                              arc.isArchived
                                ? 'bg-stone-200 text-stone-700'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {arc.isArchived ? '已归档' : '活跃'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-stone-900 leading-snug">{arc.title}</h4>
                      </div>
                      {isFamilyMember && (
                        <button
                          onClick={() => toggleArchiveStatus(arc.id)}
                          className={`text-[10px] font-bold px-2 py-1 rounded-lg border shrink-0 ${
                            arc.isArchived
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-stone-100 text-stone-700 border-stone-200'
                          }`}
                        >
                          {arc.isArchived ? '解档' : '归档'}
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-600 leading-relaxed line-clamp-2">
                      {arc.description}
                    </p>
                    {arc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {arc.tags.map((t, i) => (
                          <span
                            key={i}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="pt-1.5 border-t border-stone-100 flex justify-between text-[10px] text-stone-400">
                      <span>{arc.recordDate}</span>
                      <span>{arc.createdBy}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 模态弹窗 */}
      {currentBaseProfile && (
        <EditBaseProfileModal
          profile={currentBaseProfile}
          isOpen={isEditBaseProfileOpen}
          onClose={() => setIsEditBaseProfileOpen(false)}
          onSave={(updates) => updateMemberBaseProfile(currentBaseProfile.memberId, updates)}
        />
      )}

      {currentBaseProfile && (
        <OwnerPermissionModal
          profile={currentBaseProfile}
          currentUser={currentUserMember}
          isOpen={isOwnerPermModalOpen}
          onClose={() => setIsOwnerPermModalOpen(false)}
          onSave={(updates) =>
            updateMemberServicePermissions(currentBaseProfile.memberId, updates)
          }
          onSwitchToOwner={() => handleSwitchPersona('mom')}
        />
      )}

      {currentBaseProfile && (
        <CreateStageTaskModal
          profile={currentBaseProfile}
          isOpen={isCreateStageTaskOpen}
          onClose={() => setIsCreateStageTaskOpen(false)}
          members={members}
          onCreate={(newTask) => createStageTask(newTask)}
        />
      )}

      {activeRecordTask && (
        <AddServiceRecordModal
          task={activeRecordTask}
          currentUser={currentUserMember}
          isOpen={!!activeRecordTask}
          onClose={() => setActiveRecordTask(null)}
          onSubmit={(recData) => addStageTaskServiceRecord(activeRecordTask.id, recData)}
        />
      )}

      {activeArchiveTask && (
        <ArchiveTaskModal
          task={activeArchiveTask}
          isOpen={!!activeArchiveTask}
          onClose={() => setActiveArchiveTask(null)}
          onConfirm={(reason) => archiveStageTask(activeArchiveTask.id, reason)}
        />
      )}

      {isCreateDocModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3">
          <div className="bg-white rounded-3xl w-full max-w-md p-4 shadow-2xl space-y-3 text-xs animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-bold text-sm text-stone-900">新建电子档案</h3>
              <button
                onClick={() => setIsCreateDocModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const mem = memberBaseProfiles.find((p) => p.memberId === formMemberId);
                createFamilyArchive({
                  memberId: formMemberId,
                  memberName: mem?.name || '家庭全员',
                  category: formCategory,
                  title: formTitle,
                  description: formDescription,
                  tags: formTags ? formTags.split(/[,，\s]+/).filter(Boolean) : ['电子归档'],
                  recordDate: formDate,
                  isArchived: false,
                  importance: formImportance,
                  createdBy: currentUserMember.name,
                });
                setIsCreateDocModalOpen(false);
                setFormTitle('');
                setFormDescription('');
                setFormTags('');
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">所属成员</label>
                <select
                  value={formMemberId}
                  onChange={(e) => setFormMemberId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                >
                  {memberBaseProfiles.map((m) => (
                    <option key={m.memberId} value={m.memberId}>
                      {m.avatar} {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">档案名称</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="例如：补充医疗险保单"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">类别</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as ArchiveCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                >
                  {Object.entries(CATEGORY_MAP).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">说明</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="编号、存放位置或注意事项"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">标签</label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="保单 医疗"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsCreateDocModalOpen(false)}
                  className="px-3 py-2 rounded-xl border border-stone-200 font-bold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold"
                >
                  确定建档
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
