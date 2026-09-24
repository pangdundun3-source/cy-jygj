export type UserRole = 'owner' | 'admin' | 'member' | 'temporary_service';

export type ServiceType = 'nanny' | 'medical_escort' | 'cleaner' | 'nurse' | 'hourly_worker';

export interface PermissionSettings {
  babyArchiveView: boolean;
  babyArchiveUpload: boolean;
  elderlyHealthView: boolean;
  elderlyHealthUpload: boolean;
  familyTasksManage: boolean;
  familyTasksParticipate: boolean;
  familyFeedViewAll: boolean;
  familyFeedUpload: boolean;
  privateSpaceAccess: boolean;
  financeAccess: boolean;
}

export interface FamilyMember {
  id: string;
  name: string;
  role: UserRole;
  roleLabel: string;
  avatar: string;
  avatarBg: string;
  phone?: string;
  relation?: string;
  nickname?: string;
  age?: string;
  birthday?: string;
  schoolGrade?: string;
  bio?: string;
  hobby?: string;
  deviceType?: string;
  emergencyContact?: string;
  serviceType?: ServiceType;
  serviceTitle?: string;
  startDate?: string;
  endDate?: string;
  daysRemaining?: number;
  permissions: PermissionSettings;
  isCurrentUser?: boolean;
}

export interface GrowthMilestone {
  id: string;
  date: string;
  ageMonth: string;
  title: string;
  description: string;
  photos: string[];
  author: string;
  authorRole: string;
  likes: number;
  hasLiked?: boolean;
}

export interface VaccineItem {
  id: string;
  name: string;
  targetAge: string;
  status: 'completed' | 'pending' | 'upcoming';
  date?: string;
  hospital?: string;
}

export interface BabyProfile {
  id: string;
  name: string;
  nickname: string;
  gender: 'boy' | 'girl';
  birthDate: string;
  ageText: string;
  heightCm: number;
  weightKg: number;
  headCircumferenceCm: number;
  heightPercentile: number;
  weightPercentile: number;
  recentPhotosCount: number;
  vaccinesCompleted: number;
  vaccinesTotal: number;
  nextVaccine: {
    name: string;
    suggestedDate: string;
    notes: string;
  };
  milestones: GrowthMilestone[];
  vaccineList: VaccineItem[];
}

export interface HealthMetricLog {
  id: string;
  time: string;
  date: string;
  systolic: number; // 高压
  diastolic: number; // 低压
  pulse: number;
  status: 'normal' | 'slight_high' | 'high';
}

export interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  timeSlot: string; // "上午 09:00"
  completed: boolean;
  completedAt?: string;
  takenBy?: string;
}

export interface MedicalRecord {
  id: string;
  date: string;
  hospital: string;
  department: string;
  doctor: string;
  diagnosis: string;
  summary: string;
  escortName: string;
  reports: { name: string; type: string; url?: string }[];
  prescriptions: string[];
}

export interface ElderlyProfile {
  id: string;
  name: string;
  relation: string;
  age: number;
  tags: string[];
  currentBloodPressure: {
    systolic: number;
    diastolic: number;
    measuredTime: string;
    status: 'normal' | 'attention';
  };
  bloodGlucose: {
    value: number;
    type: 'fasting' | 'postprandial';
    measuredTime: string;
  };
  todayMedications: MedicationItem[];
  medicalRecords: MedicalRecord[];
  recentLogs: HealthMetricLog[];
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskCategory = 'baby' | 'elderly' | 'cleaning' | 'errand';

export interface FamilyTask {
  id: string;
  title: string;
  category: TaskCategory;
  categoryLabel: string;
  assigneeId: string;
  assigneeName: string;
  assigneeAvatar: string;
  assigneeRole: string;
  scheduledTime: string;
  dueDate: string;
  status: TaskStatus;
  priority: 'high' | 'medium' | 'normal';
  note: string;
  proofPhoto?: string;
  completedAt?: string;
  completedNote?: string;
}

export interface FeedComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  time: string;
}

export interface CareFeedItem {
  id: string;
  type: 'baby_daily' | 'medical_escort' | 'cleaning' | 'family_moment';
  typeLabel: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  time: string;
  date: string;
  content: string;
  photos: string[];
  tags: string[];
  likes: number;
  hasLiked?: boolean;
  comments: FeedComment[];
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionCard?: {
    type: 'task_created' | 'health_report' | 'vaccine_schedule' | 'growth_report';
    title: string;
    details: string;
  };
}

