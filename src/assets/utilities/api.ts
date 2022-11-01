import axios from './axios';

export type ApiCountries = {
	[countryKey: string]: {
		iso: {
			[countryCode: string]: 1,
		},
		prefix: {
			[countryPrefix: string]: 1,
		},
		text_ru: string,
		text_en: string,
	} & {
		[operatorKey: string]: {
			activation: 1,
		},
	},
};

export type ApiProducts = {
	[productKey: string]: {
		Category: 'hosting' | 'activation',
		Qty: number,
		Price: number,
	},
};

type Operator = {
	cost: number,
	count: number,
	rate?: number,
};

export type ApiPrices = {
	[countryKey: string]: {
		[productKey: string]: {
			[operatorKey: string]: Operator,
		},
	},
};

type ApiPricesByCountry = ApiPrices;

type ApiPricesByProduct = {
	[productKey: string]: {
		[countryKey: string]: {
			[operatorKey: string]: Operator,
		},
	},
};

type ApiPricesByCountryAndProduct = ApiPrices;

const api = {
	countries: {
		list: async () => {
			return axios.get<ApiCountries>('/v1/guest/countries');
		},
	},
	products: {
		list: async (props?: { country?: string, operator?: string }) => {
			return axios.get<ApiProducts>(`/v1/guest/products/${props?.country || 'any'}/${props?.operator || 'any'}`);
		},
	},
	prices: {
		list: async () => {
			return axios.get<ApiPrices>('/v1/guest/prices');
		},
		listByCountry: async (country: string) => {
			return axios.get<ApiPricesByCountry>(`/v1/guest/prices?country=${country}`);
		},
		listByProduct: async (product: string) => {
			return axios.get<ApiPricesByProduct>(`/v1/guest/prices?product=${product}`);
		},
		listByCountryAndProduct: async (country: string, product: string) => {
			return axios.get<ApiPricesByCountryAndProduct>(`/v1/guest/prices?country=${country}&product=${product}`);
		},
	},
};

export default api;