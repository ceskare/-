import { Card } from '../types/game';

export const INITIAL_DOOR_CARDS: Card[] = [
  // --- MONSTERS ---
  {
    id: 'door-m-1',
    name: '3842 Легкомысленный Гоблин',
    deck: 'doors',
    category: 'monster',
    monsterLevel: 1,
    monsterTreasures: 1,
    monsterLevelsReward: 1,
    badStuff: 'Он грабит тебя на мелочь. Теряешь 1 уровень.',
    badStuffEffect: 'lose_level',
    description: 'Монстр 1 уровня. Легкая добыча даже для новичка!',
    flavorText: 'Они не просто легкомысленные, они еще и не умеют драться.',
    bgGradient: 'from-amber-900/60 to-emerald-950/60',
    iconName: 'goblin'
  },
  {
    id: 'door-m-2',
    name: 'Сопливая Идиотка',
    deck: 'doors',
    category: 'monster',
    monsterLevel: 1,
    monsterTreasures: 1,
    monsterLevelsReward: 1,
    badStuff: 'Она сморкается на твою обувку. Сбрось надетую обувку!',
    badStuffEffect: 'lose_footwear',
    description: 'Монстр 1 уровня. Мерзкая, но слабая.',
    flavorText: 'Апчхи! Фу, какая гадость...',
    bgGradient: 'from-emerald-900/60 to-lime-950/60',
    iconName: 'slime'
  },
  {
    id: 'door-m-3',
    name: 'Лепорекон',
    deck: 'doors',
    category: 'monster',
    monsterLevel: 2,
    monsterTreasures: 1,
    monsterLevelsReward: 1,
    badStuff: 'Забирает все твои сокровища из руки.',
    badStuffEffect: 'discard_hand',
    description: 'Монстр 2 уровня. Зеленый жадина с горшком золота (чужого).',
    flavorText: 'Где мой клевер, парень?',
    bgGradient: 'from-green-900/60 to-yellow-950/60',
    iconName: 'clover'
  },
  {
    id: 'door-m-4',
    name: 'Летучие Лягушки',
    deck: 'doors',
    category: 'monster',
    monsterLevel: 2,
    monsterTreasures: 1,
    monsterLevelsReward: 1,
    badStuff: 'Они кусают за пятки. Сбрось 1 уровень.',
    badStuffEffect: 'lose_level',
    monsterBonusAgainst: {
      race: 'elf',
      bonus: 3
    },
    description: 'Монстр 2 уровня. Получают +3 против Эльфов, потому что эльфы вкуснее.',
    flavorText: 'Ква-ква... с высоты птичьего полета!',
    bgGradient: 'from-teal-900/60 to-green-950/60',
    iconName: 'frog'
  },
  {
    id: 'door-m-5',
    name: 'Плюшевый Мишка',
    deck: 'doors',
    category: 'monster',
    monsterLevel: 3,
    monsterTreasures: 1,
    monsterLevelsReward: 1,
    badStuff: 'Он душит тебя в теплых плюшевых объятиях. Теряешь надетый головняк.',
    badStuffEffect: 'lose_head',
    description: 'Монстр 3 уровня. Выглядит мило, пока не оторвет тебе шлем.',
    flavorText: 'Обними меня скорее... крепче!',
    bgGradient: 'from-rose-900/60 to-amber-950/60',
    iconName: 'bear'
  },
  {
    id: 'door-m-6',
    name: 'Закосивший под Зомби',
    deck: 'doors',
    category: 'monster',
    monsterLevel: 6,
    monsterTreasures: 2,
    monsterLevelsReward: 1,
    badStuff: 'Заражает тупостью. Сбрось 2 уровня.',
    badStuffEffect: 'lose_two_levels',
    monsterBonusAgainst: {
      class: 'cleric',
      bonus: -3 // Clerics easily repel undead
    },
    description: 'Монстр 6 уровня. Нежить. Клирики получают +3 в бою против него.',
    flavorText: 'Мозги... хотя погоди, у тебя их нет.',
    bgGradient: 'from-purple-900/60 to-slate-950/60',
    iconName: 'skull'
  },
  {
    id: 'door-m-7',
    name: 'Амазонка',
    deck: 'doors',
    category: 'monster',
    monsterLevel: 8,
    monsterTreasures: 2,
    monsterLevelsReward: 1,
    badStuff: 'Бьет палицей по самолюбию. Сбрось надетый доспех.',
    badStuffEffect: 'lose_armor',
    description: 'Монстр 8 уровня. Грозная воительница из диких джунглей.',
    flavorText: 'Мужчинам тут не рады, женщинам тем более.',
    bgGradient: 'from-red-900/60 to-orange-950/60',
    iconName: 'shield-alert'
  },
  {
    id: 'door-m-8',
    name: 'Бигфут',
    deck: 'doors',
    category: 'monster',
    monsterLevel: 12,
    monsterTreasures: 3,
    monsterLevelsReward: 1,
    badStuff: 'Растаптывает твою обувку и надетый головняк!',
    badStuffEffect: 'lose_footwear',
    monsterBonusAgainst: {
      race: 'dwarf',
      bonus: 3
    },
    description: 'Монстр 12 уровня. Получает +3 против Дварфов и Хафлингов.',
    flavorText: 'Его лапа больше твоей будущей пенсии.',
    bgGradient: 'from-stone-900/60 to-amber-950/60',
    iconName: 'footprints'
  },
  {
    id: 'door-m-9',
    name: 'Невыразимо жуткий кошмар',
    deck: 'doors',
    category: 'monster',
    monsterLevel: 14,
    monsterTreasures: 4,
    monsterLevelsReward: 1,
    badStuff: 'Ужас парализует тебя. Теряешь 2 уровня и сбрасываешь всю руку.',
    badStuffEffect: 'lose_two_levels',
    description: 'Монстр 14 уровня. Порождение ночных кошмаров Манчкина.',
    flavorText: 'Даже авторы правил боятся на него смотреть.',
    bgGradient: 'from-indigo-950/70 to-purple-950/70',
    iconName: 'ghost'
  },
  {
    id: 'door-m-harpy',
    name: 'Гарпии (Harpies)',
    deck: 'doors',
    category: 'monster',
    monsterLevel: 9,
    monsterTreasures: 2,
    monsterLevelsReward: 1,
    badStuff: 'Их музыка ужасна, ужасна, ужасна! Сбрось 2 уровня.',
    badStuffEffect: 'lose_two_levels',
    monsterBonusAgainst: {
      class: 'wizard',
      bonus: 5
    },
    description: 'Монстр 9 уровня. Устойчивы к магии: +5 против Волшебников.',
    flavorText: 'Играют на золотой арфе так фальшиво, что вянут уши.',
    bgGradient: 'from-amber-900/60 to-stone-950/60',
    iconName: 'harpies',
    artType: 'harpies'
  },
  {
    id: 'door-m-10',
    name: 'Кальмадзилла (Squidzilla)',
    deck: 'doors',
    category: 'monster',
    monsterLevel: 18,
    monsterTreasures: 4,
    monsterLevelsReward: 2,
    badStuff: 'Утаскивает тебя на морское дно. Смерть! Сбрасываешь все шмотки.',
    badStuffEffect: 'death',
    monsterBonusAgainst: {
      race: 'elf',
      bonus: 4
    },
    description: 'Монстр 18 уровня. Гигантский морской спрут. Дает 2 УРОВНЯ за победу!',
    flavorText: 'Обожает эльфийские щупальца под чесночным соусом.',
    bgGradient: 'from-cyan-950/70 to-blue-950/70',
    iconName: 'tentacles',
    artType: 'squidzilla'
  },
  {
    id: 'door-m-11',
    name: 'Бульрог',
    deck: 'doors',
    category: 'monster',
    monsterLevel: 18,
    monsterTreasures: 5,
    monsterLevelsReward: 2,
    badStuff: 'Испепеляет дотла огненным хлыстом. Смерть!',
    badStuffEffect: 'death',
    description: 'Монстр 18 уровня. Демон глубин подземелий. Дает 2 УРОВНЯ!',
    flavorText: 'Ты не пройдешь! (без пары мощных зелий точно).',
    bgGradient: 'from-red-950/70 to-rose-950/70',
    iconName: 'flame',
    artType: 'bullrog'
  },
  {
    id: 'door-m-12',
    name: 'Плутонический Дракон',
    deck: 'doors',
    category: 'monster',
    monsterLevel: 20,
    monsterTreasures: 5,
    monsterLevelsReward: 2,
    badStuff: 'Сжигает тебя радиоактивным пламенем. Полная смерть!',
    badStuffEffect: 'death',
    monsterBonusAgainst: {
      class: 'wizard',
      bonus: 5
    },
    description: 'Монстр 20 уровня! Царь подземелья. Никаких пощад. Дает 2 УРОВНЯ победителю!',
    flavorText: 'Светится в темноте и дышит термоядерным синтезом.',
    bgGradient: 'from-amber-950/80 to-red-950/80',
    iconName: 'dragon',
    artType: 'dragon'
  },

  // --- CURSES ---
  {
    id: 'door-c-1',
    name: 'Проклятие! Потеряй Головняк',
    deck: 'doors',
    category: 'curse',
    curseEffect: 'lose_head',
    description: 'Сбрось надетый головняк прямо сейчас. Если головняка нет, проклятие прошло мимо.',
    flavorText: 'Твоя шляпа улетает в лавовую реку.',
    bgGradient: 'from-zinc-900/60 to-red-950/60',
    iconName: 'hat-off'
  },
  {
    id: 'door-c-2',
    name: 'Проклятие! Потеряй Обувку',
    deck: 'doors',
    category: 'curse',
    curseEffect: 'lose_footwear',
    description: 'Сбрось надетую обувку прямо сейчас. Теперь бегать босиком!',
    flavorText: 'Шнурки развязались и сапоги убежали сами.',
    bgGradient: 'from-zinc-900/60 to-red-950/60',
    iconName: 'boot-off'
  },
  {
    id: 'door-c-3',
    name: 'Проклятие! Потеряй 1 Уровень',
    deck: 'doors',
    category: 'curse',
    curseEffect: 'lose_level',
    description: 'Ты теряешь 1 уровень (минимум до 1 уровня).',
    flavorText: 'Опыт выветрился вместе с воспоминаниями о вчерашней попойке в таверне.',
    bgGradient: 'from-zinc-900/60 to-red-950/60',
    iconName: 'level-down'
  },
  {
    id: 'door-c-4',
    name: 'Проклятие! Потеряй Броню',
    deck: 'doors',
    category: 'curse',
    curseEffect: 'lose_armor',
    description: 'Сбрось надетый доспех прямо сейчас.',
    flavorText: 'Ржавчина съела кольчугу за три секунды.',
    bgGradient: 'from-zinc-900/60 to-red-950/60',
    iconName: 'shield-off'
  },
  {
    id: 'door-c-5',
    name: 'Проклятие! Смена Пола',
    deck: 'doors',
    category: 'curse',
    curseEffect: 'change_gender',
    description: 'Твой пол меняется на противоположный! В следующем бою получаешь штраф -5 к силе от неловкости.',
    flavorText: 'Ого, а этот наряд мне идет?',
    bgGradient: 'from-pink-950/60 to-purple-950/60',
    iconName: 'sparkles'
  },
  {
    id: 'door-c-6',
    name: 'Проклятие! Курица на Башне',
    deck: 'doors',
    category: 'curse',
    curseEffect: 'lose_level',
    description: 'Курица клюет твою макушку. Теряешь 1 уровень!',
    flavorText: 'Ко-ко-ко! Она не слезает!',
    bgGradient: 'from-zinc-900/60 to-red-950/60',
    iconName: 'feather'
  },

  // --- CLASSES ---
  {
    id: 'door-cl-1',
    name: 'Класс: Воин',
    deck: 'doors',
    category: 'class',
    description: 'Воин побеждает при равной силе в бою! Ярость берсерка: можешь сбросить до 3 карт, получая +1 за каждую в бою.',
    flavorText: 'Думать не умеет, зато мечом машет на славу.',
    bgGradient: 'from-orange-900/60 to-red-950/60',
    iconName: 'swords'
  },
  {
    id: 'door-cl-2',
    name: 'Класс: Волшебник',
    deck: 'doors',
    category: 'class',
    description: 'Заклинание полета: +1 к смывке. Усмирение: сбрось всю руку (минимум 3 карты), чтобы сбежать от монстра и забрать его сокровища!',
    flavorText: 'Абракадабра, и монстра как не бывало.',
    bgGradient: 'from-indigo-900/60 to-blue-950/60',
    iconName: 'wand'
  },
  {
    id: 'door-cl-3',
    name: 'Класс: Вор',
    deck: 'doors',
    category: 'class',
    description: 'Подрезка: сбрось карту, чтобы отнять 2 силы у соперника в бою. Кража: попытайся украсть мелкую шмотку соперника (на кубике 4-6).',
    flavorText: 'Что упало, то мое. Что не упало — сейчас упадет.',
    bgGradient: 'from-emerald-950/70 to-slate-900/70',
    iconName: 'dagger'
  },
  {
    id: 'door-cl-4',
    name: 'Класс: Клирик',
    deck: 'doors',
    category: 'class',
    description: 'Воскрешение: можешь брать карту из сброса вместо колоды. Изгнание: +3 против нежити в любом бою!',
    flavorText: 'Свет исцелит... или ослепит врагов.',
    bgGradient: 'from-amber-900/60 to-yellow-950/60',
    iconName: 'sun'
  },

  // --- RACES ---
  {
    id: 'door-r-1',
    name: 'Раса: Эльф',
    deck: 'doors',
    category: 'race',
    description: 'Помощь другим дает +1 уровень! При смывке получаешь постоянный бонус +1 к броску кубика.',
    flavorText: 'Остроухий красавец с завышенным эго.',
    bgGradient: 'from-emerald-900/60 to-teal-950/60',
    iconName: 'leaf'
  },
  {
    id: 'door-r-2',
    name: 'Раса: Дварф',
    deck: 'doors',
    category: 'race',
    description: 'Может нести сколько угодно больших шмоток! Лимит карт в руке увеличен до 6 карт.',
    flavorText: 'Низкий рост, длинная борода и тяжелый топор.',
    bgGradient: 'from-amber-950/70 to-stone-900/70',
    iconName: 'hammer'
  },
  {
    id: 'door-r-3',
    name: 'Раса: Хафлинг',
    deck: 'doors',
    category: 'race',
    description: 'Вторая попытка смывки при провале! Продажа одной шмотки за ход дает двойную цену золотом.',
    flavorText: 'Шестиразовое питание и мохнатые ступни.',
    bgGradient: 'from-yellow-950/70 to-orange-950/70',
    iconName: 'beer'
  },

  // --- MODIFIERS ---
  {
    id: 'door-mod-1',
    name: 'Древний (+5 к монстру)',
    deck: 'doors',
    category: 'modifier',
    bonus: 5,
    description: 'Сыграй во время любого боя. Монстр получает +5 к силе и дает +1 дополнительное сокровище.',
    flavorText: 'Он помнит еще создание этого подземелья.',
    bgGradient: 'from-purple-950/60 to-rose-950/60',
    iconName: 'clock'
  },
  {
    id: 'door-mod-2',
    name: 'Громадный (+10 к монстру)',
    deck: 'doors',
    category: 'modifier',
    bonus: 10,
    description: 'Сыграй во время любого боя. Монстр вырастает до небес: +10 к силе и +2 сокровища!',
    flavorText: 'Огромный, как зарплата программиста.',
    bgGradient: 'from-red-950/70 to-amber-950/70',
    iconName: 'maximize'
  },
  {
    id: 'door-mod-3',
    name: 'Малыш (-5 к монстру)',
    deck: 'doors',
    category: 'modifier',
    bonus: -5,
    description: 'Сыграй в бой. Монстр сжимается: -5 к боевой силе (но не меньше 1) и -1 сокровище.',
    flavorText: 'Ути-пути, какой грозный дракончик!',
    bgGradient: 'from-blue-950/60 to-cyan-950/60',
    iconName: 'minimize'
  },
  {
    id: 'door-mod-wandering',
    name: 'Бродячая Тварь (Wandering Monster)',
    deck: 'doors',
    category: 'modifier',
    description: 'Сыграй вместе с монстром из руки в любой бой! Монстр присоединяется со своей силой и сокровищами.',
    flavorText: 'Шел мимо, решил заглянуть на огонек.',
    bgGradient: 'from-purple-950/70 to-stone-900/70',
    iconName: 'wandering',
    artType: 'wandering'
  }
];

