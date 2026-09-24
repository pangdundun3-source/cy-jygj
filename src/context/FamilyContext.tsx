import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  BabyProfile,
  CareFeedItem,
  ElderlyProfile,
  FamilyMember,
  FamilySpace,
  FamilyTask,
  GrowthMilestone,
  HealthMetricLog,
  PermissionSettings,
  ServiceType,
  TaskStatus,
  AIChatMessage,
  FamilyArchiveRecord,
  MemberBaseProfile,
  ProfileStageTask,
  StageTaskServiceRecord,
  MemberArchivePermissions,
} from '../types';
import {
  INITIAL_BABY_PROFILE,
  INITIAL_CARE_FEEDS,
  INITIAL_ELDERLY_PROFILE,
  INITIAL_MEMBERS,
  INITIAL_SPACE,
  INITIAL_TASKS,
  INITIAL_AI_MESSAGES,
  INITIAL_FAMILY_ARCHIVES,
  INITIAL_MEMBER_BASE_PROFILES,
  INITIAL_STAGE_TASKS,
  NANNY_PERMISSIONS,
  ESCORT_PERMISSIONS,
  MEMBER_PERMISSIONS,
} from '../data/mockData';
import confetti from 'canvas-confetti';

export type ActiveTab = 'home' | 'archives' | 'space' | 'tasks' | 'feed' | 'profile';
export type SubView = 'none' | 'baby_archive' | 'elderly_health' | 'ai_assistant' | 'invite_service' | 'member_permission' | 'create_space' | 'task_detail' | 'ai_growth_report' | 'family_space_detail' | 'personal_profile_detail' | 'family_archives_manage';

export interface TaskFeedDraft {
  taskId: string;
  title: string;
  note: string;
  category: FamilyTask['category'];
  categoryLabel: string;
  assigneeName: string;
  scheduledTime: string;
}

interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info' | 'warning';
}

interface FamilyContextType {
  // Navigation & View
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentSubView: SubView;
  setCurrentSubView: (view: SubView) => void;
  selectedMemberId: string | null;
  setSelectedMemberId: (id: string | null) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  navigateToMemberArchive: (memberId: string) => void;
  
  // Simulator State
  currentRolePersona: 'mom' | 'dad' | 'brother' | 'nanny_wang' | 'escort_zhang';
  setCurrentRolePersona: (role: 'mom' | 'dad' | 'brother' | 'nanny_wang' | 'escort_zhang') => void;
  isPhoneFrameEnabled: boolean;
  setIsPhoneFrameEnabled: (enabled: boolean) => void;
  activeFamilySpace: FamilySpace;
  
  // Current user derived info & permissions
  currentUserMember: FamilyMember;
  hasPermission: (permissionKey: keyof PermissionSettings) => boolean;
  updateMemberProfile: (memberId: string, updates: Partial<FamilyMember>) => void;
  
  // Data lists & mutations
  members: FamilyMember[];
  babyProfile: BabyProfile;
  elderlyProfile: ElderlyProfile;
  tasks: FamilyTask[];
  careFeeds: CareFeedItem[];
  aiMessages: AIChatMessage[];
  isAITyping: boolean;
  
  // Toast notifications
  toasts: ToastMessage[];
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
  
  // Actions
  inviteTemporaryService: (params: {
    name: string;
    phone: string;
    serviceType: ServiceType;
    serviceTitle: string;
    startDate: string;
    endDate: string;
    permissions: PermissionSettings;
  }) => FamilyMember;
  
  endServiceEarly: (memberId: string) => void;
  renewService: (memberId: string, days: number) => void;
  inviteFamilyMember: (name: string, relation: string, phone: string) => void;
  
  addBabyMilestone: (title: string, description: string, photos: string[]) => void;
  likeMilestone: (id: string) => void;
  
  toggleMedication: (medId: string) => void;
  addHealthLog: (systolic: number, diastolic: number, pulse: number) => void;
  
  addTask: (task: Omit<FamilyTask, 'id' | 'status'>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus, proofPhoto?: string, completedNote?: string) => void;
  deleteTask: (taskId: string) => void;
  
