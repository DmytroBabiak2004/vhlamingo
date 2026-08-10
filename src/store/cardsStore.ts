import { useSyncExternalStore, useEffect } from "react";
import { GameCard } from "@/types";
import { BASE_CARDS } from "@/data/cards";
import {
  getCustomCards,
  saveCustomCards,
  getRemovedBaseCardIds,
  saveRemovedBaseCardIds,
  clearUsedCardIds,
} from "@/storage/storage";
import { generateId } from "@/utils/shuffle";

interface CardsState {
  customCards: GameCard[];
  removedBaseIds: string[];
  isLoaded: boolean;
}

let state: CardsState = {
  customCards: [],
  removedBaseIds: [],
  isLoaded: false,
};

let loadPromise: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

export function ensureLoaded(): Promise<void> {
  if (state.isLoaded) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = Promise.all([getCustomCards(), getRemovedBaseCardIds()])
    .then(([customCards, removedBaseIds]) => {
      state = { customCards, removedBaseIds, isLoaded: true };
      emit();
    })
    .catch((err) => {
      console.error("Помилка завантаження карток:", err);
      state = { ...state, isLoaded: true };
      emit();
    })
    .finally(() => {
      loadPromise = null;
    });

  return loadPromise;
}

// Завантажуємо стан одразу при імпорті
ensureLoaded();

export function useCardsStore(): CardsState {
  useEffect(() => {
    ensureLoaded();
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, () => state);
}

/** Реактивний хук для отримання всіх активних карток */
export function useActiveCards(): GameCard[] {
  const { customCards, removedBaseIds } = useCardsStore();
  const removedSet = new Set(removedBaseIds.map(String));
  const base = BASE_CARDS.filter((c) => !removedSet.has(String(c.id)));
  return [...base, ...customCards];
}

/** Синхронна функція для зчитування карток поза React */
export function getActiveCards(): GameCard[] {
  const removedSet = new Set(state.removedBaseIds.map(String));
  const base = BASE_CARDS.filter((c) => !removedSet.has(String(c.id)));
  return [...base, ...state.customCards];
}

export function addCustomCard(text: string, category: string = "Власна") {
  const trimmed = text.trim();
  if (!trimmed) return;

  const card: GameCard = {
    id: String(generateId()),
    text: trimmed,
    category: category as GameCard["category"],
    isCustom: true,
  };

  state = { ...state, customCards: [card, ...state.customCards] };
  emit();
  saveCustomCards(state.customCards).catch(() => undefined);
}

export function updateCustomCard(id: string | number, text: string) {
  const trimmed = text.trim();
  if (!trimmed) return;

  const targetId = String(id);
  state = {
    ...state,
    customCards: state.customCards.map((c) =>
      String(c.id) === targetId ? { ...c, text: trimmed } : c
    ),
  };
  emit();
  saveCustomCards(state.customCards).catch(() => undefined);
}

export function deleteCustomCard(id: string | number) {
  const targetId = String(id);
  state = {
    ...state,
    customCards: state.customCards.filter((c) => String(c.id) !== targetId),
  };
  emit();
  saveCustomCards(state.customCards).catch(() => undefined);
}

export function removeBaseCard(id: string | number) {
  const targetId = String(id);
  if (state.removedBaseIds.map(String).includes(targetId)) return;

  state = { ...state, removedBaseIds: [...state.removedBaseIds, targetId] };
  emit();
  saveRemovedBaseCardIds(state.removedBaseIds).catch(() => undefined);
}

export function restoreBaseCard(id: string | number) {
  const targetId = String(id);
  state = {
    ...state,
    removedBaseIds: state.removedBaseIds.filter((x) => String(x) !== targetId),
  };
  emit();
  saveRemovedBaseCardIds(state.removedBaseIds).catch(() => undefined);
}

export async function resetAllToDefaults() {
  state = { customCards: [], removedBaseIds: [], isLoaded: true };
  emit();
  await Promise.all([
    saveCustomCards([]),
    saveRemovedBaseCardIds([]),
    clearUsedCardIds(),
  ]);
}