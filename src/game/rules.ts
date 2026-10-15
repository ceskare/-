import type { Card, Player, ItemSlot, CombatState, CombatMonster } from '../types/game.ts';

export interface EquipCheckResult {
  canEquip: boolean;
  reason?: string;
}

/**
 * Calculates total combat power for a player, including base level,
 * equipped item bonuses, and any special race/class perks against the active monster.
 */
export function calculateCombatPower(
  player: Player,
  extraBonus: number = 0,
  vsMonster?: Card
): number {
  let power = player.level + extraBonus;

  for (const item of player.equipped) {
    if (item.bonus) {
      power += item.bonus;
    }
  }

  // Monster specific class/race adjustments
  if (vsMonster?.monsterBonusAgainst) {
    const penalty = vsMonster.monsterBonusAgainst;
    if (penalty.class && player.class === penalty.class) {
      // Monster gains strength or player gets penalty
      power -= penalty.bonus;
    }
    if (penalty.race && player.race === penalty.race) {
      power -= penalty.bonus;
    }
  }

  // Cleric bonus against undead (e.g. Закосивший под Зомби or isUndead)
  if (player.class === 'cleric' && (vsMonster?.iconName === 'skull' || vsMonster?.isUndead)) {
    power += 3;
  }

  return Math.max(1, power);
}

/**
 * Counts occupied hand slots for equipped items.
 */
export function countOccupiedHandSlots(equipped: Card[]): number {
  let count = 0;
  for (const item of equipped) {
    if (item.slot === 'one_hand') {
      count += 1;
    } else if (item.slot === 'two_hands') {
      count += 2;
    }
  }
  return count;
}

/**
 * Validates whether an item can be equipped by the player according to Munchkin rules.
 */
export function canEquipItem(player: Player, item: Card): EquipCheckResult {
  if (item.category !== 'equipment') {
    return { canEquip: false, reason: 'Эту карту нельзя надеть' };
  }

  // Check class compatibility
  if (item.usableByClass && item.usableByClass.length > 0) {
    if (!item.usableByClass.includes(player.class)) {
      const classNames: Record<string, string> = {
        warrior: 'Воин',
        wizard: 'Волшебник',
        thief: 'Вор',
        cleric: 'Клирик'
      };
      const required = item.usableByClass.map((c) => classNames[c] || c).join(', ');
      return { canEquip: false, reason: `Требуется класс: ${required}` };
    }
  }

  // Check race compatibility
  if (item.usableByRace && item.usableByRace.length > 0) {
    if (!item.usableByRace.includes(player.race)) {
      const raceNames: Record<string, string> = {
        elf: 'Эльф',
        dwarf: 'Дварф',
        halfling: 'Хафлинг',
        human: 'Человек'
      };
      const required = item.usableByRace.map((r) => raceNames[r] || r).join(', ');
      return { canEquip: false, reason: `Требуется раса: ${required}` };
    }
  }

  // Check gender compatibility
  if (item.usableByGender && item.usableByGender !== player.gender) {
    return {
      canEquip: false,
      reason: `Только для пола: ${item.usableByGender === 'male' ? 'Мужской' : 'Женский'}`
    };
  }

  // Check Big Item limit: only 1 big item unless Dwarf
  if (item.isBigItem && player.race !== 'dwarf') {
    const hasBigItem = player.equipped.some((i) => i.isBigItem);
    if (hasBigItem) {
      return {
        canEquip: false,
        reason: 'Можно нести только одну большую шмотку (если ты не Дварф)'
      };
    }
  }

  // Slot availability
  const currentSlotItems = player.equipped.filter((i) => i.slot === item.slot);

  if (item.slot === 'head' && currentSlotItems.length >= 1) {
    return { canEquip: false, reason: 'Слот Головняка уже занят' };
  }

  if (item.slot === 'armor' && currentSlotItems.length >= 1) {
    return { canEquip: false, reason: 'Слот Брони уже занят' };
  }

  if (item.slot === 'footwear' && currentSlotItems.length >= 1) {
    return { canEquip: false, reason: 'Слот Обувки уже занят' };
  }

  // Hand slots check: standard 2 hands
  const maxHands = 2 + (player.extraHandSlots || 0);
  const occupiedHands = countOccupiedHandSlots(player.equipped);

  if (item.slot === 'one_hand') {
    if (occupiedHands + 1 > maxHands) {
      return { canEquip: false, reason: 'Обе руки уже заняты оружием' };
    }
  }

  if (item.slot === 'two_hands') {
    if (occupiedHands + 2 > maxHands) {
      return { canEquip: false, reason: 'Для двуручного оружия нужны свободны обе руки' };
    }
  }

  return { canEquip: true };
}

