export const Colors = {
  // Deep party darks & rich crimsons
  backgroundDark: "#180208",
  darkRed: "#4A040D",
  wineRed: "#7A0F1D",
  fireBrick: "#B22222",
  crimson: "#D62828",

  // Neons & Warm accents
  rosePink: "#FF2A6D",
  neonPink: "#FF4D6D",
  coral: "#FF6B6B",
  peach: "#FFB4A2",
  cream: "#FFF5F2",

  // Glassmorphic layers
  glassLight: "rgba(255, 255, 255, 0.12)",
  glassMedium: "rgba(255, 255, 255, 0.18)",
  glassBorderTop: "rgba(255, 255, 255, 0.45)",
  glassBorderBottom: "rgba(255, 255, 255, 0.10)",
  glassDark: "rgba(20, 0, 5, 0.55)",

  // Typography
  textPrimary: "#FFF5F2",
  textSecondary: "rgba(255, 245, 242, 0.70)",
  textMuted: "rgba(255, 245, 242, 0.45)",

  // Shadows & Glows
  shadow: "#220005",
  pinkGlow: "rgba(255, 42, 109, 0.40)",
} as const;

export const Gradients = {
  background: ["#1D030A", "#4A0512", "#800E22", "#B21E35"] as const,
  backgroundDark: ["#0F0105", "#28030B", "#4A040D"] as const,
  cardFront: ["#800E22", "#D62828", "#FF4D6D"] as const,
  cardBack: ["#3D030A", "#7A0F1D", "#B22222"] as const,
  buttonPrimary: ["#FF2A6D", "#FF6B6B"] as const,
  buttonSecondary: ["rgba(255,255,255,0.18)", "rgba(255,255,255,0.06)"] as const,
  badge: ["rgba(255, 42, 109, 0.35)", "rgba(255, 107, 107, 0.20)"] as const,
};

export const Radius = {
  xs: 8,
  sm: 14,
  md: 20,
  lg: 24,
  xl: 32,
  pill: 999,
};

export const Shadow = {
  card: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.5,
    shadowRadius: 28,
    elevation: 18,
  },
  neon: {
    shadowColor: Colors.rosePink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 12,
  },
  button: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.38,
    shadowRadius: 16,
    elevation: 10,
  },
  subtle: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
};
