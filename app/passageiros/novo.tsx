import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';

import { AzulCivicoScreen } from '../../src/components/AzulCivicoScreen';
import { useSession } from '../../src/features/access/SessionProvider';
import { PassengerForm } from '../../src/features/passengers/PassengerForm';
import type { PassengerInput } from '../../src/features/passengers/passenger';
import { createPassenger, newPassengerId } from '../../src/features/passengers/passengerStore';

export default function NewPassengerScreen() {
  const { user } = useSession();

  return user ? <PassengerRegistration key={user.uid} uid={user.uid} /> : null;
}

function PassengerRegistration({ uid }: { uid: string }) {
  const router = useRouter();
  const id = useRef<string | null>(null);
  const saving = useRef(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  async function save(input: PassengerInput) {
    if (saving.current) return;

    saving.current = true;
    try {
      id.current ??= newPassengerId(uid);
      await createPassenger(uid, id.current, input);
      if (mounted.current) router.dismissTo('/passageiros');
    } finally {
      saving.current = false;
    }
  }

  return (
    <AzulCivicoScreen title="Novo passageiro" showBack>
      <PassengerForm onSave={save} />
    </AzulCivicoScreen>
  );
}
