import React, { useState, useEffect, useRef } from 'react';
import {
  GameState,
  Player,
  Card,
  YandexPlayerProfile,
  TurnPhase,
  CombatState,
  DungeonTheme,
  GameMode
} from './types/game.ts';
import { INITIAL_DOOR_CARDS, INITIAL_TREASURE_CARDS, shuffleDeck } from './game/cardsData.ts';
import {
  calculateCombatPower,
  canEquipItem,
  equipItem,
  unequipItem,
  resolveCombat,
  resolveRunawayRoll,
  applyBadStuff,
  checkWinCondition
} from './game/rules.ts';
import { decideBotAction } from './game/botAI.ts';
import {
  initYandexGames,
  savePlayerStats,
  savePlayerMeta
} from './services/yandexGames.ts';
import { SoundEngine } from './services/audio.ts';

// UI Components
import { LobbyScreen } from './components/LobbyScreen.tsx';
import { DungeonScene } from './components/DungeonScene.tsx';
import { PlayerInventory } from './components/PlayerInventory.tsx';
import { HandCardsFan } from './components/HandCardsFan.tsx';
import { BattleLog } from './components/BattleLog.tsx';
import { DiceRoller } from './components/DiceRoller.tsx';
import { SellGoldModal } from './components/SellGoldModal.tsx';
import { RulesModal } from './components/RulesModal.tsx';
import { VictoryModal } from './components/VictoryModal.tsx';
import { DungeonThemeSelector } from './components/DungeonThemeSelector.tsx';
import { RatingEconomyModal } from './components/RatingEconomyModal.tsx';
import { PotionsCombatModal } from './components/PotionsCombatModal.tsx';
import { TroubleModal } from './components/TroubleModal.tsx';

import {
  Volume2,
  VolumeX,
  Maximize2,
  BookOpen,
  LogOut,
  Sparkles,
  Trophy,
  Timer
} from 'lucide-react';

