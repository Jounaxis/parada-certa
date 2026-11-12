import { StyleSheet } from 'react-native';

export const colors = {
  background: '#F0F7F4',
  surface: '#FFFFFF',
  heading: '#16382D',
  text: '#345348',
  primary: '#176344',
  border: '#688378',
  error: '#9E2836',
};

export const actionStyles = StyleSheet.create({
  primary: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  primaryLabel: {
    color: colors.surface,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  secondary: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryLabel: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});
