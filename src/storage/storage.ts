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

export async function getCustomCards(): Promise<GameCard[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.CUSTOM_CARDS);
    return raw ? (JSON.parse(raw) as GameCard[]) : [];
  } catch {
    return [];
  }
}

export async function saveCustomCards(cards: GameCard[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.CUSTOM_CARDS, JSON.stringify(cards));
}

export async function clearCustomCards(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.CUSTOM_CARDS);
}

export async function getSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}

export async function getUsedCardIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.USED_CARD_IDS);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export async function saveUsedCardIds(ids: string[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.USED_CARD_IDS, JSON.stringify(ids));
}

export async function clearUsedCardIds(): Promise<void> {
  await AsyncStorage.removeItem(KEYS.USED_CARD_IDS);
}

export async function getRemovedBaseCardIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.REMOVED_BASE_CARD_IDS);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export async function saveRemovedBaseCardIds(ids: string[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.REMOVED_BASE_CARD_IDS, JSON.stringify(ids));
}

/** Чи підтвердив користувач вік (18+) і застереження про відповідальну гру. */
export async function getAgeConfirmed(): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.AGE_CONFIRMED);
    return raw === "true";
  } catch {
    return false;
  }
}

export async function saveAgeConfirmed(value: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.AGE_CONFIRMED, value ? "true" : "false");
}