import { GameState, Player, Card } from '../types/game.ts';
import { calculateCombatPower, canEquipItem, equipItem } from './rules.ts';

export interface BotDecision {
  action:
    | 'kick_door'
    | 'fight_monster'
    | 'flee_monster'
    | 'play_card'
    | 'equip_card'
    | 'loot_room'
    | 'end_turn';
  cardId?: string;
  targetId?: string;
  delayMs: number;
}

/**
 * Determines the next tactical move for an AI Bot.
 */
export function decideBotAction(gameState: GameState, botPlayer: Player): BotDecision | null {
  const isBotActive = gameState.players[gameState.activePlayerIndex]?.id === botPlayer.id;

  // 1. If it's the bot's turn
  if (isBotActive) {
    // Phase 1: Kick door
    if (gameState.phase === 'kick_door') {
      return {
        action: 'kick_door',
        delayMs: 800
      };
    }

    // Phase 2: In Combat
    if (gameState.phase === 'combat' && gameState.combatState) {
      const monster = gameState.combatState.monsters[0];
      if (!monster) {
        return { action: 'end_turn', delayMs: 600 };
      }

      const botCombatPower = calculateCombatPower(
        botPlayer,
        gameState.combatState.munchkinBonus,
        monster.card
      );
      const monsterPower = monster.currentStrength;
      const isWarrior = botPlayer.class === 'warrior';
      const isWinning = isWarrior ? botCombatPower >= monsterPower : botCombatPower > monsterPower;

      if (isWinning) {
        return {
          action: 'fight_monster',
          delayMs: 1000
        };
      }

      // If losing, check if bot has a potion in hand
      const combatPotion = botPlayer.hand.find(
        (c) => c.category === 'potion' && (c.bonus || 0) > 0
      );

      if (combatPotion && botCombatPower + (combatPotion.bonus || 0) > monsterPower) {
        return {
          action: 'play_card',
          cardId: combatPotion.id,
          delayMs: 700
        };
      }

      // If still losing, attempt to flee
      return {
        action: 'flee_monster',
        delayMs: 900
      };
    }

    // Phase 3: Look for trouble / Loot room
    if (gameState.phase === 'look_for_trouble') {
      // Check if bot can equip any weapons / armor first
      for (const card of botPlayer.hand) {
        if (card.category === 'equipment') {
          const check = canEquipItem(botPlayer, card);
          if (check.canEquip) {
            return {
              action: 'equip_card',
              cardId: card.id,
              delayMs: 600
            };
          }
        }
      }

      // Check if bot has a weak monster in hand it can easily beat
      const currentPower = calculateCombatPower(botPlayer);
      const beatableMonster = botPlayer.hand.find(
        (c) => c.category === 'monster' && (c.monsterLevel || 99) < currentPower
      );

      if (beatableMonster) {
        return {
          action: 'play_card',
          cardId: beatableMonster.id,
          delayMs: 800
        };
      }

      // Otherwise loot the room
      return {
        action: 'loot_room',
        delayMs: 700
      };
    }

    // Phase 4: Charity or End turn
    if (gameState.phase === 'charity') {
      // Try equip anything possible before discarding
      for (const card of botPlayer.hand) {
        if (card.category === 'equipment') {
          const check = canEquipItem(botPlayer, card);
          if (check.canEquip) {
            return {
              action: 'equip_card',
              cardId: card.id,
              delayMs: 500
            };
          }
        }
        if (card.category === 'go_up_level' && botPlayer.level < 9) {
          return {
            action: 'play_card',
            cardId: card.id,
            delayMs: 500
          };
        }
      }

      return {
        action: 'end_turn',
        delayMs: 600
      };
    }
  }

  // 2. If it's another player's turn and they are in combat
  if (!isBotActive && gameState.phase === 'combat' && gameState.combatState) {
    const activePlayer = gameState.players[gameState.activePlayerIndex];
    // If active player is at level 9 (match point!), try to sabotage with monster buffs!
    if (activePlayer && activePlayer.level >= 9) {
      const monsterBuff = botPlayer.hand.find(
        (c) => c.category === 'modifier' && (c.bonus || 0) > 0
      );
      if (monsterBuff) {
        return {
          action: 'play_card',
          cardId: monsterBuff.id,
          delayMs: 1200
        };
      }
    }
  }

  return null;
}
