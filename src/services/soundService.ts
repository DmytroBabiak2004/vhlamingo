import { Platform } from "react-native";
import { Audio } from "expo-av";

const soundAsset = require("../../assets/sounds/flip.mp3");

// Для мобільних платформ (iOS / Android)
let flipSound: Audio.Sound | null = null;

// Для веб-платформи
let webAudio: HTMLAudioElement | null = null;

let isLoaded = false;

/**
 * Легкий звук перевороту картки. Файл підвантажується один раз і
 * перевикористовується для кожного наступного відтворення.
 */
async function ensureLoaded(): Promise<void> {
  if (isLoaded) return;
  try {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined") {
        webAudio = new window.Audio(soundAsset);
        isLoaded = true;
      }
      return;
    }

    const { sound } = await Audio.Sound.createAsync(soundAsset);
    flipSound = sound;
    isLoaded = true;
  } catch {
    // Якщо файл звуку відсутній у збірці — тихо ігноруємо,
    // застосунок продовжує працювати без звуку.
    isLoaded = false;
  }
}

export async function playFlipSound(enabled: boolean): Promise<void> {
  if (!enabled) return;
  await ensureLoaded();

  try {
    if (Platform.OS === "web") {
      if (webAudio) {
        webAudio.currentTime = 0; // Скидаємо на початок, якщо звук ще лунає
        await webAudio.play();
      }
      return;
    }

    if (flipSound) {
      await flipSound.replayAsync();
    }
  } catch {
    // ігноруємо помилки відтворення
  }
}

export async function unloadFlipSound(): Promise<void> {
  if (Platform.OS === "web") {
    if (webAudio) {
      webAudio.pause();
      webAudio = null;
      isLoaded = false;
    }
    return;
  }

  if (flipSound) {
    await flipSound.unloadAsync();
    flipSound = null;
    isLoaded = false;
  }
}