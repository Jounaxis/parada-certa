import { StyleSheet, Text, View } from 'react-native';

import { AzulCivicoLink } from '../../src/components/AzulCivicoAction';
import { AzulCivicoScreen } from '../../src/components/AzulCivicoScreen';
import { colors, spacing, typography } from '../../src/styles/azulCivico';

export default function PassengersScreen() {
  return (
    <AzulCivicoScreen title="Passageiros" showBack>
      <View style={styles.content}>
        <Text style={styles.status}>
          A consulta e o cadastro de passageiros serão liberados com a integração da API.
        </Text>
        <AzulCivicoLink href="/passageiros/novo" label="Testar formulário" variant="primary" />
      </View>
    </AzulCivicoScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.sectionGap,
  },
  status: {
    ...typography.body,
    color: colors.text,
  },
});
