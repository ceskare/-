import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCombatPower,
  canEquipItem,
  equipItem,
  carryItem,
  unequipItem,
  resolveCombat,
  resolveRunawayRoll,
  checkHalflingRunawayRetry,
  calculateGoldForLevels,
  applyWarriorBerserk,
  applyWizardCharm,
  addWanderingMonster,
  applyBadStuff,
  checkWinCondition
} from './rules.ts';
import type { Card, Player, CombatState } from '../types/game.ts';

const createMockPlayer = (overrides?: Partial<Player>): Player => ({
  id: 'p1',
  name: 'Тестовый Манчкин',
  avatar: '🧙‍♂️',
  level: 1,
  gender: 'male',
  class: 'none',
  race: 'human',
  hand: [],
  equipped: [],
  carried: [],
  gold: 0,
  runawayBonus: 0,
  ...overrides
});

const mockHeadgear: Card = {
  id: 'item-head-1',
  name: 'Шлем-Рогач',
  deck: 'treasures',
  category: 'equipment',
  slot: 'head',
  bonus: 1,
  gold: 200,
  description: 'Шлем'
};

const mockWeaponOneHand: Card = {
  id: 'item-w1',
  name: 'Меч Прикольного Угла',
  deck: 'treasures',
  category: 'equipment',
  slot: 'one_hand',
  bonus: 3,
  gold: 500,
  description: 'Меч'
};

const mockWeaponTwoHands: Card = {
  id: 'item-w2',
  name: 'Двуручный Двуручник',
  deck: 'treasures',
  category: 'equipment',
  slot: 'two_hands',
  bonus: 4,
  gold: 600,
  isBigItem: true,
  description: 'Двуручник'
};

test('calculateCombatPower calculates player level + items + bonuses', () => {
  const player = createMockPlayer({
    level: 3,
    equipped: [mockHeadgear, mockWeaponOneHand]
  });
  // Level 3 + 1 (helmet) + 3 (sword) = 7
  assert.equal(calculateCombatPower(player), 7);
  // With +3 potion bonus
  assert.equal(calculateCombatPower(player, 3), 10);
});

test('canEquipItem enforces two hands limit', () => {
  const playerWith2Hands = createMockPlayer({
    equipped: [
      { ...mockWeaponOneHand, id: 'w1' },
      { ...mockWeaponOneHand, id: 'w2' }
    ]
  });

  const thirdWeaponCheck = canEquipItem(playerWith2Hands, mockWeaponOneHand);
  assert.equal(thirdWeaponCheck.canEquip, false);

  const twoHandCheck = canEquipItem(playerWith2Hands, mockWeaponTwoHands);
  assert.equal(twoHandCheck.canEquip, false);
});

test('carryItem allows putting small items in backpack', () => {
  const player = createMockPlayer({ hand: [mockHeadgear] });
  const updated = carryItem(player, mockHeadgear);
  assert.equal(updated.hand.length, 0);
  assert.equal(updated.carried.length, 1);
  assert.equal(updated.carried[0].id, mockHeadgear.id);
});

test('Warrior berserk discards up to 3 cards for +1 each', () => {
  const warrior = createMockPlayer({
    class: 'warrior',
    hand: [mockHeadgear]
  });
  const { player, bonus } = applyWarriorBerserk(warrior, mockHeadgear.id);
  assert.equal(bonus, 1);
  assert.equal(player.berserkDiscardsUsed, 1);
  assert.equal(player.hand.length, 0);
});

test('Wizard charm defeats monster by discarding 3 cards', () => {
  const wizard = createMockPlayer({
    class: 'wizard',
    hand: [mockHeadgear, mockWeaponOneHand, mockWeaponTwoHands]
  });
  const { player, success } = applyWizardCharm(wizard);
  assert.equal(success, true);
  assert.equal(player.hand.length, 0);
});

test('Halfling runaway retry works on first fail', () => {
  const retryResult = checkHalflingRunawayRetry(2, 0, false);
  assert.equal(retryResult.success, false);
  assert.equal(retryResult.canRetry, true);

  const secondFail = checkHalflingRunawayRetry(2, 0, true);
  assert.equal(secondFail.success, false);
  assert.equal(secondFail.canRetry, false);
});

test('Wandering Monster adds second monster to combat state', () => {
  const combat: CombatState = {
    monsters: [
      {
        card: { id: 'm1', name: 'Гоблин', deck: 'doors', category: 'monster', monsterLevel: 2, description: '' },
        currentStrength: 2,
        modifiers: []
      }
    ],
    munchkinBonus: 0,
    munchkinModifiers: []
  };

  const monster2: Card = {
    id: 'm2',
    name: 'Дракон',
    deck: 'doors',
    category: 'monster',
    monsterLevel: 20,
    description: ''
  };

  const updatedCombat = addWanderingMonster(combat, monster2, 'Игрок 2');
  assert.equal(updatedCombat.monsters.length, 2);
  assert.equal(updatedCombat.monsters[1].card.name, 'Дракон');
});

test('resolveCombat handles warrior tie rule correctly', () => {
  assert.deepEqual(resolveCombat(10, 10, false), { playerWins: false, tie: true });
  assert.deepEqual(resolveCombat(10, 10, true), { playerWins: true, tie: true });
  assert.deepEqual(resolveCombat(11, 10, false), { playerWins: true, tie: false });
});

test('calculateGoldForLevels gives 1 level per 1000 gold with halfling bonus', () => {
  assert.deepEqual(calculateGoldForLevels(1000), { levels: 1, spentGold: 1000 });
  // Halfling sells 500 gold item with 500 double bonus -> 1000 gold -> 1 level!
  assert.deepEqual(calculateGoldForLevels(500, true, 500), { levels: 1, spentGold: 1000 });
});

test('applyBadStuff and win condition check', () => {
  const player = createMockPlayer({ level: 4, equipped: [mockHeadgear] });
  const monster: Card = {
    id: 'm1',
    name: 'Гоблин',
    deck: 'doors',
    category: 'monster',
    badStuffEffect: 'lose_level',
    description: 'Гоблин'
  };

  const { updatedPlayer } = applyBadStuff(player, monster);
  assert.equal(updatedPlayer.level, 3);
  assert.equal(checkWinCondition(createMockPlayer({ level: 9 })), false);
  assert.equal(checkWinCondition(createMockPlayer({ level: 10 })), true);
});
