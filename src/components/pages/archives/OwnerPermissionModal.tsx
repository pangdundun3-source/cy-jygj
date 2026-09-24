import React, { useState } from 'react';
import { MemberBaseProfile, MemberArchivePermissions, FamilyMember } from '../../../types';
import { X, Shield, ShieldCheck, ShieldAlert, Lock, Check, Info, Users, Sparkles } from 'lucide-react';

interface OwnerPermissionModalProps {
  profile: MemberBaseProfile;
  currentUser: FamilyMember;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<MemberArchivePermissions>) => void;
  onSwitchToOwner?: () => void;
}

export const OwnerPermissionModal: React.FC<OwnerPermissionModalProps> = ({
  profile,
  currentUser,
  isOpen,
  onClose,
  onSave,
  onSwitchToOwner,
}) => {
  if (!isOpen) return null;

  const isOwner = currentUser.role === 'owner';
  const perms = profile.servicePermissions;

  const [isOpenToService, setIsOpenToService] = useState(perms.isOpenToService);
  const [canViewHealthVitals, setCanViewHealthVitals] = useState(perms.canViewHealthVitals);
  const [canExecuteStageTasks, setCanExecuteStageTasks] = useState(perms.canExecuteStageTasks);
  const [canUploadMedicalDocs, setCanUploadMedicalDocs] = useState(perms.canUploadMedicalDocs);
  const [requireApprovalForArchive, setRequireApprovalForArchive] = useState(
    perms.requireApprovalForArchive
  );
  const [allowedServiceTypes, setAllowedServiceTypes] = useState<string[]>(
    perms.allowedServiceTypes || ['medical_escort', 'nanny']
  );

  const toggleServiceType = (type: string) => {
    setAllowedServiceTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;

    onSave({
      isOpenToService,
      allowedServiceTypes,
      canViewHealthVitals,
      canExecuteStageTasks,
      canUploadMedicalDocs,
      requireApprovalForArchive,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
      <div
        id="modal-owner-permission"
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-emerald-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-stone-900">
                  【{profile.name}】档案外来人员开放权限
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                  主成员管控
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                主成员(李婷·妈妈)专属配置，防范家庭私密数据泄露
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

        {/* Body */}
        <form onSubmit={handleSave} className="p-4 space-y-4 text-xs">
          {/* 权限归属提示卡片 */}
          <div
            className={`p-3 rounded-2xl border flex items-start gap-2.5 ${
              isOwner
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                : 'bg-amber-50/80 border-amber-200 text-amber-950'
            }`}
          >
            {isOwner ? (
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <span>
                  当前身份：{currentUser.name} ({currentUser.roleLabel})
                </span>
                {isOwner ? (
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-600 text-white rounded font-bold">
                    主成员已鉴权
                  </span>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.2 bg-amber-600 text-white rounded font-bold">
                    仅供查阅
                  </span>
                )}
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">
                {isOwner
                  ? '您是本家庭空间的主成员，拥有此档案对外来服务人员开放与否的决定权。请审慎配置外来人员的介入深度。'
                  : '提示：基础档案内容全家皆可协同维护，但对外来服务人员（陪诊员、育儿嫂等）的访问开放权限由家庭主成员(妈妈 李婷)专属管控。'}
              </p>
              {!isOwner && onSwitchToOwner && (
                <button
                  type="button"
                  onClick={() => {
                    onSwitchToOwner();
                    onClose();
                  }}
                  className="mt-1 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[11px] font-bold flex items-center gap-1 shadow-xs transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>切换为主成员(妈妈 李婷)体验控权操作</span>
                </button>
              )}
            </div>
          </div>

          {/* 总开关：是否对外来服务人员开放 */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/90 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                <span>对外来服务人员开放该成员档案</span>
                {isOpenToService ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    开放中
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                    已严格隔离
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500">
                开启后，受邀的外来陪诊员/育儿嫂可在其被指派的阶段任务下查看体征并打卡
              </p>
            </div>
            <button
              type="button"
              disabled={!isOwner}
              onClick={() => isOwner && setIsOpenToService(!isOpenToService)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                isOpenToService ? 'bg-emerald-600' : 'bg-stone-300'
              } ${!isOwner ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${
                  isOpenToService ? 'translate-x-6.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* 细粒度控制 */}
          {isOpenToService && (
            <div className="space-y-3 pt-1">
              {/* 允许服务人员类型 */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1.5 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-stone-400" />
                  <span>允许接入的服务类型范围：</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'medical_escort', label: '🩺 专业三甲陪诊员', desc: '用于陪医就诊打卡与处方代取' },
                    { id: 'nanny', label: '🧑‍🍳 高级育儿嫂/保姆', desc: '用于幼儿生活照料与发育记录' },
                    { id: 'nurse', label: '💉 社区护士/护理员', desc: '用于换药、测压与专科照护' },
                    { id: 'cleaner', label: '🧹 日常保洁/钟点工', desc: '仅允许接单打卡，隔离健康体征' },
                  ].map((item) => {
                    const isChecked = allowedServiceTypes.includes(item.id);
                    return (
                      <button
                        type="button"
                        key={item.id}
                        disabled={!isOwner}
                        onClick={() => isOwner && toggleServiceType(item.id)}
                        className={`p-2 rounded-xl border text-left transition flex flex-col justify-between ${
                          isChecked
                            ? 'bg-emerald-50/80 border-emerald-500 text-emerald-950 font-bold'
                            : 'bg-white border-stone-200 text-stone-500'
                        } ${!isOwner ? 'cursor-not-allowed opacity-80' : 'hover:bg-stone-50'}`}
                      >
                        <span className="text-xs">{item.label}</span>
                        <span className="text-[9px] opacity-75 mt-0.5">{item.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 细分权限开关列表 */}
              <div className="space-y-2 pt-1">
                <label className="block text-[11px] font-bold text-stone-700">
                  细分安全操作授权项：
                </label>

                {[
                  {
                    id: 'vitals',
                    checked: canViewHealthVitals,
                    onChange: setCanViewHealthVitals,
                    label: '允许服务人员查阅此档案下的既往体征与过敏病史',
                    sub: '陪诊人员看诊时核对过敏原及血压参考',
                  },
                  {
                    id: 'execute',
                    checked: canExecuteStageTasks,
                    onChange: setCanExecuteStageTasks,
                    label: '允许在指派的阶段任务下提交操作日志与打卡',
                    sub: '外来人员的所有操作均严格限定在具体任务内',
                  },
                  {
                    id: 'upload',
                    checked: canUploadMedicalDocs,
                    onChange: setCanUploadMedicalDocs,
                    label: '允许上传门诊病历、报销发票凭据与处方单照片',
                    sub: '凭据直传沉淀至家庭档案，无需通过第三方微信传输',
                  },
                  {
                    id: 'approval',
                    checked: requireApprovalForArchive,
                    onChange: setRequireApprovalForArchive,
                    label: '阶段任务完成后归档须由家庭主成员(妈妈)终审封存',
                    sub: '防止服务人员误操作归档未闭环的任务',
                  },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition ${
                      item.checked ? 'bg-stone-50 border-stone-300' : 'bg-white border-stone-200'
                    } ${!isOwner ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                  >
                    <input
                      type="checkbox"
                      disabled={!isOwner}
                      checked={item.checked}
                      onChange={(e) => isOwner && item.onChange(e.target.checked)}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 shrink-0"
                    />
                    <div>
                      <div className="font-bold text-stone-800 text-xs">{item.label}</div>
                      <div className="text-[10px] text-stone-400 mt-0.5">{item.sub}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Footer Info */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
            <div>
              <span>最后更新人：</span>
              <span className="font-bold text-stone-600">{perms.updatedBy || '主成员 李婷'}</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 font-bold transition"
              >
                {isOwner ? '取消' : '关闭'}
              </button>
              {isOwner && (
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 transition shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>保存权限配置</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
