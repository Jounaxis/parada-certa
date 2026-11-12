import { AzulCivicoScreen } from '../../src/components/AzulCivicoScreen';
import { PassengerForm } from '../../src/features/passengers/PassengerForm';

export default function NewPassengerScreen() {
  return (
    <AzulCivicoScreen title="Novo passageiro" showBack>
      <PassengerForm />
    </AzulCivicoScreen>
  );
}