export default function App() {
  const [inGame, setInGame] = useState(false);
  const [playerProfile, setPlayerProfile] = useState<YandexPlayerProfile>({
    id: 'guest_1',
    name: 'Манчкин Новичок',
    avatarUrl: '',
    isAuthorized: false,
    coins: 500,
    ratingScore: 1250,
    rankTitle: 'Золотой Драконоборец',
    stats: {
      gamesPlayed: 0,
      wins: 0,
      monstersSlain: 0,
      highestLevel: 1,
      cursesCast: 0,
      helpsGiven: 0,
      goldAccumulated: 0
    }
  });

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<DungeonTheme>('dungeon');
  const [gameMode, setGameMode] = useState<GameMode>('classic');

  const [isMuted, setIsMuted] = useState(SoundEngine.getIsMuted());
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isThemeSelectorOpen, setIsThemeSelectorOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isPotionsModalOpen, setIsPotionsModalOpen] = useState(false);
  const [isTroubleModalOpen, setIsTroubleModalOpen] = useState(false);

  // Dice Roller Modal state
  const [diceModal, setDiceModal] = useState<{
    isOpen: boolean;
    modifier: number;
    purpose: 'runaway' | 'steal' | 'curse';
    onResolved: (roll: number, success: boolean) => void;
  }>({
    isOpen: false,
    modifier: 0,
    purpose: 'runaway',
    onResolved: () => {}
  });

  // WebSocket for real-time rooms
  const wsRef = useRef<WebSocket | null>(null);

  // Initialize Yandex Games SDK on mount
  useEffect(() => {
    initYandexGames().then((res) => {
      setPlayerProfile(res.profile);
    });

    // Check query params: autostart=1
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('autostart') === '1') {
      startSinglePlayerGame(2);
    }
  }, []);

  // Blitz mode countdown timer (30s)
  useEffect(() => {
    if (!gameState || gameState.mode !== 'blitz' || gameState.phase === 'game_over') return;

    const timer = setInterval(() => {
      setGameState((prev) => {
        if (!prev || prev.mode !== 'blitz') return prev;
        const currentLeft = prev.turnTimeLeft ?? 30;
        if (currentLeft <= 1) {
          if (prev.phase === 'combat') {
            handleRunaway();
          } else {
            handleNextTurn();
          }
          return { ...prev, turnTimeLeft: 30 };
        }
        return { ...prev, turnTimeLeft: currentLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState?.phase, gameState?.activePlayerIndex, gameState?.mode]);

  // Bot Turn Automation Loop
  useEffect(() => {
    if (!gameState || gameState.phase === 'game_over') return;

    const activePlayer = gameState.players[gameState.activePlayerIndex];
    if (!activePlayer || !activePlayer.isBot) return;

    const decision = decideBotAction(gameState, activePlayer);
    if (!decision) return;

    const timer = setTimeout(() => {
      switch (decision.action) {
        case 'kick_door':
          handleKickDoor();
          break;
        case 'fight_monster':
          handleFightMonster();
          break;
        case 'flee_monster':
          handleRunaway();
          break;
        case 'loot_room':
          handleLootRoom();
          break;
        case 'play_card':
          if (decision.cardId) handlePlayCard(decision.cardId);
          break;
        case 'equip_card':
          if (decision.cardId) handleEquipCard(decision.cardId);
          break;
        case 'end_turn':
          handleNextTurn();
          break;
      }
    }, decision.delayMs);

    return () => clearTimeout(timer);
  }, [gameState]);

  // Setup singleplayer game against smart AI bots
  const startSinglePlayerGame = (botCount: number = 2) => {
    const doorDeck = shuffleDeck(INITIAL_DOOR_CARDS);
    const treasureDeck = shuffleDeck(INITIAL_TREASURE_CARDS);

    // Human player
    const humanPlayer: Player = {
      id: playerProfile.id,
      name: playerProfile.name,
      avatar: '🧙‍♂️',
      level: 1,
      gender: 'male',
      class: 'none',
      race: 'human',
      hand: [],
      equipped: [],
      carried: [],
      gold: 0,
      runawayBonus: 0
    };

    // Bot contenders
    const botArchetypes = [
      { name: 'Гоблин Вася', avatar: '👺', gender: 'male' as const },
      { name: 'Эльфийка Луна', avatar: '🧝‍♀️', gender: 'female' as const },
      { name: 'Дварф Торин', avatar: '🧔', gender: 'male' as const },
      { name: 'Вор Ловкач', avatar: '🦹', gender: 'male' as const }
    ];

    const players: Player[] = [humanPlayer];
    for (let i = 0; i < botCount; i++) {
      const arch = botArchetypes[i % botArchetypes.length];
      players.push({
        id: `bot_${i + 1}`,
        name: arch.name,
        avatar: arch.avatar,
        isBot: true,
        level: 1,
        gender: arch.gender,
        class: 'none',
        race: 'human',
        hand: [],
        equipped: [],
        carried: [],
        gold: 0,
        runawayBonus: 0
      });
    }

    // Deal starting hands: 4 door cards and 4 treasure cards to each player!
    for (const p of players) {
      p.hand.push(...doorDeck.splice(0, 4));
      p.hand.push(...treasureDeck.splice(0, 4));
    }

    const newGameState: GameState = {
      roomId: 'local_' + Math.random().toString(36).substring(2, 7),
      roomName: 'Одиночная игра',
      isHost: true,
      theme: selectedTheme,
      mode: gameMode,
      phase: 'kick_door',
      players,
      activePlayerIndex: 0,
      doorDeckCount: doorDeck.length,
      treasureDeckCount: treasureDeck.length,
      doorDiscard: [],
      treasureDiscard: [],
      logs: [
        {
          id: 'log_0',
          timestamp: Date.now(),
          type: 'info',
          text: '🚪 Подземелье открыто! Каждый получил по 4 двери и 4 сокровища. Выбивай первую дверь!'
        }
      ],
      chat: [],
      turnNumber: 1,
      turnTimeLeft: gameMode === 'blitz' ? 30 : undefined
    };

    // Store remaining decks in state closure
    (newGameState as any)._doorDeck = doorDeck;
    (newGameState as any)._treasureDeck = treasureDeck;

    setGameState(newGameState);
    setInGame(true);
    SoundEngine.playCardFlip();
  };

  // Create real-time room
  const handleCreateRoom = (roomCode: string) => {
    startSinglePlayerGame(1);
    connectToWebSocket(roomCode);
  };

  // Join room by code
  const handleJoinRoom = (roomCode: string) => {
    startSinglePlayerGame(1);
    connectToWebSocket(roomCode);
  };

  const connectToWebSocket = (roomCode: string) => {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/ws`;
      const ws = new WebSocket(wsUrl);

      ws.onerror = () => {
        // Silently fallback if websocket is blocked or offline
      };

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            type: 'JOIN_ROOM',
            payload: {
              roomCode,
              player: { id: playerProfile.id, name: playerProfile.name }
            }
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'NEW_CHAT') {
            setGameState((prev) =>
              prev ? { ...prev, chat: [...prev.chat, msg.payload.message] } : null
            );
          }
        } catch {
          // Ignore
        }
      };

      wsRef.current = ws;
    } catch (e) {
      console.warn('WebSocket connection error:', e);
    }
  };

  // Helper to add log
  const addLog = (text: string, type: GameState['logs'][0]['type'] = 'info') => {
    setGameState((prev) => {
      if (!prev) return null;
      const activePlayer = prev.players[prev.activePlayerIndex];
      const entry = {
        id: 'log_' + Date.now() + Math.random(),
        timestamp: Date.now(),
        playerName: activePlayer?.name,
        type,
        text
      };
      return {
        ...prev,
        logs: [...prev.logs, entry]
      };
    });
  };

  // 1. Kick Door Action
  const handleKickDoor = () => {
    if (!gameState || gameState.phase !== 'kick_door') return;

    SoundEngine.playDoorOpen();

    const doorDeck: Card[] = (gameState as any)._doorDeck || [];
    let revealedCard = doorDeck.shift();

    if (!revealedCard) {
      const fresh = shuffleDeck(INITIAL_DOOR_CARDS);
      revealedCard = fresh.shift()!;
      (gameState as any)._doorDeck = fresh;
    }

    const activePlayer = gameState.players[gameState.activePlayerIndex];

    if (revealedCard.category === 'monster') {
      // Monster combat begins!
      const combat: CombatState = {
        monsters: [
          {
            card: revealedCard,
            currentStrength: revealedCard.monsterLevel || 1,
            modifiers: []
          }
        ],
        munchkinBonus: 0,
        munchkinModifiers: []
      };

      setGameState((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          phase: 'combat',
          currentTurnCard: revealedCard,
          combatState: combat,
          doorDeckCount: doorDeck.length
        };
      });

      SoundEngine.playCombatHit();
      addLog(`👹 ${activePlayer.name} открывает дверь: Монстр «${revealedCard.name}» (Ур. ${revealedCard.monsterLevel})!`, 'combat');
    } else if (revealedCard.category === 'curse') {
      // Curse triggers immediately
      SoundEngine.playCurse();
      const { updatedPlayer, message } = applyBadStuff(activePlayer, revealedCard);

      setGameState((prev) => {
        if (!prev) return null;
        const newPlayers = [...prev.players];
        newPlayers[prev.activePlayerIndex] = updatedPlayer;
        return {
          ...prev,
          phase: 'look_for_trouble',
          currentTurnCard: revealedCard,
          players: newPlayers,
          doorDiscard: [...prev.doorDiscard, revealedCard!],
          doorDeckCount: doorDeck.length
        };
      });

      addLog(`⚡ ПРОКЛЯТИЕ! ${activePlayer.name} получает ${revealedCard.name}: ${message}`, 'curse');
    } else {
      // Non-monster card (Class, Race, Modifier, Equipment)
      activePlayer.hand.push(revealedCard);

      setGameState((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          phase: 'look_for_trouble',
          currentTurnCard: revealedCard,
          doorDeckCount: doorDeck.length
        };
      });

      addLog(`📜 ${activePlayer.name} находит карту: «${revealedCard.name}» и берет её в руку.`);
    }
  };

  // 2. Fight Monster (Claim Victory)
  const handleFightMonster = () => {
    if (!gameState || gameState.phase !== 'combat' || !gameState.combatState) return;

    const activePlayer = gameState.players[gameState.activePlayerIndex];
    const monster = gameState.combatState.monsters[0];
    if (!monster) return;

    SoundEngine.playCombatWin();

    const levelsWon = monster.card.monsterLevelsReward || 1;
    const treasuresWon = monster.card.monsterTreasures || 1;
    const newLevel = activePlayer.level + levelsWon;

    // Draw treasures
    const treasureDeck: Card[] = (gameState as any)._treasureDeck || [];
    const drawnTreasures = treasureDeck.splice(0, treasuresWon);

    const updatedPlayer: Player = {
      ...activePlayer,
      level: newLevel,
      hand: [...activePlayer.hand, ...drawnTreasures]
    };

    // Check Win Condition: Level 10
    const isWinner = checkWinCondition(updatedPlayer);

    const updatedPlayers = [...gameState.players];
    updatedPlayers[gameState.activePlayerIndex] = updatedPlayer;

    // If helper was present, reward elf or split
    if (gameState.combatState.helperPlayerId) {
      const helperIdx = updatedPlayers.findIndex(
        (p) => p.id === gameState.combatState?.helperPlayerId
      );
      if (helperIdx !== -1 && updatedPlayers[helperIdx].race === 'elf') {
        updatedPlayers[helperIdx] = {
          ...updatedPlayers[helperIdx],
          level: Math.min(10, updatedPlayers[helperIdx].level + 1)
        };
        addLog(`🧝 Эльф ${updatedPlayers[helperIdx].name} получает +1 уровень за помощь в бою!`, 'level');
      }
    }

    setGameState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        players: updatedPlayers,
        phase: isWinner ? 'game_over' : 'charity',
        winnerId: isWinner ? updatedPlayer.id : undefined,
        currentTurnCard: undefined,
        combatState: undefined,
        treasureDeckCount: treasureDeck.length
      };
    });

    addLog(`⚔️ ПОБЕДА! ${activePlayer.name} сразил «${monster.card.name}»! Получает +${levelsWon} ур. и ${treasuresWon} сокровищ.`, 'level');

    if (isWinner) {
      setTimeout(() => {
        SoundEngine.playVictory();
      }, 350);

      addLog(`🏆 ИГРА ОКОНЧЕНА! ${updatedPlayer.name} достиг 10-го Уровня и ПОБЕДИЛ!`, 'level');

      const isMeWinner = updatedPlayer.id === playerProfile.id;
      const mmrGain = isMeWinner ? (gameMode === 'ranked' ? 50 : 25) : -15;
      const coinsGain = isMeWinner ? (gameMode === 'ranked' ? 120 : 60) : 15;

      const updatedStats = {
        gamesPlayed: (playerProfile.stats?.gamesPlayed || 0) + 1,
        wins: (playerProfile.stats?.wins || 0) + (isMeWinner ? 1 : 0),
        monstersSlain: (playerProfile.stats?.monstersSlain || 0) + (isMeWinner ? 1 : 0),
        highestLevel: Math.max(playerProfile.stats?.highestLevel || 1, updatedPlayer.level),
        cursesCast: playerProfile.stats?.cursesCast || 0,
        helpsGiven: playerProfile.stats?.helpsGiven || 0,
        goldAccumulated: (playerProfile.stats?.goldAccumulated || 0) + (updatedPlayer.gold || 0)
      };

      const updatedCoins = Math.max(0, (playerProfile.coins || 500) + coinsGain);
      const updatedRating = Math.max(100, (playerProfile.ratingScore || 1250) + mmrGain);

      setPlayerProfile((prev) => ({
        ...prev,
        stats: updatedStats,
        coins: updatedCoins,
        ratingScore: updatedRating
      }));

      savePlayerStats(updatedStats);
      savePlayerMeta({
        coins: updatedCoins,
        ratingScore: updatedRating,
        rankTitle: playerProfile.rankTitle
      });
    }
  };

  // 3. Runaway Action (Смывка d6)
  const handleRunaway = () => {
    if (!gameState || gameState.phase !== 'combat' || !gameState.combatState) return;

    const activePlayer = gameState.players[gameState.activePlayerIndex];
    const runawayBonus = activePlayer.runawayBonus || 0;

    setDiceModal({
      isOpen: true,
      modifier: runawayBonus,
      purpose: 'runaway',
      onResolved: (roll, success) => {
        setDiceModal((m) => ({ ...m, isOpen: false }));

        if (success) {
          SoundEngine.playFleeSuccess();
          addLog(`🏃 ${activePlayer.name} успешно смылся от монстра! (Бросок: ${roll} + бонус ${runawayBonus})`);
          handleNextTurn();
        } else {
          SoundEngine.playCombatLoss();
          // Apply Bad Stuff
          const monster = gameState.combatState?.monsters[0];
          if (monster) {
            const { updatedPlayer, message } = applyBadStuff(activePlayer, monster.card);
            setGameState((prev) => {
              if (!prev) return null;
              const newPlayers = [...prev.players];
              newPlayers[prev.activePlayerIndex] = updatedPlayer;
              return { ...prev, players: newPlayers };
            });
            addLog(`💀 ПРОВАЛ СМЫВКИ! Непотребство монстра «${monster.card.name}»: ${message}`, 'combat');
          }
          handleNextTurn();
        }
      }
    });
  };

  // 4. Loot Room Action (Чистить нычки)
  const handleLootRoom = () => {
    if (!gameState || gameState.phase !== 'look_for_trouble') return;

    SoundEngine.playDoorOpen();
    const doorDeck: Card[] = (gameState as any)._doorDeck || [];
    const card = doorDeck.shift();

    if (card) {
      const activePlayer = gameState.players[gameState.activePlayerIndex];
      activePlayer.hand.push(card);
      addLog(`📦 ${activePlayer.name} чистит нычки и берет 2-ю карту дверей в закрытую.`);
    }

    setGameState((prev) => (prev ? { ...prev, phase: 'charity' } : null));
  };

  // 5. Look for Trouble (Monster from hand)
  const handlePlayMonsterFromHand = (monsterCardId: string) => {
    if (!gameState) return;
    const activePlayer = gameState.players[gameState.activePlayerIndex];
    const monsterCard = activePlayer.hand.find((c) => c.id === monsterCardId);
    if (!monsterCard) return;

    // Remove from hand
    activePlayer.hand = activePlayer.hand.filter((c) => c.id !== monsterCardId);

    const combat: CombatState = {
      monsters: [
        {
          card: monsterCard,
          currentStrength: monsterCard.monsterLevel || 1,
          modifiers: []
        }
      ],
      munchkinBonus: 0,
      munchkinModifiers: []
    };

    setGameState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        phase: 'combat',
        combatState: combat,
        currentTurnCard: monsterCard
      };
    });

    SoundEngine.playCombatHit();
    addLog(`👹 ${activePlayer.name} ищет неприятности и выпускает из руки «${monsterCard.name}» (Ур. ${monsterCard.monsterLevel})!`, 'combat');
  };

  // 6. Equip Card from Hand
  const handleEquipCard = (cardId: string) => {
    if (!gameState) return;
    const activePlayer = gameState.players[gameState.activePlayerIndex];
    const card = activePlayer.hand.find((c) => c.id === cardId);
    if (!card) return;

    try {
      const updated = equipItem(activePlayer, card);
      const newPlayers = [...gameState.players];
      newPlayers[gameState.activePlayerIndex] = updated;

      setGameState((prev) => (prev ? { ...prev, players: newPlayers } : null));
      SoundEngine.playEquip();
      addLog(`🛡️ ${activePlayer.name} надевает «${card.name}» (+${card.bonus || 0} силы)`, 'equip');
    } catch (e: any) {
      console.warn(e.message);
    }
  };

  // 7. Carry Card in Backpack
  const handleCarryCard = (cardId: string) => {
    if (!gameState) return;
    const activePlayer = gameState.players[gameState.activePlayerIndex];
    const card = activePlayer.hand.find((c) => c.id === cardId);
    if (!card) return;

    activePlayer.hand = activePlayer.hand.filter((c) => c.id !== cardId);
    activePlayer.carried.push(card);
    SoundEngine.playEquip();
    addLog(`🎒 ${activePlayer.name} выкладывает шмотку «${card.name}» в рюкзак.`, 'equip');
    setGameState((prev) => (prev ? { ...prev, players: [...prev.players] } : null));
  };

  // 8. Equip from Backpack
  const handleEquipCarried = (cardId: string) => {
    if (!gameState) return;
    const activePlayer = gameState.players[gameState.activePlayerIndex];
    const card = activePlayer.carried.find((c) => c.id === cardId);
    if (!card) return;

    try {
      const updated = equipItem(activePlayer, card);
      updated.carried = updated.carried.filter((c) => c.id !== cardId);
      const newPlayers = [...gameState.players];
      newPlayers[gameState.activePlayerIndex] = updated;
      setGameState((prev) => (prev ? { ...prev, players: newPlayers } : null));
      SoundEngine.playEquip();
      addLog(`🛡️ ${activePlayer.name} надевает «${card.name}» из рюкзака (+${card.bonus || 0} силы)`, 'equip');
    } catch (e: any) {
      console.warn(e.message);
    }
  };

  // 9. Unequip Item
  const handleUnequipCard = (cardId: string) => {
    if (!gameState) return;
    SoundEngine.playCardDrop();
    const activePlayer = gameState.players[gameState.activePlayerIndex];
    const updated = unequipItem(activePlayer, cardId);
    const newPlayers = [...gameState.players];
    newPlayers[gameState.activePlayerIndex] = updated;

    setGameState((prev) => (prev ? { ...prev, players: newPlayers } : null));
  };

  // 10. Play Card (Potion / Level up / Class / Race)
  const handlePlayCard = (cardId: string) => {
    if (!gameState) return;
    const activePlayer = gameState.players[gameState.activePlayerIndex];
    const card = activePlayer.hand.find((c) => c.id === cardId);
    if (!card) return;

    activePlayer.hand = activePlayer.hand.filter((c) => c.id !== cardId);

    if (card.category === 'go_up_level') {
      if (activePlayer.level < 9) {
        activePlayer.level += 1;
        SoundEngine.playLevelUp();
        addLog(`⭐ ${activePlayer.name} играет «${card.name}» и получает +1 Уровень (стал ${activePlayer.level})!`, 'level');
      }
    } else if (card.category === 'class') {
      const classMap: Record<string, Player['class']> = {
        'door-cl-1': 'warrior',
        'door-cl-2': 'wizard',
        'door-cl-3': 'thief',
        'door-cl-4': 'cleric'
      };
      activePlayer.class = classMap[card.id] || 'none';
      SoundEngine.playEquip();
      addLog(`📜 ${activePlayer.name} берет ${card.name}!`, 'equip');
    } else if (card.category === 'race') {
      const raceMap: Record<string, Player['race']> = {
        'door-r-1': 'elf',
        'door-r-2': 'dwarf',
        'door-r-3': 'halfling'
      };
      activePlayer.race = raceMap[card.id] || 'human';
      SoundEngine.playEquip();
      addLog(`🧝 ${activePlayer.name} выбирает ${card.name}!`, 'equip');
    } else if (card.category === 'potion' || card.category === 'modifier') {
      if (gameState.combatState) {
        gameState.combatState.munchkinBonus += card.bonus || 2;
        SoundEngine.playPotion();
        addLog(`🧪 ${activePlayer.name} выпивает «${card.name}» (+${card.bonus || 2} к боевой силе)!`, 'combat');
      }
    }

    setGameState((prev) => (prev ? { ...prev, players: [...prev.players] } : null));
  };

  // Potion played for Monster
  const handlePlayPotionForMonster = (cardId: string) => {
    if (!gameState || !gameState.combatState) return;
    const activePlayer = gameState.players[gameState.activePlayerIndex];
    const card = activePlayer.hand.find((c) => c.id === cardId);
    if (!card) return;

    activePlayer.hand = activePlayer.hand.filter((c) => c.id !== cardId);
    const monster = gameState.combatState.monsters[0];
    if (monster) {
      monster.currentStrength += card.bonus || 2;
      monster.modifiers.push({
        name: card.name,
        value: card.bonus || 2,
        playedBy: activePlayer.name
      });
      SoundEngine.playPotion();
      SoundEngine.playCombatHit();
      addLog(`🔥 ${activePlayer.name} усиливает монстра картой «${card.name}» (+${card.bonus || 2} к силе монстра)!`, 'combat');
    }

    setGameState((prev) => (prev ? { ...prev, players: [...prev.players], combatState: { ...prev.combatState! } } : null));
  };

  // Drag and Drop card onto Dungeon battlefield
  const handleDropCardOnDungeon = (cardId: string) => {
    if (!gameState) return;
    const activePlayer = gameState.players[gameState.activePlayerIndex];
    if (activePlayer.id !== playerProfile.id) return;
    const card = activePlayer.hand.find((c) => c.id === cardId);
    if (!card) return;

    if (gameState.phase === 'combat') {
      if (card.category === 'potion' || card.category === 'modifier') {
        handlePlayCard(cardId);
      } else if (card.category === 'equipment') {
        const canEq = canEquipItem(activePlayer, card).canEquip;
        if (canEq) handleEquipCard(cardId);
        else handleCarryCard(cardId);
      }
    } else if (gameState.phase === 'look_for_trouble') {
      if (card.category === 'monster') {
        handlePlayMonsterFromHand(cardId);
      } else if (card.category === 'equipment') {
        const canEq = canEquipItem(activePlayer, card).canEquip;
        if (canEq) handleEquipCard(cardId);
        else handleCarryCard(cardId);
      } else {
        handlePlayCard(cardId);
      }
    } else {
      if (card.category === 'equipment') {
        const canEq = canEquipItem(activePlayer, card).canEquip;
        if (canEq) handleEquipCard(cardId);
        else handleCarryCard(cardId);
      } else {
        handlePlayCard(cardId);
      }
    }
  };

  // Warrior Berserk ability
  const handleWarriorBerserk = () => {
    if (!gameState || !gameState.combatState) return;
    const activePlayer = gameState.players[gameState.activePlayerIndex];
    if (activePlayer.class !== 'warrior' || activePlayer.hand.length === 0) return;

    const used = activePlayer.berserkDiscardsUsed || 0;
    if (used >= 3) {
      return;
    }

    const discardedCard = activePlayer.hand.pop();
    activePlayer.berserkDiscardsUsed = used + 1;
    gameState.combatState.munchkinBonus += 1;

    SoundEngine.playCombatHit();
    addLog(`⚔️ ${activePlayer.name} (Воин) впадает в БЕРСЕРК! Сбрасывает «${discardedCard?.name}» и получает +1 к силе!`, 'combat');
    setGameState((prev) => (prev ? { ...prev, players: [...prev.players], combatState: { ...prev.combatState! } } : null));
  };

  // Wizard Charm ability
  const handleWizardCharm = () => {
    if (!gameState || !gameState.combatState) return;
    const activePlayer = gameState.players[gameState.activePlayerIndex];
    if (activePlayer.class !== 'wizard') return;

    if (activePlayer.hand.length < 3) {
      return;
    }

    const monster = gameState.combatState.monsters[0];
    if (!monster) return;

    // Discard entire hand
    activePlayer.hand = [];
    SoundEngine.playPotion();
    setTimeout(() => {
      SoundEngine.playCombatWin();
    }, 180);

    const treasuresWon = monster.card.monsterTreasures || 1;
    const treasureDeck: Card[] = (gameState as any)._treasureDeck || [];
    const drawnTreasures = treasureDeck.splice(0, treasuresWon);
    activePlayer.hand = drawnTreasures;

    addLog(`🪄 ${activePlayer.name} (Волшебник) творит УСМИРЕНИЕ! Монстр «${monster.card.name}» очарован и уходит без боя! Манчкин забирает ${treasuresWon} сокровищ (без уровня).`, 'combat');

    setGameState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        phase: 'charity',
        currentTurnCard: undefined,
        combatState: undefined,
        treasureDeckCount: treasureDeck.length
      };
    });
  };

  // Ask for Help
  const handleAskHelp = () => {
    if (!gameState || !gameState.combatState) return;
    const activePlayer = gameState.players[gameState.activePlayerIndex];
    // Find highest combat power other player
    const others = gameState.players.filter((p) => p.id !== activePlayer.id);
    if (others.length === 0) return;

    const helper = others[0];
    const helperBonus = calculateCombatPower(helper);

    gameState.combatState.helperPlayerId = helper.id;
    gameState.combatState.helperBonus = helperBonus;
    gameState.combatState.helperTreasuresAgreed = 1;

    setGameState((prev) => (prev ? { ...prev, combatState: { ...gameState.combatState! } } : null));
    addLog(`🤝 ${helper.name} приходит на помощь! Его боевая сила (+${helperBonus}) присоединяется к бою!`, 'combat');
  };

  // Sell Items for Gold
  const handleSellItems = (selectedCardIds: string[], levelsGained: number) => {
    if (!gameState) return;
    const activePlayer = gameState.players[gameState.activePlayerIndex];

    activePlayer.hand = activePlayer.hand.filter((c) => !selectedCardIds.includes(c.id));
    activePlayer.equipped = activePlayer.equipped.filter((c) => !selectedCardIds.includes(c.id));
    activePlayer.carried = activePlayer.carried.filter((c) => !selectedCardIds.includes(c.id));
    activePlayer.level = Math.min(9, activePlayer.level + levelsGained);

    SoundEngine.playCoins();
    if (levelsGained > 0) {
      setTimeout(() => {
        SoundEngine.playLevelUp();
      }, 250);
    }
    addLog(`💰 ${activePlayer.name} продает шмоток на золото и поднимает ${levelsGained} Ур. (стал ${activePlayer.level})!`, 'level');
    setGameState((prev) => (prev ? { ...prev, players: [...prev.players] } : null));
  };

  // Advance to Next Turn
  const handleNextTurn = () => {
    if (!gameState) return;

    const nextIndex = (gameState.activePlayerIndex + 1) % gameState.players.length;
    const nextPlayer = gameState.players[nextIndex];

    // Reset turn flags on player
    nextPlayer.berserkDiscardsUsed = 0;
    nextPlayer.halflingSoldThisTurn = false;

    setGameState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        activePlayerIndex: nextIndex,
        phase: 'kick_door',
        currentTurnCard: undefined,
        combatState: undefined,
        turnNumber: prev.turnNumber + 1,
        turnTimeLeft: prev.mode === 'blitz' ? 30 : undefined
      };
    });

    addLog(`🔔 Ход переходит к игроку: ${nextPlayer.name}! Выбивай дверь!`);
  };

  // Send Chat message
  const handleSendChat = (text: string) => {
    if (!gameState) return;
    const msg = {
      id: 'chat_' + Date.now(),
      senderId: playerProfile.id,
      senderName: playerProfile.name,
      text,
      timestamp: Date.now()
    };

    setGameState((prev) => (prev ? { ...prev, chat: [...prev.chat, msg] } : null));

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'CHAT', payload: { message: msg } }));
    }
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const next = SoundEngine.toggleMute();
    setIsMuted(next);
  };

  // Buy title in shop
  const handleBuyTitle = (title: string, cost: number) => {
    if (playerProfile.coins < cost) return;
    const newCoins = playerProfile.coins - cost;
    const updated = {
      ...playerProfile,
      coins: newCoins,
      rankTitle: title
    };
    setPlayerProfile(updated);
    savePlayerMeta({
      coins: newCoins,
      ratingScore: playerProfile.ratingScore,
      rankTitle: title
    });
    SoundEngine.playVictory();
  };

  // If not in game, render Lobby / Title screen
  if (!inGame || !gameState) {
    return (
      <>
        <LobbyScreen
          playerProfile={playerProfile}
          onUpdateProfile={setPlayerProfile}
          onStartSinglePlayer={startSinglePlayerGame}
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          onOpenRules={() => setIsRulesOpen(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onOpenRatingModal={() => setIsRatingModalOpen(true)}
          onOpenThemeSelector={() => setIsThemeSelectorOpen(true)}
          gameMode={gameMode}
          onChangeGameMode={setGameMode}
          currentTheme={selectedTheme}
        />

        <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
        <DungeonThemeSelector
          isOpen={isThemeSelectorOpen}
          currentTheme={selectedTheme}
          onSelectTheme={(th) => {
            setSelectedTheme(th);
            setIsThemeSelectorOpen(false);
          }}
          onClose={() => setIsThemeSelectorOpen(false)}
        />
        <RatingEconomyModal
          isOpen={isRatingModalOpen}
          profile={playerProfile}
          onClose={() => setIsRatingModalOpen(false)}
          onBuyTitle={handleBuyTitle}
        />
      </>
    );
  }

  const activePlayer = gameState.players[gameState.activePlayerIndex];
  const myPlayer = gameState.players.find((p) => p.id === playerProfile.id) || gameState.players[0];
  const isMyTurn = activePlayer?.id === myPlayer.id;

  return (
    <div className="relative w-full h-screen dungeon-bg dungeon-stone-pattern flex flex-col justify-between overflow-hidden text-[#f4ecd8] select-none font-fantasy">
      {/* Torch lighting vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/80 pointer-events-none" />

      {/* Top Bar: Room info, Blitz timer, Utility buttons */}
      <header className="relative z-10 w-full bg-gradient-to-r from-[#22130a]/95 via-[#160c07]/95 to-[#22130a]/95 border-b-2 border-amber-800/80 px-3 py-1.5 flex items-center justify-between shadow-[0_4px_16px_rgba(0,0,0,0.8)] backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="font-fantasy font-black text-base tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            МАНЧКИН
          </div>
          <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-md bg-stone-900 border border-stone-700 text-amber-200/80 shadow-inner">
            Ход #{gameState.turnNumber}
          </span>
          {gameState.mode === 'blitz' && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-950 border border-rose-700 text-rose-300 flex items-center gap-1 animate-pulse">
              <Timer className="w-3 h-3" />
              {gameState.turnTimeLeft ?? 30}с
            </span>
          )}
          {gameState.mode === 'ranked' && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-yellow-950/80 border border-yellow-600 text-yellow-300 hidden sm:inline">
              🏆 Рейтинговый матч
            </span>
          )}
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              SoundEngine.playButtonClick();
              setIsThemeSelectorOpen(true);
            }}
            className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-700/60 cursor-pointer transition-transform hover:scale-105"
            title="Сменить фон подземелья"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={() => {
              SoundEngine.playButtonClick();
              setIsRatingModalOpen(true);
            }}
            className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-700/60 cursor-pointer transition-transform hover:scale-105"
            title="Рейтинг и Монеты"
          >
            <Trophy className="w-4 h-4 text-yellow-400" />
          </button>

          <button
            onClick={() => {
              SoundEngine.playButtonClick();
              setIsRulesOpen(true);
            }}
            className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-700/60 cursor-pointer transition-transform hover:scale-105"
            title="Правила"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          <button
            onClick={handleToggleMute}
            className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-700/60 cursor-pointer transition-transform hover:scale-105"
            title="Звук"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={() => {
              SoundEngine.playButtonClick();
              if (confirm('Покинуть игру и вернуться в лобби?')) {
                setInGame(false);
              }
            }}
            className="p-1.5 rounded-lg bg-stone-900 hover:bg-rose-950 text-stone-400 hover:text-rose-400 border border-stone-800 transition-colors cursor-pointer"
            title="Выйти в лобби"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Authentic Dungeon Stage (Doors & Treasures) */}
      <main className="relative z-10 flex-1 w-full flex flex-col overflow-hidden">
        <DungeonScene
          gameState={gameState}
          activePlayer={activePlayer}
          myPlayer={myPlayer}
          isMyTurn={isMyTurn}
          onKickDoor={handleKickDoor}
          onFightMonster={handleFightMonster}
          onRunaway={handleRunaway}
          onAskHelp={handleAskHelp}
          onOpenPotionsModal={() => {
            SoundEngine.playPotion();
            setIsPotionsModalOpen(true);
          }}
          onWarriorBerserk={handleWarriorBerserk}
          onWizardCharm={handleWizardCharm}
          onLootRoom={handleLootRoom}
          onOpenTroubleModal={() => {
            SoundEngine.playButtonClick();
            setIsTroubleModalOpen(true);
          }}
          onEndTurn={handleNextTurn}
          onDropCard={handleDropCardOnDungeon}
        />
      </main>

      {/* Bottom Area: Fan Cards Hand & Player Inventory */}
      <div className="relative z-20 w-full flex flex-col">
        <HandCardsFan
          player={myPlayer}
          isMyTurn={isMyTurn}
          phase={gameState.phase}
          onEquipCard={handleEquipCard}
          onCarryCard={handleCarryCard}
          onPlayCard={handlePlayCard}
          onSellCard={(id) => handleSellItems([id], 0)}
          onDiscardCard={(id) => {
            myPlayer.hand = myPlayer.hand.filter((c) => c.id !== id);
            setGameState((prev) => (prev ? { ...prev, players: [...prev.players] } : null));
          }}
        />

        <PlayerInventory
          player={myPlayer}
          isMyTurn={isMyTurn}
          onUnequipItem={handleUnequipCard}
          onEquipCarriedItem={handleEquipCarried}
          onOpenSellModal={() => setIsSellModalOpen(true)}
          onOpenRatingModal={() => setIsRatingModalOpen(true)}
        />
      </div>

      {/* Floating Battle Log and Chat Drawer */}
      <BattleLog
        logs={gameState.logs}
        chat={gameState.chat}
        currentUserId={playerProfile.id}
        onSendChat={handleSendChat}
        isOpen={isLogOpen}
        onToggle={() => setIsLogOpen(!isLogOpen)}
      />

      {/* Dice Roller Modal */}
      <DiceRoller
        isOpen={diceModal.isOpen}
        modifier={diceModal.modifier}
        purpose={diceModal.purpose}
        playerName={activePlayer.name}
        onRollComplete={(roll, success) => diceModal.onResolved(roll, success)}
        onClose={() => setDiceModal((m) => ({ ...m, isOpen: false }))}
      />

      {/* Potions Combat Modal */}
      <PotionsCombatModal
        isOpen={isPotionsModalOpen}
        player={myPlayer}
        onPlayPotionForHero={(id) => handlePlayCard(id)}
        onPlayPotionForMonster={(id) => handlePlayPotionForMonster(id)}
        onClose={() => setIsPotionsModalOpen(false)}
      />

      {/* Trouble Modal */}
      <TroubleModal
        isOpen={isTroubleModalOpen}
        player={myPlayer}
        onPlayMonster={(id) => handlePlayMonsterFromHand(id)}
        onClose={() => setIsTroubleModalOpen(false)}
      />

      {/* Theme Selector Modal */}
      <DungeonThemeSelector
        isOpen={isThemeSelectorOpen}
        currentTheme={gameState.theme}
        onSelectTheme={(theme) => {
          setSelectedTheme(theme);
          setGameState((prev) => (prev ? { ...prev, theme } : null));
          setIsThemeSelectorOpen(false);
        }}
        onClose={() => setIsThemeSelectorOpen(false)}
      />

      {/* Rating & Economy Modal */}
      <RatingEconomyModal
        isOpen={isRatingModalOpen}
        profile={playerProfile}
        onClose={() => setIsRatingModalOpen(false)}
        onBuyTitle={handleBuyTitle}
      />

      {/* Sell Items for Gold Modal */}
      <SellGoldModal
        isOpen={isSellModalOpen}
        player={myPlayer}
        onSellItems={handleSellItems}
        onClose={() => setIsSellModalOpen(false)}
      />

      {/* Rules Modal */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />

      {/* Victory Modal */}
      {gameState.phase === 'game_over' && (
        <VictoryModal
          winner={
            gameState.players.find((p) => p.id === gameState.winnerId) || activePlayer
          }
          isCurrentUserWinner={gameState.winnerId === playerProfile.id}
          onPlayAgain={() => startSinglePlayerGame(2)}
          onExitLobby={() => setInGame(false)}
        />
      )}
    </div>
  );
}
