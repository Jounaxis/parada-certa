import { AzulCivicoScreen } from '../src/components/AzulCivicoScreen';
import { AccessForm } from '../src/features/access/AccessForm';

export default function LoginScreen() {
  return (
    <AzulCivicoScreen title="Login" showBack>
      <AccessForm mode="login" />
    </AzulCivicoScreen>
  );
}
