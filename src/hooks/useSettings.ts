import { useSyncExternalStore } from "react";
import { AppSettings } from "@/types";
import { getSettings, saveSettings } from "@/storage/storage";

const DEFAULTS: AppSettings = {
  soundEnabled: true,
  hapticsEnabled: true,
  theme: "dark",
};

/**
 * Раніше кожен екран мав свій незалежний useState зі стейтом налаштувань,
 * завантаженим один раз при монтуванні. Через це перемикачі в Меню реально
 * оновлювали значення лише на самому екрані Меню — HomeScreen (уже змонтований
 * в стеку навігації) про зміну не дізнавався, і звук/вібрація фактично не
 * перемикались у грі. Тепер стан живе в одному спільному модульному сховищі,
 * і всі екрани, що використовують useSettings(), бачать зміни миттєво.
 */
let state: AppSettings = DEFAULTS;
let isLoaded = false;
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
  if (isLoaded || loadPromise) return loadPromise;
  loadPromise = getSettings().then((loaded) => {
    state = loaded;
    isLoaded = true;
    emit();
  });
  return loadPromise;
}

function updateSettings(patch: Partial<AppSettings>) {
  state = { ...state, ...patch };
  emit();
  saveSettings(state).catch(() => undefined);
}

export function useSettings() {
  ensureLoaded();
  const settings = useSyncExternalStore(subscribe, getSnapshot, () => DEFAULTS);
  return { settings, isLoading: !isLoaded, update: updateSettings };
}