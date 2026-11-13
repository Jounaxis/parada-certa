import Constants from 'expo-constants';
import { StyleSheet, Text, View } from 'react-native';

import { AzulCivicoScreen } from '../src/components/AzulCivicoScreen';
import { colors, spacing, typography } from '../src/styles/azulCivico';

export default function AboutScreen() {
  const { version, extra } = Constants.expoConfig ?? {};
  const commit = typeof extra?.gitCommit === 'string' ? extra.gitCommit : null;
  const commitLabel = commit && extra?.gitCommitFromBuild === true
    ? 'Commit de referência'
    : 'Commit base';

  return (
    <AzulCivicoScreen title="Sobre o App" showBack>
      <View style={styles.content}>
        <Text style={styles.text}>
          O Parada Certa apoia o embarque de pessoas que precisam de assistência no transporte público.
        </Text>
        <View style={styles.card}>
          {version && (
            <View style={styles.detail}>
              <Text style={styles.label}>Versão do app</Text>
              <Text style={styles.text}>{version}</Text>
            </View>
          )}
          <View style={styles.detail}>
            <Text style={styles.label}>{commitLabel}</Text>
            <Text selectable style={styles.text}>{commit ?? 'Indisponível neste ambiente'}</Text>
          </View>
        </View>
      </View>
    </AzulCivicoScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.sectionGap,
  },
  card: {
    gap: spacing.controlGap,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.field,
  },
  detail: {
    gap: 4,
  },
  label: {
    ...typography.control,
    color: colors.text,
  },
  text: {
    ...typography.body,
    color: colors.text,
  },
});
