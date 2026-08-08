import { useWindowDimensions } from "react-native";

/**
 * Єдина система адаптивності застосунку.
 * Базові розміри — це референсний макет (iPhone 13 mini / стандартний компактний телефон).
 * Усі значення масштабуються відносно поточних розмірів вікна, а не "зашиваються" в кожен екран окремо.
 */

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/** Масштабує розмір відносно ширини екрана (для горизонтальних відступів, ширини елементів). */
export function scaleWidth(size: number, width: number) {
  return (size * width) / BASE_WIDTH;
}

/** Масштабує розмір відносно висоти екрана (для вертикальних відступів, висоти елементів). */
export function scaleHeight(size: number, height: number) {
  return (size * height) / BASE_HEIGHT;
}

/**
 * "Помірне" масштабування — використовується для шрифтів, щоб текст не ставав
 * занадто великим на планшетах і занадто дрібним на малих екранах.
 */
export function moderateScale(size: number, width: number, factor = 0.5) {
  return size + (scaleWidth(size, width) - size) * factor;
}

export const Breakpoints = {
  isTinyHeight: (h: number) => h < 600, // iPhone SE, старі Android, Telegram WebView
  isShortHeight: (h: number) => h < 700,
  isTablet: (w: number) => w >= 768,
  isLargePhone: (w: number) => w >= 400,
};

export interface Responsive {
  width: number;
  height: number;
  isTinyHeight: boolean;
  isShortHeight: boolean;
  isTablet: boolean;
  isLandscape: boolean;
  /** Масштаб по ширині (відступи, розміри елементів по горизонталі). */
  sw: (size: number) => number;
  /** Масштаб по висоті (відступи, висота елементів). */
  sh: (size: number) => number;
  /** Масштаб шрифту (помірний, з обмеженнями). */
  font: (size: number, min?: number, max?: number) => number;
  clamp: typeof clamp;
}

export function useResponsive(): Responsive {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return {
    width,
    height,
    isTinyHeight: Breakpoints.isTinyHeight(height),
    isShortHeight: Breakpoints.isShortHeight(height),
    isTablet: Breakpoints.isTablet(width),
    isLandscape,
    sw: (size: number) => scaleWidth(size, width),
    sh: (size: number) => scaleHeight(size, height),
    font: (size: number, min?: number, max?: number) => {
      const scaled = moderateScale(size, width);
      if (min !== undefined && max !== undefined) return clamp(scaled, min, max);
      return scaled;
    },
    clamp,
  };
}
