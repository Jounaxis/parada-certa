export const passengerNeeds = {
  CADEIRA_DE_RODAS: 'Cadeira de rodas',
  BAIXA_VISAO: 'Baixa visão',
  MOBILIDADE_REDUZIDA: 'Mobilidade reduzida',
  IDOSO: 'Idoso',
} as const;

export type PassengerNeed = keyof typeof passengerNeeds;

export type PassengerInput = {
  nome: string;
  tipoNecessidade: PassengerNeed;
  contatoEmergencia: string;
};

export type Passenger = PassengerInput & { id: string };

export const passengerConsentVersion = '1';
