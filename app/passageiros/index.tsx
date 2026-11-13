import { useIsFocused } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { AzulCivicoButton, AzulCivicoLink } from '../../src/components/AzulCivicoAction';
import { AzulCivicoScreen } from '../../src/components/AzulCivicoScreen';
import { useSession } from '../../src/features/access/SessionProvider';
import { passengerNeeds, type Passenger } from '../../src/features/passengers/passenger';
import { getPassengerErrorMessage, listPassengers } from '../../src/features/passengers/passengerStore';

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
      <View className="gap-section">
        <AzulCivicoLink href="/passageiros/novo" label="Novo passageiro" variant="primary" />
        {state.status === 'loading' && (
          <View className="flex-row items-center gap-control">
            <ActivityIndicator colorClassName="accent-civic-primary" />
            <Text accessibilityLiveRegion="polite" className="shrink text-civic-body text-civic-text">Carregando passageiros…</Text>
          </View>
        )}
        {state.status === 'error' && (
          <View className="gap-control">
            <Text accessibilityRole="alert" accessibilityLiveRegion="polite" className="text-civic-message text-civic-error">
              {state.message}
            </Text>
            <AzulCivicoButton label="Tentar novamente" onPress={() => setRequest((value) => value + 1)} />
          </View>
        )}
        {state.status === 'loaded' && (
          state.passengers.length === 0 ? (
            <Text accessibilityLiveRegion="polite" className="shrink text-civic-body text-civic-text">Nenhum passageiro cadastrado.</Text>
          ) : (
            <View className="gap-control">
              {state.passengers.map((passenger) => (
                <View key={passenger.id} className="gap-1 rounded-[14px] bg-civic-field p-4">
                  <Text accessibilityRole="header" className="text-civic-body font-semibold text-civic-text">{passenger.nome}</Text>
                  <Text className="shrink text-civic-body text-civic-text">{passengerNeeds[passenger.tipoNecessidade]}</Text>
                  <Text className="shrink text-civic-body text-civic-text">Contato de emergência: {passenger.contatoEmergencia}</Text>
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
