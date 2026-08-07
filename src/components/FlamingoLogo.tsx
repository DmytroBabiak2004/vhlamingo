import React from "react";
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
} from "react-native-svg";

interface FlamingoLogoProps {
  size?: number;
}

/**
 * Преміальний векторалізований логотип "Вхламінго" v3.1 (Ultimate Edition)
 * Оновлені окуляри: стильний кіберпанк-візор з неоновим відблиском.
 */
export function FlamingoLogo({ size = 120 }: FlamingoLogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <Defs>
        {/* Неонове світіння фону */}
        <RadialGradient id="neonGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <Stop offset="0%" stopColor="#FF007F" stopOpacity="0.25" />
          <Stop offset="60%" stopColor="#7B2CBF" stopOpacity="0.08" />
          <Stop offset="100%" stopColor="#FF007F" stopOpacity="0" />
        </RadialGradient>

        {/* Основний градієнт тіла (Sunset Pink) */}
        <LinearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FF1B6B" />
          <Stop offset="50%" stopColor="#FF007F" />
          <Stop offset="100%" stopColor="#D62828" />
        </LinearGradient>

        {/* Градієнт крила (Deep Purple to Pink) */}
        <LinearGradient id="wingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#FF70A6" />
          <Stop offset="100%" stopColor="#7B2CBF" />
        </LinearGradient>

        {/* Дзьоб */}
        <LinearGradient id="beakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="45%" stopColor="#FFB4A2" />
          <Stop offset="100%" stopColor="#110005" />
        </LinearGradient>

        {/* Золото для корони та напою */}
        <LinearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FFEA00" />
          <Stop offset="100%" stopColor="#FF7A00" />
        </LinearGradient>

        {/* Градієнт для лінзи окулярів */}
        <LinearGradient id="visorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#00F0FF" />
          <Stop offset="100%" stopColor="#FF007F" />
        </LinearGradient>
      </Defs>

      {/* 1. Фонова Аура */}
      <Circle cx="100" cy="100" r="100" fill="url(#neonGlow)" />

      {/* 2. Преміальні Зірки (UI Sparkles) */}
      <Path d="M 25 45 Q 30 45 30 40 Q 30 45 35 45 Q 30 45 30 50 Q 30 45 25 45 Z" fill="#00F0FF" opacity="0.8" />
      <Path d="M 160 30 Q 168 30 168 22 Q 168 30 176 30 Q 168 30 168 38 Q 168 30 160 30 Z" fill="url(#goldGradient)" />
      <Path d="M 150 150 Q 155 150 155 145 Q 155 150 160 150 Q 155 150 155 155 Q 155 150 150 150 Z" fill="#FF1B6B" opacity="0.9" />
      <Circle cx="170" cy="110" r="2.5" fill="#00F0FF" opacity="0.5" />
      <Circle cx="40" cy="160" r="3" fill="#FFEA00" opacity="0.6" />

      {/* 3. Ноги (Анатомічно правильна поза) */}
      <Path
        d="M 105 135 L 105 185 M 95 185 L 115 185"
        stroke="#D62828"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <Path
        d="M 85 135 L 75 160 L 95 175 M 90 175 L 102 178"
        stroke="#FF70A6"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 4. Тіло, Шия та Голова */}
      <Path
        d="M 140 100 
           C 140 145, 60 145, 60 110 
           C 60 80, 85 45, 100 35 
           C 115 25, 125 40, 110 50 
           C 95 55, 85 75, 90 100 
           C 100 110, 120 100, 140 100 Z"
        fill="url(#bodyGradient)"
      />

      {/* 5. Дзьоб */}
      <Path
        d="M 97 38 C 80 35 60 45 60 65 C 75 58 85 50 100 48 Z"
        fill="url(#beakGradient)"
      />

      {/* 6. Динамічне Крило */}
      <Path
        d="M 75 105 C 90 90 125 95 130 115 C 110 125 80 120 75 105 Z"
        fill="url(#wingGradient)"
      />

      {/* 7. Неоновий Келих Мартіні */}
      <Path d="M 30 75 L 60 75 L 45 95 Z" stroke="#00F0FF" strokeWidth="2" strokeLinejoin="round" />
      <Path d="M 35 80 L 55 80 L 45 93 Z" fill="url(#goldGradient)" />
      <Path d="M 45 95 L 45 115 M 35 115 L 55 115" stroke="#00F0FF" strokeWidth="2" strokeLinecap="round" />
      <Circle cx="42" cy="85" r="3" fill="#8CB369" />
      <Path d="M 40 83 L 44 87" stroke="#FFF" strokeWidth="1" strokeLinecap="round" />

      {/* 8. Окуляри (Стильний Cyberpunk Visor) */}
      {/* Чорна оправа */}
      <Path
        d="M 78 30 L 112 28 L 118 32 L 115 42 L 98 40 L 82 46 Z"
        fill="#0A0002"
        stroke="#00F0FF"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Яскрава неонова лінза */}
      <Path
        d="M 80 32 L 110 30 L 114 34 L 112 40 L 98 38 L 84 43 Z"
        fill="url(#visorGradient)"
      />
      {/* Світловий відблиск на склі */}
      <Path
        d="M 82 34 L 108 32 L 105 35 L 85 37 Z"
        fill="#FFFFFF"
        opacity="0.7"
      />

      {/* 9. Геометрична Корона */}
      <Path
        d="M 93 25 L 88 10 L 103 16 L 118 10 L 110 27 C 105 28 98 28 93 25 Z"
        fill="url(#goldGradient)"
      />
      <Circle cx="88" cy="10" r="1.5" fill="#FFF" />
      <Circle cx="103" cy="16" r="1.5" fill="#FFF" />
      <Circle cx="118" cy="10" r="1.5" fill="#FFF" />
    </Svg>
  );
}