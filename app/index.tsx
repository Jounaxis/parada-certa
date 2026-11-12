import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { actionStyles, colors } from '../src/styles/access';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.introduction}>
          <Text accessibilityRole="header" style={styles.title}>
            Parada Certa
          </Text>
          <Text style={styles.description}>
            Embarque assistido no transporte público para passageiros que precisam de apoio na hora de embarcar.
          </Text>
          <View style={styles.actions}>
            <Link href="/login" asChild>
              <Pressable
                accessibilityRole="link"
                style={({ pressed }) => [actionStyles.primary, pressed && actionStyles.pressed]}
              >
                <Text style={actionStyles.primaryLabel}>Entrar</Text>
              </Pressable>
            </Link>
            <Link href="/cadastro" asChild>
              <Pressable
                accessibilityRole="link"
                style={({ pressed }) => [actionStyles.secondary, pressed && actionStyles.pressed]}
              >
                <Text style={actionStyles.secondaryLabel}>Criar conta de cuidador</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  introduction: {
    width: '100%',
    maxWidth: 420,
    gap: 12,
  },
  title: {
    color: colors.heading,
    fontSize: 36,
    fontWeight: '700',
  },
  description: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 27,
  },
  actions: {
    gap: 12,
    marginTop: 20,
  },
});
