export type CardCategory =
  | "Пий"
  | "Всі п'ють"
  | "Чоловіки"
  | "Жінки"
  | "Айфон"
  | "Android"
  | "Виклик"
  | "Батл"
  | "Спів"
  | "Танці"
  | "Правда"
  | "Швидкість"
  | "Пам'ять"
  | "Логіка"
  | "Командні"
  | "Жести"
  | "Сміх"
  | "Число" 
  | "Сусіди"
  | "Імпровізація"
  | "Виклик"
  | "Блеф"
  | "Питання"
  | "Правило"
  | "Вибір"
  | "Власна";

export interface GameCard {
  id: string;
  text: string;
  category: CardCategory;
  isCustom: boolean;
}

export interface AppSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  theme: "dark" | "light";
}

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Menu: undefined;
  Rules: undefined;
  About: undefined;
  AddCard: undefined;
};
