import React from 'react';

/**
 * Hand-drawn cartoon illustrations in the classic John Kovalic / Munchkin style.
 */

// --- 1. THE CLASSIC MUNCHKIN CARD BACK ---
export const MunchkinCardBackSvg: React.FC<{
  type: 'doors' | 'treasures';
  className?: string;
}> = ({ type, className = '' }) => {
  const isDoor = type === 'doors';
  return (
    <svg
      viewBox="0 0 240 360"
      className={`w-full h-full select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Textured Aged Parchment Base */}
      <rect width="240" height="360" rx="14" fill="#eedbb5" />
      <rect
        x="6"
        y="6"
        width="228"
        height="348"
        rx="10"
        stroke="#4a2e18"
        strokeWidth="3.5"
        fill="#f4e5c8"
      />
      <rect
        x="12"
        y="12"
        width="216"
        height="336"
        rx="8"
        stroke="#a67c46"
        strokeWidth="1.5"
        strokeDasharray="4 2"
        fill="none"
      />

      {/* Hand-drawn Outer Border Accents */}
      <circle cx="20" cy="20" r="4" fill="#8c5826" />
      <circle cx="220" cy="20" r="4" fill="#8c5826" />
      <circle cx="20" cy="340" r="4" fill="#8c5826" />
      <circle cx="220" cy="340" r="4" fill="#8c5826" />

      {/* Center Lockup: Arched Door or Treasure Chest */}
      {isDoor ? (
        <g>
          {/* Wooden Arched Dungeon Door */}
          <path
            d="M 65 240 L 65 140 Q 120 70 175 140 L 175 240 Z"
            fill="#5a3d28"
            stroke="#26170d"
            strokeWidth="4"
          />
          {/* Wood Planks Lines */}
          <path d="M 95 125 L 95 240" stroke="#3d281a" strokeWidth="2.5" />
          <path d="M 120 105 L 120 240" stroke="#3d281a" strokeWidth="2.5" />
          <path d="M 145 125 L 145 240" stroke="#3d281a" strokeWidth="2.5" />
          {/* Iron Hinges and Ring */}
          <rect x="62" y="150" width="22" height="7" rx="2" fill="#1b120c" />
          <rect x="62" y="210" width="22" height="7" rx="2" fill="#1b120c" />
          <circle cx="108" cy="185" r="8" stroke="#1b120c" strokeWidth="3" fill="none" />
          {/* Door Knocker Base */}
          <circle cx="108" cy="180" r="4" fill="#1b120c" />

          {/* Title Banner */}
          <path
            d="M 40 270 Q 120 260 200 270 L 195 295 Q 120 285 45 295 Z"
            fill="#3a1e12"
            stroke="#1f0f08"
            strokeWidth="2"
          />
          <text
            x="120"
            y="287"
            fontFamily="Georgia, serif"
            fontSize="18"
            fontWeight="bold"
            fill="#f7dfa5"
            textAnchor="middle"
            letterSpacing="3"
          >
            ДВЕРИ
          </text>
        </g>
      ) : (
        <g>
          {/* Pirate / Dungeon Treasure Chest */}
          <path
            d="M 60 180 Q 120 145 180 180 L 175 235 L 65 235 Z"
            fill="#804a26"
            stroke="#2a160a"
            strokeWidth="4"
          />
          {/* Chest Lid Curved Band */}
          <path
            d="M 60 180 Q 120 155 180 180"
            stroke="#d4af37"
            strokeWidth="6"
            fill="none"
          />
          {/* Golden Iron Straps */}
          <path d="M 85 170 L 85 235" stroke="#d4af37" strokeWidth="5" />
          <path d="M 155 170 L 155 235" stroke="#d4af37" strokeWidth="5" />
          {/* Golden Keyhole Plate */}
          <rect x="110" y="188" width="20" height="22" rx="3" fill="#e6c640" stroke="#6b4c10" strokeWidth="2" />
          <circle cx="120" cy="196" r="3" fill="#301f05" />
          <path d="M 120 196 L 120 206" stroke="#301f05" strokeWidth="2.5" />

          {/* Chest Sparkles */}
          <path d="M 180 145 L 184 153 L 192 155 L 185 161 L 187 169 L 180 164 L 173 169 L 175 161 L 168 155 L 176 153 Z" fill="#ffd700" />
          <path d="M 55 160 L 58 165 L 64 166 L 59 171 L 61 176 L 55 173 L 49 176 L 51 171 L 46 166 L 52 165 Z" fill="#ffd700" />

          {/* Title Banner */}
          <path
            d="M 35 270 Q 120 260 205 270 L 200 295 Q 120 285 40 295 Z"
            fill="#4a2e0a"
            stroke="#211405"
            strokeWidth="2"
          />
          <text
            x="120"
            y="287"
            fontFamily="Georgia, serif"
            fontSize="16"
            fontWeight="bold"
            fill="#ffd700"
            textAnchor="middle"
            letterSpacing="2"
          >
            СОКРОВИЩА
          </text>
        </g>
      )}

      {/* Iconic John Kovalic Comic Logo "M" */}
      <g transform="translate(85, 30)">
        <text
          x="35"
          y="62"
          fontFamily="Impact, 'Arial Black', sans-serif"
          fontSize="68"
          fontWeight="black"
          fill="#c0281e"
          stroke="#3d0a06"
          strokeWidth="3.5"
          textAnchor="middle"
        >
          M
        </text>
      </g>
    </svg>
  );
};

// --- 2. THE MONSTER: PLUTONIUM DRAGON (Image 2) ---
export const PlutoniumDragonSvg: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 280 260"
    className={`select-none ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Dragon Wings */}
    <path
      d="M 180 110 C 210 50, 260 60, 270 110 C 255 125, 230 130, 200 135 Z"
      fill="#2e7d32"
      stroke="#1b5e20"
      strokeWidth="3.5"
    />
    <path d="M 220 85 L 205 130" stroke="#1b5e20" strokeWidth="2.5" />
    <path d="M 245 95 L 225 130" stroke="#1b5e20" strokeWidth="2.5" />

    {/* Tail with spade */}
    <path
      d="M 195 190 Q 250 200 260 160 Q 255 135 240 145"
      stroke="#1b5e20"
      strokeWidth="14"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M 240 145 L 255 130 L 265 145 L 255 160 Z"
      fill="#fbc02d"
      stroke="#1b5e20"
      strokeWidth="3"
    />

    {/* Dragon Body */}
    <ellipse cx="145" cy="165" rx="55" ry="50" fill="#43a047" stroke="#1b5e20" strokeWidth="4" />
    {/* Yellow Belly Plates */}
    <path
      d="M 115 145 Q 145 140 165 160 Q 155 195 125 205 Q 105 185 115 145 Z"
      fill="#fdd835"
      stroke="#f57f17"
      strokeWidth="3"
    />
    <path d="M 118 160 Q 140 160 155 165" stroke="#f57f17" strokeWidth="2.5" />
    <path d="M 120 178 Q 138 178 148 183" stroke="#f57f17" strokeWidth="2.5" />

    {/* Dragon Head */}
    <path
      d="M 125 125 L 85 115 C 60 115, 55 135, 75 145 L 120 150 Z"
      fill="#43a047"
      stroke="#1b5e20"
      strokeWidth="4"
    />
    {/* Horns */}
    <path d="M 120 115 Q 135 85 155 90 Q 138 105 130 120 Z" fill="#fbc02d" stroke="#1b5e20" strokeWidth="2.5" />
    <path d="M 110 112 Q 120 88 135 92 Q 125 106 118 118 Z" fill="#fbc02d" stroke="#1b5e20" strokeWidth="2" />

    {/* Sleepy / Cheeky Eye */}
    <ellipse cx="98" cy="126" rx="7" ry="8" fill="#ffffff" stroke="#1b5e20" strokeWidth="2" />
    <circle cx="97" cy="126" r="3.5" fill="#1b5e20" />
    {/* Heavy Eyelid */}
    <path d="M 91 123 Q 98 120 105 125" stroke="#1b5e20" strokeWidth="2.5" fill="none" />

    {/* Sharp Tooth */}
    <path d="M 75 145 L 80 155 L 85 147 Z" fill="#ffffff" stroke="#1b5e20" strokeWidth="1.5" />
    <path d="M 90 148 L 94 156 L 98 149 Z" fill="#ffffff" stroke="#1b5e20" strokeWidth="1.5" />

    {/* Nostril with smoke puffs */}
    <ellipse cx="68" cy="133" rx="2.5" ry="3.5" fill="#1b5e20" />
    <circle cx="52" cy="120" r="5" fill="#e8f5e9" stroke="#81c784" strokeWidth="1.5" opacity="0.8" />
    <circle cx="42" cy="112" r="7" fill="#e8f5e9" stroke="#81c784" strokeWidth="1.5" opacity="0.6" />

    {/* Claws */}
    <ellipse cx="115" cy="215" rx="14" ry="9" fill="#43a047" stroke="#1b5e20" strokeWidth="3" />
    <ellipse cx="160" cy="215" rx="14" ry="9" fill="#43a047" stroke="#1b5e20" strokeWidth="3" />
    <circle cx="106" cy="221" r="2.5" fill="#ffffff" stroke="#1b5e20" strokeWidth="1.5" />
    <circle cx="115" cy="223" r="2.5" fill="#ffffff" stroke="#1b5e20" strokeWidth="1.5" />
    <circle cx="124" cy="221" r="2.5" fill="#ffffff" stroke="#1b5e20" strokeWidth="1.5" />
  </svg>
);

// --- 3. THE MONSTER: HARPY PLAYING HARP (Image 3) ---
export const HarpySvg: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 240 240"
    className={`select-none ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Bat Wings */}
    <path
      d="M 90 100 C 60 60, 20 80, 25 120 C 45 115, 65 130, 85 135 Z"
      fill="#795548"
      stroke="#3e2723"
      strokeWidth="3.5"
    />
    <path d="M 45 85 L 55 120" stroke="#3e2723" strokeWidth="2" />
    <path d="M 30 100 L 45 122" stroke="#3e2723" strokeWidth="2" />

    {/* Body */}
    <ellipse cx="120" cy="140" rx="35" ry="40" fill="#a1887f" stroke="#3e2723" strokeWidth="3.5" />

    {/* Harpy Head */}
    <ellipse cx="120" cy="85" rx="28" ry="26" fill="#a1887f" stroke="#3e2723" strokeWidth="3.5" />
    {/* Big Pointy Bat Ears */}
    <path d="M 95 75 Q 80 50 90 40 Q 105 55 105 70 Z" fill="#d7ccc8" stroke="#3e2723" strokeWidth="2.5" />
    <path d="M 145 75 Q 160 50 150 40 Q 135 55 135 70 Z" fill="#d7ccc8" stroke="#3e2723" strokeWidth="2.5" />

    {/* Big Cartoon Eyes */}
    <ellipse cx="110" cy="82" rx="7" ry="9" fill="#ffffff" stroke="#3e2723" strokeWidth="2" />
    <circle cx="112" cy="83" r="3.5" fill="#3e2723" />
    <ellipse cx="130" cy="82" rx="7" ry="9" fill="#ffffff" stroke="#3e2723" strokeWidth="2" />
    <circle cx="132" cy="83" r="3.5" fill="#3e2723" />

    {/* Huge Cheeky Smile with sharp teeth */}
    <path d="M 102 98 Q 120 114 138 98" stroke="#3e2723" strokeWidth="3" fill="#ffffff" />
    <path d="M 112 100 L 114 105 L 118 101" stroke="#3e2723" strokeWidth="1.5" fill="#ffffff" />
    <path d="M 122 101 L 125 106 L 128 101" stroke="#3e2723" strokeWidth="1.5" fill="#ffffff" />

    {/* Golden Harp */}
    <path
      d="M 145 110 C 175 100, 195 120, 185 160 C 175 200, 150 205, 140 195 Z"
      stroke="#fbc02d"
      strokeWidth="7"
      strokeLinejoin="round"
      fill="none"
    />
    <path d="M 145 115 L 140 190" stroke="#fbc02d" strokeWidth="6" />
    {/* Strings */}
    <path d="M 152 118 L 150 188" stroke="#fff9c4" strokeWidth="1.5" />
    <path d="M 160 125 L 158 185" stroke="#fff9c4" strokeWidth="1.5" />
    <path d="M 168 135 L 165 180" stroke="#fff9c4" strokeWidth="1.5" />
    <path d="M 175 145 L 172 175" stroke="#fff9c4" strokeWidth="1.5" />

    {/* Bird Feet / Talons */}
    <path d="M 105 178 L 95 205 L 85 208" stroke="#3e2723" strokeWidth="3" fill="none" />
    <path d="M 130 178 L 125 205 L 115 208" stroke="#3e2723" strokeWidth="3" fill="none" />
  </svg>
);

// --- 4. THE MONSTER: SQUIDZILLA (Image 3) ---
export const SquidzillaSvg: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 240 240"
    className={`select-none ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Squid Head / Dome */}
    <path
      d="M 80 140 C 65 70, 175 70, 160 140 Z"
      fill="#66bb6a"
      stroke="#1b5e20"
      strokeWidth="4"
    />

    {/* Tiny Purple Wizard Hat! */}
    <path d="M 100 80 L 120 30 L 140 80 Z" fill="#7b1fa2" stroke="#4a148c" strokeWidth="2.5" />
    <ellipse cx="120" cy="80" rx="25" ry="7" fill="#7b1fa2" stroke="#4a148c" strokeWidth="2.5" />
    <circle cx="120" cy="55" r="2.5" fill="#ffd54f" />

    {/* Big round Googly Eyes */}
    <circle cx="100" cy="118" r="14" fill="#ffffff" stroke="#1b5e20" strokeWidth="3" />
    <circle cx="103" cy="119" r="6" fill="#1b5e20" />
    <circle cx="140" cy="118" r="14" fill="#ffffff" stroke="#1b5e20" strokeWidth="3" />
    <circle cx="137" cy="119" r="6" fill="#1b5e20" />

    {/* Tentacles waving */}
    <path
      d="M 80 140 Q 60 180 75 210 Q 90 200 88 150"
      fill="#81c784"
      stroke="#1b5e20"
      strokeWidth="3.5"
    />
    <path
      d="M 98 142 Q 105 190 100 215 Q 115 200 110 150"
      fill="#81c784"
      stroke="#1b5e20"
      strokeWidth="3.5"
    />
    <path
      d="M 125 142 Q 135 190 140 215 Q 148 200 138 150"
      fill="#81c784"
      stroke="#1b5e20"
      strokeWidth="3.5"
    />
    <path
      d="M 150 140 Q 180 180 165 210 Q 155 195 152 148"
      fill="#81c784"
      stroke="#1b5e20"
      strokeWidth="3.5"
    />

    {/* Suction Cups */}
    <circle cx="68" cy="190" r="3.5" fill="#c8e6c9" stroke="#1b5e20" strokeWidth="1.5" />
    <circle cx="106" cy="195" r="3.5" fill="#c8e6c9" stroke="#1b5e20" strokeWidth="1.5" />
    <circle cx="166" cy="190" r="3.5" fill="#c8e6c9" stroke="#1b5e20" strokeWidth="1.5" />
  </svg>
);

