import { YandexPlayerProfile } from '../types/game.ts';

declare global {
  interface Window {
    YaGames?: {
      init: () => Promise<any>;
    };
  }
}

let ysdkInstance: any = null;
let playerInstance: any = null;

// Catch and suppress third-party Yandex SDK logger errors outside of Yandex portal
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reasonStr = String(event.reason || '');
    if (
      reasonStr.includes('No parent to post message') ||
      reasonStr.includes('YandexSDKLogError') ||
      reasonStr.includes('Can not get appId')
    ) {
      event.preventDefault();
    }
  });

  window.addEventListener('error', (event) => {
    const errorStr = String(event.message || event.error || '');
    if (
      errorStr.includes('No parent to post message') ||
      errorStr.includes('YandexSDKLogError') ||
      errorStr.includes('Can not get appId')
    ) {
      event.preventDefault();
    }
  });
}

const DEFAULT_PROFILE: YandexPlayerProfile = {
  id: 'guest_' + Math.random().toString(36).substring(2, 8),
  name: 'Манчкин ' + Math.floor(100 + Math.random() * 900),
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
};

/**
 * Checks whether the game is currently hosted inside the Yandex Games platform
 */
export function isYandexGamesEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const hostname = window.location.hostname || '';
    const referrer = document.referrer || '';
    const search = window.location.search || '';
    const isYandexDomain =
      /yandex\.(ru|net|com|kz|by|uz)/i.test(hostname) ||
      /yandex\.(ru|net|com|kz|by|uz)/i.test(referrer);
    const hasYandexParams = /[?&](app-id|lang|flags|yandex)=/i.test(search);
    return isYandexDomain || hasYandexParams;
  } catch {
    return false;
  }
}

/**
 * Dynamically loads the Yandex Games SDK script only when in Yandex environment
 */
function loadYandexGamesScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.YaGames) return resolve(true);

    if (!isYandexGamesEnvironment()) {
      return resolve(false);
    }

    const script = document.createElement('script');
    script.src = 'https://yandex.ru/games/sdk/v2';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

/**
 * Initializes the Yandex Games SDK.
 * Seamlessly switches between real Yandex Games SDK and local standalone environment.
 */
export async function initYandexGames(): Promise<{
  isAvailable: boolean;
  profile: YandexPlayerProfile;
}> {
  try {
    if (isYandexGamesEnvironment()) {
      const scriptLoaded = await loadYandexGamesScript();
      if (scriptLoaded && window.YaGames) {
        ysdkInstance = await window.YaGames.init();

        try {
          playerInstance = await ysdkInstance.getPlayer({ scopes: false });
          const name = playerInstance.getName() || DEFAULT_PROFILE.name;
          const photo = playerInstance.getPhoto('medium') || '';
          const id = playerInstance.getUniqueID() || DEFAULT_PROFILE.id;
          const isAuth = playerInstance.getMode() !== 'lite';

          const profile: YandexPlayerProfile = {
            id,
            name,
            avatarUrl: photo,
            isAuthorized: isAuth,
            coins: DEFAULT_PROFILE.coins,
            ratingScore: DEFAULT_PROFILE.ratingScore,
            rankTitle: DEFAULT_PROFILE.rankTitle,
            stats: DEFAULT_PROFILE.stats
          };

          try {
            const savedData = await playerInstance.getData(['munchkin_stats', 'munchkin_meta']);
            if (savedData) {
              if (savedData.munchkin_stats) {
                profile.stats = {
                  ...DEFAULT_PROFILE.stats,
                  ...savedData.munchkin_stats
                };
              }
              if (savedData.munchkin_meta) {
                profile.coins = savedData.munchkin_meta.coins ?? profile.coins;
                profile.ratingScore = savedData.munchkin_meta.ratingScore ?? profile.ratingScore;
                profile.rankTitle = savedData.munchkin_meta.rankTitle ?? profile.rankTitle;
              }
            }
          } catch {
            // Ignore stats load error
          }

          return { isAvailable: true, profile };
        } catch {
          return { isAvailable: true, profile: DEFAULT_PROFILE };
        }
      }
    }
  } catch {
    // Graceful fallback to standalone mode
  }

  // Load from localStorage if standalone
  try {
    const local = localStorage.getItem('munchkin_local_profile');
    if (local) {
      const parsed = JSON.parse(local);
      return { isAvailable: false, profile: { ...DEFAULT_PROFILE, ...parsed } };
    }
  } catch {
    // Ignore local storage error
  }

  return { isAvailable: false, profile: DEFAULT_PROFILE };
}

