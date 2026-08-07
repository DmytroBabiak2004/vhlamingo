export const SPLASH_QUOTES: string[] = [
  "Наливай, гра починається 🍹",
  "Тверезим тут не місце 😉",
  "Фламінго ніколи не п'є сам 🦩",
  "Сьогодні всі трохи рожеві ✨",
  "Один келих — один крок до легенди 🥂",
  "Тости самі себе не скажуть 🎉",
  "Готуйся: буде весело і трохи соромно 🔥",
  "Найкращі історії починаються саме так 🍾",
];

export function getRandomQuote(): string {
  return SPLASH_QUOTES[Math.floor(Math.random() * SPLASH_QUOTES.length)];
}
