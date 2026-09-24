import React, { useState } from 'react';
import { MemberBaseProfile, ProfileStageTask, StageTaskType, FamilyMember } from '../../../types';
import { X, Calendar, User, Target, Stethoscope, Activity, Check, Sparkles, Clock, AlertTriangle } from 'lucide-react';

interface CreateStageTaskModalProps {
  profile: MemberBaseProfile;
  isOpen: boolean;
  onClose: () => void;
  members: FamilyMember[];
  onCreate: (task: Omit<ProfileStageTask, 'id' | 'records' | 'isArchived' | 'createdAt'>) => void;
}

const TASK_TYPE_OPTIONS: { type: StageTaskType; label: string; icon: string; desc: string }[] = [
  { type: 'medical_escort', label: '门诊陪诊', icon: '🩺', desc: '三甲就医接送、挂号就诊排队、检查陪护与病历处方代取' },
  { type: 'chronic_disease', label: '慢性病管理', icon: '💊', desc: '高血压/高血糖/心脏慢病日常监测、早晚测压、按时服药管理' },
  { type: 'vaccine_checkup', label: '疫苗体检', icon: '💉', desc: '幼儿疫苗定期接种、老人专科体检预约与出行陪同' },
  { type: 'rehabilitation', label: '阶段康复', icon: '🏃', desc: '术后复查、骨科理疗、眼科视力随访等阶段性恢复管理' },
  { type: 'daily_care', label: '生活照料', icon: '🍼', desc: '幼儿辅食转配方、敏感期护理、起居生活阶段照护' },
  { type: 'habit_growth', label: '成长习惯', icon: '🌱', desc: '学龄视力防护、户外运动打卡、自律习惯阶段跟踪' },
];

