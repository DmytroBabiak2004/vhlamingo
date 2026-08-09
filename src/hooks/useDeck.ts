import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameCard } from "@/types";
import { shuffleArray } from "@/utils/shuffle";
import { getUsedCardIds, saveUsedCardIds } from "@/storage/storage";
import { useCardsStore, getActiveCards } from "@/store/cardsStore";

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
 *
 * Колода тепер реагує на зміни в cardsStore (додавання/видалення карток,
 * скидання до базових) — раніше список карток читався зі сховища лише
 * один раз при монтуванні, і нові картки не потрапляли в гру без
 * перезапуску застосунку.
 */
export function useDeck(): UseDeckResult {
  const cardsState = useCardsStore();
  const allCards = useMemo(
    () => getActiveCards(),
    [cardsState.customCards, cardsState.removedBaseIds, cardsState.isLoaded]
  );

  const [deckOrder, setDeckOrder] = useState<GameCard[]>([]);
  const [pointer, setPointer] = useState(0);
  const [currentCard, setCurrentCard] = useState<GameCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initializedRef = useRef(false);
  const deckOrderRef = useRef<GameCard[]>([]);
  const pointerRef = useRef(0);

  useEffect(() => {
    deckOrderRef.current = deckOrder;
  }, [deckOrder]);
  useEffect(() => {
    pointerRef.current = pointer;
  }, [pointer]);

  useEffect(() => {
    if (!cardsState.isLoaded) return;

    (async () => {
      if (!initializedRef.current) {
        // Перше завантаження — враховуємо збережений прогрес попередньої сесії.
        const usedIds = await getUsedCardIds();
        const cardById = new Map(allCards.map((c) => [c.id, c]));
        const drawnOrdered = usedIds
          .map((id) => cardById.get(id))
          .filter((c): c is GameCard => Boolean(c));
        const drawnIds = new Set(drawnOrdered.map((c) => c.id));
        const remaining = allCards.filter((c) => !drawnIds.has(c.id));

        const order =
          drawnOrdered.length > 0
            ? [...drawnOrdered, ...shuffleArray(remaining)]
            : shuffleArray(allCards);

        setDeckOrder(order);
        setPointer(drawnOrdered.length);
        initializedRef.current = true;
      } else {
        // Список карток змінився (додано/видалено/скинуто) — узгоджуємо
        // поточну колоду, зберігаючи вже показані картки на своїх місцях.
        const prevOrder = deckOrderRef.current;
        const prevPointer = pointerRef.current;
        const activeIds = new Set(allCards.map((c) => c.id));
        const cardById = new Map(allCards.map((c) => [c.id, c]));

        const drawnPortion = prevOrder
          .slice(0, prevPointer)
          .filter((c) => activeIds.has(c.id))
          .map((c) => cardById.get(c.id)!);
        const drawnIds = new Set(drawnPortion.map((c) => c.id));

        const remainingPortion = prevOrder
          .slice(prevPointer)
          .filter((c) => activeIds.has(c.id) && !drawnIds.has(c.id))
          .map((c) => cardById.get(c.id)!);
        const remainingIds = new Set(remainingPortion.map((c) => c.id));

        const newCards = allCards.filter(
          (c) => !drawnIds.has(c.id) && !remainingIds.has(c.id)
        );
        const updatedRemaining =
          newCards.length > 0 ? shuffleArray([...remainingPortion, ...newCards]) : remainingPortion;

        setDeckOrder([...drawnPortion, ...updatedRemaining]);
        setPointer(drawnPortion.length);
        saveUsedCardIds(drawnPortion.map((c) => c.id)).catch(() => undefined);
      }
      setIsLoading(false);
    })();
  }, [allCards, cardsState.isLoaded]);

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
    const order = shuffleArray(allCards);
    setDeckOrder(order);
    setPointer(0);
    setCurrentCard(null);
    saveUsedCardIds([]).catch(() => undefined);
  }, [allCards]);

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