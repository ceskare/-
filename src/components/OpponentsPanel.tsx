import React from 'react';
import { Player } from '../types/game.ts';
import { calculateCombatPower } from '../game/rules.ts';
import { Zap, Crown, Swords, Shield } from 'lucide-react';

interface OpponentsPanelProps {
  opponents: Player[];
  activePlayerId: string;
  onSelectOpponent?: (opponent: Player) => void;
}

export const OpponentsPanel: React.FC<OpponentsPanelProps> = ({
  opponents,
  activePlayerId,
  onSelectOpponent
}) => {
  return (
    <div className="w-full flex items-center justify-center gap-2 p-2 overflow-x-auto select-none">
      {opponents.map((opp) => {
        const power = calculateCombatPower(opp);
        const isActive = opp.id === activePlayerId;

        const classLabels: Record<string, string> = {
          none: '',
          warrior: 'Воин',
          wizard: 'Маг',
          thief: 'Вор',
          cleric: 'Клирик'
        };

        const raceLabels: Record<string, string> = {
          human: '',
          elf: 'Эльф',
          dwarf: 'Дварф',
          halfling: 'Хафлинг'
        };

        return (
          <div
            key={opp.id}
            onClick={() => onSelectOpponent?.(opp)}
            className={`min-w-44 p-2 rounded-xl border flex flex-col justify-between transition-all ${
              isActive
                ? 'bg-amber-950/70 border-amber-500 shadow-lg ring-2 ring-amber-500/50 scale-102'
                : 'bg-stone-900/80 border-stone-800 hover:border-stone-700'
            }`}
          >
            {/* Top row: Avatar, Name, Level */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-xl">{opp.avatar}</span>
                <div className="truncate">
                  <div className="text-xs font-bold text-amber-200 truncate flex items-center gap-1">
                    <span>{opp.name}</span>
                    {opp.isBot && (
                      <span className="text-[9px] px-1 rounded bg-stone-800 text-stone-400 font-normal">
                        БОТ
                      </span>
                    )}
                  </div>
                  <div className="text-[9px] text-stone-400 truncate">
                    {classLabels[opp.class] || ''}{' '}
                    {raceLabels[opp.race] ? `(${raceLabels[opp.race]})` : ''}
                  </div>
                </div>
              </div>

              {/* Level Badge */}
              <div className="flex flex-col items-center ml-2">
                <div className="bg-amber-600 text-stone-950 font-black text-xs px-1.5 py-0.5 rounded-full border border-amber-300">
                  {opp.level} ур.
                </div>
              </div>
            </div>

            {/* Middle row: Combat power and hand cards */}
            <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-800 text-[10px]">
              <div className="flex items-center gap-1 font-mono font-bold text-emerald-400">
                <Zap className="w-3 h-3 text-emerald-400" />
                <span>Сила: {power}</span>
              </div>

              <div className="text-stone-400 font-mono">
                🎴 {opp.hand.length} карт
              </div>
            </div>

            {/* Equipped gear icons row */}
            <div className="flex items-center gap-1 mt-1 pt-0.5 text-xs text-stone-400 min-h-4">
              {opp.equipped.map((item) => (
                <span
                  key={item.id}
                  title={`${item.name} (+${item.bonus || 0})`}
                  className="p-0.5 rounded bg-stone-950/80 text-[11px] border border-stone-800 hover:border-amber-500 cursor-pointer"
                >
                  {item.slot === 'head' && '🪖'}
                  {item.slot === 'armor' && '🛡️'}
                  {item.slot === 'footwear' && '👢'}
                  {item.slot === 'one_hand' && '🗡️'}
                  {item.slot === 'two_hands' && '⚔️'}
                  {item.slot === 'item' && '💍'}
                </span>
              ))}
              {opp.equipped.length === 0 && (
                <span className="text-[9px] text-stone-600 italic">Шмота нет</span>
              )}
            </div>

            {/* Turn status indicator */}
            {isActive && (
              <div className="mt-1 text-center bg-amber-500/20 text-amber-300 text-[9px] font-bold py-0.5 rounded border border-amber-500/40 animate-pulse">
                ХОДИТ СЕЙЧАС
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