export interface FamilySpace {
  id: string;
  name: string;
  motto: string;
  createdAt: string;
  ownerId: string;
  storageUsedMB: number;
  storageTotalMB: number;
  isVip: boolean;
  members: FamilyMember[];
}

export type ArchiveCategory =
  | 'health_medical'
  | 'growth_education'
  | 'identity_cert'
  | 'insurance_finance'
  | 'life_memory'
  | 'custom';

export interface FamilyArchiveRecord {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar: string;
  memberRoleLabel?: string;
  title: string;
  category: ArchiveCategory;
  categoryLabel: string;
  description: string;
  date: string;
  tags: string[];
  isArchived: boolean;
  archivedAt?: string;
  archivedReason?: string;
  createdBy: string;
  createdAt: string;
  importance?: 'normal' | 'important' | 'top_secret';
}

// 基础档案外来人员开放权限配置 (仅主成员可设置)
export interface MemberArchivePermissions {
  isOpenToService: boolean; // 是否对外来服务人员开放基础档案与阶段任务
  allowedServiceTypes: (ServiceType | string)[]; // 允许介入的服务类型，如 ['medical_escort', 'nanny']
  authorizedPersonnelIds?: string[]; // 显式授权的服务人员ID列表
  allowViewHealthVitals?: boolean; // 允许查阅基础体征与历史健康记录
  canViewHealthVitals?: boolean;
  allowExecuteStageTasks?: boolean; // 允许执行档案下阶段任务并打卡
  canExecuteStageTasks?: boolean;
  allowUploadMedicalDocs?: boolean; // 允许上传就诊病历/检查报告/处方
  canUploadMedicalDocs?: boolean;
  requireOwnerApproval?: boolean; // 任务完结或关键操作需主成员审批
  requireApprovalForArchive?: boolean;
  updatedBy: string;
  updatedAt: string;
}

// 成员基础档案
export interface MemberBaseProfile {
  memberId: string;
  name: string;
  avatar: string;
  relation: string; // 如 "长辈", "幼儿", "长子", "母亲/主成员", "父亲"
  gender: 'male' | 'female';
  age: string;
  birthday?: string;
  bloodType?: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: string;
  notes: string;
  servicePermissions: MemberArchivePermissions;
}

// 阶段任务类型
export type StageTaskType =
  | 'medical_escort' // 门诊陪诊
  | 'chronic_disease' // 慢性病管理
  | 'vaccine_checkup' // 疫苗体检
  | 'rehabilitation' // 阶段康复
  | 'habit_growth' // 习惯成长
  | 'daily_care' // 日常照料
  | 'custom'; // 自定义阶段任务

// 阶段任务下外来服务人员或家属的操作记录
export interface StageTaskServiceRecord {
  id: string;
  taskId?: string;
  operatorId?: string;
  operatorName: string;
  operatorRole: string; // 如 "陪诊员", "育儿嫂", "妈妈", "爸爸"
  operatorAvatar?: string;
  isExternalStaff: boolean; // 是否为外来服务人员操作
  actionType: 'checkin' | 'vital_log' | 'doctor_summary' | 'medication_feed' | 'photo_report' | 'notes';
  actionTypeLabel: string;
  time?: string;
  date?: string;
  timestamp?: string;
  content: string;
  attachments?: string[];
  vitals?: {
    systolic?: number;
    diastolic?: number;
    pulse?: number;
    glucose?: number;
    bloodSugar?: number;
    temperature?: number;
  };
}

// 档案下的阶段任务 (任务完成后可归档)
export interface ProfileStageTask {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar: string;
  title: string;
  taskType: StageTaskType;
  taskTypeLabel: string;
  stageName: string; // 阶段名称，如 "初诊及检查期", "服药调理期", "视力矫正阶段", "康复观察期"
  goal: string; // 阶段目标说明
  startDate: string;
  targetEndDate?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'normal' | 'important' | 'urgent';
  // 指派人员（可指派外来服务人员，如陪诊员张明，也可指派家属）
  assigneeId: string;
  assigneeName: string;
  assigneeRole: string;
  isServiceAssigned: boolean; // 是否指派给外来服务人员
  // 阶段任务下累计的操作记录 (所有外来人员的就医、打卡、测量均在此沉淀)
  records: StageTaskServiceRecord[];
  // 归档状态
  isArchived: boolean;
  archivedAt?: string;
  archivedReason?: string;
  archivedBy?: string;
  createdAt: string;
  createdBy: string;
}

