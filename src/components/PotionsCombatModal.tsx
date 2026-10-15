import React from 'react';
import { Player, Card } from '../types/game.ts';
import { CardView } from './CardView.tsx';
import { Sparkles, X, Shield, Swords } from 'lucide-react';
import { SoundEngine } from '../services/audio.ts';

interface PotionsCombatModalProps {
  isOpen: boolean;
  player: Player;
  onPlayPotionForHero: (cardId: string) => void;
  onPlayPotionForMonster: (cardId: string) => void;
  onClose: () => void;
}

export const PotionsCombatModal: React.FC<PotionsCombatModalProps> = ({
  isOpen,
  player,
  onPlayPotionForHero,
  onPlayPotionForMonster,
  onClose
}) => {
  if (!isOpen) return null;

  const combatCards = player.hand.filter(
    (c) => c.category === 'potion' || c.category === 'modifier'
  );

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
          <Sparkles className="w-5 h-5 text-cyan-400" />
          Сыграть зелья и модификаторы в бой
        </h3>
        <p className="text-xs text-stone-400 mb-4">
          Одноразовые зелья можно применить как в помощь герою, так и на усиление монстра!
        </p>

        {combatCards.length === 0 ? (
          <div className="py-10 text-center text-stone-400 text-xs">
            🧪 В вашей руке сейчас нет боевых зелий или модификаторов.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-1">
            {combatCards.map((card) => (
              <div
                key={card.id}
                className="bg-[#1b120c] border border-amber-800/80 rounded-2xl p-2.5 flex flex-col justify-between"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-12 h-16 shrink-0">
                    <CardView card={card} size="sm" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xs text-amber-200">
                      {card.name}
                    </h4>
                    <span className="text-[11px] font-mono font-bold text-cyan-300 block">
                      +{card.bonus || 2} в бою
                    </span>
                    <p className="text-[10px] text-stone-400 line-clamp-2">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <button
                    onClick={() => {
                      SoundEngine.playPotion();
                      onPlayPotionForHero(card.id);
                      onClose();
                    }}
                    className="py-1.5 px-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow cursor-pointer transition-transform hover:scale-102"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    За Манчкина
                  </button>

                  <button
                    onClick={() => {
                      SoundEngine.playPotion();
                      SoundEngine.playCombatHit();
                      onPlayPotionForMonster(card.id);
                      onClose();
                    }}
                    className="py-1.5 px-2 rounded-xl bg-red-800 hover:bg-red-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow cursor-pointer transition-transform hover:scale-102"
                  >
                    <Swords className="w-3.5 h-3.5" />
                    За Монстра
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
