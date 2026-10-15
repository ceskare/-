import React, { useState } from 'react';
import { YandexPlayerProfile, GameMode, DungeonTheme } from '../types/game.ts';
import { loginYandexPlayer } from '../services/yandexGames.ts';
import { SoundEngine } from '../services/audio.ts';
import {
  Play,
  Users,
  PlusCircle,
  LogIn,
  BookOpen,
  Volume2,
  VolumeX,
  Maximize2,
  Trophy,
  Swords,
  ShieldAlert,
  Flame,
  Coins,
  Sparkles,
  Zap
} from 'lucide-react';

interface LobbyScreenProps {
  playerProfile: YandexPlayerProfile;
  onUpdateProfile: (profile: YandexPlayerProfile) => void;
  onStartSinglePlayer: (botCount: number) => void;
  onCreateRoom: (roomCode: string) => void;
  onJoinRoom: (roomCode: string) => void;
  onOpenRules: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenRatingModal: () => void;
  onOpenThemeSelector: () => void;
  gameMode: GameMode;
  onChangeGameMode: (mode: GameMode) => void;
  currentTheme: DungeonTheme;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  playerProfile,
  onUpdateProfile,
  onStartSinglePlayer,
  onCreateRoom,
  onJoinRoom,
  onOpenRules,
  isMuted,
  onToggleMute,
  onOpenRatingModal,
  onOpenThemeSelector,
  gameMode,
  onChangeGameMode,
  currentTheme
}) => {
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [selectedBotCount, setSelectedBotCount] = useState(2);
  const [activeTab, setActiveTab] = useState<'quick' | 'multiplayer'>('quick');

  const handleYandexLogin = async () => {
    const updated = await loginYandexPlayer();
    if (updated) {
      onUpdateProfile(updated);
    }
  };

  const handleCreateRandomRoom = () => {
    const code = Math.random().toString(36).substring(2, 6).toUpperCase();
    onCreateRoom(code);
  };

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCodeInput.trim()) return;
    onJoinRoom(roomCodeInput.trim().toUpperCase());
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="relative w-full min-h-screen dungeon-bg dungeon-stone-pattern flex flex-col justify-between p-4 text-[#f4ecd8] select-none overflow-hidden font-fantasy">
      {/* Torch fire glow overlays on flanks */}
      <div className="absolute top-1/4 -left-16 w-64 h-64 rounded-full bg-amber-600/15 blur-3xl pointer-events-none animate-torch" />
      <div className="absolute top-1/4 -right-16 w-64 h-64 rounded-full bg-amber-600/15 blur-3xl pointer-events-none animate-torch" />

      {/* Atmospheric dungeon vignette overlay */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/80 pointer-events-none" />

      {/* Top Bar: Yandex Profile & Utility Controls */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
        {/* Yandex Games Auth & Player Card */}
        <div
          onClick={onOpenRatingModal}
          className="flex items-center gap-3 bg-stone-900/80 hover:bg-stone-850 border border-amber-900/60 hover:border-amber-500/60 rounded-2xl px-3.5 py-1.5 backdrop-blur-sm shadow-lg cursor-pointer transition-colors"
          title="Открыть профиль, рейтинг и награды"
        >
          <div className="w-10 h-10 rounded-full bg-amber-950 border-2 border-amber-500 overflow-hidden flex items-center justify-center text-xl shadow">
            {playerProfile.avatarUrl ? (
              <img
                src={playerProfile.avatarUrl}
                alt={playerProfile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>🧙‍♂️</span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-amber-200">{playerProfile.name}</span>
              {playerProfile.isAuthorized ? (
                <span className="text-[9px] bg-red-950/80 text-red-300 border border-red-700 px-1.5 py-0.2 rounded font-semibold">
                  Яндекс
                </span>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleYandexLogin();
                  }}
                  className="text-[9px] bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/50 px-1.5 py-0.2 rounded transition-colors font-medium flex items-center gap-1"
                >
                  <LogIn className="w-2.5 h-2.5" /> Войти
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 text-[10px] text-stone-400 mt-0.5">
              <span className="flex items-center gap-1 text-amber-400 font-mono font-bold">
                <Trophy className="w-3 h-3 text-amber-400" /> {playerProfile.ratingScore || 1250} MMR
              </span>
              <span className="flex items-center gap-1 text-yellow-300 font-mono font-bold">
                <Coins className="w-3 h-3 text-yellow-400" /> {playerProfile.coins || 500} 💰
              </span>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              SoundEngine.playButtonClick();
              onOpenThemeSelector();
            }}
            className="p-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-amber-300 border border-amber-700/60 transition-colors shadow flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            title="Выбор фона подземелья"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Фон</span>
          </button>

          <button
            onClick={() => {
              SoundEngine.playButtonClick();
              onOpenRatingModal();
            }}
            className="p-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-amber-300 border border-amber-700/60 transition-colors shadow flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            title="Рейтинг и Магазин Званий"
          >
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="hidden sm:inline">Рейтинг</span>
          </button>

          <button
            onClick={() => {
              SoundEngine.playButtonClick();
              onOpenRules();
            }}
            className="p-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-amber-300 border border-amber-700/60 transition-colors shadow flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            title="Правила игры"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Правила</span>
          </button>

          <button
            onClick={onToggleMute}
            className="p-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-amber-300 border border-amber-700/60 transition-colors shadow cursor-pointer"
            title={isMuted ? 'Включить звук' : 'Выключить звук'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-amber-300 border border-amber-700/60 transition-colors shadow cursor-pointer"
            title="Во весь экран"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Center: Bespoke Munchkin Title Lockup & Game Modes */}
      <main className="relative z-10 w-full max-w-xl mx-auto my-auto flex flex-col items-center text-center">
        {/* Title Logo Lockup */}
        <div className="mb-6 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold tracking-widest uppercase mb-3">
            <span>🚪 ДВЕРИ И СОКРОВИЩА 💎</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black font-fantasy tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#ffe7aa] via-[#f7c865] to-[#c88f28] filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            МАНЧКИН
          </h1>
          <p className="text-sm font-serif italic text-amber-200/90 mt-1 max-w-md">
            «Мочи монстров, хапай сокровища, подставляй друзей»
          </p>
        </div>

        {/* Mode Selector Card */}
        <div className="w-full bg-[#241a15]/95 border-2 border-amber-700/80 rounded-3xl p-5 shadow-2xl backdrop-blur-md">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-stone-950/80 p-1 rounded-2xl mb-5 border border-stone-800">
            <button
              onClick={() => {
                SoundEngine.playButtonClick();
                setActiveTab('quick');
              }}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'quick'
                  ? 'bg-amber-600 text-stone-950 shadow-md font-extrabold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              Быстрая игра (Боты)
            </button>

            <button
              onClick={() => {
                SoundEngine.playButtonClick();
                setActiveTab('multiplayer');
              }}
              className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'multiplayer'
                  ? 'bg-amber-600 text-stone-950 shadow-md font-extrabold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Онлайн Комнаты
            </button>
          </div>

          {/* Quick Play Pane */}
          {activeTab === 'quick' && (
            <div className="flex flex-col items-center space-y-4">
              {/* Game Mode Selector */}
              <div className="w-full text-left">
                <label className="text-xs font-bold text-amber-200 block mb-1.5 flex items-center justify-between">
                  <span>Режим игры:</span>
                  <span className="text-[10px] text-amber-300/80 font-normal">
                    {gameMode === 'classic' && 'Классические правила до 10-го Уровня'}
                    {gameMode === 'blitz' && 'Быстрый бой: таймер 30 сек на ход'}
                    {gameMode === 'ranked' && 'Соревновательный: начисление MMR и монет'}
                  </span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      SoundEngine.playButtonClick();
                      onChangeGameMode('classic');
                    }}
                    className={`py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      gameMode === 'classic'
                        ? 'bg-amber-950 border-amber-500 text-amber-200 shadow-inner ring-1 ring-amber-400'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <Swords className="w-3.5 h-3.5 text-amber-400" />
                    Классика
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      SoundEngine.playButtonClick();
                      onChangeGameMode('blitz');
                    }}
                    className={`py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      gameMode === 'blitz'
                        ? 'bg-amber-950 border-amber-500 text-amber-200 shadow-inner ring-1 ring-amber-400'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    Блиц
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      SoundEngine.playButtonClick();
                      onChangeGameMode('ranked');
                    }}
                    className={`py-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      gameMode === 'ranked'
                        ? 'bg-amber-950 border-amber-500 text-amber-200 shadow-inner ring-1 ring-amber-400'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                    Рейтинг
                  </button>
                </div>
              </div>

              {/* Bot count */}
              <div className="w-full text-left">
                <label className="text-xs font-bold text-amber-200 block mb-1.5">
                  Количество соперников-ботов:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => {
                        SoundEngine.playButtonClick();
                        setSelectedBotCount(cnt);
                      }}
                      className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        selectedBotCount === cnt
                          ? 'bg-amber-950 border-amber-500 text-amber-200 shadow-inner ring-1 ring-amber-400'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:border-stone-700'
                      }`}
                    >
                      {cnt} {cnt === 1 ? 'соперник' : 'соперника'} ({cnt + 1} игрока)
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  SoundEngine.playDoorOpen();
                  onStartSinglePlayer(selectedBotCount);
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 hover:from-emerald-500 hover:to-green-400 text-stone-950 font-black text-base shadow-[0_8px_20px_rgba(16,185,129,0.3)] transition-all hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
                data-testid="start-quick-game"
              >
                <Play className="w-5 h-5 fill-stone-950" />
                НАЧАТЬ ИГРУ
              </button>
            </div>
          )}

          {/* Multiplayer Rooms Pane */}
          {activeTab === 'multiplayer' && (
            <div className="space-y-4">
              <button
                onClick={() => {
                  SoundEngine.playDoorOpen();
                  handleCreateRandomRoom();
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-stone-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-102 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                СОЗДАТЬ СВОЮ КОМНАТУ
              </button>

              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-stone-800 w-full" />
                <span className="bg-[#241a15] px-3 text-[11px] font-mono text-stone-500 uppercase">
                  или по коду
                </span>
                <div className="border-t border-stone-800 w-full" />
              </div>

              <form onSubmit={handleJoinByCode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value)}
                  placeholder="КОД КОМНАТЫ (НАПР. ABCD)"
                  className="flex-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2.5 text-xs font-mono uppercase text-center tracking-widest text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={!roomCodeInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 disabled:opacity-50 text-amber-300 font-bold text-xs border border-amber-600/40"
                >
                  Войти
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Footer: Control Hints & Credits */}
      <footer className="relative z-10 w-full text-center text-[11px] text-stone-500 py-2 border-t border-stone-900/80">
        <div className="font-mono text-stone-400">
          Клик по колоде Дверей для выбивания · Drag & Drop / Клик по картам для розыгрыша · 10 Уровень = Победа
        </div>
      </footer>
    </div>
  );
};