  addFeedItem: (type: CareFeedItem['type'], typeLabel: string, content: string, photos: string[], tags: string[], videos?: string[]) => void;
  feedDraft: TaskFeedDraft | null;
  openTaskCheckIn: (task: FamilyTask) => void;
  clearFeedDraft: () => void;
  likeFeedItem: (id: string) => void;
  addFeedComment: (feedId: string, content: string) => void;
  
  sendAIMessage: (text: string) => void;
  triggerAIAction: (type: string) => void;
  
  // Family Archives Management
  familyArchives: FamilyArchiveRecord[];
  createFamilyArchive: (record: Omit<FamilyArchiveRecord, 'id' | 'createdAt'>) => void;
  toggleArchiveStatus: (archiveId: string, reason?: string) => void;
  updateFamilyArchive: (archiveId: string, updates: Partial<FamilyArchiveRecord>) => void;
  deleteFamilyArchive: (archiveId: string) => void;

  // 成员基础档案与阶段任务管理
  memberBaseProfiles: MemberBaseProfile[];
  stageTasks: ProfileStageTask[];
  updateMemberBaseProfile: (memberId: string, updates: Partial<MemberBaseProfile>) => void;
  updateMemberServicePermissions: (memberId: string, updates: Partial<MemberArchivePermissions>) => void;
  createStageTask: (task: Omit<ProfileStageTask, 'id' | 'records' | 'isArchived' | 'createdAt'>) => void;
  updateStageTask: (taskId: string, updates: Partial<ProfileStageTask>) => void;
  addStageTaskServiceRecord: (taskId: string, recordData: Omit<StageTaskServiceRecord, 'id'>) => void;
  archiveStageTask: (taskId: string, reason: string) => void;
  unarchiveStageTask: (taskId: string) => void;
  deleteStageTask: (taskId: string) => void;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const FamilyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [currentSubView, setCurrentSubView] = useState<SubView>('none');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>('m_grandpa');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [feedDraft, setFeedDraft] = useState<TaskFeedDraft | null>(null);

  const openTaskCheckIn = (task: FamilyTask) => {
    setFeedDraft({
      taskId: task.id,
      title: task.title,
      note: task.note,
      category: task.category,
      categoryLabel: task.categoryLabel,
      assigneeName: task.assigneeName,
      scheduledTime: task.scheduledTime,
    });
    setCurrentSubView('none');
    setActiveTab('feed');
  };

  const clearFeedDraft = () => setFeedDraft(null);

  const navigateToMemberArchive = (memberId: string) => {
    setSelectedMemberId(memberId);
    setActiveTab('archives');
    setCurrentSubView('none');
  };
  
  const [currentRolePersona, setCurrentRolePersona] = useState<'mom' | 'dad' | 'brother' | 'nanny_wang' | 'escort_zhang'>('mom');
  const [isPhoneFrameEnabled, setIsPhoneFrameEnabled] = useState<boolean>(true);
  
