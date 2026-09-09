import { PUBLIC_API_URL } from '$env/static/public';

export class ApiError extends Error {
	status: number;
	constructor(message: string, status: number) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
	}
}

interface RequestOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	body?: unknown;
	token?: string | null;
}

export function configApi(_config: { baseUrl?: string }) {
	if (_config.baseUrl) baseUrl = _config.baseUrl;
}

let baseUrl = PUBLIC_API_URL ?? '';

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
	const { method = 'GET', body, token } = options;

	const headers = new Headers();
	headers.set('Accept', 'application/json');
	if (body !== undefined) headers.set('Content-Type', 'application/json');
	if (token) headers.set('Authorization', `Bearer ${token}`);

	const res = await fetch(`${baseUrl}${path}`, {
		method,
		headers,
		body: body !== undefined ? JSON.stringify(body) : undefined
	});

	if (!res.ok) {
		let message = `${res.status} ${res.statusText}`;
		try {
			const data = await res.json();
			if (typeof data?.message === 'string') message = data.message;
		} catch {
			/* ignore body parse error */
		}
		throw new ApiError(message, res.status);
	}

	if (res.status === 204) return undefined as T;
	return (await res.json()) as T;
}