/**
 * Equips an item if allowed, moving it from hand into equipped array.
 */
export function equipItem(player: Player, item: Card): Player {
  const check = canEquipItem(player, item);
  if (!check.canEquip) {
    throw new Error(check.reason || 'Нельзя надеть эту шмотку');
  }

  let newRunawayBonus = player.runawayBonus || 0;
  if (item.id === 'tr-f-1') {
    newRunawayBonus += 2; // Башмаки быстрого бега
  } else if (item.id === 'tr-i-1') {
    newRunawayBonus += 1; // Плащ-невидимка
  }

  return {
    ...player,
    hand: player.hand.filter((c) => c.id !== item.id),
    carried: player.carried.filter((c) => c.id !== item.id),
    equipped: [...player.equipped, item],
    runawayBonus: newRunawayBonus
  };
}

/**
 * Carries an item in play (turned sideways in backpack).
 * Does not give combat power, but doesn't count against 5-card hand limit!
 */
export function carryItem(player: Player, item: Card): Player {
  if (item.category !== 'equipment') {
    throw new Error('Только шмотки можно нести в рюкзаке');
  }

  // Big item limit applies to carried items too unless Dwarf
  if (item.isBigItem && player.race !== 'dwarf') {
    const hasBigItem = [...player.equipped, ...player.carried].some((i) => i.isBigItem);
    if (hasBigItem) {
      throw new Error('Нельзя нести больше одной большой шмотки (если не Дварф)');
    }
  }

  return {
    ...player,
    hand: player.hand.filter((c) => c.id !== item.id),
    carried: [...player.carried, item]
  };
}

/**
 * Unequips an active item back to hand.
 */
export function unequipItem(player: Player, itemId: string): Player {
  const item = player.equipped.find((i) => i.id === itemId);
  if (!item) return player;

  let newRunawayBonus = player.runawayBonus || 0;
  if (item.id === 'tr-f-1') {
    newRunawayBonus = Math.max(0, newRunawayBonus - 2);
  } else if (item.id === 'tr-i-1') {
    newRunawayBonus = Math.max(0, newRunawayBonus - 1);
  }

  return {
    ...player,
    equipped: player.equipped.filter((i) => i.id !== itemId),
    hand: [...player.hand, item],
    runawayBonus: newRunawayBonus
  };
}

/**
 * Evaluates combat outcome.
 * Warrior wins on tie, otherwise player must strictly exceed monster power.
 */
export function resolveCombat(
  playerCombatPower: number,
  monsterCombatPower: number,
  isWarrior: boolean
): { playerWins: boolean; tie: boolean } {
  const tie = playerCombatPower === monsterCombatPower;
  if (tie) {
    return { playerWins: isWarrior, tie: true };
  }
  return { playerWins: playerCombatPower > monsterCombatPower, tie: false };
}

/**
 * Runaway roll check: 5 or 6 (or with runaway bonuses) succeeds.
 */
export function resolveRunawayRoll(
  dieRoll: number,
  runawayBonus: number = 0,
  isElf: boolean = false,
  isWizard: boolean = false
): boolean {
  let effectiveRoll = dieRoll + runawayBonus;
  if (isElf) effectiveRoll += 1;
  if (isWizard) effectiveRoll += 1;
  return effectiveRoll >= 5;
}

/**
 * Halfling Runaway check: Halfling gets 1 free retry if the first roll failed!
 */
export function checkHalflingRunawayRetry(
  dieRoll: number,
  runawayBonus: number,
  hasRetried: boolean
): { success: boolean; canRetry: boolean } {
  const success = resolveRunawayRoll(dieRoll, runawayBonus);
  if (!success && !hasRetried) {
    return { success: false, canRetry: true };
  }
  return { success, canRetry: false };
}

/**
 * Calculates levels earned from selling items (1000 gold per level).
 * Halfling can sell 1 item for 2x gold!
 */
export function calculateGoldForLevels(
  totalGoldValue: number,
  isHalfling: boolean = false,
  doubleBonus: number = 0
): {
  levels: number;
  spentGold: number;
} {
  const effectiveGold = totalGoldValue + (isHalfling ? doubleBonus : 0);
  const levels = Math.floor(effectiveGold / 1000);
  const spentGold = levels * 1000;
  return { levels, spentGold };
}

