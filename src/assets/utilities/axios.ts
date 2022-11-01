import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

export enum QueryType {
	post = 'post',
	get = 'get',
	put = 'put',
	delete = 'delete',
}

export type SuccessResponse<Type = any> = {
	status: number;
	data: Type;
	error: null;
};

export type ErrorResponse = {
	status: number;
	data: null;
	error: string;
};

export type Response<Type = any> = SuccessResponse<Type> | ErrorResponse;

class Axios {
	private readonly _instance: AxiosInstance;

	constructor() {
		this._instance = axios.create({
			withCredentials: true,
			baseURL: 'https://5sim.biz',
			headers: {
				'Accept': 'application/json',
			},
		});
	}

	private async _query<ResponseData, Body = undefined>(
		type: QueryType,
		url: string,
		data?: Body,
	): Promise<Response<ResponseData>> {
		try {
			const response = await this._instance[type]<ResponseData, AxiosResponse<ResponseData>, Body>(url, data || undefined);

			if (response.status === 200 || response.status === 201) {
				return {
					status: response.status,
					data: response.data,
					error: null,
				};
			} else {
				return {
					status: response.status,
					data: null,
					error: response.statusText,
				};
			}
		} catch (_error) {
			const error = _error as AxiosError<{ statusCode: number, message: string }>;

			return {
				status: error.response?.data.statusCode || 500,
				data: null,
				error: error.response?.data.message || 'HTTP ошибка!',
			};
		}
	}

	public post<ResponseData, Body>(
		url: string,
		data: Body
	): Promise<Response<ResponseData>> {
		return this._query<ResponseData, Body>(QueryType.post, url, data);
	}

	public get<ResponseData>(
		url: string,
	): Promise<Response<ResponseData>> {
		return this._query<ResponseData>(QueryType.get, url);
	}

	public put<ResponseData, Body>(
		url: string,
		data: Body
	): Promise<Response<ResponseData>> {
		return this._query<ResponseData, Body>(QueryType.put, url, data);
	}

	public async delete(
		url: string
	): Promise<Response<true>> {
		const query = await this._query<true>(QueryType.delete, url);

		if (query.status === 200) {
			return {
				status: query.status,
				data: true,
				error: null,
			};
		} else {
			return query;
		}
	}
}

export default new Axios();