import React, { useState } from 'react';
import { GameState, Player, Card } from '../types/game.ts';
import { CardView } from './CardView.tsx';
import { calculateCombatPower } from '../game/rules.ts';
import { Swords, ShieldAlert, Sparkles, UserPlus, Dices, HelpCircle, Flame, ArrowRight } from 'lucide-react';

interface CombatArenaProps {
  gameState: GameState;
  activePlayer: Player;
  isMyTurn: boolean;
  onKickDoor: () => void;
  onFightMonster: () => void;
  onRunaway: () => void;
  onAskHelp: (helperId: string, treasuresOffered: number) => void;
  onPlayCombatCard: (cardId: string) => void;
  onLootRoom: () => void;
  onPlayMonsterFromHand: (cardId: string) => void;
  onDismissNonMonster: () => void;
}

export const CombatArena: React.FC<CombatArenaProps> = ({
  gameState,
  activePlayer,
  isMyTurn,
  onKickDoor,
  onFightMonster,
  onRunaway,
  onAskHelp,
  onPlayCombatCard,
  onLootRoom,
  onPlayMonsterFromHand,
  onDismissNonMonster
}) => {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showHandCombatCards, setShowHandCombatCards] = useState(false);
  const [showTroubleModal, setShowTroubleModal] = useState(false);

  const { phase, currentTurnCard, combatState } = gameState;

  // Monsters in hand for "Look for trouble"
  const monstersInHand = activePlayer.hand.filter((c) => c.category === 'monster');

  // Combat potions in hand
  const combatPotionsInHand = activePlayer.hand.filter(
    (c) => c.category === 'potion' || c.category === 'modifier'
  );

  // Calculate combat power
  let playerCombatPower = 0;
  let monsterCombatPower = 0;
  let isWarrior = activePlayer.class === 'warrior';
  let isWinning = false;

  if (phase === 'combat' && combatState && combatState.monsters.length > 0) {
    const mainMonster = combatState.monsters[0];
    monsterCombatPower = mainMonster.currentStrength;

    playerCombatPower = calculateCombatPower(
      activePlayer,
      combatState.munchkinBonus + (combatState.helperBonus || 0),
      mainMonster.card
    );

    isWinning = isWarrior
      ? playerCombatPower >= monsterCombatPower
      : playerCombatPower > monsterCombatPower;
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 select-none">
      {/* 1. KICK DOOR PHASE: Show 2 Decks on table */}
      {phase === 'kick_door' && (
        <div className="flex flex-col items-center justify-center text-center max-w-md w-full">
          <div className="text-sm font-serif font-bold text-amber-200/90 mb-4 bg-stone-900/80 px-4 py-1.5 rounded-full border border-amber-600/40">
            {isMyTurn ? 'Твой ход! Выбивай дверь подземелья!' : `Ходит: ${activePlayer.name}`}
          </div>

          <div className="flex items-center justify-center gap-8">
            {/* Door Deck */}
            <div className="flex flex-col items-center">
              <div
                onClick={() => {
                  if (isMyTurn) onKickDoor();
                }}
                className={`relative group ${
                  isMyTurn ? 'cursor-pointer hover:scale-105 transition-transform' : 'opacity-80'
                }`}
              >
                {/* Visual deck pile illusion */}
                <div className="absolute -top-1.5 -left-1.5 w-36 h-52 rounded-lg bg-emerald-950/70 border border-emerald-800 -z-10" />
                <div className="absolute -top-3 -left-3 w-36 h-52 rounded-lg bg-stone-900/80 border border-emerald-900 -z-20" />

                <CardView
                  card={{ id: 'door-back', name: 'Двери', deck: 'doors', category: 'special', description: '' }}
                  isBack
                  size="md"
                />

                {isMyTurn && (
                  <div className="absolute inset-0 bg-amber-500/20 rounded-lg animate-pulse flex items-center justify-center">
                    <span className="bg-emerald-900/90 text-amber-200 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500 shadow-lg">
                      Выбить дверь! 🚪
                    </span>
                  </div>
                )}
              </div>
              <span className="mt-2 text-xs font-mono font-bold text-emerald-400">
                Колода Дверей ({gameState.doorDeckCount})
              </span>
            </div>

            {/* Treasure Deck */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="absolute -top-1.5 -left-1.5 w-36 h-52 rounded-lg bg-amber-950/70 border border-amber-800 -z-10" />
                <div className="absolute -top-3 -left-3 w-36 h-52 rounded-lg bg-stone-900/80 border border-amber-900 -z-20" />
                <CardView
                  card={{ id: 'tr-back', name: 'Сокровища', deck: 'treasures', category: 'special', description: '' }}
                  isBack
                  size="md"
                />
              </div>
              <span className="mt-2 text-xs font-mono font-bold text-amber-400">
                Колода Сокровищ ({gameState.treasureDeckCount})
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. COMBAT PHASE: Fighting a monster */}
      {phase === 'combat' && combatState && combatState.monsters.length > 0 && (
        <div className="w-full max-w-xl flex flex-col items-center justify-between h-full py-1 animate-in fade-in zoom-in-95 duration-200">
          {/* Combat Header with VS Meter */}
          <div className="w-full shrink-0 bg-stone-950/90 border border-amber-600/50 rounded-xl p-2.5 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between px-3 mb-1.5">
              {/* Munchkin Side */}
              <div className="flex flex-col items-start">
                <div className="text-[11px] uppercase font-bold text-amber-300 truncate max-w-40">
                  {activePlayer.name} {combatState.helperPlayerId ? '+ Помощник' : ''}
                </div>
                <div className="text-xl font-black font-mono text-emerald-400 flex items-center gap-1">
                  <Swords className="w-5 h-5 text-emerald-400" />
                  <span>{playerCombatPower}</span>
                </div>
                {isWarrior && (
                  <span className="text-[9px] text-orange-400 font-semibold">Воин (победа вничью)</span>
                )}
              </div>

              {/* VS Crest */}
              <div className="flex flex-col items-center">
                <div className="px-2.5 py-0.5 rounded-full bg-red-950/90 border border-red-600 text-red-300 text-[10px] font-black tracking-widest shadow-md">
                  VS
                </div>
                <div
                  className={`text-[10px] font-extrabold mt-0.5 px-2 py-0.5 rounded ${
                    isWinning
                      ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-600'
                      : 'bg-rose-950/80 text-rose-200 border border-rose-600'
                  }`}
                >
                  {isWinning ? 'ПОБЕЖДАЕШЬ!' : 'МОНСТР СИЛЬНЕЕ'}
                </div>
              </div>

              {/* Monster Side */}
              <div className="flex flex-col items-end">
                <div className="text-[11px] uppercase font-bold text-red-300 truncate max-w-40 text-right">
                  {combatState.monsters[0].card.name}
                </div>
                <div className="text-xl font-black font-mono text-rose-500 flex items-center gap-1">
                  <span>{monsterCombatPower}</span>
                  <Flame className="w-5 h-5 text-rose-500" />
                </div>
                <span className="text-[9px] text-stone-400">Сила монстра</span>
              </div>
            </div>

            {/* Comparison power progress bar */}
            <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden flex border border-stone-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-300"
                style={{
                  width: `${Math.min(
                    95,
                    Math.max(
                      5,
                      (playerCombatPower / Math.max(1, playerCombatPower + monsterCombatPower)) * 100
                    )
                  )}%`
                }}
              />
              <div
                className="h-full bg-gradient-to-l from-rose-600 to-red-500 transition-all duration-300"
                style={{
                  width: `${Math.min(
                    95,
                    Math.max(
                      5,
                      (monsterCombatPower / Math.max(1, playerCombatPower + monsterCombatPower)) * 100
                    )
                  )}%`
                }}
              />
            </div>
          </div>

          {/* Active Monster Card in center (compact to avoid overflow) */}
          <div className="my-auto flex items-center justify-center scale-90 sm:scale-100">
            <CardView card={combatState.monsters[0].card} size="md" />
          </div>

          {/* Combat Actions for Active Player */}
          {isMyTurn && (
            <div className="w-full shrink-0 flex flex-wrap items-center justify-center gap-2 pt-1">
              {/* Fight button */}
              <button
                onClick={onFightMonster}
                disabled={!isWinning}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-xl transition-all ${
                  isWinning
                    ? 'bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-stone-950 scale-105 cursor-pointer animate-pulse'
                    : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
                }`}
              >
                <Swords className="w-4 h-4" />
                {isWinning ? 'В БОЙ! (Забрать победу)' : 'Не хватает силы!'}
              </button>

              {/* Runaway button */}
              <button
                onClick={onRunaway}
                className="px-4 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-rose-800 to-red-700 hover:from-rose-700 hover:to-red-600 text-white flex items-center gap-1.5 shadow-lg transition-transform hover:scale-102"
              >
                <Dices className="w-4 h-4 text-amber-300" />
                Смывка (бросить d6)
              </button>

              {/* Ask for help button */}
              {!combatState.helperPlayerId && gameState.players.length > 1 && (
                <button
                  onClick={() => setShowHelpModal(true)}
                  className="px-4 py-2.5 rounded-xl font-bold text-sm bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-600/50 flex items-center gap-1.5 shadow"
                >
                  <UserPlus className="w-4 h-4 text-amber-400" />
                  Позвать на помощь
                </button>
              )}

              {/* Play combat cards button */}
              {combatPotionsInHand.length > 0 && (
                <button
                  onClick={() => setShowHandCombatCards(!showHandCombatCards)}
                  className="px-4 py-2.5 rounded-xl font-bold text-sm bg-indigo-900/80 hover:bg-indigo-800 text-indigo-200 border border-indigo-500/50 flex items-center gap-1.5 shadow"
                >
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  Зелья из руки ({combatPotionsInHand.length})
                </button>
              )}
            </div>
          )}

          {/* Quick combat card modal */}
          {showHandCombatCards && combatPotionsInHand.length > 0 && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="bg-[#241a15] border-2 border-indigo-500 rounded-2xl max-w-sm w-full p-4 text-center text-[#f4ecd8] shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                <div className="text-sm font-bold text-indigo-300 mb-3 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  Выбери зелье или усилитель в бой:
                </div>
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto mb-4 pr-1">
                  {combatPotionsInHand.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        onPlayCombatCard(c.id);
                        setShowHandCombatCards(false);
                      }}
                      className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-indigo-500/60 text-left text-xs text-[#f4ecd8] flex items-center justify-between transition-all hover:scale-102 cursor-pointer shadow"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🧪</span>
                        <div>
                          <div className="font-bold text-amber-200">{c.name}</div>
                          <div className="text-[10px] text-stone-400">{c.description}</div>
                        </div>
                      </div>
                      <span className="text-emerald-400 font-mono font-bold whitespace-nowrap text-xs">
                        +{c.bonus || 2} силы
                      </span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowHandCombatCards(false)}
                  className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs text-stone-300 font-semibold"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          {/* Ask for help modal */}
          {showHelpModal && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="bg-[#241a15] border-2 border-amber-600 rounded-2xl max-w-sm w-full p-5 text-center text-[#f4ecd8]">
                <h3 className="text-base font-bold text-amber-300 mb-3">
                  Выбери игрока для помощи в бою:
                </h3>
                <div className="space-y-2 mb-4">
                  {gameState.players
                    .filter((p) => p.id !== activePlayer.id)
                    .map((other) => {
                      const otherPower = calculateCombatPower(other);
                      return (
                        <button
                          key={other.id}
                          onClick={() => {
                            onAskHelp(other.id, 1);
                            setShowHelpModal(false);
                          }}
                          className="w-full p-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 flex items-center justify-between text-xs font-bold transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{other.avatar}</span>
                            <span>{other.name}</span>
                          </div>
                          <span className="text-emerald-400 font-mono">Сила: {otherPower}</span>
                        </button>
                      );
                    })}
                </div>
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="px-4 py-1.5 rounded bg-stone-800 text-xs text-stone-300 font-semibold"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. NON-MONSTER REVEALED (Curse, Equipment, Class, etc.) */}
      {(phase === 'look_for_trouble' || (phase as any) === 'reveal_door') && currentTurnCard && (
        <div className="flex flex-col items-center max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
          <div className="text-xs uppercase font-bold text-amber-300 mb-2 bg-stone-900/80 px-3 py-1 rounded-full border border-amber-500/40">
            {currentTurnCard.category === 'curse' ? '⚠️ ПРОКЛЯТИЕ!' : '✨ Взята карта из дверей'}
          </div>

          <div className="my-2">
            <CardView card={currentTurnCard} size="lg" />
          </div>

          {isMyTurn && (
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              {/* Option A: Loot room */}
              <button
                onClick={onLootRoom}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg"
              >
                <span>Чистить нычки 📦</span>
                <span className="text-[10px] opacity-80">(взять 2-ю дверь)</span>
              </button>

              {/* Option B: Look for trouble (fight monster from hand) */}
              {monstersInHand.length > 0 && (
                <button
                  onClick={() => setShowTroubleModal(true)}
                  className="px-4 py-2 rounded-xl bg-red-800 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>Искать неприятности 👹</span>
                </button>
              )}
            </div>
          )}

          {/* Modal to pick monster from hand */}
          {showTroubleModal && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="bg-[#241a15] border-2 border-red-700 rounded-2xl max-w-md w-full p-5 text-center text-[#f4ecd8]">
                <h3 className="text-sm font-bold text-red-300 mb-3">
                  Выбери монстра из руки для боя:
                </h3>
                <div className="flex flex-wrap gap-2 justify-center max-h-72 overflow-y-auto mb-4">
                  {monstersInHand.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        onPlayMonsterFromHand(m.id);
                        setShowTroubleModal(false);
                      }}
                      className="p-2 rounded bg-stone-900 hover:bg-stone-800 border border-red-600/60 text-left text-xs"
                    >
                      <div className="font-bold text-red-400">{m.name}</div>
                      <div className="text-[10px] text-stone-400">Уровень: {m.monsterLevel}</div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowTroubleModal(false)}
                  className="px-4 py-1.5 rounded bg-stone-800 text-xs text-stone-300"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
