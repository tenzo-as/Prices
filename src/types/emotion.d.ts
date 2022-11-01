import '@emotion/react';
import { light } from '../assets/themes/themes';

declare module '@emotion/react' {
	export interface Theme extends (typeof light) {}
}