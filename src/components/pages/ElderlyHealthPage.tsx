import React, { useState } from 'react';
import { useFamily } from '../../context/FamilyContext';
import {
  ChevronLeft,
  HeartPulse,
  Pill,
  FileText,
  Plus,
  CheckCircle2,
  Clock,
  Activity,
  AlertCircle,
  Calendar,
  Sparkles,
  Stethoscope,
} from 'lucide-react';

export const ElderlyHealthPage: React.FC = () => {
  const {
    elderlyProfile,
    setCurrentSubView,
    toggleMedication,
    addHealthLog,
    currentUserMember,
    showToast,
  } = useFamily();

  const [isLoggingBP, setIsLoggingBP] = useState<boolean>(false);
  const [systolic, setSystolic] = useState<number>(128);
  const [diastolic, setDiastolic] = useState<number>(80);
  const [pulse, setPulse] = useState<number>(72);

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addHealthLog(systolic, diastolic, pulse);
    setIsLoggingBP(false);
  };

  return (
    <div className="pb-6 pt-2 px-4 space-y-4 max-w-md mx-auto animate-fadeIn">
      {/* 顶部返回导航 */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentSubView('none')}
          className="flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>返回首页</span>
        </button>
        <span className="text-xs font-bold text-stone-800">老人健康档案</span>
        <button
          onClick={() => {
            setCurrentSubView('ai_assistant');
            showToast('已进入AI管家，可快速咨询爷爷健康调理与用药', 'info');
          }}
          className="flex items-center gap-1 text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200 shadow-xs transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-600" />
          <span>健康AI问答</span>
        </button>
      </div>

      {/* 爷爷健康名片 */}
      <div className="bg-gradient-to-br from-rose-50/70 via-stone-50 to-white rounded-3xl p-5 border border-rose-200/90 shadow-xs space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-3xl bg-rose-100 border-2 border-rose-300 flex items-center justify-center text-3xl shadow-sm">
              👴
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-stone-900">{elderlyProfile.name}</h2>
                <span className="text-xs text-stone-500 font-medium">({elderlyProfile.relation})</span>
                <span className="px-2 py-0.5 bg-rose-100 text-rose-900 rounded-full text-[11px] font-bold">
                  {elderlyProfile.age}岁
                </span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {elderlyProfile.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-white/90 border border-rose-200 text-rose-800 text-[10px] font-semibold rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 生理体征两大核心面板 */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {/* 今日血压 */}
          <div className="bg-white rounded-2xl p-3.5 border border-rose-200/80 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="font-semibold text-rose-900">今日血压 (晨测)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="text-xl font-black text-stone-900">
              {elderlyProfile.currentBloodPressure.systolic}/
              {elderlyProfile.currentBloodPressure.diastolic}
              <span className="text-[11px] font-normal text-stone-500 ml-1">mmHg</span>
            </div>
            <div className="text-[10px] text-emerald-700 font-bold flex items-center justify-between">
              <span>状态：控制平稳</span>
              <span className="text-stone-400 font-normal">
                {elderlyProfile.currentBloodPressure.measuredTime}
              </span>
            </div>
          </div>

          {/* 今日血糖 */}
          <div className="bg-white rounded-2xl p-3.5 border border-rose-200/80 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="font-semibold text-stone-800">空腹血糖</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="text-xl font-black text-stone-900">
              {elderlyProfile.bloodGlucose.value}
              <span className="text-[11px] font-normal text-stone-500 ml-1">mmol/L</span>
            </div>
            <div className="text-[10px] text-emerald-700 font-bold flex items-center justify-between">
              <span>指标正常</span>
              <span className="text-stone-400 font-normal">07:45 测</span>
            </div>
          </div>
        </div>

        {/* 快速录入新血压折叠 */}
        <div>
          {!isLoggingBP ? (
            <button
              onClick={() => setIsLoggingBP(true)}
              className="w-full py-2 bg-white/90 hover:bg-white border border-rose-200 text-rose-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>录入最新测量血压 / 血糖</span>
            </button>
          ) : (
            <form
              onSubmit={handleLogSubmit}
              className="bg-white p-3 rounded-2xl border border-rose-300 space-y-2.5 animate-fadeIn"
            >
              <h4 className="font-bold text-xs text-stone-900">快速归档血压数据</h4>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-stone-500 block mb-0.5">高压(收缩压)</label>
                  <input
                    type="number"
                    value={systolic}
                    onChange={(e) => setSystolic(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-300 text-xs font-bold text-stone-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-500 block mb-0.5">低压(舒张压)</label>
                  <input
                    type="number"
                    value={diastolic}
                    onChange={(e) => setDiastolic(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-300 text-xs font-bold text-stone-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-500 block mb-0.5">静息心率(bpm)</label>
                  <input
                    type="number"
                    value={pulse}
                    onChange={(e) => setPulse(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-300 text-xs font-bold text-stone-900"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsLoggingBP(false)}
                  className="px-3 py-1 text-xs text-stone-600 bg-stone-100 rounded-lg"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-lg shadow-xs"
                >
                  保存记录
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* 今日用药打卡与监督 */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-sm text-stone-900">今日用药打卡</h3>
          </div>
          <span className="text-xs text-stone-500">点击直接打卡</span>
        </div>

        <div className="space-y-2">
          {elderlyProfile.todayMedications.map((med) => (
            <div
              key={med.id}
              onClick={() => toggleMedication(med.id)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                med.completed
                  ? 'bg-emerald-50/70 border-emerald-300/80 shadow-2xs'
                  : 'bg-stone-50 border-stone-200/80 hover:bg-stone-100/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${
                    med.completed ? 'bg-emerald-200 text-emerald-800' : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  💊
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4
                      className={`font-bold text-xs ${
                        med.completed ? 'text-emerald-950 line-through' : 'text-stone-900'
                      }`}
                    >
                      {med.name}
                    </h4>
                    <span className="text-[10px] bg-white px-1.5 py-0.2 rounded border border-stone-200 text-stone-600">
                      {med.timeSlot}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    剂量：{med.dosage}
                    {med.takenBy ? ` · ${med.takenBy}` : ''}
                  </p>
                </div>
              </div>

              <div>
                {med.completed ? (
                  <span className="px-2 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 已服
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold">
                    待服
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 医院就诊与陪诊报告档案 */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-sky-700" />
            <h3 className="font-bold text-sm text-stone-900">医疗与陪诊复诊记录</h3>
          </div>
          <span className="text-xs text-stone-500 font-medium">三甲医院归档</span>
        </div>

        <div className="space-y-3">
          {elderlyProfile.medicalRecords.map((rec) => (
            <div
              key={rec.id}
              className="p-3.5 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sky-900 bg-sky-100 px-2 py-0.5 rounded text-[11px]">
                  {rec.department}
                </span>
                <span className="text-stone-500 text-[11px]">{rec.date}</span>
              </div>

              <div>
                <div className="font-bold text-stone-900 text-sm">{rec.hospital}</div>
                <div className="text-[11px] text-stone-500 mt-0.5">
                  主诊医师：{rec.doctor} · 陪诊人：{rec.escortName}
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-stone-700 leading-relaxed">
                <span className="font-bold text-stone-900">诊断与医嘱：</span>
                {rec.diagnosis}。{rec.summary}
              </div>

              {/* 报告附件 */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-stone-400 font-bold block">已归档报告附件:</span>
                {rec.reports.map((rep, idx) => (
                  <div
                    key={idx}
                    onClick={() => showToast(`正在预览附件：${rep.name}`, 'info')}
                    className="flex items-center justify-between p-2 rounded-lg bg-sky-50/70 border border-sky-200 text-sky-900 cursor-pointer hover:bg-sky-100 transition"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <FileText className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                      <span className="font-medium truncate">{rep.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-sky-700 shrink-0">点击查看</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