// --- 5. THE MUNCHKIN HERO CHARACTER (John Kovalic style) ---
export const MunchkinHeroSvg: React.FC<{
  hasHornedHelm?: boolean;
  hasSlimyArmor?: boolean;
  hasSword?: boolean;
  isWizard?: boolean;
  className?: string;
}> = ({
  hasHornedHelm = true,
  hasSlimyArmor = false,
  hasSword = true,
  isWizard = false,
  className = ''
}) => (
  <svg
    viewBox="0 0 160 220"
    className={`select-none ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Body / Tunic or Slimy Armor */}
    {hasSlimyArmor ? (
      <g>
        {/* Full Green Slimy Knight Armor (Image 3) */}
        <path
          d="M 50 110 L 40 165 L 115 165 L 105 110 Z"
          fill="#c8e6c9"
          stroke="#2e7d32"
          strokeWidth="3.5"
        />
        {/* Drips of Slime */}
        <path d="M 45 165 C 45 178 52 178 52 165" fill="#81c784" stroke="#2e7d32" strokeWidth="2" />
        <path d="M 75 165 C 75 182 85 182 85 165" fill="#81c784" stroke="#2e7d32" strokeWidth="2" />
        <path d="M 105 165 C 105 175 112 175 112 165" fill="#81c784" stroke="#2e7d32" strokeWidth="2" />
        {/* Armor Breastplate Lines */}
        <path d="M 60 125 L 95 125" stroke="#2e7d32" strokeWidth="2.5" />
        <path d="M 65 145 L 90 145" stroke="#2e7d32" strokeWidth="2.5" />
      </g>
    ) : (
      <g>
        {/* Classic Brown/Orange Tunic */}
        <path
          d="M 55 110 L 45 160 L 110 160 L 100 110 Z"
          fill="#bf5b27"
          stroke="#421a05"
          strokeWidth="3.5"
        />
        {/* Belt with buckle */}
        <rect x="44" y="142" width="67" height="9" fill="#2d1607" />
        <rect x="71" y="139" width="14" height="15" rx="2" fill="#ffd54f" stroke="#421a05" strokeWidth="2" />
      </g>
    )}

    {/* Legs & Shoes */}
    <path d="M 62 160 L 58 195" stroke="#421a05" strokeWidth="7" strokeLinecap="round" />
    <path d="M 92 160 L 96 195" stroke="#421a05" strokeWidth="7" strokeLinecap="round" />
    <ellipse cx="52" cy="198" rx="14" ry="7" fill="#4e342e" stroke="#2d1607" strokeWidth="3" />
    <ellipse cx="102" cy="198" rx="14" ry="7" fill="#4e342e" stroke="#2d1607" strokeWidth="3" />

    {/* Head */}
    <ellipse cx="78" cy="80" rx="26" ry="24" fill="#ffcc80" stroke="#421a05" strokeWidth="3.5" />
    {/* Big iconic cartoon nose */}
    <path d="M 85 75 Q 105 82 85 92" stroke="#421a05" strokeWidth="3.5" fill="#ffb74d" strokeLinecap="round" />
    {/* Cartoon Eyes */}
    <ellipse cx="73" cy="74" rx="4.5" ry="6" fill="#ffffff" stroke="#421a05" strokeWidth="2" />
    <circle cx="74" cy="74" r="2.5" fill="#421a05" />
    <ellipse cx="89" cy="73" rx="4.5" ry="6" fill="#ffffff" stroke="#421a05" strokeWidth="2" />
    <circle cx="90" cy="73" r="2.5" fill="#421a05" />
    {/* Big Kovalic Grin */}
    <path d="M 68 93 Q 80 102 92 92" stroke="#421a05" strokeWidth="3" strokeLinecap="round" fill="none" />

    {/* Headgear: Horned Helmet, Slimy Knight Visor, or Wizard Hat */}
    {hasSlimyArmor ? (
      <g>
        {/* Slimy Knight Helmet with Visor slit */}
        <path
          d="M 50 78 C 50 48 105 48 105 78 Z"
          fill="#c8e6c9"
          stroke="#2e7d32"
          strokeWidth="3.5"
        />
        {/* Knight Crest */}
        <path d="M 75 48 Q 78 30 92 38" stroke="#2e7d32" strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* Visor Slit */}
        <path d="M 60 70 L 95 70" stroke="#1b5e20" strokeWidth="4" strokeLinecap="round" />
      </g>
    ) : isWizard ? (
      <g>
        {/* Wizard Hat */}
        <path d="M 50 68 L 78 15 L 105 68 Z" fill="#6a1b9a" stroke="#311b92" strokeWidth="3" />
        <ellipse cx="78" cy="68" rx="35" ry="9" fill="#6a1b9a" stroke="#311b92" strokeWidth="3" />
        <circle cx="78" cy="40" r="3" fill="#ffd54f" />
      </g>
    ) : hasHornedHelm ? (
      <g>
        {/* Horned Viking Helmet (Image 2) */}
        <path
          d="M 52 72 C 52 48 103 48 103 72 Z"
          fill="#b0bec5"
          stroke="#37474f"
          strokeWidth="3.5"
        />
        <rect x="50" y="68" width="55" height="7" rx="2" fill="#78909c" stroke="#37474f" strokeWidth="2" />
        {/* Left Horn */}
        <path d="M 54 68 Q 30 55 42 35 Q 52 48 57 62" fill="#eceff1" stroke="#37474f" strokeWidth="3" />
        {/* Right Horn */}
        <path d="M 101 68 Q 125 55 113 35 Q 103 48 98 62" fill="#eceff1" stroke="#37474f" strokeWidth="3" />
      </g>
    ) : null}

    {/* Arms & Weapon */}
    {hasSword && (
      <g>
        {/* Left Hand holding sword */}
        <path d="M 45 125 L 30 145" stroke="#421a05" strokeWidth="6" strokeLinecap="round" />
        <circle cx="28" cy="148" r="6" fill="#ffb74d" stroke="#421a05" strokeWidth="2" />
        {/* The Sword */}
        <path d="M 28 145 L 28 95" stroke="#b0bec5" strokeWidth="5" strokeLinecap="round" />
        <path d="M 28 95 L 24 105 L 32 105 Z" fill="#cfd8dc" />
        {/* Sword Crossguard and Pommel */}
        <path d="M 20 143 L 36 143" stroke="#ffd54f" strokeWidth="4" strokeLinecap="round" />
        <circle cx="28" cy="155" r="3" fill="#ffd54f" />
      </g>
    )}
  </svg>
);

// --- 6. HERALDIC BATTLE SHIELDS (Image 2 & 3) ---
export const CombatShieldBadge: React.FC<{
  score: number;
  isHero?: boolean;
  className?: string;
}> = ({ score, isHero = true, className = '' }) => (
  <div className={`relative flex items-center justify-center select-none ${className}`}>
    <svg viewBox="0 0 100 120" className="w-16 h-20 sm:w-20 sm:h-24 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)]">
      {/* Crossed Swords Behind Shield */}
      <path d="M 15 15 L 85 105" stroke="#37474f" strokeWidth="6" strokeLinecap="round" />
      <path d="M 85 15 L 15 105" stroke="#37474f" strokeWidth="6" strokeLinecap="round" />
      <circle cx="15" cy="15" r="4" fill="#ffd54f" stroke="#37474f" strokeWidth="1.5" />
      <circle cx="85" cy="15" r="4" fill="#ffd54f" stroke="#37474f" strokeWidth="1.5" />

      {/* Medieval Shield Body */}
      <path
        d="M 22 25 L 78 25 C 78 65, 75 95, 50 115 C 25 95, 22 65, 22 25 Z"
        fill={isHero ? '#c62828' : '#b71c1c'}
        stroke="#ffd54f"
        strokeWidth="4"
      />
      <path
        d="M 28 30 L 72 30 C 72 65, 70 88, 50 105 C 30 88, 28 65, 28 30 Z"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeOpacity="0.4"
      />

      {/* Score Number in Center (Scaled for single and double digit scores) */}
      <text
        x="50"
        y={score >= 10 ? 73 : 75}
        fontFamily="'Rubik', 'Impact', sans-serif"
        fontSize={score >= 10 ? "32" : "38"}
        fontWeight="900"
        fill="#ffffff"
        stroke="#3e0a0a"
        strokeWidth="2"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {score}
      </text>
    </svg>
  </div>
);

// --- 7. DUNGEON BARREL WITH SWORD & SKULL (Image 1) ---
export const DungeonBarrelSvg: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 140 160"
    className={`select-none ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Wooden Barrel */}
    <ellipse cx="70" cy="50" rx="36" ry="12" fill="#5d4037" stroke="#271c19" strokeWidth="3" />
    <path
      d="M 34 50 C 22 85 22 115 38 145 C 55 152 85 152 102 145 C 118 115 118 85 106 50 Z"
      fill="#6d4c41"
      stroke="#271c19"
      strokeWidth="3.5"
    />
    {/* Steel Hoops */}
    <path d="M 26 80 Q 70 95 114 80" stroke="#37474f" strokeWidth="5" fill="none" />
    <path d="M 27 120 Q 70 135 113 120" stroke="#37474f" strokeWidth="5" fill="none" />

    {/* Sword Stuck in Barrel */}
    <path d="M 95 65 L 125 155" stroke="#b0bec5" strokeWidth="4" strokeLinecap="round" />
    <path d="M 85 75 L 105 60" stroke="#ffd54f" strokeWidth="3" strokeLinecap="round" />
    <circle cx="84" cy="76" r="3" fill="#ffd54f" />

    {/* Skull next to Barrel */}
    <ellipse cx="40" cy="145" rx="14" ry="11" fill="#f5f5f5" stroke="#37474f" strokeWidth="2.5" />
    <circle cx="36" cy="144" r="3" fill="#263238" />
    <circle cx="44" cy="144" r="3" fill="#263238" />
    <path d="M 36 152 L 44 152" stroke="#263238" strokeWidth="1.5" />
  </svg>
);

