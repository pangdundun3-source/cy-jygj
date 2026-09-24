import React, { useState } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { CareFeedItem } from '../../types';
import {
  Activity,
  Heart,
  MessageCircle,
  Camera,
  Send,
  Plus,
  Tag,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const FamilyFeedPage: React.FC = () => {
  const {
    careFeeds,
    addFeedItem,
    likeFeedItem,
    addFeedComment,
    currentUserMember,
    showToast,
  } = useFamily();

  const [filterType, setFilterType] = useState<string>('all');
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [postContent, setPostContent] = useState<string>('');
  const [postType, setPostType] = useState<CareFeedItem['type']>('baby_daily');
  const [activeCommentFeedId, setActiveCommentFeedId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<string>('');

  const filteredFeeds = careFeeds.filter((f) => {
    if (filterType === 'all') return true;
    return f.type === filterType;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) {
      showToast('请输入照护日志内容', 'warning');
      return;
    }
    const typeLabels: Record<CareFeedItem['type'], string> = {
      baby_daily: '育儿日志',
      medical_escort: '陪诊记录',
      cleaning: '保洁记录',
      family_moment: '家庭日常',
    };
    addFeedItem(
      postType,
      typeLabels[postType],
      postContent,
      ['https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=600&auto=format&fit=crop&q=80'],
      ['日常打卡', '家庭协作']
    );
    setPostContent('');
    setIsPosting(false);
    showToast('服务照护记录已发布，全家已同步！', 'success');
  };

  const handleSendComment = (feedId: string) => {
    if (!commentText.trim()) return;
    addFeedComment(feedId, commentText);
    setCommentText('');
    setActiveCommentFeedId(null);
  };

  return (
    <div className="pb-6 pt-2 px-4 space-y-4 max-w-md mx-auto animate-fadeIn">
      {/* 顶部定位与发帖按钮 */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-lg font-bold text-stone-900 tracking-tight">家庭照护动态</h2>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              照护档案
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            不是社交朋友圈，是家庭协作与健康照护的专属空间
          </p>
        </div>
        <button
          onClick={() => setIsPosting(!isPosting)}
          className="flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>发布记录</span>
        </button>
      </div>

      {/* 分类筛选标签 */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: '全部动态' },
          { id: 'baby_daily', label: '👶 育儿日志' },
          { id: 'medical_escort', label: '🩺 陪诊就医' },
          { id: 'family_moment', label: '🏡 家庭时光' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              filterType === tab.id
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 发布动态展开抽屉 */}
      {isPosting && (
        <form
          onSubmit={handleCreatePost}
          className="bg-white rounded-2xl p-4 border-2 border-emerald-500 shadow-md space-y-3 animate-fadeIn"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-stone-900">发布服务照护记录 / 家庭动态</h3>
            <span className="text-[11px] text-stone-400">以 {currentUserMember.name} 身份发布</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <label className="font-semibold text-stone-600">记录类型:</label>
            <select
              value={postType}
              onChange={(e) => setPostType(e.target.value as CareFeedItem['type'])}
              className="px-2.5 py-1 rounded-lg border border-stone-300 bg-stone-50 text-xs font-medium"
            >
              <option value="baby_daily">👶 育儿日常打卡</option>
              <option value="medical_escort">🩺 医院陪诊记录</option>
              <option value="cleaning">🧹 家政保洁打卡</option>
              <option value="family_moment">🏡 家庭成长记录</option>
            </select>
          </div>

          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="例如：宝宝午睡2小时，辅食已吃完；或者爷爷门诊检查一切正常..."
            rows={3}
            className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50/50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <Camera className="w-4 h-4 text-stone-400" />
              <span>附带现场照片</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPosting(false)}
                className="px-3 py-1.5 text-xs text-stone-600 bg-stone-100 rounded-lg"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs"
              >
                立即发布
              </button>
            </div>
          </div>
        </form>
      )}

      {/* 动态时间轴流 */}
      <div className="space-y-3.5">
        {filteredFeeds.map((feed) => (
          <div
            key={feed.id}
            className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs space-y-3"
          >
            {/* 作者信息头 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-xl shadow-2xs">
                  {feed.authorAvatar}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs text-stone-900">{feed.authorName}</h4>
                    <span className="text-[10px] px-1.5 py-0.2 bg-stone-100 text-stone-600 rounded">
                      {feed.typeLabel}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    {feed.date} {feed.time} · {feed.authorRole}
                  </p>
                </div>
              </div>
            </div>

            {/* 内容正文 */}
            <p className="text-xs text-stone-800 leading-relaxed">{feed.content}</p>

            {/* 照片网格 */}
            {feed.photos.length > 0 && (
              <div
                className={`grid gap-2 pt-1 ${
                  feed.photos.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                }`}
              >
                {feed.photos.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt="feed"
                    className="w-full h-36 object-cover rounded-xl border border-stone-200 shadow-2xs"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
            )}

            {/* 标签 */}
            {feed.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {feed.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] px-2 py-0.5 bg-stone-100 text-stone-600 rounded-md"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* 互动底栏 */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-stone-400">已存档至李家空间</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setActiveCommentFeedId(
                      activeCommentFeedId === feed.id ? null : feed.id
                    )
                  }
                  className="flex items-center gap-1 text-stone-500 hover:text-stone-800 px-2 py-1 rounded-lg"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{feed.comments.length}</span>
                </button>
                <button
                  onClick={() => likeFeedItem(feed.id)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg transition ${
                    feed.hasLiked
                      ? 'bg-rose-50 text-rose-600 font-bold'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${feed.hasLiked ? 'fill-rose-500' : ''}`} />
                  <span>{feed.likes}</span>
                </button>
              </div>
            </div>

            {/* 评论列表与输入框 */}
            {(feed.comments.length > 0 || activeCommentFeedId === feed.id) && (
              <div className="pt-2 border-t border-stone-100 space-y-2 text-xs">
                {feed.comments.map((c) => (
                  <div
                    key={c.id}
                    className="bg-stone-50 p-2.5 rounded-xl border border-stone-100 text-[11px] space-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900">
                        {c.authorAvatar} {c.authorName}
                      </span>
                      <span className="text-stone-400">{c.time}</span>
                    </div>
                    <p className="text-stone-700 leading-normal">{c.content}</p>
                  </div>
                ))}

                {activeCommentFeedId === feed.id && (
                  <div className="flex items-center gap-1.5 pt-1">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="写下关怀或确认..."
                      className="flex-1 px-3 py-1.5 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      onClick={() => handleSendComment(feed.id)}
                      className="p-1.5 bg-emerald-700 text-white rounded-xl hover:bg-emerald-800"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
