import { TextStyle } from 'react-native';

// Figma'daki yazı stillerinin karşılığı.
// fontWeight: '400' = Regular, '500' = Medium, '600' = Semi Bold, '700' = Bold
export const typography = {
  displayNumber: { fontSize: 32, lineHeight: 40, fontWeight: '700', fontVariant: ['tabular-nums'] },
  h1:            { fontSize: 24, lineHeight: 32, fontWeight: '700' },
  h2:            { fontSize: 18, lineHeight: 24, fontWeight: '600' },
  body:          { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  bodyMedium:    { fontSize: 16, lineHeight: 24, fontWeight: '500' },
  caption:       { fontSize: 13, lineHeight: 18, fontWeight: '400' },
} satisfies Record<string, TextStyle>;