export const INITIAL_TREASURE_CARDS: Card[] = [
  // --- HEADGEAR ---
  {
    id: 'tr-h-1',
    name: 'Шлем-Рогач',
    deck: 'treasures',
    category: 'equipment',
    slot: 'head',
    bonus: 1,
    gold: 200,
    description: 'Головняк. Дает +1 к боевой силе.',
    flavorText: 'Рога устрашают монстров и задевают низкие потолки.',
    bgGradient: 'from-stone-800 to-amber-950',
    iconName: 'helmet',
    artType: 'horned'
  },
  {
    id: 'tr-h-2',
    name: 'Шлем Отваги',
    deck: 'treasures',
    category: 'equipment',
    slot: 'head',
    bonus: 2,
    gold: 400,
    description: 'Головняк. Дает +2 к боевой силе.',
    flavorText: 'Отвага не заменяет мозги, но защищает лоб.',
    bgGradient: 'from-amber-900 to-yellow-950',
    iconName: 'crown'
  },
  {
    id: 'tr-h-3',
    name: 'Бандана Крутости',
    deck: 'treasures',
    category: 'equipment',
    slot: 'head',
    bonus: 3,
    gold: 600,
    usableByClass: ['thief'],
    description: 'Головняк. Только для Вора. Дает +3 к боевой силе.',
    flavorText: 'Череп на лобной повязке придает дерзости.',
    bgGradient: 'from-red-950 to-neutral-900',
    iconName: 'skull-cap'
  },

  // --- ARMOR ---
  {
    id: 'tr-a-1',
    name: 'Кожаный Доспех',
    deck: 'treasures',
    category: 'equipment',
    slot: 'armor',
    bonus: 1,
    gold: 200,
    description: 'Броня. Дает +1 к боевой силе.',
    flavorText: 'Пахнет коровой, но стрелы задерживает.',
    bgGradient: 'from-amber-950 to-stone-900',
    iconName: 'vest'
  },
  {
    id: 'tr-a-2',
    name: 'Слизезащитный Доспех',
    deck: 'treasures',
    category: 'equipment',
    slot: 'armor',
    bonus: 2,
    gold: 400,
    description: 'Броня. Дает +2 к боевой силе. Монстры сопли и слизи соскальзывают.',
    flavorText: 'Скользкий тип в прямом смысле слова.',
    bgGradient: 'from-emerald-950 to-teal-900',
    iconName: 'shield',
    artType: 'slimy'
  },
  {
    id: 'tr-a-3',
    name: 'Кольчуга',
    deck: 'treasures',
    category: 'equipment',
    slot: 'armor',
    bonus: 3,
    gold: 600,
    isBigItem: true,
    description: 'Броня. Большая шмотка. Дает +3 к боевой силе.',
    flavorText: 'Звенит при ходьбе, зато держит удар топора.',
    bgGradient: 'from-slate-800 to-zinc-950',
    iconName: 'chainmail'
  },
  {
    id: 'tr-a-4',
    name: 'Огненный Панцирь',
    deck: 'treasures',
    category: 'equipment',
    slot: 'armor',
    bonus: 4,
    gold: 800,
    isBigItem: true,
    description: 'Броня. Большая шмотка. Дает +4 к боевой силе!',
    flavorText: 'Горячо как в бане, зато никто не полезет обниматься.',
    bgGradient: 'from-orange-950 to-red-950',
    iconName: 'flame-armor'
  },

  // --- FOOTWEAR ---
  {
    id: 'tr-f-1',
    name: 'Башмаки Быстрого Бега',
    deck: 'treasures',
    category: 'equipment',
    slot: 'footwear',
    bonus: 0,
    gold: 400,
    description: 'Обувка. Дает постоянный бонус +2 к броску кубика при Смывке!',
    flavorText: 'Кто бежит быстрее всех, тот не попадает в Непотребство.',
    bgGradient: 'from-amber-900 to-emerald-950',
    iconName: 'boots'
  },
  {
    id: 'tr-f-2',
    name: 'Сандалии Протекции',
    deck: 'treasures',
    category: 'equipment',
    slot: 'footwear',
    bonus: 1,
    gold: 500,
    description: 'Обувка. Дает +1 к боевой силе. Проклятия, вытянутые из дверей, на тебя не действуют!',
    flavorText: 'Божественная подошва отводит сглаз.',
    bgGradient: 'from-yellow-900 to-amber-950',
    iconName: 'sandals'
  },
  {
    id: 'tr-f-3',
    name: 'Сапоги Волшебного Пинка',
    deck: 'treasures',
    category: 'equipment',
    slot: 'footwear',
    bonus: 2,
    gold: 400,
    description: 'Обувка. Дает +2 к боевой силе.',
    flavorText: 'Увесистый кованый носок для убедительных аргументов.',
    bgGradient: 'from-stone-900 to-purple-950',
    iconName: 'steel-boots'
  },

  // --- WEAPONS ---
  {
    id: 'tr-w-1',
    name: 'Молот Коленкодавитель',
    deck: 'treasures',
    category: 'equipment',
    slot: 'one_hand',
    bonus: 1,
    gold: 200,
    description: 'Оружие в 1 руку. Дает +1 к силе. Получает +2 против дварфов и хафлингов.',
    flavorText: 'Прицел строго по уровню коленей.',
    bgGradient: 'from-stone-800 to-neutral-950',
    iconName: 'hammer-smash'
  },
  {
    id: 'tr-w-2',
    name: 'Меч Прикольного Угла',
    deck: 'treasures',
    category: 'equipment',
    slot: 'one_hand',
    bonus: 3,
    gold: 500,
    description: 'Оружие в 1 руку. Дает +3 к боевой силе.',
    flavorText: 'Изогнут так хитро, что противник сам на него натыкается.',
    bgGradient: 'from-slate-800 to-blue-950',
    iconName: 'sword'
  },
  {
    id: 'tr-w-3',
    name: 'Кинжал Измены',
    deck: 'treasures',
    category: 'equipment',
    slot: 'one_hand',
    bonus: 3,
    gold: 400,
    usableByClass: ['thief'],
    description: 'Оружие в 1 руку. Только для Вора. Дает +3 к боевой силе.',
    flavorText: 'Удар в спину никогда еще не был столь приятным.',
    bgGradient: 'from-emerald-950 to-neutral-900',
    iconName: 'dagger'
  },
  {
    id: 'tr-w-4',
    name: 'Палица Сокрушения',
    deck: 'treasures',
    category: 'equipment',
    slot: 'one_hand',
    bonus: 4,
    gold: 600,
    usableByClass: ['cleric'],
    description: 'Оружие в 1 руку. Только для Клирика. Дает +4 к боевой силе!',
    flavorText: 'Благословение весом в двадцать килограмм стали.',
    bgGradient: 'from-amber-950 to-yellow-950',
    iconName: 'mace'
  },
  {
    id: 'tr-w-5',
    name: 'Посох Напалма',
    deck: 'treasures',
    category: 'equipment',
    slot: 'one_hand',
    bonus: 5,
    gold: 800,
    usableByClass: ['wizard'],
    description: 'Оружие в 1 руку. Только для Волшебника. Дает +5 к боевой силе!',
    flavorText: 'Обожаю запах напалма по утрам в темном склепе.',
    bgGradient: 'from-rose-950 to-red-950',
    iconName: 'staff'
  },
  {
    id: 'tr-w-6',
    name: 'Двуручный Двуручник',
    deck: 'treasures',
    category: 'equipment',
    slot: 'two_hands',
    bonus: 4,
    gold: 600,
    isBigItem: true,
    description: 'Оружие в 2 руки. Большая шмотка. Дает +4 к боевой силе.',
    flavorText: 'Занимает обе руки, зато рубит сразу троих.',
    bgGradient: 'from-zinc-800 to-stone-950',
    iconName: 'greatsword'
  },
  {
    id: 'tr-w-7',
    name: 'Бензопила Кровавого Распила',
    deck: 'treasures',
    category: 'equipment',
    slot: 'two_hands',
    bonus: 5,
    gold: 900,
    isBigItem: true,
    description: 'Оружие в 2 руки. Большая шмотка. Дает +5 к боевой силе!',
    flavorText: 'Вжжжжж! Заводит даже нежить.',
    bgGradient: 'from-red-950 to-black',
    iconName: 'saw'
  },

  // --- ACCESSORIES / ITEMS ---
  {
    id: 'tr-i-1',
    name: 'Плащ-Невидимка',
    deck: 'treasures',
    category: 'equipment',
    slot: 'item',
    bonus: 1,
    gold: 400,
    description: 'Шмотка. Дает +1 к боевой силе и +1 к броску смывки.',
    flavorText: 'Где я? А вот и нет меня.',
    bgGradient: 'from-purple-950 to-indigo-950',
    iconName: 'cloak'
  },
  {
    id: 'tr-i-2',
    name: 'Наколенники Развода',
    deck: 'treasures',
    category: 'equipment',
    slot: 'item',
    bonus: 1,
    gold: 500,
    description: 'Шмотка. Дает +1 к силе. Позволяет заставить любого игрока помочь тебе в бою бесплатно, если его уровень выше твоего!',
    flavorText: 'Они встают на колени сами собой, и слезы текут ручьем.',
    bgGradient: 'from-amber-950 to-yellow-950',
    iconName: 'kneepads'
  },

  // --- ONE SHOT POTIONS ---
  {
    id: 'tr-p-1',
    name: 'Зелье Оцепенения',
    deck: 'treasures',
    category: 'potion',
    bonus: 3,
    gold: 100,
    description: 'Одноразовое зелье. Дает +3 любой стороне в бою (манчкину или монстру). Сбрасывается после боя.',
    flavorText: 'Враг замирает, пуская пузыри.',
    bgGradient: 'from-cyan-950 to-blue-900',
    iconName: 'flask'
  },
  {
    id: 'tr-p-2',
    name: 'Зелье Путаницы',
    deck: 'treasures',
    category: 'potion',
    bonus: 3,
    gold: 100,
    description: 'Одноразовое зелье. Дает +3 любой стороне в бою. Сбрось после применения.',
    flavorText: 'Кто я? Куда я бью? Зачем?',
    bgGradient: 'from-violet-950 to-purple-900',
    iconName: 'flask-round'
  },
  {
    id: 'tr-p-3',
    name: 'Зелье Взрыва',
    deck: 'treasures',
    category: 'potion',
    bonus: 4,
    gold: 200,
    description: 'Одноразовое зелье. Наносит взрывной урон: +4 любой стороне в бою!',
    flavorText: 'БАБАХ! Осколки летят во все стороны.',
    bgGradient: 'from-rose-950 to-red-900',
    iconName: 'bomb'
  },
  {
    id: 'tr-p-4',
    name: 'Сонное Зелье',
    deck: 'treasures',
    category: 'potion',
    bonus: 2,
    gold: 100,
    description: 'Одноразовое зелье. +2 манчкину в бою или +2 к смывке.',
    flavorText: 'Баю-бай, монстрик засыпай...',
    bgGradient: 'from-blue-950 to-indigo-950',
    iconName: 'moon'
  },
  {
    id: 'tr-p-5',
    name: 'Тюбик с Клеем',
    deck: 'treasures',
    category: 'potion',
    bonus: 0,
    gold: 100,
    description: 'Сыграй, когда кто-то успешно смылся от монстра. Он перебрасывает кубик смывки заново!',
    flavorText: 'Прилип намертво к полу подземелья.',
    bgGradient: 'from-lime-950 to-stone-900',
    iconName: 'glue'
  },

  // --- GO UP A LEVEL ---
  {
    id: 'tr-lvl-1',
    name: 'Потренируйся с Мастером',
    deck: 'treasures',
    category: 'go_up_level',
    description: 'Получи 1 Уровень прямо сейчас! Нельзя использовать для получения 10-го победного уровня.',
    flavorText: 'Повторяй за мной: удар, блок, снова удар!',
    bgGradient: 'from-amber-900 to-yellow-800',
    iconName: 'trophy'
  },
  {
    id: 'tr-lvl-2',
    name: 'Укради Опыт',
    deck: 'treasures',
    category: 'go_up_level',
    description: 'Получи 1 Уровень прямо сейчас! Не может дать 10-й уровень.',
    flavorText: 'Чужие знания усваиваются быстрее всего.',
    bgGradient: 'from-amber-900 to-yellow-800',
    iconName: 'book-open'
  },
  {
    id: 'tr-lvl-3',
    name: 'Убей Автора Правил',
    deck: 'treasures',
    category: 'go_up_level',
    description: 'Получи 1 Уровень прямо сейчас! Не может дать 10-й уровень.',
    flavorText: 'Он написал слишком много страниц мелким шрифтом.',
    bgGradient: 'from-amber-900 to-yellow-800',
    iconName: 'feather'
  },
  {
    id: 'tr-lvl-4',
    name: 'Заплати Налоги и Спи Спокойно',
    deck: 'treasures',
    category: 'go_up_level',
    description: 'Получи 1 Уровень прямо сейчас! Не может дать 10-й уровень.',
    flavorText: 'Квитанция об уплате налогов греет душу.',
    bgGradient: 'from-amber-900 to-yellow-800',
    iconName: 'coins'
  }
];

export function shuffleDeck<T>(deck: T[]): T[] {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