/**
 * Warrior Berserk ability: Discard up to 3 cards for +1 power each!
 */
export function applyWarriorBerserk(
  player: Player,
  cardId: string
): { player: Player; bonus: number } {
  if (player.class !== 'warrior') {
    throw new Error('Только Воин может использовать ярость берсерка');
  }
  const discards = player.berserkDiscardsUsed || 0;
  if (discards >= 3) {
    throw new Error('Можно сбросить не более 3 карт за бой');
  }

  return {
    player: {
      ...player,
      hand: player.hand.filter((c) => c.id !== cardId),
      berserkDiscardsUsed: discards + 1
    },
    bonus: 1
  };
}

/**
 * Wizard Charm spell: Discard hand (>= 3 cards) to charm monster!
 */
export function applyWizardCharm(player: Player): { player: Player; success: boolean } {
  if (player.class !== 'wizard') {
    throw new Error('Только Волшебник владеет усмирением');
  }
  if (player.hand.length < 3) {
    throw new Error('Нужно сбросить минимум 3 карты для усмирения');
  }

  return {
    player: {
      ...player,
      hand: []
    },
    success: true
  };
}

/**
 * Adds a second monster to combat via Wandering Monster (Бродячая тварь).
 */
export function addWanderingMonster(
  combatState: CombatState,
  monsterCard: Card,
  playedByName: string
): CombatState {
  const newMonster: CombatMonster = {
    card: monsterCard,
    currentStrength: monsterCard.monsterLevel || 1,
    modifiers: [
      {
        name: 'Бродячая Тварь',
        value: 0,
        playedBy: playedByName
      }
    ]
  };

  return {
    ...combatState,
    monsters: [...combatState.monsters, newMonster]
  };
}

/**
 * Applies Bad Stuff (Непотребство) when fleeing fails.
 */
export function applyBadStuff(
  player: Player,
  monster: Card
): { updatedPlayer: Player; discardedCards: Card[]; message: string } {
  let updatedPlayer: Player = { ...player };
  let discardedCards: Card[] = [];
  let message = monster.badStuff || 'Ничего особенного не произошло.';

  switch (monster.badStuffEffect) {
    case 'lose_level': {
      updatedPlayer.level = Math.max(1, updatedPlayer.level - 1);
      message = `Потерял 1 уровень (стал ${updatedPlayer.level})`;
      break;
    }
    case 'lose_two_levels': {
      updatedPlayer.level = Math.max(1, updatedPlayer.level - 2);
      message = `Потерял 2 уровня (стал ${updatedPlayer.level})`;
      break;
    }
    case 'lose_head': {
      const head = updatedPlayer.equipped.find((i) => i.slot === 'head');
      if (head) {
        discardedCards.push(head);
        updatedPlayer.equipped = updatedPlayer.equipped.filter((i) => i.id !== head.id);
        message = `Потерял надетый головняк (${head.name})!`;
      }
      break;
    }
    case 'lose_armor': {
      const armor = updatedPlayer.equipped.find((i) => i.slot === 'armor');
      if (armor) {
        discardedCards.push(armor);
        updatedPlayer.equipped = updatedPlayer.equipped.filter((i) => i.id !== armor.id);
        message = `Потерял надетый доспех (${armor.name})!`;
      }
      break;
    }
    case 'lose_footwear': {
      const boots = updatedPlayer.equipped.find((i) => i.slot === 'footwear');
      if (boots) {
        discardedCards.push(boots);
        updatedPlayer.equipped = updatedPlayer.equipped.filter((i) => i.id !== boots.id);
        message = `Потерял надетую обувку (${boots.name})!`;
      }
      break;
    }
    case 'discard_hand': {
      discardedCards = [...updatedPlayer.hand];
      updatedPlayer.hand = [];
      message = 'Сбросил все карты из руки!';
      break;
    }
    case 'death': {
      // Discard all gear and hand, retain level, race, class
      discardedCards = [...updatedPlayer.equipped, ...updatedPlayer.carried, ...updatedPlayer.hand];
      updatedPlayer.equipped = [];
      updatedPlayer.carried = [];
      updatedPlayer.hand = [];
      updatedPlayer.runawayBonus = 0;
      message = 'СМЕРТЬ! Сбросил все шмотки и карты.';
      break;
    }
    default:
      break;
  }

  return { updatedPlayer, discardedCards, message };
}

/**
 * Checks if player reached level 10 victory.
 */
export function checkWinCondition(player: Player): boolean {
  return player.level >= 10;
}
