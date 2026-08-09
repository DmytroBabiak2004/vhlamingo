import { useSyncExternalStore } from "react";
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

/**
 * Спільне сховище карток. Раніше useDeck() читав картки зі storage лише
 * один раз при монтуванні HomeScreen, тож додані/видалені на AddCardScreen
 * картки не потрапляли в поточну гру без перезапуску застосунку. Тепер
 * будь-яка зміна тут одразу транслюється в useDeck() через підписку.
 */
let state: CardsState = { customCards: [], removedBaseIds: [], isLoaded: false };
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

function ensureLoaded() {
  if (state.isLoaded || loadPromise) return loadPromise;
  loadPromise = Promise.all([getCustomCards(), getRemovedBaseCardIds()]).then(
    ([customCards, removedBaseIds]) => {
      state = { customCards, removedBaseIds, isLoaded: true };
      emit();
    }
  );
  return loadPromise;
}

export function useCardsStore(): CardsState {
  ensureLoaded();
  return useSyncExternalStore(subscribe, getSnapshot, () => state);
}

/** Активна колода: базові картки (мінус видалені) + власні. */
export function getActiveCards(): GameCard[] {
  const base = BASE_CARDS.filter((c) => !state.removedBaseIds.includes(c.id));
  return [...base, ...state.customCards];
}

export function addCustomCard(text: string, category: string = "Власна") {
  const trimmed = text.trim();
  if (!trimmed) return;
  const card: GameCard = {
    id: generateId(),
    text: trimmed,
    category: category as GameCard["category"],
    isCustom: true,
  };
  state = { ...state, customCards: [card, ...state.customCards] };
  emit();
  saveCustomCards(state.customCards).catch(() => undefined);
}

export function updateCustomCard(id: string, text: string) {
  const trimmed = text.trim();
  if (!trimmed) return;
  state = {
    ...state,
    customCards: state.customCards.map((c) => (c.id === id ? { ...c, text: trimmed } : c)),
  };
  emit();
  saveCustomCards(state.customCards).catch(() => undefined);
}

export function deleteCustomCard(id: string) {
  state = { ...state, customCards: state.customCards.filter((c) => c.id !== id) };
  emit();
  saveCustomCards(state.customCards).catch(() => undefined);
}

/** "Видалення" базової картки — вона не видаляється з коду, лише ховається з активної колоди. */
export function removeBaseCard(id: string) {
  if (state.removedBaseIds.includes(id)) return;
  state = { ...state, removedBaseIds: [...state.removedBaseIds, id] };
  emit();
  saveRemovedBaseCardIds(state.removedBaseIds).catch(() => undefined);
}

export function restoreBaseCard(id: string) {
  state = { ...state, removedBaseIds: state.removedBaseIds.filter((x) => x !== id) };
  emit();
  saveRemovedBaseCardIds(state.removedBaseIds).catch(() => undefined);
}

/** Повне скидання: прибрати всі власні картки й повернути всі приховані базові. */
export async function resetAllToDefaults() {
  state = { customCards: [], removedBaseIds: [], isLoaded: true };
  emit();
  await Promise.all([saveCustomCards([]), saveRemovedBaseCardIds([]), clearUsedCardIds()]);
}