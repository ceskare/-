import React, { useState } from 'react';
import { Player, Card, ItemSlot } from '../types/game.ts';
import { calculateCombatPower } from '../game/rules.ts';
import { CardView } from './CardView.tsx';
import { SoundEngine } from '../services/audio.ts';
import {
  Shield,
  Coins,
  Crown,
  Zap,
  Footprints,
  Sparkles,
  Briefcase,
  X
} from 'lucide-react';

interface PlayerInventoryProps {
  player: Player;
  isMyTurn: boolean;
  onUnequipItem: (itemId: string) => void;
  onEquipCarriedItem?: (itemId: string) => void;
  onOpenSellModal: () => void;
  onOpenRatingModal?: () => void;
}

export const PlayerInventory: React.FC<PlayerInventoryProps> = ({
  player,
  isMyTurn,
  onUnequipItem,
  onEquipCarriedItem,
  onOpenSellModal,
  onOpenRatingModal
}) => {
  const [inspectedCard, setInspectedCard] = useState<Card | null>(null);

  const combatPower = calculateCombatPower(player);

  // Find equipped items by slot
  const headItem = player.equipped.find((i) => i.slot === 'head');
  const armorItem = player.equipped.find((i) => i.slot === 'armor');
  const footwearItem = player.equipped.find((i) => i.slot === 'footwear');
  const twoHandItem = player.equipped.find((i) => i.slot === 'two_hands');
  const oneHandItems = player.equipped.filter((i) => i.slot === 'one_hand');
  const otherItems = player.equipped.filter((i) => i.slot === 'item');

  const classLabels: Record<string, string> = {
    none: 'Без класса',
    warrior: 'Воин ⚔️',
    wizard: 'Волшебник 🧙',
    thief: 'Вор 🗡️',
    cleric: 'Клирик ✝️'
  };

  const raceLabels: Record<string, string> = {
    human: 'Человек 👤',
    elf: 'Эльф 🧝',
    dwarf: 'Дварф 🧔',
    halfling: 'Хафлинг 🍺'
  };

  return (
    <div className="w-full bg-gradient-to-r from-[#221309] via-[#160c06] to-[#221309] border-t-2 border-amber-900/80 p-2 text-[#f4ecd8] select-none shadow-[0_-8px_30px_rgba(0,0,0,0.8)] font-fantasy">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Authentic Arched Stone Portrait */}
        <div className="flex items-center gap-3 parchment-card border-2 border-[#5c3719] rounded-2xl p-2 shadow-xl text-stone-950">
          {/* Arched Character Frame */}
          <div className="relative w-16 h-18 bg-gradient-to-b from-[#2d4052] to-[#1a252f] rounded-t-xl rounded-b-md border-2 border-stone-800 flex items-center justify-center overflow-hidden shadow-inner">
            <span className="text-3xl filter drop-shadow">{player.avatar}</span>

            {/* Red Level Heraldic Shield Badge */}
            <div className="absolute -top-1 -left-1 w-6 h-7 bg-red-700 border-2 border-amber-300 rounded-b-md flex items-center justify-center text-white font-sans font-black text-xs shadow">
              {player.level}
            </div>

            {/* Combat Power Gold Badge */}
            <div className="absolute -top-1 -right-1 w-6 h-7 bg-amber-600 border-2 border-yellow-200 rounded-b-md flex items-center justify-center text-stone-950 font-sans font-black text-xs shadow">
              ⚡{combatPower}
            </div>
          </div>

          {/* Wooden Parchment Name Banner */}
          <div className="flex flex-col pr-2">
            <div className="font-fantasy font-bold text-sm text-[#3b1d0c] flex items-center gap-1">
              <span>{player.name}</span>
              <span className="text-xs">{player.gender === 'male' ? '♂️' : '♀️'}</span>
            </div>

            <div className="flex items-center gap-1.5 mt-0.5 text-[10px] font-sans font-bold">
              <span className="px-1.5 py-0.5 rounded bg-[#3b1d0c] text-amber-200 border border-[#5d3016]">
                {classLabels[player.class]}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#1e3a1f] text-emerald-200 border border-[#2d5830]">
                {raceLabels[player.race]}
              </span>
            </div>

            {/* Gold and Rating quick status */}
            <div className="flex items-center gap-3 mt-1 text-[11px] font-sans font-bold">
              <span className="text-amber-900 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-700" /> {player.gold} Г
              </span>
              <button
                onClick={() => {
                  SoundEngine.playButtonClick();
                  onOpenSellModal();
                }}
                className="px-2 py-0.5 rounded bg-yellow-600 hover:bg-yellow-500 text-stone-950 text-[10px] font-fantasy font-bold shadow cursor-pointer transition-transform hover:scale-105"
              >
                Продать (+1 ур)
              </button>
            </div>
          </div>
        </div>

        {/* Right: Equipped Gear Slots Grid with authentic wooden frames */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#140b06]/90 p-2 rounded-2xl border-2 border-amber-950/80 shadow-inner">
          {/* Headgear slot */}
          <EquippedSlot
            title="Головняк"
            icon="🪖"
            item={headItem}
            onClick={() => {
              if (headItem) {
                SoundEngine.playCardDrag();
                setInspectedCard(headItem);
              }
            }}
          />

          {/* Armor slot */}
          <EquippedSlot
            title="Броня"
            icon="🛡️"
            item={armorItem}
            onClick={() => {
              if (armorItem) {
                SoundEngine.playCardDrag();
                setInspectedCard(armorItem);
              }
            }}
          />

          {/* Footwear slot */}
          <EquippedSlot
            title="Обувка"
            icon="👢"
            item={footwearItem}
            onClick={() => {
              if (footwearItem) {
                SoundEngine.playCardDrag();
                setInspectedCard(footwearItem);
              }
            }}
          />

          {/* Weapon Hand 1 */}
          <EquippedSlot
            title={twoHandItem ? '2 Руки' : 'Оружие 1'}
            icon="🗡️"
            item={twoHandItem || oneHandItems[0]}
            onClick={() => {
              const item = twoHandItem || oneHandItems[0];
              if (item) {
                SoundEngine.playCardDrag();
                setInspectedCard(item);
              }
            }}
          />

          {/* Weapon Hand 2 */}
          <EquippedSlot
            title={twoHandItem ? 'Занято' : 'Оружие 2'}
            icon="⚔️"
            item={twoHandItem ? undefined : oneHandItems[1]}
            isOccupiedByTwoHand={!!twoHandItem}
            onClick={() => {
              if (oneHandItems[1]) {
                SoundEngine.playCardDrag();
                setInspectedCard(oneHandItems[1]);
              }
            }}
          />

          {/* Extra Item slot */}
          <EquippedSlot
            title="Мелочь"
            icon="💍"
            item={otherItems[0]}
            onClick={() => {
              if (otherItems[0]) {
                SoundEngine.playCardDrag();
                setInspectedCard(otherItems[0]);
              }
            }}
          />

          {/* Carried items in backpack (sideways on table) */}
          {player.carried.length > 0 && (
            <div
              onClick={() => {
                SoundEngine.playCardDrag();
                setInspectedCard(player.carried[0]);
              }}
              className="w-14 h-18 rounded-xl border-2 border-dashed border-amber-600/80 bg-amber-950/40 p-1 flex flex-col items-center justify-between cursor-pointer hover:border-amber-400 hover:scale-105 shadow transition-transform"
              title="Шмотки в рюкзаке (на столе боком)"
            >
              <span className="text-[7.5px] font-serif font-black text-amber-300 uppercase truncate">
                Рюкзак ({player.carried.length})
              </span>
              <Briefcase className="w-5 h-5 text-amber-400 my-auto" />
              <span className="text-[7.5px] font-mono text-stone-300 truncate w-full text-center">
                {player.carried[0].name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Item inspection modal */}
      {inspectedCard && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#241a15] border-3 border-amber-600 rounded-3xl max-w-sm w-full p-4 text-center text-[#f4ecd8] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => {
                SoundEngine.playButtonClick();
                setInspectedCard(null);
              }}
              className="absolute top-3 right-3 p-1 text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex justify-center mb-3">
              <CardView card={inspectedCard} size="md" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {player.equipped.some((i) => i.id === inspectedCard.id) && (
                <button
                  onClick={() => {
                    SoundEngine.playCardDrop();
                    onUnequipItem(inspectedCard.id);
                    setInspectedCard(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-stone-700 hover:bg-stone-600 font-serif font-black text-xs text-stone-200 shadow cursor-pointer transition-transform hover:scale-102"
                >
                  Снять в руку
                </button>
              )}

              {player.carried.some((i) => i.id === inspectedCard.id) && onEquipCarriedItem && (
                <button
                  onClick={() => {
                    SoundEngine.playEquip();
                    onEquipCarriedItem(inspectedCard.id);
                    setInspectedCard(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-serif font-black text-xs text-white shadow cursor-pointer transition-transform hover:scale-102"
                >
                  Надеть из рюкзака
                </button>
              )}

              <button
                onClick={() => {
                  SoundEngine.playButtonClick();
                  setInspectedCard(null);
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 font-serif font-black text-xs text-stone-950 shadow cursor-pointer transition-transform hover:scale-102"
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

interface EquippedSlotProps {
  title: string;
  icon: string;
  item?: Card;
  isOccupiedByTwoHand?: boolean;
  onClick: () => void;
}

const EquippedSlot: React.FC<EquippedSlotProps> = ({
  title,
  icon,
  item,
  isOccupiedByTwoHand,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`w-14 h-18 rounded-xl border-2 flex flex-col items-center justify-between p-1 transition-all ${
        item
          ? 'bg-[#3b2012] border-amber-500/90 cursor-pointer hover:border-yellow-400 hover:scale-105 shadow-md'
          : isOccupiedByTwoHand
          ? 'bg-stone-950/40 border-dashed border-stone-800 opacity-50'
          : 'bg-stone-950/60 border-dashed border-amber-900/40 opacity-70'
      }`}
      title={item ? `${item.name} (+${item.bonus || 0} силы)` : title}
    >
      <span className="text-[7.5px] font-serif font-bold text-amber-200/80 uppercase tracking-tighter truncate w-full text-center">
        {title}
      </span>

      <div className="my-auto flex flex-col items-center">
        {item ? (
          <>
            <span className="text-xl">
              {item.slot === 'head' && '🪖'}
              {item.slot === 'armor' && '🛡️'}
              {item.slot === 'footwear' && '👢'}
              {item.slot === 'one_hand' && '🗡️'}
              {item.slot === 'two_hands' && '⚔️'}
              {item.slot === 'item' && '💍'}
            </span>
            {item.bonus && (
              <span className="text-[9px] font-black font-mono text-yellow-300 leading-none">
                +{item.bonus}
              </span>
            )}
          </>
        ) : (
          <span className="text-base opacity-35">{icon}</span>
        )}
      </div>

      <span className="text-[7px] font-serif font-semibold text-stone-400 truncate w-full text-center">
        {item ? item.name : 'Пусто'}
      </span>
    </div>
  );
};
