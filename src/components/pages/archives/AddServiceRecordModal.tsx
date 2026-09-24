import React, { useState } from 'react';
import { ProfileStageTask, StageTaskServiceRecord, FamilyMember } from '../../../types';
import { X, Activity, FileText, Check, Camera, Plus, Trash2, Heart, Stethoscope, Clock } from 'lucide-react';

interface AddServiceRecordModalProps {
  task: ProfileStageTask;
  currentUser: FamilyMember;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (record: Omit<StageTaskServiceRecord, 'id'>) => void;
}

const ACTION_TYPE_OPTIONS: {
  type: StageTaskServiceRecord['actionType'];
  label: string;
  icon: string;
  desc: string;
}[] = [
  { type: 'doctor_summary', label: '看诊医嘱记录', icon: '🩺', desc: '记录医生诊断意见、换药建议、复查预约与用药调整' },
  { type: 'vital_log', label: '生命体征测报', icon: '💓', desc: '测量并上传早晚血压、心率脉搏、血糖或体温数据' },
  { type: 'checkin', label: '陪护/到达打卡', icon: '📍', desc: '准时接送、到达医院候诊、排队取号及检查室就位打卡' },
  { type: 'medication_feed', label: '服药/处置记录', icon: '💊', desc: '按时协助服药、滴眼药水、伤口换药或生活护理' },
  { type: 'photo_report', label: '凭证与处方上传', icon: '📷', desc: '上传发票报销凭单、门诊病历拍照、动态心电图佩戴照' },
  { type: 'notes', label: '阶段工作说明', icon: '📝', desc: '向家属总结阶段进展或提示下一阶段照料注意事项' },
];

