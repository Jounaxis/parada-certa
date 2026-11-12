import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword, type Auth, updateProfile } from 'firebase/auth';

export type Credentials = { email: string; password: string };
export type CaregiverRegistration = Credentials & { name: string };

export async function registerCaregiver(auth: Auth, { name, email, password }: CaregiverRegistration) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  try {
    await updateProfile(user, { displayName: name });
  } catch {
    // A conta já está ativa. A Área do Cuidador permite concluir o cadastro do nome.
  }

  return user;
}

export function getAuthErrorMessage(error: unknown) {
  const code = error instanceof FirebaseError ? error.code : undefined;

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'E-mail ou senha inválidos. Confira os dados e tente novamente.';
    case 'auth/email-already-in-use':
      return 'Já existe uma conta com esse e-mail. Entre pela tela de Login.';
    case 'auth/invalid-email':
      return 'Informe um e-mail válido.';
    case 'auth/weak-password':
    case 'auth/password-does-not-meet-requirements':
      return 'Escolha uma senha que atenda aos requisitos de segurança.';
    case 'auth/user-disabled':
      return 'Esta conta está desativada.';
    case 'auth/network-request-failed':
      return 'Confira sua conexão com a internet e tente novamente.';
    case 'auth/too-many-requests':
      return 'Houve muitas tentativas. Aguarde alguns instantes e tente novamente.';
    case 'auth/configuration-not-found':
    case 'auth/invalid-api-key':
    case 'auth/operation-not-allowed':
      return 'O Firebase Authentication precisa ser configurado neste ambiente.';
    case 'auth/no-current-user':
      return 'Sua sessão expirou. Entre novamente.';
    default:
      return 'Não foi possível concluir a operação. Tente novamente.';
  }
}
