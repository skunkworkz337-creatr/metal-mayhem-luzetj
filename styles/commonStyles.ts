
import { StyleSheet, ViewStyle, TextStyle, useColorScheme } from 'react-native';

// Light mode colors
export const lightColors = {
  background: '#f5f5f5',
  backgroundSecondary: '#e8e8e8',
  text: '#1a1a1a',
  textSecondary: '#666666',
  primary: '#2E7D32',
  secondary: '#FFB300',
  accent: '#4CAF50',
  card: '#FFFFFF',
  highlight: '#B2FF59',
  border: '#4CAF50',
  outline: '#4CAF50',
};

// Dark mode colors
export const darkColors = {
  background: '#121212',
  backgroundSecondary: '#1e1e1e',
  text: '#e0e0e0',
  textSecondary: '#a0a0a0',
  primary: '#66BB6A',
  secondary: '#FFD54F',
  accent: '#81C784',
  card: '#1e1e1e',
  highlight: '#C5E1A5',
  border: '#4CAF50',
  outline: '#4CAF50',
};

// Hook to get current theme colors
export const useThemeColors = () => {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkColors : lightColors;
};

// Default export for backwards compatibility
export const colors = lightColors;

export const buttonStyles = StyleSheet.create({
  primaryButton: {
    backgroundColor: lightColors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  secondaryButton: {
    backgroundColor: lightColors.secondary,
    alignSelf: 'center',
    width: '100%',
  },
  accentButton: {
    backgroundColor: lightColors.accent,
    alignSelf: 'center',
    width: '100%',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: lightColors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: lightColors.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    color: lightColors.text,
    marginBottom: 12
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: lightColors.text,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: lightColors.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  textSecondary: {
    fontSize: 14,
    fontWeight: '400',
    color: lightColors.textSecondary,
    lineHeight: 20,
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: lightColors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    borderWidth: 2,
    borderColor: lightColors.outline,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  cardDark: {
    backgroundColor: darkColors.card,
    borderColor: darkColors.outline,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.4)',
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: lightColors.primary,
  },
  outlineBox: {
    borderWidth: 2,
    borderColor: lightColors.outline,
    borderRadius: 8,
    padding: 12,
  },
  outlineBoxDark: {
    borderColor: darkColors.outline,
  },
});
