import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.introduction}>
          <Text accessibilityRole="header" style={styles.title}>
            Parada Certa
          </Text>
          <Text style={styles.description}>
            Embarque assistido no transporte público para passageiros que precisam de apoio na hora de embarcar.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F0F7F4',
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
    color: '#16382D',
    fontSize: 36,
    fontWeight: '700',
  },
  description: {
    color: '#345348',
    fontSize: 18,
    lineHeight: 27,
  },
});
