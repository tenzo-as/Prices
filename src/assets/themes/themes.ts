import { createTheme } from '@mui/material';
import deepMerge from '@root/assets/utilities/deepMerge';

export type MainPalette = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

export enum ThemeMode {
	light = 'light',
	dark = 'dark',
}

export const light = createTheme({
	typography: {
		fontFamily: "'Inter', sans-serif",
		fontSize: 16,
	},
});

export const dark: typeof light = deepMerge(
	{...light},
	{

	},
);
