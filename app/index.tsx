import { Text, View } from 'react-native';

import { AzulCivicoLink } from '../src/components/AzulCivicoAction';
import { AzulCivicoScreen } from '../src/components/AzulCivicoScreen';

export default function HomeScreen() {
  return (
    <AzulCivicoScreen
      title="Embarque assistido"
      footer={<AzulCivicoLink href="/sobre" label="Sobre o App" />}
    >
      <View className="gap-section">
        <Text className="text-civic-body text-civic-text">
          Apoio no transporte público para quem precisa de ajuda na hora de embarcar.
        </Text>
        <View className="gap-control">
          <AzulCivicoLink href="/login" label="Entrar" variant="primary" />
          <AzulCivicoLink href="/cadastro" label="Criar conta de cuidador" />
        </View>
      </View>
    </AzulCivicoScreen>
  );
}
