import React, { useState, useRef, useEffect } from 'react';
import { GameLogEntry, ChatMessage } from '../types/game.ts';
import { ScrollText, MessageSquare, Send, X } from 'lucide-react';
import { SoundEngine } from '../services/audio.ts';

interface BattleLogProps {
  logs: GameLogEntry[];
  chat: ChatMessage[];
  currentUserId: string;
  onSendChat: (text: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const BattleLog: React.FC<BattleLogProps> = ({
  logs,
  chat,
  currentUserId,
  onSendChat,
  isOpen,
  onToggle
}) => {
  const [activeTab, setActiveTab] = useState<'log' | 'chat'>('log');
  const [chatInput, setChatInput] = useState('');
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, chat, isOpen, activeTab]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendChat(chatInput.trim());
    setChatInput('');
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => {
          SoundEngine.playButtonClick();
          onToggle();
        }}
        className="fixed bottom-24 right-4 z-40 bg-stone-900/95 hover:bg-stone-800 text-amber-300 border border-amber-600/70 rounded-full px-3 py-2 flex items-center gap-1.5 shadow-2xl transition-all hover:scale-105 cursor-pointer"
        title="Журнал боя и чат"
      >
        <ScrollText className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-bold font-mono">Журнал ({logs.length})</span>
      </button>

      {/* Side drawer */}
      {isOpen && (
        <div className="fixed top-14 bottom-24 right-2 w-80 max-w-full bg-[#1c1510]/95 border-2 border-amber-800/80 rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden backdrop-blur-md animate-in slide-in-from-right duration-200">
          {/* Drawer Header with Tabs */}
          <div className="flex items-center justify-between p-2 bg-stone-950/80 border-b border-stone-800">
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  SoundEngine.playButtonClick();
                  setActiveTab('log');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'log'
                    ? 'bg-amber-600 text-stone-950'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Журнал боя
              </button>
              <button
                onClick={() => {
                  SoundEngine.playButtonClick();
                  setActiveTab('chat');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-amber-600 text-stone-950'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Чат комнаты
              </button>
            </div>

            <button
              onClick={() => {
                SoundEngine.playButtonClick();
                onToggle();
              }}
              className="p-1 text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-2.5 overflow-y-auto space-y-2 text-xs font-sans">
            {activeTab === 'log' ? (
              logs.length === 0 ? (
                <div className="text-center text-stone-500 py-8 italic">
                  Игра только началась. Первые события появятся здесь!
                </div>
              ) : (
                logs.map((entry) => (
                  <div
                    key={entry.id}
                    className={`p-2 rounded-lg border text-[11px] leading-tight ${
                      entry.type === 'combat'
                        ? 'bg-red-950/40 border-red-800/60 text-red-200'
                        : entry.type === 'level'
                        ? 'bg-yellow-950/40 border-yellow-700/60 text-yellow-200'
                        : entry.type === 'curse'
                        ? 'bg-purple-950/40 border-purple-800/60 text-purple-200'
                        : entry.type === 'equip'
                        ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                        : 'bg-stone-900/60 border-stone-800 text-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[9px] opacity-60 mb-0.5">
                      <span>{entry.playerName || 'Система'}</span>
                      <span>
                        {new Date(entry.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </span>
                    </div>
                    <div>{entry.text}</div>
                  </div>
                ))
              )
            ) : chat.length === 0 ? (
              <div className="text-center text-stone-500 py-8 italic">
                В чате пока тихо. Напиши что-нибудь игрокам!
              </div>
            ) : (
              chat.map((msg) => {
                const isMe = msg.senderId === currentUserId;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[9px] text-stone-400 font-semibold mb-0.5">
                      {msg.senderName}
                    </span>
                    <div
                      className={`px-2.5 py-1.5 rounded-xl max-w-[85%] text-xs ${
                        isMe
                          ? 'bg-amber-600 text-stone-950 font-medium'
                          : 'bg-stone-800 text-stone-200 border border-stone-700'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={logEndRef} />
          </div>

          {/* Chat input box when on chat tab */}
          {activeTab === 'chat' && (
            <form onSubmit={handleSend} className="p-2 border-t border-stone-800 flex gap-1.5">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Написать в чат..."
                className="flex-1 bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="p-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 rounded-lg"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
};
