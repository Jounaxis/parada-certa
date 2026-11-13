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

  const isEmpty = state.status === 'loaded' && state.passengers.length === 0;

  return (
    <AzulCivicoScreen title="Passageiros" compactHeader showBack>
      <View className="gap-section">
        {state.status === 'loading' && (
          <View className="flex-row items-center gap-control">
            <ActivityIndicator colorClassName="accent-civic-primary" />
            <Text accessibilityLiveRegion="polite" className="shrink text-civic-body text-civic-text">
              Buscando seus passageiros…
            </Text>
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
        <View className="gap-control">
          {isEmpty && (
            <Text accessibilityLiveRegion="polite" className="text-civic-body text-civic-text">
              Cadastre a primeira pessoa que você acompanha.
            </Text>
          )}
          <AzulCivicoLink
            href="/passageiros/novo"
            label="Novo passageiro"
            variant={state.status === 'error' ? 'secondary' : 'primary'}
          />
        </View>
        {state.status === 'loaded' && !isEmpty && (
          <View className="gap-control">
            {state.passengers.map((passenger) => (
              <View key={passenger.id} className="gap-control rounded-[14px] bg-civic-field p-4">
                <Text accessibilityRole="header" className="text-[20px]/[28px] font-bold text-civic-text">
                  {passenger.nome}
                </Text>
                <View className="gap-1">
                  <Text className="text-civic-body text-civic-text">{passengerNeeds[passenger.tipoNecessidade]}</Text>
                  <Text className="text-civic-body text-civic-text">
                    <Text className="font-semibold">Contato de emergência:</Text> {passenger.contatoEmergencia}
                  </Text>
                </View>
                <View className="self-start">
                  <AzulCivicoLink
                    href={{ pathname: '/passageiros/[id]', params: { id: passenger.id } }}
                    label="Editar"
                    accessibilityLabel={`Editar passageiro ${passenger.nome}`}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </AzulCivicoScreen>
  );
}
