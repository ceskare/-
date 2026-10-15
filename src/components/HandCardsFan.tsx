import React, { useState } from 'react';
import { Card, Player } from '../types/game.ts';
import { canEquipItem } from '../game/rules.ts';
import { CardView } from './CardView.tsx';
import { MunchkinCardBackSvg } from '../game/illustrations.tsx';
import { SoundEngine } from '../services/audio.ts';
import {
  Layers,
  ChevronUp,
  ChevronDown,
  Shield,
  Briefcase,
  Play,
  Coins,
  Trash2,
  X
} from 'lucide-react';

interface HandCardsFanProps {
  player: Player;
  isMyTurn: boolean;
  phase?: string;
  onEquipCard: (cardId: string) => void;
  onCarryCard: (cardId: string) => void;
  onPlayCard: (cardId: string) => void;
  onSellCard: (cardId: string) => void;
  onDiscardCard: (cardId: string) => void;
}

export const HandCardsFan: React.FC<HandCardsFanProps> = ({
  player,
  isMyTurn,
  phase,
  onEquipCard,
  onCarryCard,
  onPlayCard,
  onSellCard,
  onDiscardCard
}) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const maxHandSize = player.race === 'dwarf' ? 6 : 5;
  const isHandOverfilled = player.hand.length > maxHandSize;
  const showOverfillWarning = isHandOverfilled && phase === 'charity';

  const totalCards = player.hand.length;
  const midIndex = (totalCards - 1) / 2;

  return (
    <div className="group relative w-full flex flex-col items-center select-none z-30 transition-all">
      {/* Hand status header pill */}
      <div className="flex items-center gap-3 bg-[#3a2012]/95 border-t-2 border-x-2 border-amber-600 rounded-t-xl px-4 py-1 text-xs shadow-2xl backdrop-blur-sm -mb-1 z-10 cursor-pointer">
        <div className="flex items-center gap-1.5 font-serif font-black text-amber-200">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>РУКА КАРТ:</span>
          <span
            className={`font-mono font-bold px-1.5 py-0.2 rounded ${
              isHandOverfilled && phase === 'charity'
                ? 'bg-red-700 text-white animate-bounce'
                : 'bg-stone-900 text-amber-300'
            }`}
          >
            {player.hand.length}/{maxHandSize}
          </span>
        </div>

        {/* Carried items count in backpack */}
        {player.carried.length > 0 && (
          <div className="flex items-center gap-1 text-[11px] text-amber-300/80 font-mono">
            <Briefcase className="w-3.5 h-3.5" />
            <span>В рюкзаке: {player.carried.length}</span>
          </div>
        )}

        {showOverfillWarning && (
          <span className="text-[10px] text-rose-400 font-bold animate-pulse">
            ⚠️ От щедрот: раздай излишки!
          </span>
        )}

        <button
          onClick={() => {
            SoundEngine.playButtonClick();
            setIsCollapsed(!isCollapsed);
          }}
          className="text-stone-400 hover:text-white p-0.5 cursor-pointer"
          title={isCollapsed ? 'Развернуть руку' : 'Свернуть руку'}
        >
          {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Fanned Out Hand Cards Display (Matching Image 1, 2, 3!) */}
      {!isCollapsed && (
        <div className="relative w-full max-w-4xl h-20 sm:h-24 group-hover:h-42 transition-all duration-300 ease-out flex items-end justify-center pb-1 px-2 overflow-visible">
          {player.hand.length === 0 ? (
            <div className="py-6 text-xs font-serif italic text-amber-200/60">
              Рука пуста. Выбивай двери и хапай сокровища!
            </div>
          ) : (
            <div className="relative flex items-end justify-center w-full h-full">
              {player.hand.map((card, idx) => {
                // Calculate fan angle and horizontal overlap
                const offsetFromCenter = idx - midIndex;
                const spreadSpacing = Math.max(22, Math.min(32, 260 / Math.max(1, totalCards)));
                const angleDeg = offsetFromCenter * 4.5; // Fan rotation angle
                const yOffsetPx = Math.abs(offsetFromCenter) * 3; // Parabolic curve
                const xOffsetPx = offsetFromCenter * spreadSpacing; // Overlapping spread

                const equipCheck =
                  card.category === 'equipment' ? canEquipItem(player, card) : undefined;
                const canEquip = equipCheck?.canEquip;

                return (
                  <div
                    key={card.id}
                    draggable={isMyTurn}
                    onDragStart={(e) => {
                      try {
                        e.dataTransfer.setData('text/plain', card.id);
                        e.dataTransfer.setData(
                          'application/json',
                          JSON.stringify({ cardId: card.id, category: card.category })
                        );
                        e.dataTransfer.effectAllowed = 'copyMove';
                      } catch {
                        // ignore
                      }
                      SoundEngine.playCardDrag();
                    }}
                    onDragEnd={() => {
                      SoundEngine.playCardDrop();
                    }}
                    onClick={() => {
                      SoundEngine.playCardDrag();
                      setSelectedCard(card);
                    }}
                    style={{
                      transform: `translateX(${xOffsetPx}px) translateY(${yOffsetPx}px) rotate(${angleDeg}deg)`,
                      zIndex: idx + 1
                    }}
                    className="absolute bottom-0 cursor-grab active:cursor-grabbing origin-bottom transition-all duration-200 hover:-translate-y-8 hover:rotate-0 hover:scale-115 hover:z-50 active:scale-105"
                  >
                    {/* Munchkin Card with authentic border and shadow */}
                    <div className="w-24 h-36 sm:w-28 sm:h-40 rounded-xl shadow-[0_12px_24px_rgba(0,0,0,0.85)] border-2 border-[#2b170c] overflow-hidden bg-[#f4e5c8]">
                      <CardView card={card} size="sm" className="w-full h-full" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Selected Card Action Popover / Inspection Modal */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#241a15] border-3 border-amber-600 rounded-3xl max-w-sm w-full p-5 text-center text-[#f4ecd8] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                SoundEngine.playButtonClick();
                setSelectedCard(null);
              }}
              className="absolute top-3 right-3 p-1 text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* High-res card preview */}
            <div className="flex justify-center mb-4">
              <CardView card={selectedCard} size="lg" />
            </div>

            {/* Action buttons with responsive sound triggers */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {selectedCard.category === 'equipment' && (
                <>
                  <button
                    onClick={() => {
                      SoundEngine.playEquip();
                      onEquipCard(selectedCard.id);
                      setSelectedCard(null);
                    }}
                    disabled={!canEquipItem(player, selectedCard).canEquip}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-800 disabled:text-stone-500 font-serif font-black text-xs text-white flex items-center gap-1 shadow-lg transition-transform hover:scale-102 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Shield className="w-4 h-4" />
                    НАДЕТЬ ШМОТКУ
                  </button>

                  <button
                    onClick={() => {
                      SoundEngine.playEquip();
                      onCarryCard(selectedCard.id);
                      setSelectedCard(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#5d4037] hover:bg-[#6d4c41] font-serif font-black text-xs text-amber-200 flex items-center gap-1 border border-amber-600/60 shadow cursor-pointer transition-transform hover:scale-102"
                    title="Положить шмотку на стол боком (в рюкзак)"
                  >
                    <Briefcase className="w-4 h-4" />
                    В РЮКЗАК
                  </button>
                </>
              )}

              {selectedCard.category !== 'equipment' && (
                <button
                  onClick={() => {
                    if (selectedCard.category === 'potion') {
                      SoundEngine.playPotion();
                    } else if (selectedCard.category === 'go_up_level') {
                      SoundEngine.playLevelUp();
                    } else {
                      SoundEngine.playCardFlip();
                    }
                    onPlayCard(selectedCard.id);
                    setSelectedCard(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 font-serif font-black text-xs text-stone-950 flex items-center gap-1 shadow-lg transition-transform hover:scale-102 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-stone-950" />
                  СЫГРАТЬ КАРТУ
                </button>
              )}

              {selectedCard.gold && selectedCard.gold > 0 && (
                <button
                  onClick={() => {
                    SoundEngine.playCoins();
                    onSellCard(selectedCard.id);
                    setSelectedCard(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-yellow-600 hover:bg-yellow-500 font-serif font-black text-xs text-stone-950 flex items-center gap-1 shadow cursor-pointer transition-transform hover:scale-102"
                >
                  <Coins className="w-4 h-4" />
                  ПРОДАТЬ (+{selectedCard.gold} Г)
                </button>
              )}

              <button
                onClick={() => {
                  SoundEngine.playCardDrop();
                  onDiscardCard(selectedCard.id);
                  setSelectedCard(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-800 hover:bg-rose-700 font-serif font-bold text-xs text-white flex items-center gap-1 shadow cursor-pointer transition-transform hover:scale-102"
              >
                <Trash2 className="w-3.5 h-3.5" />
                СБРОС
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
