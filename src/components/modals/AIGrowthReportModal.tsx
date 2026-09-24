import React from 'react';
import { useFamily } from '../../context/FamilyContext';
import {
  ChevronLeft,
  Sparkles,
  Award,
  TrendingUp,
  Share2,
  Download,
  CheckCircle2,
  Baby,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AIGrowthReportModal: React.FC = () => {
  const { babyProfile, setCurrentSubView, showToast } = useFamily();

  const handleShareToFeed = () => {
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
    } catch {
      // ignore
    }
    showToast('AI智能成长月报已同步至李家家庭动态！', 'success');
    setCurrentSubView('none');
  };

  return (
    <div className="pb-6 pt-2 px-4 space-y-4 max-w-md mx-auto animate-fadeIn">
      {/* 顶部返回导航 */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentSubView('baby_archive')}
          className="flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>返回宝宝档案</span>
        </button>
        <span className="text-xs font-bold text-stone-800">AI宝宝智能成长月报</span>
        <div className="w-12" />
      </div>

      {/* AI 成长卡片 */}
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-emerald-50 rounded-3xl p-5 border-2 border-amber-300 shadow-md space-y-4 text-stone-900">
        <div className="flex items-center justify-between pb-3 border-b border-amber-200/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-900 flex items-center justify-center text-xl shadow-2xs">
              🌟
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-stone-900">
                  {babyProfile.nickname} · 2岁3个月成长报告
                </h3>
              </div>
              <p className="text-[10px] text-stone-500 mt-0.5">
                基于李家空间 24 条真实照护数据与体征模型生成
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full">
            综合评估：优+
          </span>
        </div>

        {/* 核心亮点标签 */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white/80 p-3 rounded-2xl border border-amber-200 shadow-2xs space-y-1">
            <span className="text-amber-800 font-bold block text-[11px]">
              📏 身高发育 (P85)
            </span>
            <div className="text-base font-extrabold text-stone-900">
              92.0 cm <span className="text-xs font-normal text-emerald-700">+1.8cm/月</span>
            </div>
            <p className="text-[10px] text-stone-500">优于 85% 同龄男宝</p>
          </div>

          <div className="bg-white/80 p-3 rounded-2xl border border-amber-200 shadow-2xs space-y-1">
            <span className="text-amber-800 font-bold block text-[11px]">
              ⚖️ 体重发育 (P78)
            </span>
            <div className="text-base font-extrabold text-stone-900">
              13.0 kg <span className="text-xs font-normal text-emerald-700">标准匀称</span>
            </div>
            <p className="text-[10px] text-stone-500">BMI指数处于健康理想区间</p>
          </div>
        </div>

        {/* 智能分析要点 */}
        <div className="bg-white/90 p-4 rounded-2xl border border-amber-200 space-y-2.5 text-xs">
          <h4 className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>AI发育里程碑洞察</span>
          </h4>

          <div className="space-y-2 text-stone-700 leading-relaxed text-[11px]">
            <p>
              <strong>1. 大动作与精细动作突破：</strong>
              本月小宝成功实现自主穿鞋（大动作平衡感与手眼协调能力显著提升），并能独立完成6块动物拼图。
            </p>
            <p>
              <strong>2. 饮食与作息规律：</strong>
              育儿嫂王阿姨记录的午睡周期稳定在1.5~2小时，蔬菜肉类辅食接受度高，精神状态饱满。
            </p>
            <p>
              <strong>3. 疫苗与下阶段计划：</strong>
              目前已完成12针基础免疫，9月25日需前往社区接种秋季流感疫苗。
            </p>
          </div>
        </div>

        {/* 育儿建议 */}
        <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
          <div className="font-bold text-[11px] text-emerald-900">💡 管家育儿建议 (2-3岁阶梯)</div>
          <p className="text-[10px] text-stone-600 leading-normal">
            可增加亲子双向语言互动游戏，鼓励宝宝用完整句子表达需求；外出散步时可引导其认识常见交通工具与昆虫。
          </p>
        </div>
      </div>

      {/* 底部操作按钮 */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={handleShareToFeed}
          className="py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>同步到家庭动态</span>
        </button>
        <button
          onClick={() => {
            showToast('已保存高清月报卡片至手机相册', 'success');
          }}
          className="py-2.5 bg-white border border-stone-200 text-stone-800 hover:bg-stone-50 rounded-xl font-semibold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5 text-stone-500" />
          <span>保存图片</span>
        </button>
      </div>
    </div>
  );
};
