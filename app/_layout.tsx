import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { colors } from '../src/styles/azulCivico';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.headerTop },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Parada Certa' }} />
        <Stack.Screen name="login" options={{ title: 'Login' }} />
        <Stack.Screen name="cadastro" options={{ title: 'Cadastro de cuidador' }} />
      </Stack>
    </>
  );
}