// --- 8. DUNGEON TORCH WITH ANIMATED FLAME ---
export const DungeonTorchSvg: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 60 100"
    className={`select-none ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Stone wall bracket */}
    <rect x="25" y="45" width="10" height="40" fill="#37474f" stroke="#101518" strokeWidth="2" />
    <path d="M 18 45 L 42 45 L 36 60 L 24 60 Z" fill="#455a64" stroke="#101518" strokeWidth="2" />

    {/* Animated Torch Flame */}
    <g className="animate-pulse origin-bottom">
      {/* Outer Fire Glow */}
      <circle cx="30" cy="30" r="22" fill="#ff6f00" opacity="0.3" filter="blur(6px)" />
      {/* Outer Flame */}
      <path
        d="M 30 8 C 42 22 45 35 30 45 C 15 35 18 22 30 8 Z"
        fill="#ff5722"
      />
      {/* Mid Flame */}
      <path
        d="M 30 15 C 38 25 40 35 30 42 C 20 35 22 25 30 15 Z"
        fill="#ff9800"
      />
      {/* Inner Hot Yellow Core */}
      <path
        d="M 30 24 C 34 30 35 36 30 40 C 25 36 26 30 30 24 Z"
        fill="#ffeb3b"
      />
    </g>
  </svg>
);
