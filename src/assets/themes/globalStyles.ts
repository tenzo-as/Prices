import { css } from '@emotion/react';
import getEm from '../utilities/getEm';
import theme from '../../store/theme';
import { Sizes } from '../utilities/config';
import { lightBlue } from '@mui/material/colors';

const globalStyles = () => css({
	'@import': "url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap')",

	'*, *::before, *::after': {
		boxSizing: 'border-box',
		margin: 0,
		outline: 'transparent none 0',
		outlineOffset: 0,
		border: '0 none transparent',
		padding: 0,
		fontWeight: 'inherit',
		fontSize: getEm(theme.typography.htmlFontSize),
		lineHeight: 1.5,
		fontFamily: 'inherit',
		color: 'inherit',
		wordSpacing: 'inherit',
		letterSpacing: 'inherit',
		textRendering: 'inherit',
		textDecoration: 'none',
		listStyle: 'none',
		background: 'transparent',
	},

	'body': {
		fontWeight: 400,
		lineHeight: getEm(1.5),
		fontFamily: theme.typography.fontFamily,
		wordSpacing: getEm(0.5),
		letterSpacing: getEm(0.5),
		textRendering: 'geometricPrecision',
		minWidth: Sizes.AppMinWidth,
		color: theme.palette.text.primary,
		transition: `
			color 200ms,
			background-color 200ms
		`,
	},

	'html, body, #root': {
		display: 'flex',
		flexDirection: 'column',
		width: '100%',
		minHeight: '100%',
		fontSize: getEm(theme.typography.htmlFontSize),
		scrollBehavior: 'smooth',
	},

	'body, #root': {
		flexGrow: 1,
	},

	'span': {
		display: 'inline-block',
	},
});

export default globalStyles;