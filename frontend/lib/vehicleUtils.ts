export const COLOUR_SWATCHES: Record<string, string> = {
  red: '#e53935', blue: '#1e88e5', black: '#212121', white: '#eeeeee',
  silver: '#bdbdbd', grey: '#757575', gray: '#757575', green: '#43a047',
  orange: '#fb8c00', yellow: '#fdd835', purple: '#8e24aa', brown: '#6d4c41',
  navy: '#1565c0', burgundy: '#b71c1c', khaki: '#afb42b', olive: '#827717',
};

const AVATAR_PALETTE = [
  '#ef5350', '#ec407a', '#ab47bc', '#5c6bc0', '#42a5f5',
  '#26c6da', '#26a69a', '#66bb6a', '#ff7043', '#8d6e63',
];

export function avatarColour(make: string): string {
  const hash = [...make].reduce((h, c) => c.charCodeAt(0) + ((h << 5) - h), 0);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}
