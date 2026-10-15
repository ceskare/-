import React from 'react';
import { Card } from '../types/game.ts';
import {
  MunchkinCardBackSvg,
  PlutoniumDragonSvg,
  HarpySvg,
  SquidzillaSvg
} from '../game/illustrations.tsx';
import {
  Shield,
  Coins,
  Skull,
  Flame,
  Swords,
  Crown,
  Sparkles
} from 'lucide-react';

interface CardViewProps {
  card: Card;
  isBack?: boolean;
  deckType?: 'doors' | 'treasures';
  size?: 'sm' | 'md' | 'lg';
  isEquipped?: boolean;
  onClick?: () => void;
  onEquip?: () => void;
  onPlay?: () => void;
  onSell?: () => void;
  onDiscard?: () => void;
  canEquip?: boolean;
  canPlay?: boolean;
  className?: string;
}

export const CardView: React.FC<CardViewProps> = ({
  card,
  isBack = false,
  deckType = card.deck,
  size = 'md',
  isEquipped = false,
  onClick,
  onEquip,
  onPlay,
  onSell,
  onDiscard,
  canEquip,
  canPlay,
  className = ''
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'w-24 h-36 text-[10px]',
    md: 'w-40 h-60 text-xs',
    lg: 'w-56 h-84 text-sm'
  }[size];

  // If card back is displayed
  if (isBack) {
    return (
      <div
        onClick={onClick}
        className={`${sizeClasses} relative rounded-xl shadow-2xl cursor-pointer transition-transform hover:scale-105 select-none overflow-hidden border-2 border-[#3b1d0c] ${className}`}
      >
        <MunchkinCardBackSvg type={deckType || 'doors'} />
      </div>
    );
  }

  // Front card rendering
  const isMonster = card.category === 'monster';
  const isCurse = card.category === 'curse';
  const isEquipment = card.category === 'equipment';
  const isPotion = card.category === 'potion';
  const isClassOrRace = card.category === 'class' || card.category === 'race';
  const isLevelUp = card.category === 'go_up_level';

  // Category badge colors
  let headerBg = 'bg-[#3b2012] text-[#f4ecd8] border-[#5a361e]';
  if (isMonster) headerBg = 'bg-[#7f1d1d] text-white border-[#991b1b]';
  else if (isCurse) headerBg = 'bg-[#4a154b] text-white border-[#6b21a8]';
  else if (isEquipment) headerBg = 'bg-[#451a03] text-amber-100 border-[#78350f]';
  else if (isPotion) headerBg = 'bg-[#164e63] text-white border-[#0e7490]';
  else if (isClassOrRace) headerBg = 'bg-[#14532d] text-white border-[#15803d]';
  else if (isLevelUp) headerBg = 'bg-[#713f12] text-amber-100 border-[#854d0e]';

  return (
    <div
      onClick={onClick}
      className={`${sizeClasses} relative rounded-xl shadow-xl flex flex-col justify-between overflow-hidden cursor-pointer select-none transition-all duration-200 hover:-translate-y-2 hover:shadow-[0_16px_32px_rgba(0,0,0,0.85)] border-2 ${
        isMonster
          ? 'border-[#7f1d1d] ring-1 ring-red-900/40'
          : isCurse
          ? 'border-[#6b21a8] ring-1 ring-purple-900/40'
          : 'border-[#4a2e18] ring-1 ring-amber-900/30'
      } ${className}`}
      data-testid={`card-${card.id}`}
    >
      {/* Hand-drawn Parchment Base with authentic parchment texture */}
      <div className="absolute inset-0 parchment-card text-stone-900 flex flex-col p-1.5 shadow-inner overflow-hidden border border-[#d2b588]/60">
        {/* Top Header Banner with fantasy font */}
        <div
          className={`rounded-md px-1.5 py-0.5 border text-center font-fantasy font-bold tracking-normal text-[11px] leading-tight truncate shadow-sm ${headerBg}`}
        >
          {card.name}
        </div>

        {/* Subheader info: Monster level, Equipment Slot & Bonus */}
        <div className="flex items-center justify-between text-[9px] font-bold text-stone-800 border-b-2 border-[#bfa275] pb-0.5 mt-0.5">
          {isMonster && (
            <span className="text-[#b71c1c] flex items-center gap-0.5 font-black">
              <Flame className="w-3 h-3 text-red-600 fill-red-600" /> Ур. {card.monsterLevel}
            </span>
          )}

          {isEquipment && (
            <span className="text-[#5d4037] flex items-center gap-0.5">
              {card.slot === 'head' && '🪖 Головняк'}
              {card.slot === 'armor' && '🛡️ Броня'}
              {card.slot === 'footwear' && '👢 Обувка'}
              {card.slot === 'one_hand' && '🗡️ 1 рука'}
              {card.slot === 'two_hands' && '⚔️ 2 руки'}
              {card.slot === 'item' && '💍 Шмотка'}
            </span>
          )}

          {card.bonus !== undefined && card.bonus !== 0 && (
            <span
              className={`px-1 rounded font-black ${
                card.bonus > 0 ? 'bg-amber-700 text-white' : 'bg-red-800 text-white'
              }`}
            >
              {card.bonus > 0 ? `+${card.bonus}` : card.bonus} Бонус
            </span>
          )}

          {isCurse && (
            <span className="text-purple-900 font-black uppercase tracking-wider">
              Проклятие
            </span>
          )}
          {isClassOrRace && (
            <span className="text-emerald-900 font-black capitalize">
              {card.category === 'class' ? 'Класс' : 'Раса'}
            </span>
          )}
          {isLevelUp && <span className="text-amber-800 font-black">+1 УРОВЕНЬ</span>}
        </div>

        {/* Center Card Illustration (John Kovalic comic art if available!) */}
        <div className="flex-1 my-1 flex flex-col items-center justify-center bg-[#ebd8b3]/60 rounded-lg border border-[#c9b48c] p-1 relative overflow-hidden">
          {card.artType === 'dragon' ? (
            <div className="w-full h-full flex items-center justify-center scale-90">
              <PlutoniumDragonSvg className="w-full h-full" />
            </div>
          ) : card.artType === 'harpies' ? (
            <div className="w-full h-full flex items-center justify-center scale-90">
              <HarpySvg className="w-full h-full" />
            </div>
          ) : card.artType === 'squidzilla' ? (
            <div className="w-full h-full flex items-center justify-center scale-90">
              <SquidzillaSvg className="w-full h-full" />
            </div>
          ) : isMonster ? (
            <div className="text-center">
              <span className="text-3xl filter drop-shadow">👹</span>
              <div className="text-[10px] font-black text-red-900 mt-0.5 leading-none">
                Сила: {card.monsterLevel}
              </div>
            </div>
          ) : isCurse ? (
            <div className="text-center text-purple-900">
              <span className="text-3xl filter drop-shadow">⚡</span>
              <div className="text-[10px] font-black mt-0.5">Сглаз</div>
            </div>
          ) : isEquipment ? (
            <div className="text-center text-stone-800">
              <span className="text-3xl filter drop-shadow">
                {card.artType === 'horned' ? '🪖' : card.artType === 'slimy' ? '🛡️' : card.slot === 'footwear' ? '👢' : '🗡️'}
              </span>
              {card.isBigItem && (
                <div className="text-[8.5px] font-black text-amber-900 bg-amber-300/90 px-1 rounded mt-0.5">
                  Большая шмотка
                </div>
              )}
            </div>
          ) : isPotion ? (
            <div className="text-center text-cyan-900">
              <span className="text-3xl filter drop-shadow">🧪</span>
              <div className="text-[9px] font-black mt-0.5">+{card.bonus || 2} в бою</div>
            </div>
          ) : isClassOrRace ? (
            <div className="text-center text-emerald-900">
              <span className="text-3xl filter drop-shadow">📜</span>
            </div>
          ) : (
            <div className="text-center text-amber-900">
              <span className="text-3xl filter drop-shadow">⭐</span>
            </div>
          )}
        </div>

        {/* Card Description */}
        <div className="text-[9px] font-serif font-medium text-stone-900 leading-snug line-clamp-3 my-0.5">
          {card.description}
        </div>

        {/* Bad Stuff (for monsters) */}
        {card.badStuff && (
          <div className="mt-auto border-t-2 border-red-300 pt-0.5 text-[8.5px] text-red-950 leading-tight bg-red-100/70 rounded px-1 font-sans">
            <span className="font-bold text-red-900 font-fantasy">Непотребство:</span> {card.badStuff}
          </div>
        )}

        {/* Footer: Gold value and treasures */}
        <div className="mt-auto flex items-center justify-between text-[8.5px] font-sans font-bold text-stone-700 border-t border-[#bfa275] pt-0.5">
          {card.gold !== undefined ? (
            <span className="text-amber-900 font-mono font-black flex items-center gap-0.5">
              <Coins className="w-2.5 h-2.5 text-amber-700" /> {card.gold} Голд
            </span>
          ) : card.monsterTreasures ? (
            <span className="text-stone-900 font-bold">
              💎 {card.monsterTreasures} сокр.{' '}
              {card.monsterLevelsReward && card.monsterLevelsReward > 1
                ? `(+${card.monsterLevelsReward} ур.)`
                : ''}
            </span>
          ) : (
            <span className="text-stone-500 italic">Без цены</span>
          )}

          {card.usableByClass && (
            <span className="text-indigo-900 font-black text-[7.5px] bg-indigo-100 px-1 rounded">
              {card.usableByClass.join(', ')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
