/**
 * Алгоритм Фішера — Єйтса для рівномірного перемішування масиву.
 * Повертає новий масив, не змінюючи оригінал.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateId(): string {
  return `custom-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}
