import React from 'react';
import { YandexPlayerProfile } from '../types/game.ts';
import { Trophy, Coins, Award, Swords, Skull, Flame, Shield, X, Check } from 'lucide-react';
import { SoundEngine } from '../services/audio.ts';

interface RatingEconomyModalProps {
  isOpen: boolean;
  profile: YandexPlayerProfile;
  onClose: () => void;
  onBuyTitle?: (title: string, cost: number) => void;
}

export const RatingEconomyModal: React.FC<RatingEconomyModalProps> = ({
  isOpen,
  profile,
  onClose,
  onBuyTitle
}) => {
  if (!isOpen) return null;

  const rating = profile.ratingScore || 1200;
  const coins = profile.coins || 450;
  const stats = profile.stats || {
    gamesPlayed: 0,
    wins: 0,
    monstersSlain: 0,
    highestLevel: 1,
    cursesCast: 0,
    helpsGiven: 0,
    goldAccumulated: 0
  };

  const winRate =
    stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;

  // Rank Tiers
  const tiers = [
    { title: 'Бронзовый Бродяга', minScore: 0, icon: '🥉', color: 'text-amber-600' },
    { title: 'Серебряный Воин', minScore: 500, icon: '🥈', color: 'text-stone-300' },
    { title: 'Золотой Драконоборец', minScore: 1000, icon: '🥇', color: 'text-yellow-400' },
    { title: 'Алмазный Манчкин 10 Ур.', minScore: 2000, icon: '💎', color: 'text-cyan-400' }
  ];

  const currentTier =
    [...tiers].reverse().find((t) => rating >= t.minScore) || tiers[0];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#241a15] border-3 border-amber-600 rounded-3xl max-w-lg w-full max-h-[88vh] flex flex-col shadow-2xl text-[#f4ecd8] relative animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#3b2010] to-[#25150a] border-b-2 border-amber-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-xl">
              🏆
            </div>
            <div>
              <h2 className="font-serif font-black text-lg text-amber-300 leading-tight">
                Рейтинг и Монеты (Doors & Treasures)
              </h2>
              <div className="text-[11px] text-amber-200/70 font-mono">
                Система соревновательного рейтинга и наград
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              SoundEngine.playButtonClick();
              onClose();
            }}
            className="p-1 text-stone-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* 1. Player Rank Banner */}
          <div className="bg-stone-950/80 border-2 border-amber-500/60 rounded-2xl p-4 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-3">
              <span className="text-4xl filter drop-shadow">{currentTier.icon}</span>
              <div>
                <div className={`font-serif font-black text-base ${currentTier.color}`}>
                  {currentTier.title}
                </div>
                <div className="text-[11px] text-stone-400">
                  Текущий рейтинг Манчкина: <span className="font-mono font-bold text-amber-300">{rating} MMR</span>
                </div>
              </div>
            </div>

            {/* Coins Balance */}
            <div className="flex items-center gap-1.5 bg-yellow-950/90 border border-yellow-600 px-3 py-1.5 rounded-xl font-mono font-bold text-yellow-300 shadow">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span>{coins} Монет</span>
            </div>
          </div>

          {/* 2. Rating Ladders List */}
          <div className="bg-stone-900/70 rounded-2xl p-3 border border-stone-800">
            <div className="font-serif font-bold text-amber-300 text-xs mb-2">
              Рейтинговая лестница подземелья:
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {tiers.map((t) => {
                const isCurrent = currentTier.title === t.title;
                return (
                  <div
                    key={t.title}
                    className={`p-2 rounded-xl border flex items-center justify-between ${
                      isCurrent
                        ? 'bg-amber-950/80 border-amber-400 shadow ring-1 ring-amber-400'
                        : 'bg-stone-950/60 border-stone-800 opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{t.icon}</span>
                      <span className="font-bold truncate">{t.title}</span>
                    </div>
                    <span className="font-mono text-stone-400">{t.minScore}+</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Detailed Combat Stats Grid */}
          <div className="bg-stone-900/70 rounded-2xl p-3 border border-stone-800">
            <div className="font-serif font-bold text-amber-300 text-xs mb-2">
              Боевая статистика манчкина:
            </div>
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="bg-stone-950 p-2 rounded-xl border border-stone-800">
                <div className="text-[10px] text-stone-400">Винрейт</div>
                <div className="text-sm font-black text-emerald-400">{winRate}%</div>
              </div>
              <div className="bg-stone-950 p-2 rounded-xl border border-stone-800">
                <div className="text-[10px] text-stone-400">Игр сыграно</div>
                <div className="text-sm font-black text-amber-200">{stats.gamesPlayed}</div>
              </div>
              <div className="bg-stone-950 p-2 rounded-xl border border-stone-800">
                <div className="text-[10px] text-stone-400">Побед (10 ур.)</div>
                <div className="text-sm font-black text-yellow-400">{stats.wins}</div>
              </div>
              <div className="bg-stone-950 p-2 rounded-xl border border-stone-800">
                <div className="text-[10px] text-stone-400">Монстров убито</div>
                <div className="text-sm font-black text-red-400">{stats.monstersSlain}</div>
              </div>
              <div className="bg-stone-950 p-2 rounded-xl border border-stone-800">
                <div className="text-[10px] text-stone-400">Проклятий сыграно</div>
                <div className="text-sm font-black text-purple-400">{stats.cursesCast || 3}</div>
              </div>
              <div className="bg-stone-950 p-2 rounded-xl border border-stone-800">
                <div className="text-[10px] text-stone-400">Помощь друзьям</div>
                <div className="text-sm font-black text-cyan-400">{stats.helpsGiven || 2}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-950 border-t border-stone-800 flex justify-end">
          <button
            onClick={() => {
              SoundEngine.playButtonClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 font-serif font-black text-stone-950 text-xs shadow-lg transition-transform hover:scale-102 cursor-pointer"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
