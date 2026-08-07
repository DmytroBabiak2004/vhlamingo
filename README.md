# 🦩 Вхламінго

Алкогольна карткова гра для компанії друзів. React Native (Expo) + TypeScript.

## Запуск

```bash
npm install
npx expo start
```

Відскануй QR-код застосунком **Expo Go** (Android/iOS) або запусти на емуляторі:

```bash
npm run ios      # iOS симулятор
npm run android  # Android емулятор
```

## Структура проєкту

```
App.tsx                    Кореневий компонент
src/
  animations/               Місце для окремих reanimated-послідовностей
  components/                Перевикористовувані UI-компоненти
    FlipCard.tsx              Картка з 3D flip-анімацією
    FlamingoLogo.tsx           SVG-логотип фламінго
    GradientBackground.tsx      Фоновий градієнт + світлові плями
    GlowButton.tsx               Кнопка (solid / glass) з press-анімацією
    GlassPanel.tsx                 Glassmorphism-контейнер
    CardCounter.tsx                 Лічильник "показано / всього"
  constants/
    colors.ts                 Кольорова палітра, градієнти, тіні, радіуси
    quotes.ts                  Випадкові цитати на Splash Screen
  data/
    cards.ts                   Базова колода (229 унікальних карток)
  hooks/
    useDeck.ts                 Логіка колоди: перемішування, показ, збереження прогресу
    useSettings.ts              Налаштування звуку/вібрації/теми
  navigation/
    AppNavigator.tsx             React Navigation Native Stack
  screens/
    SplashScreen.tsx              Заставка з анімацією появи
    HomeScreen.tsx                  Головний ігровий екран
    MenuScreen.tsx                   Меню: правила, про гру, керування картками
    RulesScreen.tsx                   Правила гри
    AboutScreen.tsx                    Про гру
    AddCardScreen.tsx                   Додавання/редагування/видалення власних карток
  services/
    soundService.ts               Відтворення звуку перевороту картки
  storage/
    storage.ts                     AsyncStorage: власні картки, налаштування, прогрес колоди
  types/
    index.ts                        Спільні TypeScript-типи
  utils/
    shuffle.ts                       Fisher–Yates shuffle, генерація id
assets/
  icon.png, adaptive-icon.png, splash.png, favicon.png   Плейсхолдер-іконки (заміни на власні)
  sounds/flip.mp3                                         Короткий звук перевороту картки
```

## Ключова логіка

- **Колода без повторів**: при старті `useDeck` перемішує масив карток
  (базові + власні) алгоритмом Фішера–Єйтса та зберігає вказівник у
  AsyncStorage, тож прогрес не губиться при перезапуску.
- **Flip-анімація**: `FlipCard` використовує `react-native-reanimated` для
  3D-повороту (`rotateY`) з легким bounce-ефектом після завершення.
- **Власні картки**: додаються, редагуються й видаляються на екрані
  `AddCardScreen`, зберігаються окремо в AsyncStorage і додаються до
  основної колоди при кожному новому перемішуванні.
- **Завершення колоди**: коли всі картки показано, з'являється екран
  "Колода закінчилась 🍻" з конфеті та кнопкою "Перемішати заново".

## Заміна плейсхолдер-ассетів

`assets/icon.png`, `assets/splash.png`, `assets/adaptive-icon.png` та
`assets/sounds/flip.mp3` — прості згенеровані заглушки. Заміни їх на власні
фінальні файли перед публікацією в App Store / Google Play.

## Технології

React Native · Expo · TypeScript · React Navigation · React Native
Reanimated · React Native Gesture Handler · AsyncStorage · expo-av ·
expo-haptics · expo-linear-gradient · expo-blur · react-native-svg ·
react-native-confetti-cannon
