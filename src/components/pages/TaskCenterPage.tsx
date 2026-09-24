import React, { useState } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { FamilyTask, TaskCategory, TaskStatus } from '../../types';
import {
  CheckSquare,
  Plus,
  Clock,
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

  const filteredTasks = tasks.filter((t) => {
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
          全部 ({tasks.length})
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`flex-1 py-1.5 rounded-lg transition ${
            filterStatus === 'pending'
              ? 'bg-white text-emerald-800 shadow-xs font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          进行与待办 ({tasks.filter((t) => t.status !== 'completed').length})
        </button>
        <button
          onClick={() => setFilterStatus('completed')}
          className={`flex-1 py-1.5 rounded-lg transition ${
            filterStatus === 'completed'
              ? 'bg-white text-stone-900 shadow-xs font-bold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          已完成 ({tasks.filter((t) => t.status === 'completed').length})
        </button>
      </div>

      {/* 新建任务表单抽屉/弹层 */}
      {isCreatingTask && (
        <form
          onSubmit={handleCreateTaskSubmit}
          className="bg-white rounded-2xl p-4 border-2 border-emerald-500 shadow-lg space-y-3 animate-fadeIn"
        >
          <div className="flex items-center justify-between pb-1 border-b border-stone-100">
            <h3 className="font-bold text-sm text-stone-900">创建新家庭协作任务</h3>
            <button
              type="button"
              onClick={() => setIsCreatingTask(false)}
              className="text-stone-400 hover:text-stone-600 text-xs font-bold"
            >
              关闭
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">任务名称</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：下午16:30接小宝放学 / 爷爷陪诊"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50/50 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-stone-700 block mb-1">任务类型</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50/50 text-xs"
                >
                  <option value="baby">👶 宝宝育儿</option>
                  <option value="elderly">👴 老人健康</option>
                  <option value="cleaning">🏠 家务保洁</option>
                  <option value="errand">🛒 家庭杂事</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">指派负责人</label>
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50/50 text-xs"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.avatar} {m.name} ({m.roleLabel.split(' ')[0]})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">执行时间</label>
              <input
                type="text"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                placeholder="今日 16:30 / 本周六 09:30"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50/50 text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">注意事项 / 备注说明</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="如需要带水壶、注意添衣等..."
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50/50 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreatingTask(false)}
              className="px-3 py-2 text-xs text-stone-600 bg-stone-100 rounded-xl"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs"
            >
              确认发布
            </button>
          </div>
        </form>
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
                      <button
                        onClick={() => updateTaskStatus(task.id, 'in_progress')}
                        className="px-2.5 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg font-bold text-xs border border-sky-200 transition"
                      >
                        开始执行
                      </button>
                    )}

                    {!isCompleted && (
                      <button
                        onClick={() => {
                          updateTaskStatus(
                            task.id,
                            'completed',
                            'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=600&auto=format&fit=crop&q=80',
                            '服务打卡照片已同步归档'
                          );
                        }}
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
    </div>
  );
};
