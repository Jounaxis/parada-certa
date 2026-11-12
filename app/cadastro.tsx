import { AzulCivicoScreen } from '../src/components/AzulCivicoScreen';
import { AccessForm } from '../src/features/access/AccessForm';

export default function RegistrationScreen() {
  return (
    <AzulCivicoScreen title="Cadastro de cuidador" showBack>
      <AccessForm mode="registration" />
    </AzulCivicoScreen>
  );
}
