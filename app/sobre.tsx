import Constants from 'expo-constants';
import { Text, View } from 'react-native';

import { AzulCivicoScreen } from '../src/components/AzulCivicoScreen';

export default function AboutScreen() {
  const { version, extra } = Constants.expoConfig ?? {};
  const commit = typeof extra?.gitCommit === 'string' ? extra.gitCommit : null;
  const commitLabel = commit && extra?.gitCommitFromBuild === true
    ? 'Commit de referência'
    : 'Commit base';

  return (
    <AzulCivicoScreen title="Sobre o App" showBack>
      <View className="gap-section">
        <Text className="text-civic-body text-civic-text">
          O Parada Certa apoia o embarque de pessoas que precisam de assistência no transporte público.
        </Text>
        <View className="gap-control rounded-2xl bg-civic-field p-4">
          {version && (
            <View className="gap-1">
              <Text className="text-civic-body font-semibold text-civic-text">Versão do app</Text>
              <Text className="text-civic-body text-civic-text">{version}</Text>
            </View>
          )}
          <View className="gap-1">
            <Text className="text-civic-body font-semibold text-civic-text">{commitLabel}</Text>
            <Text selectable className="text-civic-body text-civic-text">{commit ?? 'Indisponível neste ambiente'}</Text>
          </View>
        </View>
      </View>
    </AzulCivicoScreen>
  );
}
