import React, { useState, useRef, useEffect } from 'react';
import { useFamily } from '../../context/FamilyContext';
import {
  ChevronLeft,
  Sparkles,
  Send,
  Bot,
  User,
  ArrowRight,
  HeartPulse,
  Baby,
  CheckSquare,
  Clock,
} from 'lucide-react';

export const AIAssistantPage: React.FC = () => {
  const {
    aiMessages,
    isAITyping,
    sendAIMessage,
    triggerAIAction,
    setCurrentSubView,
    currentUserMember,
  } = useFamily();

  const [inputVal, setInputVal] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages, isAITyping]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;
    sendAIMessage(text);
    if (!textToSend) setInputVal('');
  };

  const presetQuestions = [
    '爷爷最近血压高怎么办？',
    '小宝本月该打什么疫苗？',
    '生成小宝成长月报',
    '今天有哪些家庭任务？',
    '王阿姨服务还有几天到期？',
  ];

  return (
    <div className="h-full flex flex-col p-4 pb-2 space-y-3 max-w-md mx-auto animate-fadeIn">
      {/* 顶部返回导航 */}
      <div className="flex items-center justify-between shrink-0">
        <button
          onClick={() => setCurrentSubView('none')}
          className="flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>返回</span>
        </button>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
            🤖
          </div>
          <span className="text-xs font-bold text-stone-800">AI家庭管家助手</span>
        </div>
        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
          档案已联网
        </span>
      </div>

      {/* 快捷提问推荐气泡 */}
      <div className="shrink-0 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {presetQuestions.map((q) => (
          <button
            key={q}
            onClick={() => handleSend(q)}
            className="text-[11px] font-medium bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs whitespace-nowrap transition"
          >
            💬 {q}
          </button>
        ))}
      </div>

      {/* 对话消息滚动流 */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {aiMessages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                isAssistant ? 'justify-start' : 'justify-end'
              }`}
            >
              {isAssistant && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-sm shrink-0 shadow-xs mt-0.5">
                  🤖
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-2 ${
                  isAssistant
                    ? 'bg-white border border-stone-200/90 text-stone-800 shadow-xs'
                    : 'bg-emerald-700 text-white shadow-xs rounded-tr-xs'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* 智能行动卡片 */}
                {msg.actionCard && (
                  <div
                    onClick={() => triggerAIAction(msg.actionCard!.type)}
                    className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 mt-2 cursor-pointer hover:bg-emerald-100/80 transition flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-xs flex items-center gap-1 text-emerald-900">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{msg.actionCard.title}</span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-0.5">
                        {msg.actionCard.details}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-700 shrink-0 ml-2" />
                  </div>
                )}

                <div
                  className={`text-[9px] text-right ${
                    isAssistant ? 'text-stone-400' : 'text-emerald-200'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {!isAssistant && (
                <div className="w-8 h-8 rounded-xl bg-stone-200 text-stone-800 flex items-center justify-center text-sm shrink-0 mt-0.5">
                  {currentUserMember.avatar}
                </div>
              )}
            </div>
          );
        })}

        {isAITyping && (
          <div className="flex items-center gap-2 text-xs text-stone-400 pl-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-xs animate-bounce">
              🤖
            </div>
            <span>AI管家正在检索李家健康档案并思考建议...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 底部输入框 */}
      <div className="shrink-0 pt-2 border-t border-stone-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="问问AI管家：关于爷爷血压、小宝疫苗、任务安排..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="p-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl shadow-xs transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
