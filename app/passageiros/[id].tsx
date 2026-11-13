import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AzulCivicoButton } from '../../src/components/AzulCivicoAction';
import { AzulCivicoScreen } from '../../src/components/AzulCivicoScreen';
import { useSession } from '../../src/features/access/SessionProvider';
import { PassengerForm } from '../../src/features/passengers/PassengerForm';
import type { Passenger, PassengerInput } from '../../src/features/passengers/passenger';
import {
  deletePassenger,
  getPassenger,
  getPassengerErrorMessage,
  updatePassenger,
} from '../../src/features/passengers/passengerStore';
import { colors, spacing, typography } from '../../src/styles/azulCivico';

type EditState =
  | { status: 'loading' }
  | { status: 'loaded'; passenger: Passenger }
  | { status: 'missing' }
  | { status: 'error'; message: string };

export default function EditPassengerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useSession();

  return user ? <PassengerEditor key={JSON.stringify([user.uid, id])} uid={user.uid} id={id} /> : null;
}

function PassengerEditor({ uid, id }: { uid: string; id: string | undefined }) {
  const router = useRouter();
  const [state, setState] = useState<EditState>(id ? { status: 'loading' } : { status: 'missing' });
  const [attempt, setAttempt] = useState(0);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!id) return;

    let active = true;

    async function load(passengerId: string) {
      try {
        const passenger = await getPassenger(uid, passengerId);
        if (active) setState(passenger ? { status: 'loaded', passenger } : { status: 'missing' });
      } catch (error) {
        if (active) {
          const message = getPassengerErrorMessage(error, 'Não foi possível carregar o passageiro.');
          setState({ status: 'error', message });
        }
      }
    }

    void load(id);
    return () => {
      active = false;
    };
  }, [uid, id, attempt]);

  function backToPassengers() {
    router.dismissTo('/passageiros');
  }

  function retry() {
    setState({ status: 'loading' });
    setAttempt((value) => value + 1);
  }

  async function save(passengerId: string, input: PassengerInput) {
    await updatePassenger(uid, passengerId, input);
    if (mounted.current) backToPassengers();
  }

  async function remove(passengerId: string) {
    await deletePassenger(uid, passengerId);
    if (mounted.current) backToPassengers();
  }

  return (
    <AzulCivicoScreen title="Editar passageiro" showBack>
      <View style={styles.content}>
        {state.status === 'loading' && (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.primary} />
            <Text accessibilityLiveRegion="polite" style={styles.text}>Carregando passageiro…</Text>
          </View>
        )}
        {state.status === 'missing' && (
          <>
            <Text accessibilityLiveRegion="polite" style={styles.text}>
              Este passageiro não está disponível na sua conta.
            </Text>
            <AzulCivicoButton label="Voltar para passageiros" onPress={backToPassengers} />
          </>
        )}
        {state.status === 'error' && (
          <>
            <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.error}>
              {state.message}
            </Text>
            <AzulCivicoButton label="Tentar novamente" onPress={retry} />
          </>
        )}
        {state.status === 'loaded' && (
          <PassengerForm
            initialValues={state.passenger}
            onSave={(input) => save(state.passenger.id, input)}
            onDelete={() => remove(state.passenger.id)}
          />
        )}
      </View>
    </AzulCivicoScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.controlGap,
  },
  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.controlGap,
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
