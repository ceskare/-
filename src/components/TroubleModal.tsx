import React from 'react';
import { Player, Card } from '../types/game.ts';
import { CardView } from './CardView.tsx';
import { Swords, X, Flame } from 'lucide-react';
import { SoundEngine } from '../services/audio.ts';

interface TroubleModalProps {
  isOpen: boolean;
  player: Player;
  onPlayMonster: (cardId: string) => void;
  onClose: () => void;
}

export const TroubleModal: React.FC<TroubleModalProps> = ({
  isOpen,
  player,
  onPlayMonster,
  onClose
}) => {
  if (!isOpen) return null;

  const monsterCards = player.hand.filter((c) => c.category === 'monster');

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#241a15] border-3 border-amber-600 rounded-3xl max-w-xl w-full p-5 text-[#f4ecd8] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => {
            SoundEngine.playButtonClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-stone-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-serif font-black text-lg text-amber-300 flex items-center gap-2 mb-1">
          <Flame className="w-5 h-5 text-red-500 fill-red-500" />
          Искать неприятности: Сразиться с монстром из руки
        </h3>
        <p className="text-xs text-stone-400 mb-4">
          Если за дверью не было монстра, вы можете сыграть монстра из своей руки и сразиться с ним за уровни и сокровища!
        </p>

        {monsterCards.length === 0 ? (
          <div className="py-10 text-center text-stone-400 text-xs">
            👹 У вас в руке нет карт монстров. Вы можете только «Почистить нычки» (взять вторую дверь в закрытую).
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-1">
            {monsterCards.map((card) => (
              <div
                key={card.id}
                className="bg-[#1b120c] border border-red-900/80 rounded-2xl p-2.5 flex flex-col justify-between"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-14 h-20 shrink-0">
                    <CardView card={card} size="sm" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xs text-red-300">
                      {card.name}
                    </h4>
                    <span className="text-[11px] font-mono font-bold text-amber-300 block">
                      Уровень: {card.monsterLevel} · 💎 {card.monsterTreasures} сокр.
                    </span>
                    <p className="text-[10px] text-stone-400 line-clamp-2">
                      {card.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    SoundEngine.playCombatHit();
                    onPlayMonster(card.id);
                    onClose();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-red-800 to-rose-700 hover:from-red-700 hover:to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg cursor-pointer transition-transform hover:scale-102"
                >
                  <Swords className="w-4 h-4" />
                  ВЫПУСТИТЬ В БОЙ
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