  const [activeFamilySpace] = useState<FamilySpace>(INITIAL_SPACE);
  const [members, setMembers] = useState<FamilyMember[]>(INITIAL_MEMBERS);
  const [babyProfile, setBabyProfile] = useState<BabyProfile>(INITIAL_BABY_PROFILE);
  const [elderlyProfile, setElderlyProfile] = useState<ElderlyProfile>(INITIAL_ELDERLY_PROFILE);
  const [tasks, setTasks] = useState<FamilyTask[]>(INITIAL_TASKS);
  const [careFeeds, setCareFeeds] = useState<CareFeedItem[]>(INITIAL_CARE_FEEDS);
  const [familyArchives, setFamilyArchives] = useState<FamilyArchiveRecord[]>(INITIAL_FAMILY_ARCHIVES);
  const [memberBaseProfiles, setMemberBaseProfiles] = useState<MemberBaseProfile[]>(INITIAL_MEMBER_BASE_PROFILES);
  const [stageTasks, setStageTasks] = useState<ProfileStageTask[]>(INITIAL_STAGE_TASKS);
  const [aiMessages, setAiMessages] = useState<AIChatMessage[]>(INITIAL_AI_MESSAGES);
  const [isAITyping, setIsAITyping] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const createFamilyArchive = (record: Omit<FamilyArchiveRecord, 'id' | 'createdAt'>) => {
    const newRecord: FamilyArchiveRecord = {
      ...record,
      id: `arc_${Date.now()}`,
      createdAt: new Date().toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setFamilyArchives((prev) => [newRecord, ...prev]);
    showToast(`已成功为【${record.memberName}】创建【${record.title}】档案！`, 'success');
  };

  const toggleArchiveStatus = (archiveId: string, reason?: string) => {
    let nextState = false;
    let targetTitle = '';
    setFamilyArchives((prev) =>
      prev.map((arc) => {
        if (arc.id === archiveId) {
          nextState = !arc.isArchived;
          targetTitle = arc.title;
          const today = new Date().toISOString().split('T')[0];
          return {
            ...arc,
            isArchived: nextState,
            archivedAt: nextState ? today : undefined,
            archivedReason: nextState ? (reason || '家庭成员手动设置归档保存') : undefined,
          };
        }
        return arc;
      })
    );
    if (nextState) {
      showToast(`档案【${targetTitle}】已成功设置归档！`, 'info');
    } else {
      showToast(`档案【${targetTitle}】已恢复为活跃进行中！`, 'success');
    }
  };

  const updateFamilyArchive = (archiveId: string, updates: Partial<FamilyArchiveRecord>) => {
    setFamilyArchives((prev) =>
      prev.map((arc) => (arc.id === archiveId ? { ...arc, ...updates } : arc))
    );
    showToast('档案信息已保存更新！', 'success');
  };

  const deleteFamilyArchive = (archiveId: string) => {
    setFamilyArchives((prev) => prev.filter((arc) => arc.id !== archiveId));
    showToast('档案记录已删除', 'info');
  };

  // 基础档案管理：所有家庭成员均可更新基础信息
  const updateMemberBaseProfile = (memberId: string, updates: Partial<MemberBaseProfile>) => {
    setMemberBaseProfiles((prev) =>
      prev.map((p) => (p.memberId === memberId ? { ...p, ...updates } : p))
    );
    showToast('基础档案信息已更新保存！', 'success');
  };

  // 基础档案外来人员开放权限配置：仅主成员 (owner 妈妈) 可修改
  const updateMemberServicePermissions = (
    memberId: string,
    updates: Partial<MemberArchivePermissions>
  ) => {
    if (currentUserMember.role !== 'owner') {
      showToast('权限受限：仅家庭主成员(妈妈 李婷)有权配置外来人员开放权限！', 'warning');
      return;
    }
    const today = new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    setMemberBaseProfiles((prev) =>
      prev.map((p) => {
        if (p.memberId === memberId) {
          return {
            ...p,
            servicePermissions: {
              ...p.servicePermissions,
              ...updates,
              updatedBy: `主成员：${currentUserMember.name} (妈妈)`,
              updatedAt: today,
            },
          };
        }
        return p;
      })
    );
    showToast('档案对外来人员开放权限已成功更新！', 'success');
  };

  // 档案下阶段任务管理
  const createStageTask = (
    taskData: Omit<ProfileStageTask, 'id' | 'records' | 'isArchived' | 'createdAt'>
  ) => {
    const today = new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    const newTask: ProfileStageTask = {
      ...taskData,
      id: `st_task_${Date.now()}`,
      records: [],
      isArchived: false,
      createdAt: today,
      createdBy: `${currentUserMember.name} (${currentUserMember.roleLabel})`,
    };
    setStageTasks((prev) => [newTask, ...prev]);
    showToast(`已在【${taskData.memberName}】档案下新建【${taskData.title}】阶段任务！`, 'success');
  };

  const updateStageTask = (taskId: string, updates: Partial<ProfileStageTask>) => {
    setStageTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    );
    showToast('阶段任务信息已更新', 'success');
  };