/**
 * Authorize player in Yandex Games or simulate in standalone mode
 */
export async function loginYandexPlayer(): Promise<YandexPlayerProfile | null> {
  if (ysdkInstance && playerInstance) {
    try {
      if (playerInstance.getMode() === 'lite') {
        await ysdkInstance.auth.openAuthDialog();
        playerInstance = await ysdkInstance.getPlayer({ scopes: false });
        return {
          id: playerInstance.getUniqueID(),
          name: playerInstance.getName() || DEFAULT_PROFILE.name,
          avatarUrl: playerInstance.getPhoto('medium') || '',
          isAuthorized: true,
          coins: DEFAULT_PROFILE.coins,
          ratingScore: DEFAULT_PROFILE.ratingScore,
          rankTitle: DEFAULT_PROFILE.rankTitle,
          stats: DEFAULT_PROFILE.stats
        };
      }
    } catch (e) {
      console.warn('[Yandex Games] Auth warning:', e);
    }
  }

  // Standalone simulated login
  const mockAuthorizedProfile: YandexPlayerProfile = {
    ...DEFAULT_PROFILE,
    name: 'Манчкин Мастер',
    isAuthorized: true
  };
  try {
    localStorage.setItem('munchkin_local_profile', JSON.stringify(mockAuthorizedProfile));
  } catch {
    // Ignore
  }
  return mockAuthorizedProfile;
}

/**
 * Save user game statistics (games, wins, monsters defeated).
 */
export async function savePlayerStats(stats: NonNullable<YandexPlayerProfile['stats']>): Promise<void> {
  try {
    if (playerInstance && playerInstance.setData) {
      await playerInstance.setData({ munchkin_stats: stats }, true);
    } else {
      localStorage.setItem('munchkin_local_stats', JSON.stringify(stats));
    }
  } catch {
    // Fallback ignore
  }
}

/**
 * Save user coins, rating score and title
 */
export async function savePlayerMeta(meta: { coins: number; ratingScore: number; rankTitle: string }): Promise<void> {
  try {
    if (playerInstance && playerInstance.setData) {
      await playerInstance.setData({ munchkin_meta: meta }, true);
    } else {
      localStorage.setItem('munchkin_local_meta', JSON.stringify(meta));
    }
  } catch {
    // Fallback ignore
  }
}

/**
 * Update score on Yandex Leaderboard (if configured in game console)
 */
export async function submitLeaderboardScore(score: number): Promise<void> {
  try {
    if (ysdkInstance && ysdkInstance.getLeaderboards) {
      const lb = await ysdkInstance.getLeaderboards();
      await lb.setLeaderboardScore('munchkin_wins', score);
    }
  } catch {
    // Skip if unavailable
  }
}

/**
 * Show interstitial or victory ad if running in Yandex environment
 */
export function showYandexAdv(): Promise<boolean> {
  return new Promise((resolve) => {
    if (ysdkInstance && ysdkInstance.adv && ysdkInstance.adv.showFullscreenAdv) {
      ysdkInstance.adv.showFullscreenAdv({
        callbacks: {
          onClose: () => resolve(true),
          onError: () => resolve(false)
        }
      });
    } else {
      resolve(true);
    }
  });
}
