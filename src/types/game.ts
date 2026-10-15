export type DeckType = 'doors' | 'treasures';

export type CardCategory =
  | 'monster'
  | 'curse'
  | 'class'
  | 'race'
  | 'modifier'
  | 'equipment'
  | 'potion'
  | 'go_up_level'
  | 'special';

export type ItemSlot = 'head' | 'armor' | 'footwear' | 'one_hand' | 'two_hands' | 'item';

export type MunchkinClass = 'none' | 'warrior' | 'wizard' | 'thief' | 'cleric';
export type MunchkinRace = 'human' | 'elf' | 'dwarf' | 'halfling';
export type PlayerGender = 'male' | 'female';

export type DungeonTheme = 'dungeon' | 'bridge' | 'crypt';
export type GameMode = 'classic' | 'blitz' | 'ranked';

export interface Card {
  id: string;
  name: string;
  deck: DeckType;
  category: CardCategory;
  bonus?: number; // Equipment or potion combat bonus
  gold?: number; // Gold value (e.g. 400 Gold, or 0 for "No Value")
  slot?: ItemSlot;
  isBigItem?: boolean; // Большой шмот (только 1, если не Дварф)
  usableByClass?: MunchkinClass[];
  usableByRace?: MunchkinRace[];
  usableByGender?: PlayerGender;
  
  // Monster attributes
  monsterLevel?: number;
  monsterTreasures?: number; // How many treasures awarded
  monsterLevelsReward?: number; // Usually 1, or 2 for high level dragons/bosses
  badStuff?: string; // Text description
  badStuffEffect?:
    | 'lose_level'
    | 'lose_head'
    | 'lose_armor'
    | 'lose_footwear'
    | 'lose_all_items'
    | 'death'
    | 'discard_hand'
    | 'lose_two_levels';
  isUndead?: boolean; // For cleric +3 turning bonus
  monsterBonusAgainst?: {
    class?: MunchkinClass;
    race?: MunchkinRace;
    bonus: number; // e.g. +5 against Wizards
  };

  // Curse attributes
  curseEffect?:
    | 'lose_level'
    | 'lose_head'
    | 'lose_armor'
    | 'lose_footwear'
    | 'lose_hand_weapon'
    | 'change_gender'
    | 'lose_all_big_items';

  // Details & UI
  description: string;
  flavorText?: string;
  iconName?: string;
  bgGradient?: string;
  artType?: string; // For John Kovalic comic art
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  isBot?: boolean;
  level: number; // 1 to 10
  gender: PlayerGender;
  class: MunchkinClass;
  race: MunchkinRace;
  hand: Card[];
  equipped: Card[]; // Active gear (gives power)
  carried: Card[]; // Items in play but carried/sideways (backpack)
  gold: number;
  isReady?: boolean;
  isConnected?: boolean;
  runawayBonus?: number; // e.g. boots give +2
  extraHandSlots?: number; // standard is 2
  berserkDiscardsUsed?: number; // Warrior ability: up to 3 per combat
  halflingSoldThisTurn?: boolean; // Halfling ability: 1 item at 2x per turn
}

export type TurnPhase =
  | 'waiting'
  | 'kick_door'          // Opening first door
  | 'combat'             // Fighting monster
  | 'runaway'            // Trying to flee
  | 'look_for_trouble'   // Fighting monster from hand OR loot room
  | 'charity'            // Discard/pass down to 5 (or 6 for Dwarf)
  | 'game_over';

export interface CombatMonster {
  card: Card;
  currentStrength: number;
  modifiers: {
    name: string;
    value: number;
    playedBy: string;
  }[];
}

export interface CombatState {
  monsters: CombatMonster[]; // Supports Wandering Monster (2 monsters!)
  munchkinBonus: number; // Potions / cards played in fight
  munchkinModifiers: {
    name: string;
    value: number;
    playedBy: string;
  }[];
  helperPlayerId?: string; // Player helping in combat
  helperTreasuresAgreed?: number; // Treasure split agreed
  helperBonus?: number;
  fleeStatus?: {
    [playerId: string]: {
      rolled?: number;
      success?: boolean;
      retriesLeft?: number; // Halfling gets 1 retry
    };
  };
}

export interface GameLogEntry {
  id: string;
  timestamp: number;
  playerId?: string;
  playerName?: string;
  type: 'info' | 'combat' | 'curse' | 'equip' | 'level' | 'chat' | 'dice';
  text: string;
  cardName?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

export interface GameState {
  roomId: string;
  roomName: string;
  isHost: boolean;
  theme: DungeonTheme;
  mode: GameMode;
  phase: TurnPhase;
  players: Player[];
  activePlayerIndex: number;
  doorDeckCount: number;
  treasureDeckCount: number;
  doorDiscard: Card[];
  treasureDiscard: Card[];
  currentTurnCard?: Card; // Card revealed when kicking door
  combatState?: CombatState;
  logs: GameLogEntry[];
  chat: ChatMessage[];
  turnNumber: number;
  winnerId?: string;
  turnTimeLeft?: number; // For Blitz mode
  diceRollResult?: {
    value: number;
    playerId: string;
    purpose: 'runaway' | 'steal' | 'curse';
    success: boolean;
  };
}

export interface YandexPlayerProfile {
  id: string;
  name: string;
  avatarUrl: string;
  isAuthorized: boolean;
  coins: number;
  ratingScore: number; // MMR e.g. 1250
  rankTitle: string; // "Золотой Драконоборец"
  stats?: {
    gamesPlayed: number;
    wins: number;
    monstersSlain: number;
    highestLevel: number;
    cursesCast: number;
    helpsGiven: number;
    goldAccumulated: number;
  };
}
