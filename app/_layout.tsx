import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { SessionProvider, useSession } from '../src/features/access/SessionProvider';
import { colors, spacing, typography } from '../src/styles/azulCivico';

export default function RootLayout() {
  return (
    <SessionProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </SessionProvider>
  );
}

function RootNavigator() {
  const { restoring, user } = useSession();

  if (restoring) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.surface} />
        <Text accessibilityLiveRegion="polite" style={styles.loadingLabel}>
          Carregando sessão…
        </Text>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.headerTop },
      }}
    >
      <Stack.Protected guard={!user} redirectTo="/cuidador">
        <Stack.Screen name="index" options={{ title: 'Parada Certa' }} />
        <Stack.Screen name="login" options={{ title: 'Login' }} />
        <Stack.Screen name="cadastro" options={{ title: 'Cadastro de cuidador' }} />
      </Stack.Protected>
      <Stack.Protected guard={Boolean(user)} redirectTo="/">
        <Stack.Screen name="cuidador" options={{ title: 'Área do Cuidador' }} />
        <Stack.Screen name="passageiros/index" options={{ title: 'Passageiros' }} />
        <Stack.Screen name="passageiros/novo" options={{ title: 'Novo passageiro' }} />
        <Stack.Screen name="passageiros/[id]" options={{ title: 'Editar passageiro' }} />
      </Stack.Protected>
      <Stack.Screen name="sobre" options={{ title: 'Sobre o App' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.controlGap,
    backgroundColor: colors.headerTop,
  },
  loadingLabel: {
    ...typography.body,
    color: colors.surface,
  },
});
