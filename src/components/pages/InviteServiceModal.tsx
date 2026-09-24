import React, { useState } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { ServiceType, PermissionSettings } from '../../types';
import {
  ChevronLeft,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  Share2,
  Lock,
  ArrowRight,
  Check,
  Copy,
  QrCode,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const InviteServiceModal: React.FC = () => {
  const {
    setCurrentSubView,
    inviteTemporaryService,
    activeFamilySpace,
    setCurrentRolePersona,
    showToast,
  } = useFamily();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [serviceType, setServiceType] = useState<ServiceType>('nanny');
  const [name, setName] = useState<string>('王阿姨');
  const [phone, setPhone] = useState<string>('18688889921');
  const [startDate, setStartDate] = useState<string>('2026.09.16');
  const [endDate, setEndDate] = useState<string>('2026.10.16');
  const [durationDays, setDurationDays] = useState<number>(30);

  // Granular Permissions State
  const [permissions, setPermissions] = useState<PermissionSettings>({
    babyArchiveView: true,
    babyArchiveUpload: true,
    elderlyHealthView: false,
    elderlyHealthUpload: false,
    familyTasksManage: false,
    familyTasksParticipate: true,
    familyFeedViewAll: false,
    familyFeedUpload: true,
    privateSpaceAccess: false,
    financeAccess: false,
  });

  const [generatedInvite, setGeneratedInvite] = useState<{
    id: string;
    name: string;
    roleTitle: string;
  } | null>(null);

  const serviceTypeOptions: {
    type: ServiceType;
    title: string;
    icon: string;
    desc: string;
    defaultPermissions: Partial<PermissionSettings>;
  }[] = [
    {
      type: 'nanny',
      title: '育儿嫂 / 月嫂',
      icon: '👶',
      desc: '负责宝宝起居、喂养与早教成长记录',
      defaultPermissions: {
        babyArchiveView: true,
        babyArchiveUpload: true,
        elderlyHealthView: false,
        elderlyHealthUpload: false,
        familyFeedViewAll: false,
        familyFeedUpload: true,
      },
    },
    {
      type: 'medical_escort',
      title: '医院陪诊员',
      icon: '🩺',
      desc: '负责老人医院排队、就诊及化验单上传',
      defaultPermissions: {
        babyArchiveView: false,
        babyArchiveUpload: false,
        elderlyHealthView: true,
        elderlyHealthUpload: true,
        familyFeedViewAll: false,
        familyFeedUpload: true,
      },
    },
    {
      type: 'cleaner',
      title: '保洁 / 家政',
      icon: '🧹',
      desc: '负责定期全屋清洁、收纳与服务拍照打卡',
      defaultPermissions: {
        babyArchiveView: false,
        babyArchiveUpload: false,
        elderlyHealthView: false,
        elderlyHealthUpload: false,
        familyFeedViewAll: false,
        familyFeedUpload: true,
      },
    },
    {
      type: 'nurse',
      title: '专业护理员',
      icon: '💉',
      desc: '负责术后护理、康复理疗与体征记录',
      defaultPermissions: {
        babyArchiveView: false,
        babyArchiveUpload: false,
        elderlyHealthView: true,
        elderlyHealthUpload: true,
        familyFeedViewAll: false,
        familyFeedUpload: true,
      },
    },
  ];

  const handleSelectServiceType = (opt: (typeof serviceTypeOptions)[0]) => {
    setServiceType(opt.type);
    if (opt.type === 'nanny') {
      setName('王阿姨');
    } else if (opt.type === 'medical_escort') {
      setName('张阿姨');
    } else if (opt.type === 'cleaner') {
      setName('李师傅');
    } else {
      setName('刘护士');
    }
    setPermissions((prev) => ({
      ...prev,
      ...opt.defaultPermissions,
    }));
    setStep(2);
  };

  const handleGenerateCard = () => {
    const selectedOption = serviceTypeOptions.find((s) => s.type === serviceType);
    const newMember = inviteTemporaryService({
      name,
      phone,
      serviceType,
      serviceTitle: selectedOption?.title || '服务人员',
      startDate,
      endDate,
      permissions,
    });

    setGeneratedInvite({
      id: newMember.id,
      name: newMember.name,
      roleTitle: selectedOption?.title || '服务人员',
    });
    setStep(4);
  };

  return (
    <div className="pb-6 pt-2 px-4 space-y-4 max-w-md mx-auto animate-fadeIn">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentSubView('none')}
          className="flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>取消</span>
        </button>
        <div className="text-center">
          <span className="text-xs font-bold text-stone-800 block">邀请临时服务人员</span>
          <span className="text-[10px] text-stone-600">步骤 {step} / 4</span>
        </div>
        <div className="w-16" />
      </div>

      {/* 流程进度指示器 */}
      <div className="flex items-center justify-between px-2">
        {['选择身份', '填写周期', '精细权限', '生成邀请'].map((label, idx) => {
          const stepNum = idx + 1;
          const isDone = step > stepNum;
          const isCurrent = step === stepNum;
          return (
            <div key={label} className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isDone
                    ? 'bg-emerald-700 text-white'
                    : isCurrent
                    ? 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-700'
                    : 'bg-stone-200 text-stone-500'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : stepNum}
              </div>
              <span
                className={`text-[10px] ${
                  isCurrent ? 'font-bold text-emerald-800' : 'text-stone-600'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* 步骤 1: 选择服务类型 */}
      {step === 1 && (
        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs space-y-3">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-stone-900">请选择服务人员类型</h3>
            <p className="text-xs text-stone-600">
              系统将根据服务类型自动推荐合理的权限边界，严格保护家庭隐私。
            </p>
          </div>

          <div className="space-y-2.5 pt-1">
            {serviceTypeOptions.map((opt) => (
              <div
                key={opt.type}
                onClick={() => handleSelectServiceType(opt)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  serviceType === opt.type
                    ? 'bg-emerald-50/80 border-emerald-500 ring-1 ring-emerald-400/40 shadow-xs'
                    : 'bg-stone-50/60 border-stone-200/80 hover:bg-stone-100/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white border border-stone-200/80 flex items-center justify-center text-2xl shadow-xs">
                    {opt.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-stone-900">{opt.title}</h4>
                    <p className="text-xs text-stone-600 mt-0.5">{opt.desc}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-500" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 步骤 2: 填写服务周期与姓名 */}
      {step === 2 && (
        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs space-y-4">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-stone-900">服务基本信息与期限</h3>
            <p className="text-xs text-stone-600">
              到达截止时间后，系统将自动回收该人员的访问权限，确保安全无泄漏。
            </p>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">服务人员称呼 / 姓名</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：王阿姨、张师傅"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">联系电话 (选填)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="18688889921"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">服务有效期</label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {[7, 30, 90].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => {
                      setDurationDays(days);
                      if (days === 7) setEndDate('2026.09.23');
                      if (days === 30) setEndDate('2026.10.16');
                      if (days === 90) setEndDate('2026.12.16');
                    }}
                    className={`py-2 rounded-xl text-xs font-semibold border transition ${
                      durationDays === days
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-400 shadow-2xs'
                        : 'bg-stone-50 text-stone-600 border-stone-200'
                    }`}
                  >
                    {days} 天
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs bg-stone-100/70 p-3 rounded-xl text-stone-700">
                <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  服务周期：<strong>{startDate}</strong> 至 <strong>{endDate}</strong> (共 {durationDays} 天)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2.5 bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-200 transition"
            >
              上一步
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <span>下一步：设置权限</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 步骤 3: 精细化权限勾选 */}
      {step === 3 && (
        <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs space-y-4">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-stone-900">权限隔离配置</h3>
            <p className="text-xs text-stone-600">
              按需勾选服务所需的必要权限，其余家庭隐私（老人病历/财务）默认强力屏蔽。
            </p>
          </div>

          {/* 允许权限列表 */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>允许访问的模块</span>
            </div>

            <label className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
              <div>
                <div className="font-bold text-xs text-stone-900">👶 宝宝成长档案</div>
                <div className="text-[11px] text-stone-500">查看宝宝成长记录与上传照片</div>
              </div>
              <input
                type="checkbox"
                checked={permissions.babyArchiveView}
                onChange={(e) =>
                  setPermissions((p) => ({
                    ...p,
                    babyArchiveView: e.target.checked,
                    babyArchiveUpload: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
              <div>
                <div className="font-bold text-xs text-stone-900">📋 服务任务协作</div>
                <div className="text-[11px] text-stone-500">接收接送/陪诊任务并拍照打卡</div>
              </div>
              <input
                type="checkbox"
                checked={permissions.familyTasksParticipate}
                onChange={(e) =>
                  setPermissions((p) => ({
                    ...p,
                    familyTasksParticipate: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer">
              <div>
                <div className="font-bold text-xs text-stone-900">📷 上传服务照护日志</div>
                <div className="text-[11px] text-stone-500">在家庭动态中发布宝宝/老人服务情况</div>
              </div>
              <input
                type="checkbox"
                checked={permissions.familyFeedUpload}
                onChange={(e) =>
                  setPermissions((p) => ({
                    ...p,
                    familyFeedUpload: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
            </label>
          </div>

          {/* 默认强力禁止隔离列表 */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <div className="text-xs font-bold text-rose-800 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              <span>默认禁止 (严格隐私保护)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600">
              <div className="p-2 bg-rose-50/60 border border-rose-200/60 rounded-lg flex items-center gap-1.5">
                <span className="text-rose-600 font-bold">✕</span> 老人健康病历档案
              </div>
              <div className="p-2 bg-rose-50/60 border border-rose-200/60 rounded-lg flex items-center gap-1.5">
                <span className="text-rose-600 font-bold">✕</span> 家庭私密动态与评论
              </div>
              <div className="p-2 bg-rose-50/60 border border-rose-200/60 rounded-lg flex items-center gap-1.5">
                <span className="text-rose-600 font-bold">✕</span> 财务资产与账本
              </div>
              <div className="p-2 bg-rose-50/60 border border-rose-200/60 rounded-lg flex items-center gap-1.5">
                <span className="text-rose-600 font-bold">✕</span> 成员管理与删除
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2.5 bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-200 transition"
            >
              上一步
            </button>
            <button
              id="btn-generate-invite-card"
              onClick={handleGenerateCard}
              className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>生成微信邀请卡片</span>
            </button>
          </div>
        </div>
      )}

      {/* 步骤 4: 生成高颜值邀请卡片 (微信卡片 & 模拟阿姨加入) */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="bg-gradient-to-b from-stone-900 to-stone-950 text-white rounded-3xl p-6 shadow-2xl border border-stone-800 text-center relative overflow-hidden">
            {/* Background sparkle effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />

            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center text-3xl mx-auto shadow-lg shadow-emerald-950">
              🏡
            </div>

            <div className="mt-3">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30">
                家有管家 · 临时服务邀请
              </span>
              <h3 className="text-lg font-bold text-white mt-2">
                邀请【{name}】入驻《李家空间》
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                身份：{serviceTypeOptions.find((s) => s.type === serviceType)?.title}
              </p>
            </div>

            <div className="my-5 p-4 rounded-2xl bg-white/5 border border-white/10 text-left text-xs space-y-2">
              <div className="flex items-center justify-between text-stone-300">
                <span>服务期限：</span>
                <strong className="text-white font-semibold">{durationDays} 天 ({startDate} - {endDate})</strong>
              </div>
              <div className="flex items-center justify-between text-stone-300">
                <span>已授权限：</span>
                <span className="text-emerald-400 font-semibold">宝宝档案 · 任务打卡 · 日志上传</span>
              </div>
              <div className="flex items-center justify-between text-stone-300">
                <span>隔离保护：</span>
                <span className="text-rose-400 font-semibold">老人健康 · 财务与私人动态</span>
              </div>
            </div>

            {/* QR Mockup */}
            <div className="bg-white p-3 rounded-2xl inline-block shadow-lg mx-auto">
              <div className="w-32 h-32 bg-stone-100 rounded-xl flex flex-col items-center justify-center text-stone-800 border border-stone-300">
                <QrCode className="w-16 h-16 text-emerald-800 mb-1" />
                <span className="text-[10px] font-bold text-stone-600">微信扫码一键加入</span>
              </div>
            </div>

            <p className="text-[11px] text-stone-400 mt-3">
              服务到期后系统自动解除授权，无需手动移出。
            </p>
          </div>

          {/* 模拟阿姨加入操作 */}
          <div className="space-y-2">
            <button
              id="btn-simulate-join"
              onClick={() => {
                setCurrentRolePersona('nanny_wang');
                setCurrentSubView('none');
                showToast(`已模拟【${name}】微信扫码加入成功！已为您切换至受限阿姨视角`, 'success');
              }}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>模拟【{name}】一键接受并进入家庭空间</span>
            </button>

            <button
              onClick={() => {
                showToast('已复制微信邀请小程序卡片链接', 'info');
              }}
              className="w-full py-2.5 bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 rounded-2xl font-semibold text-xs shadow-xs transition flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4 text-stone-500" />
              <span>复制邀请链接分享至微信</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
