import React, { useState } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { FamilyMember } from '../../types';
import {
  User,
  Edit3,
  Save,
  CheckCircle2,
  Smile,
  GraduationCap,
  Calendar,
  Heart,
  Watch,
  Phone,
  Sparkles,
  BookOpen,
  Award,
  CheckSquare,
  Shield,
  Clock,
  ChevronRight,
} from 'lucide-react';

const AVATAR_OPTIONS = ['👦', '🧒', '🧑', '🚴', '🚀', '⚽', '🎮', '🎨', '🦖', '📚'];

export const BrotherProfileManager: React.FC = () => {
  const { currentUserMember, updateMemberProfile, showToast, setActiveTab, tasks, updateTaskStatus } = useFamily();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUserMember.name || '李浩然 (哥哥)',
    nickname: currentUserMember.nickname || '浩浩',
    relation: currentUserMember.relation || '哥哥 (9岁 · 小学三年级)',
    age: currentUserMember.age || '9岁',
    birthday: currentUserMember.birthday || '2017-06-15',
    schoolGrade: currentUserMember.schoolGrade || '实验小学 三年级(2)班',
    bio: currentUserMember.bio || '认真完成每天的学习打卡，和爸爸妈妈一起爱护小宝弟弟！',
    hobby: currentUserMember.hobby || '乐高拼搭、少儿编程、游泳、恐龙百科',
    deviceType: currentUserMember.deviceType || '小天才电话手表 Z9 · 已绑定家庭圈',
    phone: currentUserMember.phone || '135****6789',
    emergencyContact: currentUserMember.emergencyContact || '妈妈 (138****8899) / 爸爸 (139****1234)',
    avatar: currentUserMember.avatar || '👦',
  });

  // 哥哥视角的好习惯打卡（本地模拟）
  const [habits, setHabits] = useState([
    { id: 'h1', title: '自主课外阅读 30 分钟', done: true, reward: '+5 成长星' },
    { id: 'h2', title: '独立整理自己的书桌与玩具', done: true, reward: '+5 成长星' },
    { id: 'h3', title: '陪小宝弟弟搭积木/讲绘本', done: false, reward: '+10 成长星' },
    { id: 'h4', title: '晚上 9:30 前准时上床休息', done: false, reward: '+5 成长星' },
  ]);

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const newDone = !h.done;
          if (newDone) {
            showToast(`打卡成功！获得 ${h.reward}，太棒啦！`, 'success');
          }
          return { ...h, done: newDone };
        }
        return h;
      })
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMemberProfile(currentUserMember.id, {
      name: formData.name,
      nickname: formData.nickname,
      age: formData.age,
      birthday: formData.birthday,
      schoolGrade: formData.schoolGrade,
      bio: formData.bio,
      hobby: formData.hobby,
      deviceType: formData.deviceType,
      phone: formData.phone,
      emergencyContact: formData.emergencyContact,
      avatar: formData.avatar,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* 1. 哥哥视角专属个人名片卡 */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-sky-700 text-white rounded-3xl p-5 shadow-sm relative overflow-hidden">
        {/* 背景微光光斑 */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />
        
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl shadow-xs shrink-0">
              {currentUserMember.avatar || formData.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {currentUserMember.nickname || '浩浩'}
                </h3>
                <span className="px-2 py-0.5 bg-white/20 text-white text-[11px] font-semibold rounded-md border border-white/30">
                  {currentUserMember.name}
                </span>
              </div>
              <div className="text-xs text-indigo-100/90 mt-1 flex items-center gap-1.5 flex-wrap">
                <span>{formData.age}</span>
                <span>·</span>
                <span>{formData.schoolGrade}</span>
              </div>
            </div>
          </div>

          <button
            id="btn-edit-brother-profile"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold rounded-xl border border-white/30 transition shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? '取消编辑' : '编辑资料'}</span>
          </button>
        </div>

        {/* 个性座右铭 / 寄语 */}
        <div className="mt-4 pt-3 border-t border-white/20 text-xs text-indigo-50 leading-relaxed flex items-start gap-2 relative z-10">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
          <p className="italic">“{currentUserMember.bio || formData.bio}”</p>
        </div>

        {/* 快捷设备与安全状态 */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-indigo-200 relative z-10 pt-2 border-t border-white/10">
          <div className="flex items-center gap-1">
            <Watch className="w-3.5 h-3.5 text-indigo-300" />
            <span className="truncate max-w-[200px]">{formData.deviceType}</span>
          </div>
          <span className="text-emerald-300 font-medium">设备在线 · 安全守护中</span>
        </div>
      </div>

      {/* 2. 编辑表单（开启编辑模式时展开） */}
      {isEditing ? (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-3xl p-5 border-2 border-indigo-500 shadow-md space-y-4 animate-fadeIn"
        >
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              <h4 className="font-bold text-sm text-stone-900">编辑哥哥的个人档案</h4>
            </div>
            <span className="text-xs text-stone-400">实时同步至家庭圈</span>
          </div>

          {/* 头像选择 */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">选择专属个性头像</label>
            <div className="flex flex-wrap gap-2 pt-1">
              {AVATAR_OPTIONS.map((icon) => (
                <button
                  type="button"
                  key={icon}
                  onClick={() => setFormData({ ...formData, avatar: icon })}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition ${
                    formData.avatar === icon
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">全名</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-indigo-500"
                placeholder="例如：李浩然"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">空间昵称</label>
              <input
                type="text"
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-indigo-500"
                placeholder="例如：浩浩"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">年龄</label>
              <input
                type="text"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-indigo-500"
                placeholder="9岁"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">出生日期</label>
              <input
                type="date"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">学校及年级</label>
            <input
              type="text"
              value={formData.schoolGrade}
              onChange={(e) => setFormData({ ...formData, schoolGrade: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-indigo-500"
              placeholder="例如：实验小学 三年级(2)班"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">个人座右铭 / 家庭寄语</label>
            <textarea
              rows={2}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-indigo-500"
              placeholder="认真学习，和爸妈一起爱护弟弟！"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">兴趣特长</label>
            <input
              type="text"
              value={formData.hobby}
              onChange={(e) => setFormData({ ...formData, hobby: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-indigo-500"
              placeholder="乐高拼搭、少儿编程、游泳、恐龙百科"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">关联智能设备</label>
            <input
              type="text"
              value={formData.deviceType}
              onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-indigo-500"
              placeholder="小天才电话手表 Z9"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">紧急联系人</label>
            <input
              type="text"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:border-indigo-500"
              placeholder="妈妈 (138****8899) / 爸爸 (139****1234)"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>保存个人信息</span>
            </button>
          </div>
        </form>
      ) : null}

      {/* 3. 哥哥个人档案详细信息条目 */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <h4 className="font-bold text-sm text-stone-900">个人基本档案</h4>
          </div>
          <span className="text-[11px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-medium">
            本人可自主维护
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 space-y-1">
            <span className="text-stone-400 text-[11px] block">空间昵称</span>
            <span className="font-bold text-stone-800">{currentUserMember.nickname || formData.nickname}</span>
          </div>
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 space-y-1">
            <span className="text-stone-400 text-[11px] block">就读学校</span>
            <span className="font-bold text-stone-800 truncate block">{currentUserMember.schoolGrade || formData.schoolGrade}</span>
          </div>
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 space-y-1">
            <span className="text-stone-400 text-[11px] block">年龄 & 生日</span>
            <span className="font-bold text-stone-800">
              {currentUserMember.age || formData.age} ({currentUserMember.birthday || formData.birthday})
            </span>
          </div>
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 space-y-1">
            <span className="text-stone-400 text-[11px] block">智能设备</span>
            <span className="font-bold text-stone-800 truncate block">小天才电话手表</span>
          </div>
        </div>

        {/* 兴趣爱好标签 */}
        <div className="pt-1">
          <span className="text-[11px] text-stone-400 block mb-1.5 font-medium">兴趣特长</span>
          <div className="flex flex-wrap gap-1.5">
            {(currentUserMember.hobby || formData.hobby).split('、').map((h, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-indigo-50 text-indigo-800 rounded-md text-[11px] font-medium border border-indigo-100"
              >
                {h}
              </span>
            ))}
          </div>
        </div>

        {/* 紧急联系人快捷 */}
        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-amber-600" />
            <div>
              <span className="font-semibold block text-[11px]">紧急联系守护人</span>
              <span className="text-[11px] text-amber-800">{formData.emergencyContact}</span>
            </div>
          </div>
          <span className="text-[10px] text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded font-bold">
            一键直连
          </span>
        </div>
      </div>

      {/* 4. 哥哥的家庭好习惯每日打卡 */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-emerald-600" />
            <h4 className="font-bold text-sm text-stone-900">哥哥今日成长好习惯</h4>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
            今日已打卡 {habits.filter((h) => h.done).length}/{habits.length}
          </span>
        </div>

        <div className="space-y-2">
          {habits.map((habit) => (
            <div
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className={`p-3 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                habit.done
                  ? 'bg-emerald-50/70 border-emerald-200 text-stone-700'
                  : 'bg-stone-50 border-stone-200/90 hover:bg-stone-100/70 text-stone-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-xs transition ${
                    habit.done
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-stone-300 bg-white'
                  }`}
                >
                  {habit.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <span className={`text-xs font-medium ${habit.done ? 'line-through text-stone-400' : ''}`}>
                  {habit.title}
                </span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                {habit.reward}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. 哥哥在家庭数字空间的权限视角 */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600" />
            <h4 className="font-bold text-sm text-stone-900">空间身份与权限透视</h4>
          </div>
          <span className="text-xs text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded">
            核心成员 · 哥哥
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-emerald-600">✓</span>
              <span className="text-stone-700">弟弟成长日记与照片</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold">可浏览 & 点赞互动</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-emerald-600">✓</span>
              <span className="text-stone-700">家庭日常任务与家务分工</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold">可打卡 & 领取奖励</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-emerald-600">✓</span>
              <span className="text-stone-700">全家动态圈与家庭时光</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold">可发文字与图片</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-amber-600">🔒</span>
              <span className="text-stone-700">外部阿姨聘请与家庭财务档案</span>
            </div>
            <span className="text-[11px] text-amber-700 font-semibold">仅父母管理员可操作</span>
          </div>
        </div>
      </div>
    </div>
  );
};
