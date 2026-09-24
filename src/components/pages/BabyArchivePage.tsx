import React, { useState } from 'react';
import { useFamily } from '../../context/FamilyContext';
import {
  ChevronLeft,
  Baby,
  Sparkles,
  Heart,
  Plus,
  Calendar,
  Syringe,
  TrendingUp,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Camera,
} from 'lucide-react';

export const BabyArchivePage: React.FC = () => {
  const {
    babyProfile,
    setCurrentSubView,
    addBabyMilestone,
    likeMilestone,
    currentUserMember,
    showToast,
  } = useFamily();

  const [isAddingMilestone, setIsAddingMilestone] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDesc, setNewDesc] = useState<string>('');

  const handleAddMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('请输入记录标题', 'warning');
      return;
    }
    addBabyMilestone(
      newTitle,
      newDesc || '宝宝今天又有了新进步，记录下这美好的瞬间！',
      ['https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=600&auto=format&fit=crop&q=80']
    );
    setNewTitle('');
    setNewDesc('');
    setIsAddingMilestone(false);
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
        <span className="text-xs font-bold text-stone-800">宝宝成长档案</span>
        <button
          id="btn-ai-growth-report"
          onClick={() => setCurrentSubView('ai_growth_report')}
          className="flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100/90 hover:bg-amber-200 px-3 py-1.5 rounded-xl border border-amber-300 shadow-xs transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>AI生成报告</span>
        </button>
      </div>

      {/* 宝宝基础信息名片 */}
      <div className="bg-gradient-to-br from-amber-50 via-orange-50/50 to-stone-50 rounded-3xl p-5 border border-amber-200/90 shadow-xs space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl shadow-sm">
              👶
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-stone-900">{babyProfile.nickname}</h2>
                <span className="text-xs text-stone-500 font-medium">({babyProfile.name})</span>
                <span className="px-2 py-0.5 bg-amber-200/70 text-amber-900 rounded-full text-[11px] font-bold">
                  {babyProfile.ageText}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                出生日期：{babyProfile.birthDate} · 男宝
              </p>
            </div>
          </div>
        </div>

        {/* 生长指标三大卡片 */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="bg-white/90 rounded-2xl p-3 border border-amber-200/60 shadow-2xs">
            <span className="text-[11px] text-stone-500 block mb-0.5">当前身高</span>
            <div className="text-base font-extrabold text-stone-900">
              {babyProfile.heightCm} <span className="text-xs font-normal">cm</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold mt-0.5 block">
              超 85% 同龄
            </span>
          </div>

          <div className="bg-white/90 rounded-2xl p-3 border border-amber-200/60 shadow-2xs">
            <span className="text-[11px] text-stone-500 block mb-0.5">当前体重</span>
            <div className="text-base font-extrabold text-stone-900">
              {babyProfile.weightKg} <span className="text-xs font-normal">kg</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold mt-0.5 block">
              超 78% 同龄
            </span>
          </div>

          <div className="bg-white/90 rounded-2xl p-3 border border-amber-200/60 shadow-2xs">
            <span className="text-[11px] text-stone-500 block mb-0.5">当前头围</span>
            <div className="text-base font-extrabold text-stone-900">
              {babyProfile.headCircumferenceCm} <span className="text-xs font-normal">cm</span>
            </div>
            <span className="text-[10px] text-stone-500 font-medium mt-0.5 block">发育标准</span>
          </div>
        </div>
      </div>

      {/* 疫苗与健康管理卡片 */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Syringe className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-sm text-stone-900">疫苗接种管理</h3>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
            已完成 {babyProfile.vaccinesCompleted} / {babyProfile.vaccinesTotal} 针
          </span>
        </div>

        {/* 下一针提醒 */}
        <div className="bg-amber-50/70 border border-amber-200/70 rounded-xl p-3 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-900 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              下一针：{babyProfile.nextVaccine.name}
            </span>
            <span className="text-amber-800 font-semibold bg-white/80 px-2 py-0.5 rounded text-[11px]">
              {babyProfile.nextVaccine.suggestedDate}
            </span>
          </div>
          <p className="text-stone-600 text-[11px]">{babyProfile.nextVaccine.notes}</p>
        </div>

        {/* 疫苗接种时间线折叠精选 */}
        <div className="space-y-1.5 pt-1">
          {babyProfile.vaccineList.slice(0, 3).map((v) => (
            <div
              key={v.id}
              className="flex items-center justify-between p-2 rounded-xl bg-stone-50 text-xs"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-medium text-stone-800">{v.name}</span>
              </div>
              <span className="text-stone-500 text-[11px]">{v.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 成长时光记录 (Milestones & Photos) */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Baby className="w-4 h-4 text-amber-700" />
            <h3 className="font-bold text-sm text-stone-900">成长里程碑与时光记录</h3>
          </div>
          <button
            onClick={() => setIsAddingMilestone(!isAddingMilestone)}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>记录新成长</span>
          </button>
        </div>

        {/* 快速新增记录展开表单 */}
        {isAddingMilestone && (
          <form
            onSubmit={handleAddMilestoneSubmit}
            className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-2.5 animate-fadeIn"
          >
            <h4 className="font-bold text-xs text-stone-900">记录小宝的新变化 / 里程碑</h4>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="例如：今天学会了自己用小勺子喝汤 🥄"
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="记录细节、心情与互动..."
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-xs text-stone-500">
                <Camera className="w-4 h-4 text-stone-400" />
                <span>自动附带生活照片</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingMilestone(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 bg-white border border-stone-200 rounded-lg"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs"
                >
                  发布记录
                </button>
              </div>
            </div>
          </form>
        )}

        {/* 时光流列表 */}
        <div className="space-y-4 pt-1">
          {babyProfile.milestones.map((m) => (
            <div
              key={m.id}
              className="p-3.5 rounded-2xl bg-stone-50/70 border border-stone-200/70 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md text-[10px] font-bold">
                    {m.ageMonth}
                  </span>
                  <span className="text-xs text-stone-500">{m.date}</span>
                </div>
                <span className="text-[11px] text-stone-500">由 {m.author} 记录</span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-stone-900">{m.title}</h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">{m.description}</p>
              </div>

              {/* 照片网格 */}
              {m.photos.length > 0 && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {m.photos.map((imgUrl, idx) => (
                    <img
                      key={idx}
                      src={imgUrl}
                      alt="baby milestone"
                      className="w-full h-32 object-cover rounded-xl border border-stone-200/80 shadow-2xs"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
              )}

              {/* 互动点赞 */}
              <div className="flex items-center justify-between pt-1 border-t border-stone-200/50">
                <span className="text-[11px] text-stone-500">已同步至家庭动态</span>
                <button
                  onClick={() => likeMilestone(m.id)}
                  className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition ${
                    m.hasLiked
                      ? 'bg-rose-50 text-rose-600 font-bold'
                      : 'bg-white text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${m.hasLiked ? 'fill-rose-500' : ''}`} />
                  <span>{m.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
