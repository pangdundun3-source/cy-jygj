import React, { useEffect, useRef, useState } from 'react';
import { useFamily } from '../../context/FamilyContext';
import { CareFeedItem } from '../../types';
import {
  Activity,
  Heart,
  MessageCircle,
  Camera,
  ImagePlus,
  Video,
  X,
  Send,
  Plus,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Mic,
  AudioLines,
  Square,
} from 'lucide-react';

type BrowserSpeechRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: { transcript: string };
  }>;
};

function createRecognizer(): BrowserSpeechRecognition | null {
  const speechWindow = window as Window & {
    SpeechRecognition?: new () => BrowserSpeechRecognition;
    webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
  };
  const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
  if (!Recognition) return null;
  const recognition = new Recognition();
  recognition.lang = 'zh-CN';
  recognition.continuous = true;
  recognition.interimResults = true;
  return recognition;
}

export const FamilyFeedPage: React.FC = () => {
  const {
    careFeeds,
    addFeedItem,
    likeFeedItem,
    addFeedComment,
    currentUserMember,
    showToast,
    feedDraft,
    clearFeedDraft,
    updateTaskStatus,
  } = useFamily();

  const [filterType, setFilterType] = useState<string>('all');
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [postContent, setPostContent] = useState<string>('');
  const [postType, setPostType] = useState<CareFeedItem['type']>('baby_daily');
  const [linkedTaskId, setLinkedTaskId] = useState<string | null>(null);
  const [linkedTaskTitle, setLinkedTaskTitle] = useState<string>('');
  const [activeCommentFeedId, setActiveCommentFeedId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<string>('');
  const [attachments, setAttachments] = useState<{ id: string; url: string; kind: 'image' | 'video' }[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [voiceMode, setVoiceMode] = useState<'idle' | 'dictating' | 'recording'>('idle');
  const [recordSeconds, setRecordSeconds] = useState(0);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const draftBaseRef = useRef('');
  const finalTranscriptRef = useRef('');

  useEffect(() => {
    if (!feedDraft) return;
    const typeMap = {
      baby: 'baby_daily',
      elderly: 'medical_escort',
      cleaning: 'cleaning',
      errand: 'family_moment',
    } as const;
    setIsPosting(true);
    setPostType(typeMap[feedDraft.category]);
    setPostContent(
      `【任务打卡】${feedDraft.title}\n时间：${feedDraft.scheduledTime}\n执行人：${feedDraft.assigneeName}\n${feedDraft.note}`
    );
    setLinkedTaskId(feedDraft.taskId);
    setLinkedTaskTitle(feedDraft.title);
    clearFeedDraft();
  }, [feedDraft, clearFeedDraft]);

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
      attachments.filter((item) => item.kind === 'image').map((item) => item.url),
      ['日常打卡', '家庭协作'],
      attachments.filter((item) => item.kind === 'video').map((item) => item.url)
    );
    if (linkedTaskId) {
      updateTaskStatus(linkedTaskId, 'completed', undefined, postContent);
      setLinkedTaskId(null);
      setLinkedTaskTitle('');
    }
    finishVoice();
    setPostContent('');
    setAttachments([]);
    setIsPosting(false);
    showToast('服务照护记录已发布，全家已同步！', 'success');
  };

  const addAttachmentFiles = (files: FileList | null, kind: 'image' | 'video') => {
    if (!files?.length) return;
    const maxBytes = kind === 'image' ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
    const accepted: { id: string; url: string; kind: 'image' | 'video' }[] = [];
    Array.from(files).forEach((file) => {
      const matches = kind === 'image' ? file.type.startsWith('image/') : file.type.startsWith('video/');
      if (!matches) {
        showToast(`${file.name} 不是${kind === 'image' ? '图片' : '视频'}`, 'warning');
        return;
      }
      if (file.size > maxBytes) {
        showToast(`${file.name} 超过 ${kind === 'image' ? '10MB' : '50MB'}`, 'warning');
        return;
      }
      accepted.push({ id: `${kind}_${Date.now()}_${file.name}`, url: URL.createObjectURL(file), kind });
    });
    if (accepted.length) setAttachments((prev) => [...prev, ...accepted]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((item) => item.id !== id);
    });
  };

  const clearAttachments = () => {
    setAttachments((prev) => {
      prev.forEach((item) => URL.revokeObjectURL(item.url));
      return [];
    });
  };

  const handleSendComment = (feedId: string) => {
    if (!commentText.trim()) return;
    addFeedComment(feedId, commentText);
    setCommentText('');
    setActiveCommentFeedId(null);
  };

  const applyTranscript = (finalText: string, interimText: string) => {
    if (finalText) finalTranscriptRef.current += finalText;
    const spoken = `${finalTranscriptRef.current}${interimText}`.trim();
    const base = draftBaseRef.current.trim();
    setPostContent(base && spoken ? `${base}\n${spoken}` : spoken || base);
  };

  const releaseMicrophone = () => {
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    recognition?.abort();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    setVoiceMode('idle');
    setRecordSeconds(0);
  };

  const finishVoice = () => {
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    recognition?.stop();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    setVoiceMode('idle');
    setRecordSeconds(0);
  };

  const beginRecognition = (mode: 'dictating' | 'recording') => {
    const recognition = createRecognizer();
    if (!recognition) {
      showToast('当前浏览器不支持语音识别，请使用 Chrome 或 Edge', 'warning');
      return false;
    }
    draftBaseRef.current = postContent;
    finalTranscriptRef.current = '';
    recognition.onresult = (event) => {
      let finalText = '';
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const piece = event.results[i][0]?.transcript ?? '';
        if (event.results[i].isFinal) finalText += piece;
        else interimText += piece;
      }
      applyTranscript(finalText, interimText);
    };
    recognition.onerror = (event) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        showToast('请允许使用麦克风后再试', 'warning');
      } else if (event.error !== 'aborted' && event.error !== 'no-speech') {
        showToast('语音识别失败，请再试一次', 'warning');
      }
      releaseMicrophone();
    };
    recognition.onend = () => {
      if (recognitionRef.current === recognition) {
        releaseMicrophone();
      }
    };
    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      releaseMicrophone();
      showToast('暂时无法开始语音识别，请再试一次', 'warning');
      return false;
    }
    setVoiceMode(mode);
    return true;
  };

  const startDictation = () => {
    if (voiceMode !== 'idle') {
      finishVoice();
      showToast('语音内容已填入输入框', 'success');
      return;
    }
    if (beginRecognition('dictating')) {
      showToast('开始语音输入，请对着麦克风说话', 'info');
    }
  };

  const startRecordToText = async () => {
    if (voiceMode !== 'idle') {
      finishVoice();
      showToast('录音已转为文字并填入输入框', 'success');
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      showToast('当前浏览器不支持录音', 'warning');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.start();
      if (!beginRecognition('recording')) {
        releaseMicrophone();
      }
    } catch {
      showToast('无法打开麦克风，请检查权限', 'warning');
      releaseMicrophone();
    }
  };

  useEffect(() => {
    if (voiceMode !== 'recording') return;
    const timer = window.setInterval(() => setRecordSeconds((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(timer);
  }, [voiceMode]);

  useEffect(() => () => releaseMicrophone(), []);

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
          onClick={() => {
            if (isPosting) {
              finishVoice();
              clearAttachments();
            }
            setIsPosting(!isPosting);
          }}
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
            <div>
              <h3 className="font-bold text-xs text-stone-900">发布服务照护记录 / 家庭动态</h3>
              {linkedTaskTitle && (
                <p className="text-[10px] text-emerald-700 mt-0.5">来自任务：{linkedTaskTitle}</p>
              )}
            </div>
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

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={startDictation}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition ${
                voiceMode === 'dictating'
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              {voiceMode === 'dictating' ? <Square className="w-3 h-3" /> : <Mic className="w-3.5 h-3.5" />}
              {voiceMode === 'dictating' ? '结束语音' : '语音'}
            </button>
            <button
              type="button"
              onClick={startRecordToText}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition ${
                voiceMode === 'recording'
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {voiceMode === 'recording' ? <Square className="w-3 h-3" /> : <AudioLines className="w-3.5 h-3.5" />}
              {voiceMode === 'recording'
                ? `结束录音 ${Math.floor(recordSeconds / 60)}:${String(recordSeconds % 60).padStart(2, '0')}`
                : '录音转文字'}
            </button>
          </div>
          {voiceMode !== 'idle' && (
            <p className="text-[10px] text-stone-500 -mt-1">
              {voiceMode === 'dictating' ? '正在听写，识别结果会直接写入上方输入框' : '正在录音，结束后自动转成文字填入输入框'}
            </p>
          )}

          <div className="flex items-center gap-2">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                addAttachmentFiles(e.target.files, 'image');
                e.target.value = '';
              }}
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              multiple
              className="hidden"
              onChange={(e) => {
                addAttachmentFiles(e.target.files, 'video');
                e.target.value = '';
              }}
            />
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
            >
              <ImagePlus className="w-3.5 h-3.5" />
              上传图片
            </button>
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border border-stone-200 bg-white text-stone-700 hover:bg-stone-50"
            >
              <Video className="w-3.5 h-3.5" />
              上传视频
            </button>
          </div>
          {attachments.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {attachments.map((item) => (
                <div key={item.id} className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-100 h-20">
                  {item.kind === 'image' ? (
                    <img src={item.url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <video src={item.url} className="w-full h-full object-cover" />
                  )}
                  <button
                    type="button"
                    onClick={() => removeAttachment(item.id)}
                    className="absolute top-1 right-1 w-4 h-4 rounded-full bg-stone-900/70 text-white flex items-center justify-center"
                    aria-label="移除"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <Camera className="w-4 h-4 text-stone-400" />
              <span>{attachments.length > 0 ? `已选 ${attachments.length} 个文件` : '可附带图片或视频'}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  finishVoice();
                  clearAttachments();
                  setIsPosting(false);
                }}
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
            {(feed.photos.length > 0 || (feed.videos?.length ?? 0) > 0) && (
              <div
                className={`grid gap-2 pt-1 ${
                  feed.photos.length + (feed.videos?.length ?? 0) === 1 ? 'grid-cols-1' : 'grid-cols-2'
                }`}
              >
                {feed.photos.map((url, idx) => (
                  <img
                    key={`photo-${idx}`}
                    src={url}
                    alt="feed"
                    className="w-full h-36 object-cover rounded-xl border border-stone-200 shadow-2xs"
                    referrerPolicy="no-referrer"
                  />
                ))}
                {feed.videos?.map((url, idx) => (
                  <video
                    key={`video-${idx}`}
                    src={url}
                    controls
                    className="w-full h-36 object-cover rounded-xl border border-stone-200 bg-stone-900"
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
