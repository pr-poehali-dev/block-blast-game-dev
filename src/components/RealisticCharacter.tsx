interface RealisticCharacterProps {
  level: number;
  clickAnimation: boolean;
  onClick: () => void;
}

export default function RealisticCharacter({ level, clickAnimation, onClick }: RealisticCharacterProps) {
  const getMuscleScale = () => {
    return 1 + (level * 0.05);
  };

  const getSkinTone = () => {
    if (level < 5) return '#FFD6A5';
    if (level < 10) return '#E8B896';
    if (level < 20) return '#D4A574';
    return '#C89968';
  };

  const getMuscleDefinition = () => {
    return Math.min(level * 3, 50);
  };

  return (
    <button
      onClick={onClick}
      className={`relative transition-all duration-200 cursor-pointer hover:scale-105 ${
        clickAnimation ? 'scale-110' : 'scale-100'
      }`}
      style={{ transform: `scale(${clickAnimation ? 1.1 : 1})` }}
    >
      <svg
        width="200"
        height="300"
        viewBox="0 0 200 300"
        style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}
      >
        <defs>
          <linearGradient id="skinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={getSkinTone()} />
            <stop offset="100%" stopColor={getSkinTone()} stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="hairGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3D2817" />
            <stop offset="100%" stopColor="#2A1810" />
          </linearGradient>
          <linearGradient id="muscleHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
          </linearGradient>
          <radialGradient id="muscleDepth">
            <stop offset="0%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
          </radialGradient>
        </defs>

        <g transform={`scale(${getMuscleScale()})`} transformOrigin="100 150">
          <ellipse cx="100" cy="50" rx="35" ry="42" fill="url(#skinGradient)" />
          
          <ellipse cx="100" cy="35" rx="38" ry="35" fill="url(#hairGradient)" />
          <path
            d="M 65 40 Q 70 25 100 20 Q 130 25 135 40"
            fill="url(#hairGradient)"
            stroke="none"
          />

          <ellipse cx="85" cy="48" rx="5" ry="7" fill="#2C1810" />
          <ellipse cx="115" cy="48" rx="5" ry="7" fill="#2C1810" />
          <ellipse cx="86" cy="49" rx="2" ry="3" fill="#000" />
          <ellipse cx="116" cy="49" rx="2" ry="3" fill="#000" />

          <path d="M 75 42 Q 80 40 85 42" stroke="#5C3A21" strokeWidth="1.5" fill="none" />
          <path d="M 115 42 Q 110 40 105 42" stroke="#5C3A21" strokeWidth="1.5" fill="none" />

          <path d="M 90 62 Q 100 65 110 62" stroke="#C89" strokeWidth="1" fill="none" />
          <ellipse cx="100" cy="58" rx="8" ry="6" fill="#D4A0A0" opacity="0.3" />

          <rect x="70" y="75" width="60" height="50" rx="15" fill="url(#skinGradient)" />
          <ellipse cx="100" cy="100" rx="28" ry="25" fill="url(#muscleHighlight)" opacity="0.3" />
          
          <line x1="100" y1="85" x2="100" y2="115" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" />
          <ellipse cx="85" cy="95" rx="8" ry="12" fill="url(#muscleDepth)" />
          <ellipse cx="115" cy="95" rx="8" ry="12" fill="url(#muscleDepth)" />

          <ellipse
            cx="50"
            cy="95"
            rx={15 + getMuscleDefinition() / 5}
            ry={22 + getMuscleDefinition() / 3}
            fill="url(#skinGradient)"
          />
          <ellipse
            cx="50"
            cy="95"
            rx={12 + getMuscleDefinition() / 6}
            ry={18 + getMuscleDefinition() / 4}
            fill="url(#muscleHighlight)"
            opacity="0.4"
          />
          <ellipse cx="50" cy="90" rx="10" ry="8" fill="url(#muscleDepth)" />

          <ellipse
            cx="150"
            cy="95"
            rx={15 + getMuscleDefinition() / 5}
            ry={22 + getMuscleDefinition() / 3}
            fill="url(#skinGradient)"
          />
          <ellipse
            cx="150"
            cy="95"
            rx={12 + getMuscleDefinition() / 6}
            ry={18 + getMuscleDefinition() / 4}
            fill="url(#muscleHighlight)"
            opacity="0.4"
          />
          <ellipse cx="150" cy="90" rx="10" ry="8" fill="url(#muscleDepth)" />

          <rect x="75" y="120" width="50" height="60" rx="8" fill="#2C5F8D" />
          <rect x="77" y="122" width="46" height="56" rx="6" fill="#4A90E2" opacity="0.8" />
          <line x1="100" y1="125" x2="100" y2="175" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

          <rect x="78" y="175" width="18" height="55" rx="5" fill="url(#skinGradient)" />
          <rect x="104" y="175" width="18" height="55" rx="5" fill="url(#skinGradient)" />
          
          <ellipse cx="87" cy="195" rx="7" ry="12" fill="url(#muscleDepth)" />
          <ellipse cx="113" cy="195" rx="7" ry="12" fill="url(#muscleDepth)" />

          <ellipse cx="87" cy="228" rx="10" ry="8" fill="#2C2C2C" />
          <ellipse cx="113" cy="228" rx="10" ry="8" fill="#2C2C2C" />

          <rect x="30" y="130" width="22" height="50" rx="6" fill="url(#skinGradient)" />
          <rect x="148" y="130" width="22" height="50" rx="6" fill="url(#skinGradient)" />
          
          <ellipse cx="41" cy="145" rx="8" ry="15" fill="url(#muscleDepth)" />
          <ellipse cx="159" cy="145" rx="8" ry="15" fill="url(#muscleDepth)" />

          <circle cx="35" cy="178" r="12" fill="url(#skinGradient)" />
          <circle cx="165" cy="178" r="12" fill="url(#skinGradient)" />
          <circle cx="35" cy="178" r="8" fill="url(#muscleHighlight)" opacity="0.3" />
          <circle cx="165" cy="178" r="8" fill="url(#muscleHighlight)" opacity="0.3" />
        </g>

        {level >= 5 && (
          <g opacity="0.8">
            <circle cx="150" cy="95" r="3" fill="#FFD700" />
            <circle cx="145" cy="98" r="2" fill="#FFD700" />
            <circle cx="155" cy="98" r="2" fill="#FFD700" />
          </g>
        )}

        {level >= 10 && (
          <g>
            <path
              d="M 90 115 Q 100 118 110 115"
              stroke="#E74C3C"
              strokeWidth="2"
              fill="none"
            />
          </g>
        )}
      </svg>

      {clickAnimation && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-3xl font-bold">
          💪
        </div>
      )}
    </button>
  );
}
