import React from 'react';
import { GameState, Player, Card, DungeonTheme } from '../types/game.ts';
import { calculateCombatPower } from '../game/rules.ts';
import { CardView } from './CardView.tsx';
import { Dungeon3DView } from './Dungeon3DView.tsx';
import { SoundEngine } from '../services/audio.ts';
import {
  MunchkinHeroSvg,
  PlutoniumDragonSvg,
  HarpySvg,
  SquidzillaSvg,
  CombatShieldBadge,
  DungeonBarrelSvg,
  DungeonTorchSvg,
  MunchkinCardBackSvg
} from '../game/illustrations.tsx';
import {
  Swords,
  Flame,
  UserPlus,
  Dices,
  Sparkles,
  Zap,
  Shield,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface DungeonSceneProps {
  gameState: GameState;
  activePlayer: Player;
  myPlayer: Player;
  isMyTurn: boolean;
  onKickDoor: () => void;
  onFightMonster: () => void;
  onRunaway: () => void;
  onAskHelp: () => void;
  onOpenPotionsModal: () => void;
  onWarriorBerserk?: () => void;
  onWizardCharm?: () => void;
  onLootRoom: () => void;
  onOpenTroubleModal: () => void;
  onEndTurn?: () => void;
  onDropCard?: (cardId: string) => void;
}

export const DungeonScene: React.FC<DungeonSceneProps> = ({
  gameState,
  activePlayer,
  myPlayer,
  isMyTurn,
  onKickDoor,
  onFightMonster,
  onRunaway,
  onAskHelp,
  onOpenPotionsModal,
  onWarriorBerserk,
  onWizardCharm,
  onLootRoom,
  onOpenTroubleModal,
  onEndTurn,
  onDropCard
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const { phase, currentTurnCard, combatState, theme } = gameState;

  // Active monster data in combat
  const activeMonster = combatState?.monsters[0];
  const secondMonster = combatState?.monsters[1];

  // Combat powers
  let playerCombatPower = 0;
  let monsterTotalPower = 0;
  let isWarrior = activePlayer.class === 'warrior';
  let isWinning = false;

  if (phase === 'combat' && combatState && activeMonster) {
    monsterTotalPower = combatState.monsters.reduce(
      (sum, m) => sum + m.currentStrength,
      0
    );

    playerCombatPower = calculateCombatPower(
      activePlayer,
      combatState.munchkinBonus + (combatState.helperBonus || 0),
      activeMonster.card
    );

    isWinning = isWarrior
      ? playerCombatPower >= monsterTotalPower
      : playerCombatPower > monsterTotalPower;
  }

  // Check equipped gear on hero for visual representation
  const hasSlimyArmor = activePlayer.equipped.some((i) => i.id === 'tr-a-2');
  const hasHornedHelm = activePlayer.equipped.some((i) => i.id === 'tr-h-1');
  const hasSword = activePlayer.equipped.some(
    (i) => i.slot === 'one_hand' || i.slot === 'two_hands'
  );
  const isWizard = activePlayer.class === 'wizard';

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none">
      {/* --- 1. 3D BLENDER-STYLE ANIMATED DUNGEON VIEWPORT --- */}
      <Dungeon3DView
        phase={phase}
        isMyTurn={isMyTurn}
        onKickDoor={onKickDoor}
        combatState={combatState}
        currentTurnCard={currentTurnCard}
        theme={theme}
        isWinning={isWinning}
      />

      {/* Atmospheric Vignette & Depth Overlay (Rich textured lighting, never solid color) */}
      <div className="absolute inset-0 pointer-events-none z-1 bg-gradient-to-t from-black/60 via-transparent to-black/40 shadow-[inset_0_0_120px_rgba(0,0,0,0.8)]" />

      {/* --- 2. CEILING-HUNG OPPONENT BOARDS (Image 1 & 3) --- */}
      <div className="relative z-20 w-full pt-1 px-4 flex items-start justify-center gap-3">
        {gameState.players
          .filter((p) => p.id !== myPlayer.id)
          .map((opp) => {
            const oppPower = calculateCombatPower(opp);
            const isTurn = opp.id === activePlayer.id;

            return (
              <div
                key={opp.id}
                className={`relative flex flex-col items-center transition-transform ${
                  isTurn ? 'scale-105 -translate-y-0.5' : 'opacity-90'
                }`}
              >
                {/* Iron Hanging Chains */}
                <div className="flex gap-8 -mb-1">
                  <div className="w-1.5 h-6 bg-gradient-to-b from-stone-400 to-stone-700 border-x border-stone-900 rounded-sm" />
                  <div className="w-1.5 h-6 bg-gradient-to-b from-stone-400 to-stone-700 border-x border-stone-900 rounded-sm" />
                </div>

                {/* Arched Stone Portrait Frame */}
                <div
                  className={`relative w-36 sm:w-44 parchment-card rounded-t-2xl rounded-b-lg border-2 ${
                    isTurn ? 'border-amber-400 shadow-[0_0_24px_rgba(251,191,36,0.65)]' : 'border-[#4a2e18]'
                  } p-1 text-stone-950 shadow-xl`}
                >
                  {/* Top Arch Character Window */}
                  <div className="w-full h-14 bg-gradient-to-b from-[#2d4052] to-[#1a252f] rounded-t-xl border border-stone-700 flex items-center justify-center relative overflow-hidden">
                    <span className="text-3xl filter drop-shadow">{opp.avatar}</span>
                    {/* Level Heraldic Shield Badge (Left) */}
                    <div className="absolute -top-1 -left-1 w-7 h-8 bg-red-700 border-2 border-amber-300 rounded-b-md flex items-center justify-center text-white font-sans font-black text-xs shadow">
                      {opp.level}
                    </div>
                    {/* Combat Power Gold Badge (Right) */}
                    <div className="absolute -top-1 -right-1 w-7 h-8 bg-amber-600 border-2 border-yellow-200 rounded-b-md flex items-center justify-center text-stone-950 font-sans font-black text-xs shadow">
                      ⚡{oppPower}
                    </div>
                  </div>

                  {/* Player Wooden Roll Name Banner */}
                  <div className="bg-[#d2ab72] border-t border-b border-[#7c4d1d] py-0.5 px-1 mt-0.5 text-center">
                    <div className="font-fantasy font-bold text-[11px] leading-tight text-[#3b1d0c] truncate">
                      {opp.name} {opp.isBot ? '(БОТ)' : ''}
                    </div>
                    <div className="text-[9px] text-[#5c3115] font-sans font-bold">
                      {opp.race !== 'human' ? opp.race : 'Человек'}{' '}
                      {opp.class !== 'none' ? `| ${opp.class}` : ''}
                    </div>
                  </div>

                  {/* Equipped Gear Little Icons Hanging Below */}
                  <div className="flex items-center justify-center gap-1 py-0.5 bg-[#f5e6ce]/80 rounded-b">
                    {opp.equipped.map((it) => (
                      <span
                        key={it.id}
                        title={`${it.name} (+${it.bonus || 0})`}
                        className="text-[11px] hover:scale-125 transition-transform"
                      >
                        {it.slot === 'head' && '🪖'}
                        {it.slot === 'armor' && '🛡️'}
                        {it.slot === 'footwear' && '👢'}
                        {it.slot === 'one_hand' && '🗡️'}
                        {it.slot === 'two_hands' && '⚔️'}
                        {it.slot === 'item' && '💍'}
                      </span>
                    ))}
                    {opp.equipped.length === 0 && (
                      <span className="text-[8px] text-stone-500 italic">Без шмоток</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* --- 3. CENTER BATTLEFIELD ARENA --- */}
      <div
        onDragOver={(e) => {
          if (isMyTurn) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            if (!isDragOver) setIsDragOver(true);
          }
        }}
        onDragLeave={(e) => {
          if (e.currentTarget === e.target) {
            setIsDragOver(false);
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          if (!isMyTurn) return;
          const cardId = e.dataTransfer.getData('text/plain');
          if (cardId && onDropCard) {
            SoundEngine.playCardDrop();
            onDropCard(cardId);
          }
        }}
        className={`relative z-10 flex-1 flex flex-col items-center justify-start pt-1 sm:pt-2 px-4 max-w-4xl mx-auto w-full transition-all rounded-3xl ${
          isDragOver
            ? 'ring-4 ring-amber-400/80 bg-amber-950/30 scale-[1.01]'
            : ''
        }`}
      >
        {isDragOver && (
          <div className="absolute top-2 z-50 px-4 py-1.5 rounded-full bg-amber-500 text-stone-950 font-serif font-black text-xs shadow-2xl border-2 border-yellow-200 animate-bounce pointer-events-none">
            ✨ БРОСЬ КАРТУ СЮДА ДЛЯ РОЗЫГРЫША!
          </div>
        )}

        {/* PHASE A: KICK DOOR PHASE (Wooden Arched Door) */}
        {phase === 'kick_door' && (
          <div className="flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            {/* Parchment Speech Banner (Image 1) */}
            <div className="relative bg-[#f5e6ce] border-3 border-[#4a2e18] rounded-xl px-5 py-1.5 shadow-2xl mb-4">
              <span className="font-serif font-black text-xs sm:text-sm text-[#3b1d0c] tracking-wide">
                {isMyTurn ? 'Твой ход! Выбирай: Выбить дверь в открытую?' : `Ходит: ${activePlayer.name}...`}
              </span>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#f5e6ce] border-b-3 border-r-3 border-[#4a2e18] rotate-45" />
            </div>

            {/* Clickable Animated Door Deck (Image 1 & 2) */}
            <div className="flex items-center gap-6 sm:gap-10">
              <div
                onClick={() => {
                  if (isMyTurn) {
                    SoundEngine.playDoorOpen();
                    onKickDoor();
                  }
                }}
                className={`relative group ${
                  isMyTurn ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform' : 'opacity-80'
                }`}
              >
                <div className="w-32 h-48 sm:w-36 sm:h-54 rounded-xl shadow-[0_16px_32px_rgba(0,0,0,0.8)] border-3 border-[#26170d] overflow-hidden">
                  <MunchkinCardBackSvg type="doors" />
                </div>
                {isMyTurn && (
                  <div className="absolute inset-0 bg-amber-400/20 rounded-xl animate-pulse flex items-center justify-center">
                    <span className="bg-emerald-800 text-amber-200 px-3 py-1 rounded-full text-[11px] sm:text-xs font-black border-2 border-emerald-400 shadow-xl">
                      ВЫБИТЬ ДВЕРЬ! 🚪
                    </span>
                  </div>
                )}
              </div>

              {/* Treasure Deck */}
              <div className="w-32 h-48 sm:w-36 sm:h-54 rounded-xl shadow-[0_16px_32px_rgba(0,0,0,0.8)] border-3 border-[#26170d] overflow-hidden hidden sm:block">
                <MunchkinCardBackSvg type="treasures" />
              </div>
            </div>
          </div>
        )}

        {/* PHASE B: COMBAT PHASE (Hero VS Monster Comic Encounter!) */}
        {phase === 'combat' && activeMonster && (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
            {/* Top Monster Parchment Banner (Image 3) */}
            <div className="relative bg-[#f5e5c9] border-3 border-[#3b1d0c] rounded-xl px-4 py-1.5 shadow-2xl max-w-lg w-full text-stone-900 mb-1">
              <div className="flex items-center justify-between border-b border-[#a67c46] pb-0.5">
                <div className="flex items-center gap-2">
                  <span className="bg-[#9c27b0] text-white font-black text-xs px-2 py-0.5 rounded-md shadow">
                    Ур. {activeMonster.card.monsterLevel}
                  </span>
                  <span className="font-serif font-black text-sm sm:text-base tracking-wide text-[#3b1d0c]">
                    {activeMonster.card.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 font-bold text-xs text-amber-900">
                  <span>💎 {activeMonster.card.monsterTreasures} сокр.</span>
                  {activeMonster.card.monsterLevelsReward && activeMonster.card.monsterLevelsReward > 1 && (
                    <span className="text-emerald-700 font-extrabold">(+{activeMonster.card.monsterLevelsReward} ур.)</span>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-[#4a2e18] my-0.5 font-medium line-clamp-2">
                {activeMonster.card.description}
              </div>

              {/* Red Jagged "Bad Stuff:" Ribbon (Image 3) */}
              {activeMonster.card.badStuff && (
                <div className="bg-[#b71c1c] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow flex items-center gap-1">
                  <span className="italic font-black">Непотребство:</span>
                  <span>{activeMonster.card.badStuff}</span>
                </div>
              )}
            </div>

            {/* THE COMBAT STAGE: Munchkin Hero on left, Battle Shields & Controls in middle, Monster on right! */}
            <div className="w-full flex items-center justify-around my-0.5">
              {/* Left: The Munchkin Hero Character (Visually wearing equipped armor!) */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-28 sm:w-26 sm:h-34">
                  <MunchkinHeroSvg
                    hasHornedHelm={hasHornedHelm}
                    hasSlimyArmor={hasSlimyArmor}
                    hasSword={hasSword}
                    isWizard={isWizard}
                  />
                </div>
                <div className="bg-[#3b1d0c] text-amber-200 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black border border-amber-500 shadow mt-1">
                  {activePlayer.name}
                </div>
              </div>

              {/* Center: The Clashing Heraldic Battle Shields & Actions (Image 2 & 3) */}
              <div className="flex flex-col items-center justify-center mx-1 sm:mx-4">
                <div className="flex items-center gap-2 sm:gap-4">
                  {/* Hero Combat Shield */}
                  <CombatShieldBadge score={playerCombatPower} isHero={true} />
                  <div className="text-lg sm:text-xl font-serif font-black text-amber-400 italic">
                    VS
                  </div>
                  {/* Monster Combat Shield */}
                  <CombatShieldBadge score={monsterTotalPower} isHero={false} />
                </div>

                {/* Outcome Banner */}
                <div
                  className={`mt-1.5 px-3 py-0.5 rounded-full font-black text-[11px] sm:text-xs uppercase tracking-wider border-2 shadow-lg ${
                    isWinning
                      ? 'bg-emerald-600 border-yellow-300 text-stone-950 animate-bounce'
                      : 'bg-red-700 border-red-400 text-white animate-pulse'
                  }`}
                >
                  {isWinning ? 'ПОБЕЖДАЕШЬ! ⚔️' : 'МОНСТР СИЛЬНЕЕ! 🔥'}
                </div>

                {/* Combat Action Buttons for Active Player */}
                {isMyTurn && (
                  <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
                    {/* Fight button (Crossed Swords) */}
                    <button
                      onClick={() => {
                        SoundEngine.playCombatWin();
                        onFightMonster();
                      }}
                      disabled={!isWinning}
                      className={`px-3.5 py-1.5 rounded-xl font-serif font-black text-xs flex items-center gap-1.5 shadow-2xl transition-all ${
                        isWinning
                          ? 'bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500 hover:scale-105 text-stone-950 border-2 border-yellow-300 cursor-pointer animate-pulse'
                          : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <Swords className="w-4 h-4" />
                      {isWinning ? 'В БОЙ! (ПОБЕДА)' : 'НЕ ХВАТАЕТ СИЛЫ'}
                    </button>

                    {/* Runaway button (Running Boot d6) */}
                    <button
                      onClick={() => {
                        SoundEngine.playButtonClick();
                        onRunaway();
                      }}
                      className="px-3 py-1.5 rounded-xl font-serif font-black text-xs bg-gradient-to-r from-red-800 to-rose-700 hover:from-red-700 hover:to-rose-600 text-white flex items-center gap-1 border-2 border-red-400 shadow-xl transition-transform hover:scale-105 cursor-pointer"
                    >
                      <Dices className="w-4 h-4 text-amber-300" />
                      СМЫВКА (d6)
                    </button>

                    {/* Ask for help */}
                    {!combatState.helperPlayerId && gameState.players.length > 1 && (
                      <button
                        onClick={() => {
                          SoundEngine.playButtonClick();
                          onAskHelp();
                        }}
                        className="px-2.5 py-1.5 rounded-xl font-serif font-black text-xs bg-[#5d4037] hover:bg-[#6d4c41] text-amber-200 border-2 border-amber-600 flex items-center gap-1 shadow-lg transition-transform hover:scale-105 cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                        ПОМОЩЬ
                      </button>
                    )}

                    {/* Combat Potions from Hand */}
                    <button
                      onClick={() => {
                        SoundEngine.playPotion();
                        onOpenPotionsModal();
                      }}
                      className="px-2.5 py-1.5 rounded-xl font-serif font-black text-xs bg-indigo-900/90 hover:bg-indigo-800 text-indigo-200 border-2 border-indigo-400 flex items-center gap-1 shadow-lg transition-transform hover:scale-105 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                      ЗЕЛЬЯ
                    </button>

                    {/* Warrior Berserk ability (if warrior) */}
                    {isWarrior && onWarriorBerserk && (
                      <button
                        onClick={() => {
                          SoundEngine.playCombatHit();
                          onWarriorBerserk();
                        }}
                        className="px-2.5 py-1.5 rounded-xl font-serif font-black text-[11px] bg-orange-800 hover:bg-orange-700 text-white border-2 border-orange-400 flex items-center gap-1 shadow-lg cursor-pointer"
                      >
                        ⚔️ БЕРСЕРК (+1)
                      </button>
                    )}

                    {/* Wizard Charm ability (if wizard) */}
                    {isWizard && onWizardCharm && (
                      <button
                        onClick={() => {
                          SoundEngine.playPotion();
                          onWizardCharm();
                        }}
                        className="px-2.5 py-1.5 rounded-xl font-serif font-black text-[11px] bg-purple-800 hover:bg-purple-700 text-white border-2 border-purple-400 flex items-center gap-1 shadow-lg cursor-pointer"
                      >
                        🪄 УСМИРЕНИЕ
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Right: The Animated Cartoon Monster! */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-28 sm:w-28 sm:h-34 flex items-center justify-center">
                  {activeMonster.card.artType === 'dragon' ? (
                    <PlutoniumDragonSvg className="w-full h-full" />
                  ) : activeMonster.card.artType === 'harpies' ? (
                    <HarpySvg className="w-full h-full" />
                  ) : activeMonster.card.artType === 'squidzilla' ? (
                    <SquidzillaSvg className="w-full h-full" />
                  ) : (
                    /* Default Animated Monster SVG */
                    <div className="w-24 h-28 rounded-2xl bg-[#5d4037]/90 border-2 border-[#3e2723] p-1.5 flex flex-col items-center justify-center text-center shadow-xl">
                      <span className="text-4xl animate-pulse">👹</span>
                      <span className="font-serif font-black text-[10px] text-amber-200 mt-1 line-clamp-1">
                        {activeMonster.card.name}
                      </span>
                    </div>
                  )}
                </div>
                <div className="bg-[#5d1010] text-red-200 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black border border-red-500 shadow mt-1">
                  Уровень {activeMonster.card.monsterLevel}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PHASE C: NON-MONSTER CARD REVEALED (Curse, Equipment, Class, etc.) */}
        {phase === 'look_for_trouble' && currentTurnCard && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
            {/* Parchment Notification */}
            <div className="bg-[#f5e6ce] border-3 border-[#4a2e18] rounded-xl px-6 py-2 shadow-2xl mb-3 text-center">
              <span className="font-serif font-black text-xs text-[#3b1d0c] uppercase tracking-wider block">
                {currentTurnCard.category === 'curse' ? '⚡ ПРОКЛЯТИЕ ОБРУШИЛОСЬ!' : '✨ ВЗЯТА КАРТА ДВЕРЕЙ'}
              </span>
              <span className="font-serif font-bold text-sm text-[#795548]">
                {currentTurnCard.name}
              </span>
            </div>

            {/* Revealed Card Inspection */}
            <div className="mb-3 transform hover:scale-105 transition-transform">
              <CardView card={currentTurnCard} size="md" />
            </div>

            {isMyTurn && (
              <div className="flex items-center gap-4 mt-1">
                <button
                  onClick={() => {
                    SoundEngine.playDoorOpen();
                    onLootRoom();
                  }}
                  className="px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 font-serif font-black text-sm text-stone-950 border-2 border-yellow-300 shadow-2xl flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
                >
                  <span>ЧИСТИТЬ НЫЧКИ 📦</span>
                  <span className="text-[10px] opacity-80">(2-я дверь в руку)</span>
                </button>

                <button
                  onClick={() => {
                    SoundEngine.playButtonClick();
                    onOpenTroubleModal();
                  }}
                  className="px-5 py-3 rounded-2xl bg-red-800 hover:bg-red-700 font-serif font-black text-sm text-white border-2 border-red-400 shadow-2xl flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
                >
                  <Swords className="w-4 h-4" />
                  <span>ИСКАТЬ НЕПРИЯТНОСТИ 👹</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* PHASE D: CHARITY PHASE (От щедрот) */}
        {phase === 'charity' && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
            {/* Parchment Notification */}
            <div className="bg-[#f5e6ce] border-3 border-[#4a2e18] rounded-xl px-6 py-2.5 shadow-2xl mb-4 text-center max-w-md">
              <span className="font-serif font-black text-sm text-[#3b1d0c] uppercase tracking-wider block">
                ФАЗА «ОТ ЩЕДРОТ» (CHARITY)
              </span>
              <span className="text-xs text-[#5d4037] font-medium mt-1 block">
                {myPlayer.hand.length > (myPlayer.race === 'dwarf' ? 6 : 5)
                  ? `Лимит карт в руке превышен (${myPlayer.hand.length} из ${myPlayer.race === 'dwarf' ? 6 : 5})! Сбросьте лишние карты перед окончанием хода.`
                  : 'Все условия соблюдены. Передайте ход следующему манчкину!'}
              </span>
            </div>

            {isMyTurn && onEndTurn && (
              <button
                onClick={() => {
                  SoundEngine.playButtonClick();
                  onEndTurn();
                }}
                disabled={myPlayer.hand.length > (myPlayer.race === 'dwarf' ? 6 : 5)}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 hover:from-emerald-500 hover:to-green-400 disabled:opacity-40 disabled:cursor-not-allowed text-stone-950 font-serif font-black text-base shadow-2xl border-2 border-emerald-300 flex items-center gap-2.5 cursor-pointer transition-transform hover:scale-105"
              >
                <span>ЗАВЕРШИТЬ ХОД</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