export const AddServiceRecordModal: React.FC<AddServiceRecordModalProps> = ({
  task,
  currentUser,
  isOpen,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const [actionType, setActionType] = useState<StageTaskServiceRecord['actionType']>('doctor_summary');
  const [content, setContent] = useState('');
  const [hasVitals, setHasVitals] = useState(task.taskType === 'chronic_disease' || task.taskType === 'medical_escort');
  const [systolic, setSystolic] = useState('128');
  const [diastolic, setDiastolic] = useState('82');
  const [pulse, setPulse] = useState('74');
  const [bloodSugar, setBloodSugar] = useState('');
  const [attachments, setAttachments] = useState<string[]>([
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500&auto=format&fit=crop&q=80',
  ]);
  const [newAttachmentUrl, setNewAttachmentUrl] = useState('');

  const isExternalStaff = currentUser.role === 'temporary_service';

  // 快捷填入模板
  const handleQuickFill = (type: StageTaskServiceRecord['actionType'], sampleText: string) => {
    setActionType(type);
    setContent(sampleText);
  };

  const handleAddAttachment = () => {
    if (!newAttachmentUrl.trim()) return;
    setAttachments((prev) => [...prev, newAttachmentUrl.trim()]);
    setNewAttachmentUrl('');
  };

  const handleRemoveAttachment = (idx: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const actionTypeLabel = ACTION_TYPE_OPTIONS.find((a) => a.type === actionType)?.label || '操作记录';
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const date = `${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

    onSubmit({
      timestamp: `${date} ${time}`,
      operatorName: currentUser.name,
      operatorRole: currentUser.roleLabel,
      operatorAvatar: currentUser.avatar,
      isExternalStaff,
      actionType,
      actionTypeLabel,
      content: content.trim(),
      vitals: hasVitals
        ? {
            systolic: Number(systolic) || undefined,
            diastolic: Number(diastolic) || undefined,
            pulse: Number(pulse) || undefined,
            bloodSugar: Number(bloodSugar) || undefined,
          }
        : undefined,
      attachments: attachments.length > 0 ? attachments : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
      <div
        id="modal-add-service-record"
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                {task.taskTypeLabel}
              </span>
              <h3 className="text-sm font-bold text-stone-900 line-clamp-1">
                提交操作记录：{task.title}
              </h3>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              操作人员：<span className="font-bold text-stone-800">{currentUser.name}</span> ({currentUser.roleLabel})
              {isExternalStaff && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-sky-50 text-sky-700 rounded border border-sky-200 font-bold">
                  外来服务打卡
                </span>
              )}
            </p>
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
          {/* 快捷输入助手 */}
          <div className="bg-stone-50 p-2.5 rounded-2xl border border-stone-200/80 space-y-1.5">
            <span className="text-[11px] font-bold text-stone-600 block">快捷套用服务操作模板：</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() =>
                  handleQuickFill(
                    'doctor_summary',
                    '主治心内科医生评估：收缩压改善明显，晨起头晕症状缓解。将络活喜每日5mg调整为维持量，24小时动态心电图已佩戴完毕，叮嘱保持日常作息，明日下午准时取下回送读卡。'
                  )
                }
                className="px-2 py-1 bg-white hover:bg-stone-100 border border-stone-200 text-stone-800 rounded-lg text-[10px] font-bold"
              >
                🩺 门诊看诊医嘱
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickFill(
                    'checkin',
                    '已准时到达医院门诊大厅协助取号。挂号序号：心内科专家号32号，目前在候诊区陪同长辈休息并测得晨起血压平稳。'
                  )
                }
                className="px-2 py-1 bg-white hover:bg-stone-100 border border-stone-200 text-stone-800 rounded-lg text-[10px] font-bold"
              >
                📍 陪诊到达打卡
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickFill(
                    'vital_log',
                    '今日晨间血压测量完成，坐位安静测量5分钟后测得。高压126，低压80，脉搏74，按时遵医嘱温水送服降压药。'
                  )
                }
                className="px-2 py-1 bg-white hover:bg-stone-100 border border-stone-200 text-stone-800 rounded-lg text-[10px] font-bold"
              >
                💓 血压晨起测报
              </button>
            </div>
          </div>

          {/* 操作类别选择 */}
          <div>
            <label className="block text-[11px] font-bold text-stone-700 mb-1.5">
              操作记录类型
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ACTION_TYPE_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.type}
                  onClick={() => setActionType(opt.type)}
                  className={`p-2 rounded-2xl border text-left transition flex flex-col justify-between ${
                    actionType === opt.type
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

          {/* 详细描述 */}
          <div>
            <label className="block text-[11px] font-bold text-stone-700 mb-1">
              操作详情与就医说明 <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="请详细描述陪诊进展、就诊建议、患者体感或照护细节..."
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600 resize-none bg-white"
              required
            />
          </div>

          {/* 体征数据记录选项 */}
          <div className="bg-stone-50/70 p-3 rounded-2xl border border-stone-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasVitals}
                  onChange={(e) => setHasVitals(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>记录本次体征指标 (同步更新档案健康看板)</span>
                </span>
              </label>
            </div>

            {hasVitals && (
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <div>
                  <label className="block text-[10px] text-stone-500 font-bold mb-0.5">
                    收缩压 (高压 mmHg)
                  </label>
                  <input
                    type="number"
                    value={systolic}
                    onChange={(e) => setSystolic(e.target.value)}
                    placeholder="128"
                    className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 text-xs bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-stone-500 font-bold mb-0.5">
                    舒张压 (低压 mmHg)
                  </label>
                  <input
                    type="number"
                    value={diastolic}
                    onChange={(e) => setDiastolic(e.target.value)}
                    placeholder="82"
                    className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 text-xs bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-stone-500 font-bold mb-0.5">
                    脉搏心率 (bpm)
                  </label>
                  <input
                    type="number"
                    value={pulse}
                    onChange={(e) => setPulse(e.target.value)}
                    placeholder="74"
                    className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 text-xs bg-white font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 处方与凭据附件 */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-stone-700 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-stone-500" />
                <span>病历、处方单、发票报销单或陪诊打卡照片</span>
              </span>
              <span className="text-[10px] text-stone-400">已添加 {attachments.length} 张</span>
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={newAttachmentUrl}
                onChange={(e) => setNewAttachmentUrl(e.target.value)}
                placeholder="输入照片图片URL或点击添加样例凭单"
                className="flex-1 px-3 py-1.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-emerald-600"
              />
              <button
                type="button"
                onClick={handleAddAttachment}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>添加</span>
              </button>
            </div>

            {attachments.length > 0 && (
              <div className="flex gap-2 overflow-x-auto py-1">
                {attachments.map((imgUrl, idx) => (
                  <div key={idx} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-stone-200 shrink-0">
                    <img src={imgUrl} alt="凭据" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(idx)}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/70 text-white rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              <span>提交并同步到档案</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
