import { User } from '$lib/entities/user/User';

type RequestOption = {
	method: string;
	headers: Record<string, string>;
	body: string;
};

class BaseClient {
	protected static async httpRequest(
		url: string,
		data: Partial<User>,
		customRequestOptions?: RequestOption
	): Promise<unknown> {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
			body: JSON.stringify(data)
		};

		return await fetch(url, customRequestOptions ?? requestOptions)
			.then((resp) => {
				return resp.json();
			})
			.then((json) => {
				return json;
			});
	}
}
export default BaseClient;
