import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Player } from '../types/game.ts';
import { SoundEngine } from '../services/audio.ts';
import { submitLeaderboardScore } from '../services/yandexGames.ts';
import { Trophy, Crown, Flame, Swords, RotateCcw, Home } from 'lucide-react';

interface VictoryModalProps {
  winner: Player;
  isCurrentUserWinner: boolean;
  onPlayAgain: () => void;
  onExitLobby: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  winner,
  isCurrentUserWinner,
  onPlayAgain,
  onExitLobby
}) => {
  useEffect(() => {
    SoundEngine.playVictory();

    // Fire fireworks / confetti
    try {
      const end = Date.now() + 3 * 1000;
      const colors = ['#d4af37', '#ffd700', '#ff4500', '#00ff7f'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } catch {
      // Ignore if confetti fails
    }

    if (isCurrentUserWinner) {
      submitLeaderboardScore(1);
    }
  }, [isCurrentUserWinner]);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#241a15] border-4 border-amber-500 rounded-3xl max-w-md w-full p-6 text-center text-[#f4ecd8] shadow-2xl relative animate-in fade-in zoom-in-95 duration-300">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 p-1 flex items-center justify-center shadow-[0_0_35px_rgba(245,158,11,0.5)] mb-3">
          <Trophy className="w-10 h-10 text-stone-950 stroke-[2.5]" />
        </div>

        <h2 className="text-2xl font-serif font-black text-amber-300 tracking-wide uppercase">
          {isCurrentUserWinner ? 'ТЫ ПОБЕДИЛ!' : 'ПОБЕДА В МАНЧКИНЕ!'}
        </h2>

        <p className="text-xs text-amber-200/80 mt-1">
          {isCurrentUserWinner
            ? 'Ты одолел чудовищ и первым достиг заветного 10-го Уровня!'
            : `Игрок ${winner.name} достиг 10-го Уровня и стал величайшим Манчкином подземелья!`}
        </p>

        {/* Winner Showcase Card */}
        <div className="my-5 bg-stone-950/80 border border-amber-600/60 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{winner.avatar}</span>
            <div className="text-left">
              <div className="font-bold text-base text-amber-100">{winner.name}</div>
              <div className="text-xs text-emerald-400 font-bold">
                10 Уровень • {winner.class !== 'none' ? winner.class : 'Манчкин'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-xl border border-amber-500/40 font-mono font-bold text-xs">
            <Crown className="w-4 h-4 text-amber-400" />
            ЧЕМПИОН
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => {
              SoundEngine.playDoorOpen();
              onPlayAgain();
            }}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 font-bold text-stone-950 text-xs flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-102 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Сыграть ещё
          </button>

          <button
            onClick={() => {
              SoundEngine.playButtonClick();
              onExitLobby();
            }}
            className="px-4 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 font-bold text-stone-300 text-xs flex items-center justify-center gap-1.5 transition-colors border border-stone-700 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            В лобби
          </button>
        </div>
      </div>
    </div>
  );
};
