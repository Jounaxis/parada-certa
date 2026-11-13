import { FirebaseError } from 'firebase/app';
import {
  get,
  getDatabase,
  orderByChild,
  push,
  query,
  ref,
  remove,
  runTransaction,
  serverTimestamp,
  update,
  type DataSnapshot,
} from 'firebase/database';

import { firebaseAuth } from '../access/firebase';
import { passengerConsentVersion, type Passenger, type PassengerInput } from './passenger';

function passengersRef(uid: string, id?: string) {
  if (firebaseAuth?.currentUser?.uid !== uid) {
    throw new FirebaseError('database/unauthenticated', 'Caregiver session missing.');
  }

  const databaseURL = process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL;
  if (!databaseURL) {
    throw new FirebaseError('database/configuration-not-found', 'Realtime Database URL missing.');
  }

  if (id !== undefined && (!id || /[.#$\[\]/]/u.test(id))) {
    throw new FirebaseError('database/not-found', 'Invalid passenger ID.');
  }

  const path = `cuidadores/${uid}/passageiros`;
  return ref(getDatabase(firebaseAuth.app, databaseURL), id === undefined ? path : `${path}/${id}`);
}

function readPassenger(record: DataSnapshot): Passenger {
  const { nome, tipoNecessidade, contatoEmergencia } = record.val() as PassengerInput;
  return { id: record.key!, nome, tipoNecessidade, contatoEmergencia };
}

export function newPassengerId(uid: string) {
  return push(passengersRef(uid)).key!;
}

export async function listPassengers(uid: string): Promise<Passenger[]> {
  const snapshot = await get(query(passengersRef(uid), orderByChild('criadoEm')));
  const passengers: Passenger[] = [];

  snapshot.forEach((record) => {
    passengers.push(readPassenger(record));
  });

  return passengers.reverse();
}

export async function getPassenger(uid: string, id: string): Promise<Passenger | null> {
  const snapshot = await get(passengersRef(uid, id));
  return snapshot.exists() ? readPassenger(snapshot) : null;
}

export async function createPassenger(uid: string, id: string, input: PassengerInput) {
  const { committed, snapshot } = await runTransaction(passengersRef(uid, id), (existing) => {
    if (existing !== null) return undefined;

    return {
      ...input,
      consentimentoEm: serverTimestamp(),
      versaoTermo: passengerConsentVersion,
      criadoEm: serverTimestamp(),
    };
  }, { applyLocally: false });

  if (committed) return;

  const existing = snapshot.val() as PassengerInput | null;
  // Se o servidor já recebeu a gravação anterior, confirmar o mesmo cadastro.
  if (
    existing?.nome === input.nome
    && existing.tipoNecessidade === input.tipoNecessidade
    && existing.contatoEmergencia === input.contatoEmergencia
  ) return;

  throw new FirebaseError('database/already-exists', 'Passenger already registered.');
}

export function updatePassenger(uid: string, id: string, input: PassengerInput) {
  const { nome, tipoNecessidade, contatoEmergencia } = input;
  return update(passengersRef(uid, id), { nome, tipoNecessidade, contatoEmergencia });
}

export function deletePassenger(uid: string, id: string) {
  return remove(passengersRef(uid, id));
}

export function getPassengerErrorMessage(error: unknown, fallback: string) {
  const rawCode = error instanceof Error && 'code' in error ? error.code : undefined;
  const code = typeof rawCode === 'string'
    ? rawCode.toLowerCase().replace(/^database\//, '').replace(/_/g, '-')
    : undefined;

  switch (code) {
    case 'permission-denied':
      return 'A sua conta não tem acesso a estes dados.';
    case 'unauthenticated':
      return 'Sua sessão expirou. Entre novamente.';
    case 'configuration-not-found':
      return 'O endereço do banco de passageiros precisa ser configurado.';
    case 'disconnected':
    case 'unavailable':
    case 'deadline-exceeded':
      return 'Confira sua conexão e tente novamente.';
    case 'already-exists':
      return 'Este cadastro já foi salvo com os dados anteriores. Volte à lista para conferir.';
    case 'not-found':
      return 'Este passageiro não está mais disponível na sua conta.';
    default:
      return fallback;
  }
}
