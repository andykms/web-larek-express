import { API_URL, CDN_URL } from '@constants';

<<<<<<< HEAD
import { IOrder, IOrderResult, IProduct } from '@types';

export const enum RequestStatus {
	Idle='idle',
	Loading='loading',
	Success='success',
	Failed='failed',
}

=======
import { IFile, IOrder, IOrderResult, IProduct, ServerResponse, UserLoginBodyDto, UserRegisterBodyDto, UserResponse, UserResponseToken } from '@types';
import { getCookie, setCookie } from './cookie';

export const enum RequestStatus {
	Idle = 'idle',
	Loading = 'loading',
	Success = 'success',
	Failed = 'failed',
}


>>>>>>> admin
export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

<<<<<<< HEAD
 type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
 class Api {
	readonly baseUrl: string;
=======
class Api {
	private readonly baseUrl: string;
>>>>>>> admin
	protected options: RequestInit;

	constructor(baseUrl: string, options: RequestInit = {}) {
		this.baseUrl = baseUrl;
		this.options = {
			headers: {
<<<<<<< HEAD
				'Content-Type': 'application/json',
				...((options.headers as object) ?? {}),
=======
				...((options.headers as object) ?? {}),

>>>>>>> admin
			},
		};
	}

	protected handleResponse<T>(response: Response): Promise<T> {
<<<<<<< HEAD
		if (response.ok) return response.json();
		else
			return response
				.json()
				.then(data => Promise.reject(data.error ?? response.statusText));
	}

	get<T>(uri: string) {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method: 'GET',
		}).then(this.handleResponse<T>);
	}

	post<T>(uri: string, data: object, method: ApiPostMethods = 'POST') {
		return fetch(this.baseUrl + uri, {
			...this.options,
			method,
			body: JSON.stringify(data),
		}).then(this.handleResponse<T>);
	}
=======
		return response.ok
			? response.json()
			: response
				.json()
				.then(err => Promise.reject({ ...err, statusCode: response.status }));
	}

	protected async request<T>(endpoint: string, options: RequestInit) {
		try {
			const res = await fetch(`${this.baseUrl}${endpoint}`, {
				...this.options,
				...options,
			});
			return await this.handleResponse<T>(res);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	private refreshToken = () => {
		return this.request<UserResponseToken>('/auth/token', {
			method: 'GET',
			credentials: 'include'
		});
	};


	protected requestWithRefresh = async <T>(
		endpoint: string,
		options: RequestInit
	) => {
		try {
			return await this.request<T>(endpoint, options);
		} catch (error) {
				const refreshData = await this.refreshToken();
				if (!refreshData.success) {
					return Promise.reject(refreshData);
				}
				setCookie('accessToken', refreshData.accessToken);
				return await this.request<T>(endpoint, {
					...options,
					headers: {
						...options.headers,
						Authorization: `Bearer ${getCookie('accessToken')}`
					},
				});
			}
		}
>>>>>>> admin
}

export interface IWebLarekAPI {
	getProductList: () => Promise<IProduct[]>;
	getProductItem: (id: string) => Promise<IProduct>;
	orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

export class WebLarekAPI extends Api implements IWebLarekAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductItem = (id: string): Promise<IProduct> => {
<<<<<<< HEAD
		return this.get<IProduct>(`/product/${id}`).then((data: IProduct) => ({
=======
		return this.request<IProduct>(`/product/${id}`, { method: 'GET' }).then((data: IProduct) => ({
>>>>>>> admin
			...data,
			image: {
				...data.image,
				fileName: this.cdn + data.image.fileName,
			}
<<<<<<< HEAD

		}));
	}

	getProductList = (): Promise<IProduct[]> => {
		return this.get<ApiListResponse<IProduct>>('/product').then((data: ApiListResponse<IProduct>) =>
=======
		}));
	};

	getProductList = (): Promise<IProduct[]> => {
		return this.request<ApiListResponse<IProduct>>('/product', { method: 'GET' }).then((data: ApiListResponse<IProduct>) =>
>>>>>>> admin
			data.items.map(item => ({
				...item,
				image: {
					...item.image,
					fileName: this.cdn + item.image.fileName,
				}
			}))
		);
<<<<<<< HEAD
	}

	orderProducts = (order: IOrder): Promise<IOrderResult> =>{
		return this.post<IOrderResult>('/order', order).then((data: IOrderResult) => data);
	}
}


export default new WebLarekAPI(CDN_URL, API_URL)
=======
	};

	orderProducts = (order: IOrder): Promise<IOrderResult> => {
		return this.request<IOrderResult>('/order', {
			method: 'POST',
			body: JSON.stringify(order),
			headers: {
				'Content-Type': 'application/json',
			}
		}).then((data: IOrderResult) => data);
	};

	loginUser = (data: UserLoginBodyDto) => {
		return this.request<UserResponseToken>('/auth/login', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include'
		});
	};

	registerUser = (data: UserRegisterBodyDto) => {
		return this.request<UserResponseToken>('/auth/register', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include'
		});
	};

	getUser = () => {
		return this.requestWithRefresh<UserResponse>('/auth/user', {
			method: 'GET',
			headers: { Authorization: `Bearer ${getCookie('accessToken')}` }
		});
	};

	logoutUser = () => {
		return this.request<ServerResponse<unknown>>('/auth/logout', { method: 'GET', credentials: 'include' });
	};

	createProduct = (data: Omit<IProduct, '_id'>)  =>  {
		console.log(data);
		return this.requestWithRefresh<IProduct>('/product', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${getCookie('accessToken')}`
			}
		}).then((data: IProduct) => ({
			...data,
			image: {
				...data.image,
				fileName: this.cdn + data.image.fileName,
			}
		}));
	};

	uploadFile = (data: FormData) => {
		return this.requestWithRefresh<IFile>('/upload', {
			method: 'POST',
			body: data,
			headers: {
				Authorization: `Bearer ${getCookie('accessToken')}`
			}
		}).then((data) => ({
			...data,
			fileName: data.fileName,
		}));
	};

	updateProduct = (data: Partial<Omit<IProduct, '_id'>>, id: string) => {
		return this.requestWithRefresh<IProduct>(`/product/${id}`, {
			method: 'PATCH',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${getCookie('accessToken')}`
			}
		}).then((data: IProduct) => ({
			...data,
			image: {
				...data.image,
				fileName: this.cdn + data.image.fileName,
			}
		}));
	};

	deleteProduct = (id: string) => {
		return this.requestWithRefresh<IProduct>(`/product/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${getCookie('accessToken')}`
			}
		});
	};
}


export default new WebLarekAPI(CDN_URL, API_URL);
>>>>>>> admin
