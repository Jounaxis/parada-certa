import { FirebaseError } from 'firebase/app';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type Auth,
  type User,
  updateProfile,
} from 'firebase/auth';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

import { registerCaregiver, type CaregiverRegistration, type Credentials } from './authActions';
import { firebaseAuth } from './firebase';

type SessionUser = { name: string | null; email: string | null };
type Operation = 'registration' | 'request';

type Session = {
  user: SessionUser | null;
  restoring: boolean;
  busy: boolean;
  login: (credentials: Credentials) => Promise<void>;
  register: (registration: CaregiverRegistration) => Promise<void>;
  saveName: (name: string) => Promise<void>;
  logout: () => Promise<void>;
};

const SessionContext = createContext<Session | null>(null);

function readUser(user: User | null): SessionUser | null {
  return user ? { name: user.displayName, email: user.email } : null;
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [restoring, setRestoring] = useState(Boolean(firebaseAuth));
  const [operation, setOperation] = useState<Operation | null>(null);
  const operationInProgress = useRef(false);

  useEffect(() => {
    if (!firebaseAuth) return;

    return onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(readUser(currentUser));
      setRestoring(false);
    });
  }, []);

  async function run(kind: Operation, action: (auth: Auth) => Promise<void>) {
    if (operationInProgress.current) return;
    if (!firebaseAuth) throw new FirebaseError('auth/configuration-not-found', 'Firebase config missing.');

    operationInProgress.current = true;
    setOperation(kind);

    try {
      await action(firebaseAuth);
    } finally {
      operationInProgress.current = false;
      setOperation(null);
    }
  }

  function register(registration: CaregiverRegistration) {
    return run('registration', async (auth) => {
      const currentUser = await registerCaregiver(auth, registration);
      setUser(readUser(currentUser));
    });
  }

  function login({ email, password }: Credentials) {
    return run('request', async (auth) => {
      await signInWithEmailAndPassword(auth, email, password);
    });
  }

  function saveName(name: string) {
    return run('request', async (auth) => {
      if (!auth.currentUser) throw new FirebaseError('auth/no-current-user', 'Firebase session missing.');

      await updateProfile(auth.currentUser, { displayName: name });
      setUser(readUser(auth.currentUser));
    });
  }

  function logout() {
    return run('request', (auth) => signOut(auth));
  }

  return (
    <SessionContext.Provider
      value={{
        user: operation === 'registration' ? null : user,
        restoring,
        busy: operation !== null,
        login,
        register,
        saveName,
        logout,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const session = useContext(SessionContext);

  if (!session) throw new Error('useSession must be used within SessionProvider.');

  return session;
}
