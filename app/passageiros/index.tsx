import { useIsFocused } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AzulCivicoButton, AzulCivicoLink } from '../../src/components/AzulCivicoAction';
import { AzulCivicoScreen } from '../../src/components/AzulCivicoScreen';
import { useSession } from '../../src/features/access/SessionProvider';
import { passengerNeeds, type Passenger } from '../../src/features/passengers/passenger';
import { getPassengerErrorMessage, listPassengers } from '../../src/features/passengers/passengerStore';
import { colors, spacing, typography } from '../../src/styles/azulCivico';

type ListState =
  | { status: 'loading' }
  | { status: 'loaded'; passengers: Passenger[] }
  | { status: 'error'; message: string };

export default function PassengersScreen() {
  const { user } = useSession();

  return user ? <PassengerList key={user.uid} uid={user.uid} /> : null;
}

function PassengerList({ uid }: { uid: string }) {
  const isFocused = useIsFocused();
  const [state, setState] = useState<ListState>({ status: 'loading' });
  const [request, setRequest] = useState(0);

  useEffect(() => {
    if (!isFocused) return;

    let active = true;

    async function load() {
      setState({ status: 'loading' });
      try {
        const passengers = await listPassengers(uid);
        if (active) setState({ status: 'loaded', passengers });
      } catch (error) {
        if (active) {
          const message = getPassengerErrorMessage(error, 'Não foi possível carregar os passageiros.');
          setState({ status: 'error', message });
        }
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [isFocused, uid, request]);

  return (
    <AzulCivicoScreen title="Passageiros" showBack>
      <View style={styles.content}>
        <AzulCivicoLink href="/passageiros/novo" label="Novo passageiro" variant="primary" />
        {state.status === 'loading' && (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.primary} />
            <Text accessibilityLiveRegion="polite" style={styles.text}>Carregando passageiros…</Text>
          </View>
        )}
        {state.status === 'error' && (
          <View style={styles.list}>
            <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.error}>
              {state.message}
            </Text>
            <AzulCivicoButton label="Tentar novamente" onPress={() => setRequest((value) => value + 1)} />
          </View>
        )}
        {state.status === 'loaded' && (
          state.passengers.length === 0 ? (
            <Text accessibilityLiveRegion="polite" style={styles.text}>Nenhum passageiro cadastrado.</Text>
          ) : (
            <View style={styles.list}>
              {state.passengers.map((passenger) => (
                <View key={passenger.id} style={styles.card}>
                  <Text accessibilityRole="header" style={styles.name}>{passenger.nome}</Text>
                  <Text style={styles.text}>{passengerNeeds[passenger.tipoNecessidade]}</Text>
                  <Text style={styles.text}>Contato de emergência: {passenger.contatoEmergencia}</Text>
                  <AzulCivicoLink
                    href={{ pathname: '/passageiros/[id]', params: { id: passenger.id } }}
                    label="Editar"
                    accessibilityLabel={`Editar passageiro ${passenger.nome}`}
                  />
                </View>
              ))}
            </View>
          )
        )}
      </View>
    </AzulCivicoScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.sectionGap,
  },
  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.controlGap,
  },
  list: {
    gap: spacing.controlGap,
  },
  card: {
    gap: 4,
    borderRadius: 14,
    backgroundColor: colors.field,
    padding: 16,
  },
  name: {
    ...typography.control,
    color: colors.text,
  },
  text: {
    ...typography.body,
    flexShrink: 1,
    color: colors.text,
  },
  error: {
    ...typography.message,
    color: colors.error,
  },
});
