import React, { useState } from 'react';
import { ProfileStageTask } from '../../../types';
import { X, Archive, CheckCircle2, ShieldCheck, FileCheck } from 'lucide-react';

interface ArchiveTaskModalProps {
  task: ProfileStageTask;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const PRESET_REASONS = [
  '三甲专科门诊陪诊完成，专家医嘱与调整处方已完整归档备查',
  '慢病阶段指标平稳达标，收缩压已连续控制在健康范围，进入常规随访',
  '疫苗加强接种完成，现场留观无不良反应，体检报告已录入',
  '术后阶段康复复查达成既定视力与眼压目标，主治医嘱评估良好',
  '辅食与生活作息规律阶段过渡顺利，达标结案封存',
];

export const ArchiveTaskModal: React.FC<ArchiveTaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const [selectedPreset, setSelectedPreset] = useState(PRESET_REASONS[0]);
  const [customReason, setCustomReason] = useState('');

  const finalReason = customReason.trim() || selectedPreset;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(finalReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
      <div
        id="modal-archive-stage-task"
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-emerald-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                完成并归档阶段任务
              </h3>
              <p className="text-[11px] text-stone-500">
                任务完结后将封存至历史档案库，记录永久保留
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

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/80 space-y-1">
            <div className="text-[11px] text-stone-400 font-bold">准备归档的任务：</div>
            <div className="font-bold text-stone-900 text-xs">{task.title}</div>
            <div className="text-[11px] text-stone-500 flex items-center gap-2 pt-0.5">
              <span>阶段: {task.stageName}</span>
              <span>·</span>
              <span>执行人: {task.assigneeName}</span>
              <span>·</span>
              <span>已沉淀记录: {task.records.length} 条</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-700 mb-1.5 flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>选择归档达标结案原因：</span>
            </label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {PRESET_REASONS.map((reason, idx) => (
                <label
                  key={idx}
                  className={`flex items-start gap-2 p-2 rounded-xl border text-[11px] cursor-pointer transition ${
                    selectedPreset === reason && !customReason
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="archivePreset"
                    checked={selectedPreset === reason && !customReason}
                    onChange={() => {
                      setSelectedPreset(reason);
                      setCustomReason('');
                    }}
                    className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-700 mb-1">
              或输入自定义归档总结说明：
            </label>
            <textarea
              rows={2}
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="可补充具体的总结、复查结论或下一阶段提醒..."
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 resize-none bg-white"
            />
          </div>

          <div className="bg-amber-50/80 p-2.5 rounded-2xl border border-amber-200/80 flex items-start gap-2 text-[11px] text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              归档后，此任务将移至已归档列表，所有就医处方、服务打卡及体征数据永久安全保存，随时可查阅或重新解档激活。
            </span>
          </div>

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
              <CheckCircle2 className="w-4 h-4" />
              <span>确认归档任务</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