export const CreateStageTaskModal: React.FC<CreateStageTaskModalProps> = ({
  profile,
  isOpen,
  onClose,
  members,
  onCreate,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [taskType, setTaskType] = useState<StageTaskType>('medical_escort');
  const [stageName, setStageName] = useState('初诊与就医检查阶段');
  const [goal, setGoal] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [targetEndDate, setTargetEndDate] = useState('');
  const [priority, setPriority] = useState<'normal' | 'important' | 'urgent'>('important');
  const [assigneeId, setAssigneeId] = useState<string>(
    members.find((m) => m.role === 'temporary_service')?.id || members[0]?.id || ''
  );

  const selectedAssignee = members.find((m) => m.id === assigneeId) || members[0];
  const isServiceAssigned = selectedAssignee?.role === 'temporary_service';

  // 快捷预设模版
  const handlePresetSelect = (preset: {
    title: string;
    type: StageTaskType;
    stage: string;
    goal: string;
  }) => {
    setTitle(preset.title);
    setTaskType(preset.type);
    setStageName(preset.stage);
    setGoal(preset.goal);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskTypeLabel = TASK_TYPE_OPTIONS.find((t) => t.type === taskType)?.label || '阶段任务';

    onCreate({
      memberId: profile.memberId,
      memberName: profile.name,
      memberAvatar: profile.avatar,
      title: title.trim(),
      taskType,
      taskTypeLabel,
      stageName: stageName.trim() || '执行阶段',
      goal: goal.trim(),
      startDate,
      targetEndDate: targetEndDate || undefined,
      status: 'in_progress',
      priority,
      assigneeId: selectedAssignee.id,
      assigneeName: selectedAssignee.name,
      assigneeRole: selectedAssignee.roleLabel,
      isServiceAssigned,
      createdBy: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
      <div
        id="modal-create-stage-task"
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-2xl bg-white shadow-xs border border-stone-200 flex items-center justify-center text-xl">
              {profile.avatar}
            </span>
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                新建【{profile.name}】档案阶段任务
              </h3>
              <p className="text-[11px] text-stone-500">
                外来服务人员对该成员的操作将基于此任务展开并沉淀，完成后可归档
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 text-xs flex-1">
          {/* 快捷参考预设 */}
          <div className="bg-emerald-50/60 p-2.5 rounded-2xl border border-emerald-200/60 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-emerald-800 font-bold">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>常用阶段任务预设模版（点击一键填充）：</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() =>
                  handlePresetSelect({
                    title: `朝阳医院专科门诊就医陪诊与处方代取`,
                    type: 'medical_escort',
                    stage: '专家门诊就医阶段',
                    goal: '协助长辈前往三甲医院专科门诊，完成检查预约、陪护看诊并取回报销单据及处方医嘱',
                  })
                }
                className="px-2 py-1 bg-white hover:bg-emerald-100/70 border border-emerald-200 text-emerald-900 rounded-lg text-[10px] font-bold transition"
              >
                🩺 专科门诊陪诊
              </button>
              <button
                type="button"
                onClick={() =>
                  handlePresetSelect({
                    title: `2026春季高血压慢病日常早晚血压平稳监测`,
                    type: 'chronic_disease',
                    stage: '血压连续监测平稳期',
                    goal: '每日早晚按时遵医嘱服药，监测双侧坐位血压并打卡记录，确保收缩压在135以下',
                  })
                }
                className="px-2 py-1 bg-white hover:bg-emerald-100/70 border border-emerald-200 text-emerald-900 rounded-lg text-[10px] font-bold transition"
              >
                💊 慢病服药测压
              </button>
              <button
                type="button"
                onClick={() =>
                  handlePresetSelect({
                    title: `社区卫生服务中心疫苗加强针与儿童体检`,
                    type: 'vaccine_checkup',
                    stage: '接种预约出行期',
                    goal: '带齐接种证与防风保暖衣物，完成第四剂肺炎疫苗接种并测量身高体重发育',
                  })
                }
                className="px-2 py-1 bg-white hover:bg-emerald-100/70 border border-emerald-200 text-emerald-900 rounded-lg text-[10px] font-bold transition"
              >
                💉 疫苗加强接种
              </button>
              <button
                type="button"
                onClick={() =>
                  handlePresetSelect({
                    title: `术后康复复查与视力随访阶段`,
                    type: 'rehabilitation',
                    stage: '术后随访评估期',
                    goal: '跟踪人工晶状体植入后裸眼视力与眼压恢复，完成主治医生终期复测',
                  })
                }
                className="px-2 py-1 bg-white hover:bg-emerald-100/70 border border-emerald-200 text-emerald-900 rounded-lg text-[10px] font-bold transition"
              >
                🏃 术后阶段康复
              </button>
            </div>
          </div>

          {/* 任务类型单选 */}
          <div>
            <label className="block text-[11px] font-bold text-stone-700 mb-1.5">
              选择任务类别
            </label>
            <div className="grid grid-cols-3 gap-2">
              {TASK_TYPE_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.type}
                  onClick={() => setTaskType(opt.type)}
                  className={`p-2 rounded-2xl border text-left transition flex flex-col justify-between ${
                    taskType === opt.type
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-1 text-xs">
                    <span>{opt.icon}</span>
                    <span>{opt.label}</span>
                  </div>
                  <span className="text-[9px] text-stone-400 line-clamp-1 mt-1">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 任务标题 */}
          <div>
            <label className="block text-[11px] font-bold text-stone-700 mb-1">
              阶段任务标题 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如: 朝阳医院心内科专家门诊陪诊与动态心电图复查"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-white"
              required
            />
          </div>

          {/* 阶段名称与紧急程度 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                当前阶段划分名称
              </label>
              <input
                type="text"
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                placeholder="例如: 专家门诊就医阶段 / 平稳期监测"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                任务优先级
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-white"
              >
                <option value="normal">⚪ 普通跟进</option>
                <option value="important">🟡 重点照料 (重要)</option>
                <option value="urgent">🔴 紧迫 / 就医就诊专办</option>
              </select>
            </div>
          </div>

          {/* 指派执行人员 (外来人员或家属) */}
          <div>
            <label className="block text-[11px] font-bold text-stone-700 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 text-stone-400" />
                <span>指派执行人 (外来服务人员或家庭成员)</span>
              </span>
              {isServiceAssigned && (
                <span className="text-[10px] text-sky-700 font-bold bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                  外来服务人员 · 操作权限将基于此任务开放
                </span>
              )}
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-white"
            >
              <optgroup label="外来临时服务人员 (基于此任务执行与打卡)">
                {members
                  .filter((m) => m.role === 'temporary_service')
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.avatar} {m.name} ({m.serviceTitle || '专业人员'})
                    </option>
                  ))}
              </optgroup>
              <optgroup label="家庭内部核心成员">
                {members
                  .filter((m) => m.role !== 'temporary_service')
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.avatar} {m.name} ({m.roleLabel})
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          {/* 阶段照料目标 */}
          <div>
            <label className="block text-[11px] font-bold text-stone-700 mb-1 flex items-center gap-1">
              <Target className="w-3 h-3 text-stone-400" />
              <span>阶段核心目标与达标标准说明</span>
            </label>
            <textarea
              rows={2}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="明确该阶段需要完成的事项，例如：看诊后取回药物并调整用药剂量，收缩压连续两周维持在130以下..."
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 resize-none bg-white"
            />
          </div>

          {/* 时间跨度 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-stone-400" />
                <span>开始执行日期</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-stone-400" />
                <span>预期结案/归档日期</span>
              </label>
              <input
                type="date"
                value={targetEndDate}
                onChange={(e) => setTargetEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 bg-white"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 font-bold transition"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 transition shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>新建阶段任务</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
