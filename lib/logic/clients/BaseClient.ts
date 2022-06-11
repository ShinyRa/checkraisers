import { type User } from '../../backend/entities/user/User';

type RequestOption = {
	method: string;
	body?: FormData | string;
};
class BaseDto {
	private static serialize(data: FormData | Partial<User>): FormData | string {
		if (data instanceof FormData) return data;
		return JSON.stringify(data);
	}

	protected static async httpRequest(
		url: string,
		data?: FormData | Partial<User>,
		customRequestOptions?: Partial<RequestOption>
	): Promise<unknown> {
		let requestOptions: RequestOption = {
			method: 'POST'
		};

		if (data) {
			const updatedData = { body: this.serialize(data) };
			requestOptions = { ...requestOptions, ...updatedData };
		}

		if (customRequestOptions) {
			requestOptions = { ...requestOptions, ...customRequestOptions };
		}
		return await fetch(url, requestOptions)
			.then((resp) => {
				return resp.json();
			})
			.then((json) => {
				return json;
			});
	}
}
export default BaseDto;
