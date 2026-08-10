import { Alert, Platform } from "react-native";

interface ConfirmDialogButton {
  text: string;
  style?: "default" | "cancel" | "destructive";
  onPress?: () => void;
}

/**
 * Крос-платформне підтвердження дії (так/ні).
 *
 * Чому не можна просто викликати `Alert.alert(...)` напряму:
 * у react-native-web (веб-збірка через `expo start --web`) клас `Alert`
 * реалізований як порожня заглушка (`static alert() {}`) — вона нічого
 * не показує і не викликає жоден з переданих `onPress`. Через це на вебі
 * будь-яка дія, яка чекає підтвердження через Alert.alert (видалення
 * картки, скидання до дефолтних), просто ніколи не виконується —
 * без жодної помилки чи попередження в консолі, бо це "нормальна"
 * (навмисна) поведінка заглушки, а не збій.
 *
 * Тому на вебі використовуємо `window.confirm`, а на iOS/Android —
 * рідний `Alert.alert`.
 */
export function confirmDialog(
  title: string,
  message: string,
  confirmButton: ConfirmDialogButton,
  cancelButton?: ConfirmDialogButton
): void {
  if (Platform.OS === "web") {
    const text = message ? `${title}\n\n${message}` : title;
    const confirmed = typeof window !== "undefined" && window.confirm(text);
    if (confirmed) {
      confirmButton.onPress?.();
    } else {
      cancelButton?.onPress?.();
    }
    return;
  }

  Alert.alert(title, message, [
    {
      text: cancelButton?.text ?? "Скасувати",
      style: cancelButton?.style ?? "cancel",
      onPress: cancelButton?.onPress,
    },
    {
      text: confirmButton.text,
      style: confirmButton.style ?? "destructive",
      onPress: confirmButton.onPress,
    },
  ]);
}
