import { User } from '$lib/entities/user/User';

type RequestOption = {
	method: string;
	body: FormData | string;
};
class BaseClient {
	private static serialize(data: FormData | Partial<User>): FormData | string {
		if (data instanceof FormData) return data;
		return JSON.stringify(data);
	}

	protected static async httpRequest(
		url: string,
		data: FormData | Partial<User>,
		customRequestOptions?: Partial<RequestOption>
	): Promise<unknown> {
		let requestOptions: RequestOption = {
			method: 'POST',
			body: this.serialize(data)
		};

		requestOptions = customRequestOptions
			? { ...requestOptions, ...customRequestOptions }
			: requestOptions;

		return await fetch(url, requestOptions)
			.then((resp) => {
				return resp.json();
			})
			.then((json) => {
				return json;
			});
	}
}
export default BaseClient;
