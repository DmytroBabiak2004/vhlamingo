import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { GradientBackground } from "@/components/GradientBackground";
import { GlassPanel } from "@/components/GlassPanel";
import { GlowButton } from "@/components/GlowButton";
import { FlamingoLogo } from "@/components/FlamingoLogo";
import { Colors } from "@/constants/colors";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Без цього будь-яка необроблена помилка рендеру (наприклад, пошкоджені
 * дані з AsyncStorage після оновлення версії) показує користувачу білий
 * порожній екран без жодної можливості відновитись, окрім видалення
 * застосунку. React-помилки можна перехопити лише в класовому компоненті —
 * хук для цього не існує.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Тут — точка інтеграції для сервісу моніторингу збоїв (Sentry, Bugsnag тощо).
    // Наприклад: Sentry.captureException(error, { extra: info });
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.error("ErrorBoundary перехопив помилку:", error, info);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <GradientBackground>
          <View style={styles.container}>
            <View style={styles.logoWrapper}>
              <FlamingoLogo size={72} />
            </View>
            <Text style={styles.title}>Ой, щось пішло не так 🦩</Text>

            <GlassPanel style={styles.panel}>
              <Text style={styles.body}>
                Сталася неочікувана помилка. Спробуй перезапустити екран — зазвичай це допомагає. Якщо
                проблема повторюється, спробуй скинути власні картки в меню.
              </Text>
              {__DEV__ && this.state.error && (
                <Text style={styles.devError} numberOfLines={6}>
                  {this.state.error.toString()}
                </Text>
              )}
            </GlassPanel>

            <GlowButton label="Спробувати ще раз" onPress={this.handleReset} style={styles.button} />
          </View>
        </GradientBackground>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoWrapper: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.cream,
    textAlign: "center",
    marginBottom: 20,
  },
  panel: {
    width: "100%",
    marginBottom: 24,
  },
  body: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 21,
    textAlign: "center",
  },
  devError: {
    marginTop: 12,
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: "monospace",
  },
  button: {
    width: "100%",
    height: 50,
    justifyContent: "center",
  },
});