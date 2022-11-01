import '@craco/craco';
const path = require("path");

module.exports = {
	eslint: {
		enable: false,
	},
	webpack: {
		alias: { '@root': path.resolve(__dirname, './src') },
	},
	babel: {
		presets: [
			[
				"@babel/preset-react",
				{"runtime": "automatic", "importSource": "@emotion/react"}
			]
		],
		plugins: ["@emotion/babel-plugin"]
	}
};