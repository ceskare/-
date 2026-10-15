import React, { useState } from 'react';
import { Card, Player } from '../types/game.ts';
import { CardView } from './CardView.tsx';
import { canEquipItem } from '../game/rules.ts';
import { ChevronDown, ChevronUp, Layers, Filter } from 'lucide-react';

interface HandCardsProps {
  player: Player;
  isMyTurn: boolean;
  phase?: string;
  onEquipCard: (cardId: string) => void;
  onPlayCard: (cardId: string) => void;
  onSellCard: (cardId: string) => void;
  onDiscardCard: (cardId: string) => void;
}

type TabCategory = 'all' | 'equipment' | 'potion' | 'monster' | 'class_race';

export const HandCards: React.FC<HandCardsProps> = ({
  player,
  isMyTurn,
  phase,
  onEquipCard,
  onPlayCard,
  onSellCard,
  onDiscardCard
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedTab, setSelectedTab] = useState<TabCategory>('all');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const maxHandSize = player.race === 'dwarf' ? 6 : 5;
  const isHandOverfilled = player.hand.length > maxHandSize;
  const showOverfillWarning = isHandOverfilled && phase === 'charity';

  const filteredCards = player.hand.filter((card) => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'equipment') return card.category === 'equipment';
    if (selectedTab === 'potion') return card.category === 'potion';
    if (selectedTab === 'monster') return card.category === 'monster';
    if (selectedTab === 'class_race') return card.category === 'class' || card.category === 'race';
    return true;
  });

  return (
    <div className="w-full bg-[#160f0b] border-t border-amber-950 px-3 py-2 text-[#f4ecd8] select-none">
      {/* Header Bar with Tabs and Expand Toggle */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-1.5 text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 font-bold text-amber-300 hover:text-amber-200"
          >
            <Layers className="w-4 h-4 text-amber-500" />
            <span>Карты на руке</span>
            <span
              className={`px-1.5 py-0.2 rounded font-mono font-bold ${
                isHandOverfilled ? 'bg-red-800 text-white animate-bounce' : 'bg-stone-800 text-stone-300'
              }`}
            >
              {player.hand.length}/{maxHandSize}
            </span>
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>

          {/* Quick filter tabs */}
          {isExpanded && (
            <div className="hidden sm:flex items-center gap-1 text-[11px]">
              {(
                [
                  { id: 'all', label: 'Все' },
                  { id: 'equipment', label: 'Шмотки' },
                  { id: 'potion', label: 'Зелья' },
                  { id: 'monster', label: 'Монстры' },
                  { id: 'class_race', label: 'Класс/Раса' }
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    selectedTab === tab.id
                      ? 'bg-amber-600 text-stone-950 font-bold'
                      : 'bg-stone-900/80 hover:bg-stone-800 text-stone-400'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {showOverfillWarning && (
          <span className="text-[10px] text-rose-400 font-bold animate-pulse">
            ⚠️ Перебор карт! Сбрось или раздай в фазе «От щедрот»
          </span>
        )}
      </div>

      {/* Cards Drawer / Row */}
      {isExpanded && (
        <div className="max-w-6xl mx-auto overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-amber-800">
          {player.hand.length === 0 ? (
            <div className="py-6 text-center text-xs text-stone-500 italic">
              Рука пуста. Выбивай двери и хапай сокровища!
            </div>
          ) : (
            <div className="flex items-center gap-2.5 min-w-max px-1 py-1">
              {filteredCards.map((card) => {
                const equipCheck = card.category === 'equipment' ? canEquipItem(player, card) : undefined;
                const canEquip = equipCheck?.canEquip;

                return (
                  <div key={card.id} className="relative group">
                    <CardView
                      card={card}
                      size="sm"
                      canEquip={canEquip}
                      canPlay={true}
                      onClick={() => setSelectedCard(card)}
                      onEquip={card.category === 'equipment' ? () => onEquipCard(card.id) : undefined}
                      onPlay={
                        card.category !== 'equipment'
                          ? () => onPlayCard(card.id)
                          : undefined
                      }
                      onSell={card.gold ? () => onSellCard(card.id) : undefined}
                      onDiscard={() => onDiscardCard(card.id)}
                    />

                    {/* Tooltip hint if cannot equip */}
                    {equipCheck && !equipCheck.canEquip && (
                      <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-950 text-red-300 text-[9px] px-2 py-0.5 rounded border border-red-800 whitespace-nowrap z-30 shadow-lg">
                        {equipCheck.reason}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Card detail popup when clicking */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#241a15] border-2 border-amber-600 rounded-2xl max-w-sm w-full p-4 text-center text-[#f4ecd8] relative">
            <div className="flex justify-center mb-3">
              <CardView card={selectedCard} size="md" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {selectedCard.category === 'equipment' && (
                <button
                  onClick={() => {
                    onEquipCard(selectedCard.id);
                    setSelectedCard(null);
                  }}
                  disabled={!canEquipItem(player, selectedCard).canEquip}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-700 text-xs font-bold text-white transition-colors"
                >
                  Надеть шмотку
                </button>
              )}

              {selectedCard.category !== 'equipment' && (
                <button
                  onClick={() => {
                    onPlayCard(selectedCard.id);
                    setSelectedCard(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-xs font-bold text-stone-950 transition-colors"
                >
                  Сыграть карту
                </button>
              )}

              {selectedCard.gold && selectedCard.gold > 0 && (
                <button
                  onClick={() => {
                    onSellCard(selectedCard.id);
                    setSelectedCard(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-xs font-bold text-stone-950 transition-colors"
                >
                  Продать (+{selectedCard.gold} Г)
                </button>
              )}

              <button
                onClick={() => {
                  onDiscardCard(selectedCard.id);
                  setSelectedCard(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-600 text-xs font-bold text-white transition-colors"
              >
                Сбросить
              </button>

              <button
                onClick={() => setSelectedCard(null)}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-bold text-stone-300 transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
