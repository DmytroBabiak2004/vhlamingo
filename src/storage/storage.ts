import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppSettings, GameCard } from "@/types";

const KEYS = {
  CUSTOM_CARDS: "@vhlamingo/custom_cards",
  SETTINGS: "@vhlamingo/settings",
  USED_CARD_IDS: "@vhlamingo/used_card_ids",
  REMOVED_BASE_CARD_IDS: "@vhlamingo/removed_base_card_ids",
  AGE_CONFIRMED: "@vhlamingo/age_confirmed",
} as const;

const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  hapticsEnabled: true,
  theme: "dark",
};

/**
 * Черга запису по кожному ключу AsyncStorage.
 *
 * Проблема, яку це вирішує: виклики на кшталт
 * `saveCustomCards(...).catch(() => undefined)` не очікуються (fire-and-forget)
 * і можуть виконуватись паралельно. Якщо користувач швидко зробить дві дії
 * підряд (напр. видалити картку, а потім одразу натиснути "Відновити базові"),
 * порядок ЗАВЕРШЕННЯ операцій AsyncStorage не гарантовано збігається
 * з порядком їх ВИКЛИКУ — старіший запис може дописатись пізніше і
 * затерти новіший стан застарілими даними.
 *
 * Рішення: для кожного ключа тримаємо "хвіст" (tail) — проміс останньої
 * запланованої операції запису/видалення. Кожен новий запис приєднується
 * до цього хвоста через `.then(...)`, тож операції для одного й того ж
 * ключа завжди виконуються СТРОГО в порядку виклику, одна за одною,
 * незалежно від того, чи хтось очікує (await) результат.
 */
const writeQueues = new Map<string, Promise<void>>();

function enqueueWrite(key: string, operation: () => Promise<void>): Promise<void> {
  const previous = writeQueues.get(key) ?? Promise.resolve();
  // `.catch()` тут потрібен, щоб помилка попередньої операції в черзі
  // не "заблокувала" назавжди виконання наступних операцій для цього ключа.
  const next = previous.catch(() => undefined).then(operation);
  writeQueues.set(key, next);
  return next;
}

export async function getCustomCards(): Promise<GameCard[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.CUSTOM_CARDS);
    return raw ? (JSON.parse(raw) as GameCard[]) : [];
  } catch {
    return [];
  }
}

export function saveCustomCards(cards: GameCard[]): Promise<void> {
  return enqueueWrite(KEYS.CUSTOM_CARDS, async () => {
    try {
      await AsyncStorage.setItem(KEYS.CUSTOM_CARDS, JSON.stringify(cards));
    } catch (error) {
      console.error("Failed to save custom cards:", error);
    }
  });
}

export function clearCustomCards(): Promise<void> {
  return enqueueWrite(KEYS.CUSTOM_CARDS, async () => {
    try {
      await AsyncStorage.removeItem(KEYS.CUSTOM_CARDS);
    } catch (error) {
      console.error("Failed to clear custom cards:", error);
    }
  });
}

export async function getSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): Promise<void> {
  return enqueueWrite(KEYS.SETTINGS, async () => {
    try {
      await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  });
}

export async function getUsedCardIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.USED_CARD_IDS);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function saveUsedCardIds(ids: string[]): Promise<void> {
  return enqueueWrite(KEYS.USED_CARD_IDS, async () => {
    try {
      await AsyncStorage.setItem(KEYS.USED_CARD_IDS, JSON.stringify(ids));
    } catch (error) {
      console.error("Failed to save used card ids:", error);
    }
  });
}

export function clearUsedCardIds(): Promise<void> {
  return enqueueWrite(KEYS.USED_CARD_IDS, async () => {
    try {
      await AsyncStorage.removeItem(KEYS.USED_CARD_IDS);
    } catch (error) {
      console.error("Failed to clear used card ids:", error);
    }
  });
}

export async function getRemovedBaseCardIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.REMOVED_BASE_CARD_IDS);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function saveRemovedBaseCardIds(ids: string[]): Promise<void> {
  return enqueueWrite(KEYS.REMOVED_BASE_CARD_IDS, async () => {
    try {
      await AsyncStorage.setItem(KEYS.REMOVED_BASE_CARD_IDS, JSON.stringify(ids));
    } catch (error) {
      console.error("Failed to save removed base card ids:", error);
    }
  });
}

export async function getAgeConfirmed(): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.AGE_CONFIRMED);
    return raw === "true";
  } catch {
    return false;
  }
}

export function saveAgeConfirmed(value: boolean): Promise<void> {
  return enqueueWrite(KEYS.AGE_CONFIRMED, async () => {
    try {
      await AsyncStorage.setItem(KEYS.AGE_CONFIRMED, value ? "true" : "false");
    } catch (error) {
      console.error("Failed to save age confirmed:", error);
    }
  });
}
