export const colors = {
  headerTop: '#15366C',
  headerBottom: '#23529B',
  surface: '#FFFFFF',
  text: '#17263F',
  brand: '#EDF4FF',
  back: '#29518C',
  field: '#F6F8FC',
  border: '#74839B',
  primary: '#174BA8',
  secondary: '#EAF2FF',
  secondaryText: '#214C92',
  error: '#A1293E',
} as const;

export const spacing = {
  gutter: 24,
  maxContentWidth: 420,
  controlGap: 12,
  sectionGap: 28,
} as const;

export const typography = {
  title: { fontSize: 44, lineHeight: 52, fontWeight: '700' },
  brand: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
  body: { fontSize: 17, lineHeight: 24 },
  control: { fontSize: 17, lineHeight: 24, fontWeight: '600' },
  message: { fontSize: 15, lineHeight: 21 },
} as const;