  // 外来人员/家属在阶段任务下提交操作记录 (就医陪诊、慢病打卡、服药护理等)
  const addStageTaskServiceRecord = (
    taskId: string,
    recordData: Omit<StageTaskServiceRecord, 'id'>
  ) => {
    const newRecord: StageTaskServiceRecord = {
      ...recordData,
      id: `rec_${Date.now()}`,
    };
    setStageTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, records: [newRecord, ...t.records] } : t
      )
    );
    // 如果包含血压等指标，同步至老人体征
    if (recordData.vitals?.systolic && recordData.vitals?.diastolic) {
      addHealthLog(recordData.vitals.systolic, recordData.vitals.diastolic, recordData.vitals.pulse || 72);
    }
    // 同步生成动态
    addFeedItem(
      recordData.actionType === 'doctor_summary' ? 'medical_escort' : 'family_moment',
      recordData.actionTypeLabel,
      `【${recordData.operatorName}】提交阶段任务记录：${recordData.content}`,
      recordData.attachments || [],
      ['阶段任务执行', recordData.actionTypeLabel]
    );
    showToast('任务操作记录已提交并沉淀至档案！', 'success');
  };

  // 阶段任务完成并归档
  const archiveStageTask = (taskId: string, reason: string) => {
    const today = new Date().toISOString().split('T')[0];
    let taskTitle = '';
    setStageTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          taskTitle = t.title;
          return {
            ...t,
            status: 'completed',
            isArchived: true,
            archivedAt: today,
            archivedReason: reason || '阶段任务顺利完成，已设置归档封存备查',
            archivedBy: `${currentUserMember.name} (${currentUserMember.roleLabel})`,
          };
        }
        return t;
      })
    );
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
    } catch {
      // ignore
    }
    showToast(`阶段任务【${taskTitle}】已顺利完成并归档保存！`, 'success');
  };

  const unarchiveStageTask = (taskId: string) => {
    setStageTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              isArchived: false,
              status: 'in_progress',
              archivedAt: undefined,
              archivedReason: undefined,
            }
          : t
      )
    );
    showToast('阶段任务已恢复为活跃进行中！', 'success');
  };

  const deleteStageTask = (taskId: string) => {
    setStageTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast('阶段任务已移除', 'info');
  };

  // Derive Current User Member based on active persona
  const currentUserMember: FamilyMember = React.useMemo(() => {
    switch (currentRolePersona) {
      case 'mom':
        return members.find((m) => m.id === 'm_mom') || members[0];
      case 'dad':
        return members.find((m) => m.id === 'm_dad') || members[1];
      case 'brother':
        return members.find((m) => m.id === 'm_brother') || members[2];
      case 'nanny_wang':
        return members.find((m) => m.id === 'm_nanny_wang') || members[6];
      case 'escort_zhang':
        return members.find((m) => m.id === 'm_escort_zhang') || members[7];
      default:
        return members[0];
    }
  }, [currentRolePersona, members]);

  const updateMemberProfile = (memberId: string, updates: Partial<FamilyMember>) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, ...updates } : m))
    );
    showToast('个人资料已成功更新保存！', 'success');
  };

  const hasPermission = (permissionKey: keyof PermissionSettings): boolean => {
    if (currentUserMember.role === 'owner') return true;
    return !!currentUserMember.permissions[permissionKey];
  };

  // 1. Invite Temporary Service Provider
  const inviteTemporaryService = (params: {
    name: string;
    phone: string;
    serviceType: ServiceType;
    serviceTitle: string;
    startDate: string;
    endDate: string;
    permissions: PermissionSettings;
  }): FamilyMember => {
    const avatarMap: Record<ServiceType, { avatar: string; bg: string }> = {
      nanny: { avatar: '🧑‍🍳', bg: 'bg-teal-100 text-teal-800' },
      medical_escort: { avatar: '🩺', bg: 'bg-sky-100 text-sky-800' },
      cleaner: { avatar: '🧹', bg: 'bg-amber-100 text-amber-800' },
      nurse: { avatar: '💉', bg: 'bg-indigo-100 text-indigo-800' },
      hourly_worker: { avatar: '🧤', bg: 'bg-emerald-100 text-emerald-800' },
    };

    const newMember: FamilyMember = {
      id: `m_serv_${Date.now()}`,
      name: params.name,
      role: 'temporary_service',
      roleLabel: `临时服务人员 · ${params.serviceTitle}`,
      avatar: avatarMap[params.serviceType]?.avatar || '🤝',
      avatarBg: avatarMap[params.serviceType]?.bg || 'bg-teal-100 text-teal-800',
      serviceType: params.serviceType,
      serviceTitle: params.serviceTitle,
      phone: params.phone,
      startDate: params.startDate,
      endDate: params.endDate,
      daysRemaining: 30,
      permissions: params.permissions,
    };

    setMembers((prev) => [...prev, newMember]);
    try {
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
    showToast(`已成功生成【${params.name}】的临时服务邀请，权限已生效！`, 'success');
    return newMember;
  };

  // 2. End / Renew Service
  const endServiceEarly = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    showToast('已安全解除服务人员授权，服务档案已归档保存。', 'info');
  };

  const renewService = (memberId: string, days: number) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? { ...m, daysRemaining: (m.daysRemaining || 0) + days }
          : m
      )
    );
    showToast(`已为服务人员延期 ${days} 天权限。`, 'success');
  };

  // 3. Invite Family Member
  const inviteFamilyMember = (name: string, relation: string, phone: string) => {
    const newMember: FamilyMember = {
      id: `m_fam_${Date.now()}`,
      name: `${name} (${relation})`,
      role: 'member',
      roleLabel: '家庭成员',
      avatar: '👨‍👩‍👧',
      avatarBg: 'bg-emerald-100 text-emerald-800',
      relation,
      phone,
      permissions: MEMBER_PERMISSIONS,
    };
    setMembers((prev) => [...prev, newMember]);
    showToast(`已成功邀请【${name}】加入家庭空间！`, 'success');
  };

  // 4. Baby Growth Actions
  const addBabyMilestone = (title: string, description: string, photos: string[]) => {
    const newMilestone: GrowthMilestone = {
      id: `m_${Date.now()}`,
      date: '2026-09-16',
      ageMonth: babyProfile.ageText,
      title,
      description,
      photos: photos.length > 0 ? photos : ['https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=600&auto=format&fit=crop&q=80'],
      author: currentUserMember.name,
      authorRole: currentUserMember.roleLabel,
      likes: 1,
      hasLiked: true,
    };
    setBabyProfile((prev) => ({
      ...prev,
      recentPhotosCount: prev.recentPhotosCount + 1,
      milestones: [newMilestone, ...prev.milestones],
    }));
    // Also broadcast to care feeds
    addFeedItem('baby_daily', '育儿日志', `${title}：${description}`, newMilestone.photos, ['成长里程碑', '宝宝日常']);
    try {
      confetti({ particleCount: 40, spread: 45, origin: { y: 0.5 } });
    } catch {
      // ignore
    }
    showToast('宝宝新成长记录已记录并同步至家庭动态！', 'success');
  };

  const likeMilestone = (id: string) => {
    setBabyProfile((prev) => ({
      ...prev,
      milestones: prev.milestones.map((m) =>
        m.id === id
          ? { ...m, likes: m.hasLiked ? m.likes - 1 : m.likes + 1, hasLiked: !m.hasLiked }
          : m
      ),
    }));
  };

  // 5. Elderly Health Actions
  const toggleMedication = (medId: string) => {
    setElderlyProfile((prev) => ({
      ...prev,
      todayMedications: prev.todayMedications.map((m) =>
        m.id === medId
          ? {
              ...m,
              completed: !m.completed,
              completedAt: !m.completed ? '刚刚' : undefined,
              takenBy: !m.completed ? `由 ${currentUserMember.name} 协助完成` : undefined,
            }
          : m
      ),
    }));
    showToast('已更新爷爷服药状态！', 'success');
  };

  const addHealthLog = (systolic: number, diastolic: number, pulse: number) => {
    const status = systolic > 140 || diastolic > 90 ? 'high' : systolic > 130 || diastolic > 85 ? 'slight_high' : 'normal';
    const newLog: HealthMetricLog = {
      id: `log_${Date.now()}`,
      date: '09-16',
      time: '刚刚',
      systolic,
      diastolic,
      pulse,
      status,
    };
    setElderlyProfile((prev) => ({
      ...prev,
      currentBloodPressure: {
        systolic,
        diastolic,
        measuredTime: '刚刚 测量',
        status: status === 'normal' ? 'normal' : 'attention',
      },
      recentLogs: [newLog, ...prev.recentLogs.slice(0, 6)],
    }));
    showToast(`新血压数据已归档: ${systolic}/${diastolic} mmHg`, 'success');
  };

  // 6. Task Actions
  const addTask = (taskData: Omit<FamilyTask, 'id' | 'status'>) => {
    const newTask: FamilyTask = {
      ...taskData,
      id: `task_${Date.now()}`,
      status: 'pending',
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast('新家庭任务已创建并指派！', 'success');
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus, proofPhoto?: string, completedNote?: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated: FamilyTask = {
            ...t,
            status,
            proofPhoto: proofPhoto || t.proofPhoto,
            completedNote: completedNote || t.completedNote,
            completedAt: status === 'completed' ? '刚刚完成' : t.completedAt,
            completedOn: status === 'completed' ? new Date().toISOString().slice(0, 10) : t.completedOn,
          };
          return updated;
        }
        return t;
      })
    );
    if (status === 'completed') {
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
      showToast('任务已圆满完成打卡！', 'success');
    } else {
      showToast('任务状态已更新', 'info');
    }
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    showToast('待开始的任务已删除', 'info');
  };

  // 7. Family Feed Actions
  const addFeedItem = (
    type: CareFeedItem['type'],
    typeLabel: string,
    content: string,
    photos: string[],
    tags: string[],
    videos: string[] = []
  ) => {
    const newFeed: CareFeedItem = {
      id: `feed_${Date.now()}`,
      type,
      typeLabel,
      authorName: currentUserMember.name,
      authorAvatar: currentUserMember.avatar,
      authorRole: currentUserMember.roleLabel,
      time: '刚刚',
      date: '今日 (9月16日)',
      content,
      photos,
      videos,
      tags,
      likes: 0,
      comments: [],
    };
    setCareFeeds((prev) => [newFeed, ...prev]);
  };

  const likeFeedItem = (id: string) => {
    setCareFeeds((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, likes: f.hasLiked ? f.likes - 1 : f.likes + 1, hasLiked: !f.hasLiked }
          : f
      )
    );
  };

  const addFeedComment = (feedId: string, content: string) => {
    const newComment = {
      id: `c_${Date.now()}`,
      authorName: currentUserMember.name,
      authorAvatar: currentUserMember.avatar,
      content,
      time: '刚刚',
    };
    setCareFeeds((prev) =>
      prev.map((f) =>
        f.id === feedId ? { ...f, comments: [...f.comments, newComment] } : f
      )
    );
    showToast('留言已发送', 'success');
  };

  // 8. AI Assistant Actions
  const sendAIMessage = (text: string) => {
    const userMsg: AIChatMessage = {
      id: `msg_u_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: '刚刚',
    };
    setAiMessages((prev) => [...prev, userMsg]);
    setIsAITyping(true);

    setTimeout(() => {
      let replyText = '';
      let actionCard: AIChatMessage['actionCard'] = undefined;

      const lower = text.toLowerCase();
      if (lower.includes('血压') || lower.includes('爷爷') || lower.includes('老人')) {
        replyText = `根据【李建国爷爷】最新健康档案：\n\n- 今日早晨血压 **128/80 mmHg**，状态平稳。\n- 上午9点络活喜（氨氯地平）已服药打卡。\n- 下午14:00有张阿姨陪同复诊。\n\n**建议**：换季期间早晚温差大，外出复诊请佩戴防风围巾，避免情绪波动与过咸菜品。`;
        actionCard = {
          type: 'health_report',
          title: '爷爷健康档案摘要',
          details: '高血压二级 · 血压正常128/80 · 今日复诊心内科',
        };
      } else if (lower.includes('疫苗') || lower.includes('宝宝') || lower.includes('针')) {
        replyText = `查询【小宝 2岁3个月】疫苗接种档案：\n\n已完成接种 12 针，计划接种总数 16 针。\n\n📅 **下一针提醒**：【季节性流感疫苗】\n- 推荐日期：2026年9月25日\n- 接种地点：朝阳社区卫生服务中心\n- 预防提示：接种前3天观察宝宝无发热流涕。`;
        actionCard = {
          type: 'vaccine_schedule',
          title: '小宝下一针疫苗提醒',
          details: '流感疫苗 · 推荐接种日 09-25 · 已接种12/16',
        };
      } else if (lower.includes('任务') || lower.includes('保洁') || lower.includes('接送') || lower.includes('今天')) {
        replyText = `李家空间今日共有 3 项照护任务正在流转：\n\n1. 👶 **宝宝接送** (16:30 由育儿嫂王阿姨负责，待开始)\n2. 👴 **老人陪诊** (14:00 由陪诊员张阿姨负责，进行中，已取号32号)\n3. 🏠 **全屋保洁** (周六 09:30 洁净管家已预约)\n\n所有服务记录会自动归档到家庭动态，无需多平台沟通！`;
        actionCard = {
          type: 'task_created',
          title: '今日家庭任务一览',
          details: '宝宝接送(16:30) · 老人陪诊(进行中) · 保洁(周六)',
        };
      } else if (lower.includes('报告') || lower.includes('成长') || lower.includes('月报')) {
        replyText = `已根据小宝本月 24 条生活记录与身高体重数据生成【2岁3个月 智能成长月报】：\n\n- 身高 92cm (处于同龄 85% 水平，生长发育优良)\n- 体重 13kg (处于同龄 78% 水平)\n- 认知与精细动作突破：独立穿鞋、6块大积木拼图\n- 词汇量预计达 180+ 词。`;
        actionCard = {
          type: 'growth_report',
          title: '小宝 2岁3个月 成长报告已生成',
          details: '大动作自主穿鞋 · 身高92cm(P85) · 疫苗按时接种',
        };
      } else if (lower.includes('阿姨') || lower.includes('权限') || lower.includes('到期')) {
        replyText = `当前家庭空间临时服务人员状态：\n\n- 🧑‍🍳 **王阿姨 (育儿嫂)**：服务期 2026.09.16 - 2026.10.16，**剩余 15 天**。仅开放宝宝成长档案与服务打卡，已隔离老人健康及家庭财务。\n- 🩺 **张阿姨 (陪诊员)**：服务期至 2026.09.20，**剩余 4 天**。仅开放老人陪诊日志权限。\n\n到期后系统将自动回收访问权并永久保留服务日志。`;
      } else {
        replyText = `收到您的提问！我是【家有管家】AI智能管家，已全面打通李家空间数据。\n\n您可以随时问我：“爷爷最近血压怎么样？”、“小宝下一针疫苗是什么？”、“今天有哪些家庭任务？”、“王阿姨服务还有几天到期？”`;
      }

      const aiReply: AIChatMessage = {
        id: `msg_a_${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: '刚刚',
        actionCard,
      };

      setAiMessages((prev) => [...prev, aiReply]);
      setIsAITyping(false);
    }, 600);
  };

  const triggerAIAction = (type: string) => {
    if (type === 'growth_report') {
      setCurrentSubView('ai_growth_report');
    } else if (type === 'vaccine_schedule') {
      setCurrentSubView('baby_archive');
    } else if (type === 'health_report') {
      setCurrentSubView('elderly_health');
    } else if (type === 'task_created') {
      setActiveTab('tasks');
      setCurrentSubView('none');
    }
  };

  return (
    <FamilyContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentSubView,
        setCurrentSubView,
        selectedMemberId,
        setSelectedMemberId,
        selectedTaskId,
        setSelectedTaskId,
        navigateToMemberArchive,
        currentRolePersona,
        setCurrentRolePersona,
        isPhoneFrameEnabled,
        setIsPhoneFrameEnabled,
        activeFamilySpace,
        currentUserMember,
        hasPermission,
        updateMemberProfile,
        members,
        babyProfile,
        elderlyProfile,
        tasks,
        careFeeds,
        aiMessages,
        isAITyping,
        toasts,
        showToast,
        inviteTemporaryService,
        endServiceEarly,
        renewService,
        inviteFamilyMember,
        addBabyMilestone,
        likeMilestone,
        toggleMedication,
        addHealthLog,
        addTask,
        updateTaskStatus,
        deleteTask,
        addFeedItem,
        feedDraft,
        openTaskCheckIn,
        clearFeedDraft,
        likeFeedItem,
        addFeedComment,
        sendAIMessage,
        triggerAIAction,
        familyArchives,
        createFamilyArchive,
        toggleArchiveStatus,
        updateFamilyArchive,
        deleteFamilyArchive,
        memberBaseProfiles,
        stageTasks,
        updateMemberBaseProfile,
        updateMemberServicePermissions,
        createStageTask,
        updateStageTask,
        addStageTaskServiceRecord,
        archiveStageTask,
        unarchiveStageTask,
        deleteStageTask,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
};
