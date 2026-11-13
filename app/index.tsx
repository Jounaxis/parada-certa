import { StyleSheet, Text, View } from 'react-native';

import { AzulCivicoLink } from '../src/components/AzulCivicoAction';
import { AzulCivicoScreen } from '../src/components/AzulCivicoScreen';
import { colors, spacing, typography } from '../src/styles/azulCivico';

export default function HomeScreen() {
  return (
    <AzulCivicoScreen
      title="Embarque assistido"
      footer={<AzulCivicoLink href="/sobre" label="Sobre o App" />}
    >
      <View style={styles.introduction}>
        <Text style={styles.description}>
          Apoio no transporte público para quem precisa de ajuda na hora de embarcar.
        </Text>
        <View style={styles.actions}>
          <AzulCivicoLink href="/login" label="Entrar" variant="primary" />
          <AzulCivicoLink href="/cadastro" label="Criar conta de cuidador" />
        </View>
      </View>
    </AzulCivicoScreen>
  );
}

const styles = StyleSheet.create({
  introduction: {
    gap: spacing.sectionGap,
  },
  description: {
    ...typography.body,
    color: colors.text,
  },
  actions: {
    gap: spacing.controlGap,
  },
});
