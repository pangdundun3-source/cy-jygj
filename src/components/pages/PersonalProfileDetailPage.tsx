import React, { useState } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { BrotherProfileManager } from '../profile/BrotherProfileManager';
import {
  ArrowLeft,
  User,
  Edit3,
  Save,
  Phone,
  Shield,
  CheckCircle2,
  Sparkles,
  Smile,
  Heart,
  Calendar,
  Lock,
  BadgeCheck,
  ChevronRight,
  ShieldCheck,
  Award,
} from 'lucide-react';

const ADULT_AVATARS = ['👩', '👨', '🧑', '🌸', '☕', '💼', '🕶️', '🌿', '🌟', '📚'];

export const PersonalProfileDetailPage: React.FC = () => {
  const {
    currentUserMember,
    updateMemberProfile,
    setCurrentSubView,
    setActiveTab,
    setCurrentRolePersona,
    showToast,
  } = useFamily();

  const isBrother = currentUserMember.id === 'm_brother';
  const isFamilyMember = currentUserMember.role === 'owner' || currentUserMember.role === 'member';

  // 成人用户可编辑个人资料状态
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUserMember.name || '',
    nickname: currentUserMember.nickname || currentUserMember.name || '',
    relation: currentUserMember.relation || currentUserMember.roleLabel || '',
    phone: currentUserMember.phone || '138****8899',
    wechat: 'wx_family_bound_01',
    bio: currentUserMember.bio || '用心守护家人的每一天，陪伴孩子健康成长',
    emergencyContact: currentUserMember.emergencyContact || '配偶 (139****1234)',
    avatar: currentUserMember.avatar || '👩',
  });

  const handleSaveAdultProfile = () => {
    updateMemberProfile(currentUserMember.id, {
      name: formData.name,
      nickname: formData.nickname,
      relation: formData.relation,
      phone: formData.phone,
      bio: formData.bio,
      emergencyContact: formData.emergencyContact,
      avatar: formData.avatar,
    });
    setIsEditing(false);
    showToast('个人资料已成功保存更新！', 'success');
  };

  return (
    <div className="pb-10 pt-2 px-4 space-y-4 max-w-md mx-auto animate-fadeIn">
      {/* 顶部导航返回栏 */}
      <div className="flex items-center justify-between py-1 border-b border-stone-200/70 pb-3">
        <button
          id="btn-back-from-profile-detail"
          onClick={() => {
            setCurrentSubView('none');
            setActiveTab('profile');
          }}
          className="flex items-center gap-1 text-xs font-bold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-2.5 py-1.5 rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回我的</span>
        </button>
        <div className="text-center">
          <h1 className="text-sm font-bold text-stone-900">个人信息详情</h1>
          <p className="text-[10px] text-stone-500">
            {isBrother ? '哥哥 (李浩然) 专属档案' : '个人资料 · 偏好与设备设置'}
          </p>
        </div>
        <div className="w-16 flex justify-end">
          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
            已认证
          </span>
        </div>
      </div>

      {/* 视角分流：如果是哥哥视角，直接渲染功能完整的 BrotherProfileManager */}
      {isBrother ? (
        <BrotherProfileManager />
      ) : (
        /* 非哥哥视角 (成人/服务人员) 的完整个人资料管理详情 */
        <div className="space-y-4 animate-fadeIn">
          {/* 1. 个人形象与基本状态卡片 */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-xs shrink-0 ${currentUserMember.avatarBg}`}
                >
                  {isEditing ? formData.avatar : currentUserMember.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-stone-900">
                      {isEditing ? formData.name : currentUserMember.name}
                    </h2>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                        currentUserMember.role === 'owner'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : currentUserMember.role === 'member'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {currentUserMember.roleLabel}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
                    <span>{formData.relation}</span>
                    <span className="text-stone-300">·</span>
                    <span className="text-emerald-700 font-medium">实名认证已生效</span>
                  </p>
                </div>
              </div>

              <button
                id="btn-toggle-edit-adult-profile"
                onClick={() => {
                  if (isEditing) {
                    handleSaveAdultProfile();
                  } else {
                    setIsEditing(true);
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs ${
                  isEditing
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {isEditing ? (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>保存</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>编辑资料</span>
                  </>
                )}
              </button>
            </div>

            {/* 编辑模式下的头像选择器 */}
            {isEditing && (
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2 animate-fadeIn">
                <span className="text-xs font-semibold text-stone-700 block">选择个人头像</span>
                <div className="flex flex-wrap gap-2">
                  {ADULT_AVATARS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setFormData({ ...formData, avatar: emoji })}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition ${
                        formData.avatar === emoji
                          ? 'bg-emerald-600 text-white scale-110 shadow-xs ring-2 ring-emerald-500/30'
                          : 'bg-white hover:bg-stone-100 border border-stone-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. 核心信息表单 / 详情 */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2 font-bold text-sm text-stone-900">
                <User className="w-4 h-4 text-emerald-600" />
                <span>详细资料</span>
              </div>
              <span className="text-[11px] text-stone-400">
                {isEditing ? '正在编辑' : '点击右上角可修改'}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* 空间姓名 */}
              <div>
                <label className="text-stone-400 block mb-1">空间姓名</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-semibold text-stone-900 focus:outline-emerald-600"
                  />
                ) : (
                  <p className="font-semibold text-stone-900 bg-stone-50/70 px-3 py-2 rounded-xl">
                    {currentUserMember.name}
                  </p>
                )}
              </div>

              {/* 家庭称谓 */}
              <div>
                <label className="text-stone-400 block mb-1">家庭称谓 / 身份</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.relation}
                    onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-semibold text-stone-900 focus:outline-emerald-600"
                  />
                ) : (
                  <p className="font-semibold text-stone-900 bg-stone-50/70 px-3 py-2 rounded-xl">
                    {currentUserMember.relation || currentUserMember.roleLabel}
                  </p>
                )}
              </div>

              {/* 绑定手机号 */}
              <div>
                <label className="text-stone-400 block mb-1">绑定手机号 (用于安全登录)</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-semibold text-stone-900 focus:outline-emerald-600"
                  />
                ) : (
                  <p className="font-semibold text-stone-900 bg-stone-50/70 px-3 py-2 rounded-xl flex items-center justify-between">
                    <span>{currentUserMember.phone || '138****8899'}</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">已验证</span>
                  </p>
                )}
              </div>

              {/* 家庭寄语/座右铭 */}
              <div>
                <label className="text-stone-400 block mb-1">个性签名 / 家庭寄语</label>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-900 focus:outline-emerald-600 leading-relaxed"
                  />
                ) : (
                  <p className="font-medium text-stone-700 bg-stone-50/70 px-3 py-2 rounded-xl leading-relaxed">
                    “{currentUserMember.bio || formData.bio}”
                  </p>
                )}
              </div>

              {/* 紧急联络人 */}
              <div>
                <label className="text-stone-400 block mb-1">紧急家庭联系方式</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-semibold text-stone-900 focus:outline-emerald-600"
                  />
                ) : (
                  <p className="font-semibold text-stone-900 bg-stone-50/70 px-3 py-2 rounded-xl">
                    {currentUserMember.emergencyContact || formData.emergencyContact}
                  </p>
                )}
              </div>
            </div>

            {isEditing && (
              <button
                id="btn-save-adult-profile-bottom"
                onClick={handleSaveAdultProfile}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs mt-2"
              >
                <Save className="w-4 h-4" />
                <span>保存个人资料修改</span>
              </button>
            )}
          </div>

          {/* 3. 空间权限与角色权益总览 */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100 font-bold text-sm text-stone-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>当前空间权限</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl">
                <span className="text-stone-600">空间管理权限</span>
                <span className="font-semibold text-emerald-700">
                  {currentUserMember.role === 'owner' ? '全权所有者 (空间主管理员)' : '家庭核心成员 (共管)'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl">
                <span className="text-stone-600">孩子成长档案</span>
                <span className="font-semibold text-emerald-700">完整查看与编辑打卡</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl">
                <span className="text-stone-600">老人健康档案</span>
                <span className="font-semibold text-emerald-700">完整查看与就医陪诊协同</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl">
                <span className="text-stone-600">外部阿姨聘请与到期控制</span>
                <span className="font-semibold text-emerald-700">
                  {currentUserMember.role === 'owner' ? '有权发起邀请与到期注销' : '有权查看'}
                </span>
              </div>
            </div>
          </div>

          {/* 4. 快捷联动：查看长子 (哥哥) 个人资料 */}
          {isFamilyMember && (
            <div className="bg-gradient-to-br from-indigo-50 to-sky-50 rounded-3xl p-5 border border-indigo-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl shadow-2xs shrink-0">
                  👦
                </div>
                <div>
                  <h4 className="text-sm font-bold text-indigo-950">
                    查看【哥哥 (李浩然)】专属个人档案
                  </h4>
                  <p className="text-xs text-indigo-700 mt-0.5">
                    长子9岁自主维护昵称、兴趣特长、学生电话手表及每日习惯打卡
                  </p>
                </div>
              </div>

              <button
                id="btn-switch-to-brother-from-detail"
                onClick={() => {
                  setCurrentRolePersona('brother');
                  showToast('已切换至【哥哥 (李浩然)】专属视角', 'success');
                }}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <User className="w-4 h-4" />
                <span>立即切换至哥哥视角体验个人信息管理</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
