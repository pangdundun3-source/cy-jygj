import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useFamily } from '../../context/FamilyContext';
import { FamilyTask, TaskCategory, TaskStatus } from '../../types';
import {
  CheckSquare,
  Plus,
  X,
  Clock,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Camera,
  ChevronRight,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TaskCenterPage: React.FC = () => {
  const {
    tasks,
    members,
    addTask,
    updateTaskStatus,
    deleteTask,
    openTaskCheckIn,
    currentUserMember,
    showToast,
  } = useFamily();

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isCreatingTask, setIsCreatingTask] = useState<boolean>(false);

  // New task form state
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<TaskCategory>('baby');
  const [assigneeId, setAssigneeId] = useState<string>(members[0]?.id || 'm_mom');
  const [scheduledTime, setScheduledTime] = useState<string>('今日 16:30');
  const [note, setNote] = useState<string>('');

  const visibleTasks = tasks.filter((task) => {
    if (task.status !== 'completed') return true;
    if (!task.completedOn) return true;
    const completed = new Date(`${task.completedOn}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const keptDays = (today.getTime() - completed.getTime()) / 86400000;
    return keptDays < 30;
  });

  const filteredTasks = visibleTasks.filter((t) => {
    if (filterStatus === 'pending' && t.status === 'completed') return false;
    if (filterStatus === 'completed' && t.status !== 'completed') return false;
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    return true;
  });

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('请输入任务标题', 'warning');
      return;
    }
    const assignee = members.find((m) => m.id === assigneeId) || members[0];
    const categoryLabels: Record<TaskCategory, string> = {
      baby: '育儿照护',
      elderly: '老人健康',
      cleaning: '家务保洁',
      errand: '家庭事务',
    };

    addTask({
      title,
      category,
      categoryLabel: categoryLabels[category],
      assigneeId: assignee.id,
      assigneeName: assignee.name,
      assigneeAvatar: assignee.avatar,
      assigneeRole: assignee.roleLabel,
      scheduledTime,
      dueDate: scheduledTime,
      priority: 'high',
      note: note || '请按时完成并进行照片打卡。',
    });

    setTitle('');
    setNote('');
    setIsCreatingTask(false);
  };

  return (
    <div className="pb-6 pt-2 px-4 space-y-4 max-w-md mx-auto animate-fadeIn">
      {/* 顶部标题与新建按钮 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight">家庭任务中心</h2>
          <p className="text-xs text-stone-600">轻量家庭协作 · 支持服务人员接单打卡</p>
        </div>
        <button
          id="btn-new-task"
          onClick={() => setIsCreatingTask(true)}
          className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>新建任务</span>
        </button>
      </div>

      {/* 状态筛选切换 (全部 / 待完成 / 已完成) */}
      <div className="flex items-center gap-1.5 bg-stone-200/80 p-1 rounded-xl text-xs font-semibold">
        <button
          onClick={() => setFilterStatus('all')}
          className={`flex-1 py-1.5 rounded-lg transition ${
            filterStatus === 'all'
              ? 'bg-white text-stone-900 shadow-xs font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          全部 ({visibleTasks.length})
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`flex-1 py-1.5 rounded-lg transition ${
            filterStatus === 'pending'
              ? 'bg-white text-emerald-800 shadow-xs font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          进行与待办 ({visibleTasks.filter((t) => t.status !== 'completed').length})
        </button>
        <button
          onClick={() => setFilterStatus('completed')}
          className={`flex-1 py-1.5 rounded-lg transition ${
            filterStatus === 'completed'
              ? 'bg-white text-stone-900 shadow-xs font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          已完成 ({visibleTasks.filter((t) => t.status === 'completed').length})
        </button>
      </div>

      {/* 新建任务表单抽屉/弹层 */}
      {isCreatingTask && createPortal(
        <div
          className="absolute inset-0 z-50 bg-stone-900/40 flex items-end"
          onClick={() => setIsCreatingTask(false)}
        >
          <form
            onSubmit={handleCreateTaskSubmit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-h-[78%] overflow-y-auto bg-[#FBFBF9] rounded-t-[1.6rem] px-4 pt-2.5 pb-5 shadow-2xl space-y-3 animate-fadeIn"
          >
            <div className="mx-auto w-9 h-1 rounded-full bg-stone-300" />
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-stone-900">发布任务</h3>
                <p className="text-[10px] text-stone-500 mt-0.5">指派给家人或服务人员</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreatingTask(false)}
                className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center"
                aria-label="关闭"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <label className="block">
              <span className="text-[11px] font-bold text-stone-500">做什么</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：接小宝放学"
                className="mt-1 w-full px-3 py-2.5 rounded-2xl border border-stone-200 bg-white text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </label>

            <div>
              <span className="text-[11px] font-bold text-stone-500">类型</span>
              <div className="mt-1 grid grid-cols-4 gap-1.5">
                {(
                  [
                    ['baby', '育儿'],
                    ['elderly', '健康'],
                    ['cleaning', '保洁'],
                    ['errand', '杂事'],
                  ] as [TaskCategory, string][]
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setCategory(id)}
                    className={`py-2 rounded-xl text-[11px] font-bold ${
                      category === id
                        ? 'bg-emerald-700 text-white'
                        : 'bg-white text-stone-600 border border-stone-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <label className="block">
                <span className="text-[11px] font-bold text-stone-500">谁来做</span>
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="mt-1 w-full px-3 py-2.5 rounded-2xl border border-stone-200 bg-white text-xs font-medium text-stone-800"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.avatar} {m.name}
                    </option>
                  ))}
                </select>
              </label>

              <div>
                <span className="text-[11px] font-bold text-stone-500">什么时候</span>
                <div className="mt-1 flex gap-1.5">
                  {['今日 16:30', '明日 09:00', '本周六 09:30'].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setScheduledTime(slot)}
                      className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold ${
                        scheduledTime === slot
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : 'bg-white text-stone-500 border border-stone-200'
                      }`}
                    >
                      {slot.split(' ')[0]}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  placeholder="今日 16:30"
                  className="mt-1.5 w-full px-3 py-2.5 rounded-2xl border border-stone-200 bg-white text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <label className="block">
              <span className="text-[11px] font-bold text-stone-500">备注</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="需要带的东西、注意事项"
                rows={2}
                className="mt-1 w-full px-3 py-2.5 rounded-2xl border border-stone-200 bg-white text-xs font-medium text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </label>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-2xl"
            >
              发布
            </button>
          </form>
        </div>,
        document.querySelector('[data-phone-frame]') ?? document.body
      )}

      {/* 任务列表 */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-stone-200 text-stone-400 text-xs">
            暂无匹配的家庭任务
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const isInProgress = task.status === 'in_progress';
            return (
              <div
                key={task.id}
                className={`bg-white rounded-2xl p-4 border transition-all shadow-xs space-y-3 ${
                  isCompleted
                    ? 'border-stone-200/80 bg-stone-50/50 opacity-80'
                    : isInProgress
                    ? 'border-sky-300 ring-1 ring-sky-200'
                    : 'border-stone-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-stone-100 text-stone-700">
                        {task.categoryLabel}
                      </span>
                      <span className="text-xs text-stone-500 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3 text-stone-400" />
                        {task.scheduledTime}
                      </span>
                    </div>
                    <h3
                      className={`font-bold text-sm text-stone-900 mt-1.5 ${
                        isCompleted ? 'line-through text-stone-500' : ''
                      }`}
                    >
                      {task.title}
                    </h3>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : isInProgress
                        ? 'bg-sky-100 text-sky-800 animate-pulse'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isCompleted ? '已完成' : isInProgress ? '进行中' : '待开始'}
                  </span>
                </div>

                <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100 leading-relaxed">
                  {task.note}
                </p>

                {/* 负责人与操作流 */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{task.assigneeAvatar}</span>
                    <div>
                      <span className="font-bold text-stone-800 block text-xs">
                        {task.assigneeName}
                      </span>
                      <span className="text-[10px] text-stone-500">{task.assigneeRole}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {!isCompleted && !isInProgress && (
                      <>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="px-2 py-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg font-bold text-xs border border-stone-200 transition flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          删除
                        </button>
                        <button
                          onClick={() => updateTaskStatus(task.id, 'in_progress')}
                          className="px-2.5 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg font-bold text-xs border border-sky-200 transition"
                        >
                          开始执行
                        </button>
                      </>
                    )}

                    {isInProgress && (
                      <button
                        onClick={() => openTaskCheckIn(task)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs shadow-2xs transition flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>打卡完成</span>
                      </button>
                    )}

                    {isCompleted && (
                      <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>已归档至动态</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <p className="text-center text-[11px] text-stone-400 leading-relaxed px-2">
        已完成的任务只保留 30 天，到期后自动清空
      </p>
    </div>
  );
};
