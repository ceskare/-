import React, { useState } from 'react';
import { Player, Card } from '../types/game.ts';
import { calculateGoldForLevels } from '../game/rules.ts';
import { Coins, Check, AlertCircle, X } from 'lucide-react';
import { SoundEngine } from '../services/audio.ts';

interface SellGoldModalProps {
  isOpen: boolean;
  player: Player;
  onSellItems: (selectedCardIds: string[], levelsGained: number) => void;
  onClose: () => void;
}

export const SellGoldModal: React.FC<SellGoldModalProps> = ({
  isOpen,
  player,
  onSellItems,
  onClose
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  if (!isOpen) return null;

  // Collect all sellable items from hand and equipped
  const sellableCards = [...player.hand, ...player.equipped].filter(
    (c) => c.gold && c.gold > 0
  );

  const toggleSelect = (id: string) => {
    SoundEngine.playCoins();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Calculate total value
  let totalGold = 0;
  for (const card of sellableCards) {
    if (selectedIds.includes(card.id)) {
      let val = card.gold || 0;
      // Halfling perk: one item sells for double
      if (player.race === 'halfling' && selectedIds[0] === card.id) {
        val *= 2;
      }
      totalGold += val;
    }
  }

  const { levels, spentGold } = calculateGoldForLevels(totalGold);
  const canGainLevel = levels > 0 && player.level + levels < 10;
  const isCappedAtNine = player.level + levels >= 10;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#241a15] border-2 border-amber-600 rounded-2xl max-w-lg w-full p-5 text-[#f4ecd8] shadow-2xl relative">
        <button
          onClick={() => {
            SoundEngine.playButtonClick();
            onClose();
          }}
          className="absolute top-3 right-3 text-stone-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2 mb-1">
          <Coins className="w-5 h-5 text-amber-400" />
          Сброс шмоток за Золото и Уровни
        </h3>
        <p className="text-xs text-stone-300 mb-4">
          Каждые 1000 голдов дают +1 Уровень (максимум до 9 уровня, 10-й берется только в бою).
        </p>

        {/* Items List */}
        <div className="max-h-60 overflow-y-auto space-y-2 mb-4 pr-1">
          {sellableCards.length === 0 ? (
            <div className="py-8 text-center text-xs text-stone-500 italic">
              У тебя нет шмоток с ценой в золоте.
            </div>
          ) : (
            sellableCards.map((card) => {
              const isSelected = selectedIds.includes(card.id);
              const isEquipped = player.equipped.some((i) => i.id === card.id);

              return (
                <div
                  key={card.id}
                  onClick={() => toggleSelect(card.id)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-950/80 border-amber-500 shadow-md ring-1 ring-amber-400'
                      : 'bg-stone-900/80 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center border ${
                        isSelected
                          ? 'bg-amber-500 border-amber-300 text-stone-950'
                          : 'border-stone-600 bg-stone-950'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-amber-200">{card.name}</div>
                      <div className="text-[10px] text-stone-400">
                        {isEquipped ? 'Надето на герое' : 'В руке'} • {card.bonus ? `+${card.bonus} силы` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs font-mono font-bold text-amber-400">
                    +{card.gold} Голд
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Calculation summary banner */}
        <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 mb-4 text-xs">
          <div className="flex justify-between items-center mb-1">
            <span className="text-stone-400">Сумма выбранного:</span>
            <span className="font-mono font-bold text-amber-300 text-sm">{totalGold} Голд</span>
          </div>
          <div className="flex justify-between items-center text-emerald-400 font-bold">
            <span>Получаешь уровней:</span>
            <span className="text-base font-mono">+{levels}</span>
          </div>

          {isCappedAtNine && (
            <div className="mt-2 text-[10px] text-yellow-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Победный 10-й уровень можно получить ТОЛЬКО победив монстра в бою!
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => {
              SoundEngine.playButtonClick();
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-bold text-stone-300 transition-colors cursor-pointer"
          >
            Отмена
          </button>
          <button
            onClick={() => {
              if (levels > 0) {
                SoundEngine.playCoins();
                onSellItems(selectedIds, levels);
                onClose();
              }
            }}
            disabled={levels === 0 || isCappedAtNine}
            className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:bg-stone-800 disabled:text-stone-600 text-xs font-bold text-stone-950 transition-colors shadow-lg cursor-pointer disabled:cursor-not-allowed"
          >
            Продать и повысить уровень!
          </button>
        </div>
      </div>
    </div>
  );
};
