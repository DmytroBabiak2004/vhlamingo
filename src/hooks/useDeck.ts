import { useCallback, useEffect, useMemo, useState } from "react";
import { BASE_CARDS } from "@/data/cards";
import { GameCard } from "@/types";
import { shuffleArray } from "@/utils/shuffle";
import {
  getCustomCards,
  getUsedCardIds,
  saveUsedCardIds,
} from "@/storage/storage";

interface UseDeckResult {
  currentCard: GameCard | null;
  totalCount: number;
  shownCount: number;
  isDeckFinished: boolean;
  isLoading: boolean;
  drawNextCard: () => void;
  reshuffleDeck: () => void;
}

/**
 * Керує повною колодою (базові + власні картки), послідовністю показу
 * без повторів та збереженням прогресу між сесіями.
 */
export function useDeck(): UseDeckResult {
  const [allCards, setAllCards] = useState<GameCard[]>([]);
  const [deckOrder, setDeckOrder] = useState<GameCard[]>([]);
  const [pointer, setPointer] = useState(0);
  const [currentCard, setCurrentCard] = useState<GameCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const buildFreshOrder = useCallback((cards: GameCard[]) => {
    return shuffleArray(cards);
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const custom = await getCustomCards();
      const combined = [...BASE_CARDS, ...custom];
      const usedIds = await getUsedCardIds();

      if (!isMounted) return;

      setAllCards(combined);

      const remaining = combined.filter((c) => !usedIds.includes(c.id));
      const order =
        remaining.length > 0 ? shuffleArray(remaining) : buildFreshOrder(combined);

      setDeckOrder(order);
      setPointer(0);
      setIsLoading(false);
    })();
    return () => {
      isMounted = false;
    };
  }, [buildFreshOrder]);

  const isDeckFinished = useMemo(
    () => !isLoading && deckOrder.length > 0 && pointer >= deckOrder.length,
    [isLoading, deckOrder.length, pointer]
  );

  const drawNextCard = useCallback(() => {
    if (pointer >= deckOrder.length) {
      setCurrentCard(null);
      return;
    }
    const next = deckOrder[pointer];
    setCurrentCard(next);
    const nextPointer = pointer + 1;
    setPointer(nextPointer);

    const usedIds = deckOrder.slice(0, nextPointer).map((c) => c.id);
    saveUsedCardIds(usedIds).catch(() => undefined);
  }, [deckOrder, pointer]);

  const reshuffleDeck = useCallback(() => {
    const order = buildFreshOrder(allCards);
    setDeckOrder(order);
    setPointer(0);
    setCurrentCard(null);
    saveUsedCardIds([]).catch(() => undefined);
  }, [allCards, buildFreshOrder]);

  return {
    currentCard,
    totalCount: deckOrder.length,
    shownCount: pointer,
    isDeckFinished,
    isLoading,
    drawNextCard,
    reshuffleDeck,
  };
}
