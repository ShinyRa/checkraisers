import { User } from '$lib/entities/user/User';


const httpRequest = async(url: string, data: Partial<User>): Promise<unknown> => {
	const requestOptions = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
		body: JSON.stringify(data)
	};

	return await fetch(url, requestOptions)
	.then((resp) => {
		return resp.json();
	})
	.then((json) => {
		return json;
	});
}

export const userClient = {
	login: async (user: Partial<User>): Promise<unknown> => {
		return httpRequest('api/user/login',user)
	},
	register: async (user: User): Promise<unknown> => {
		return httpRequest('api/user/register',user)
	},
	update: async (user: Partial<User>): Promise<unknown> => {
		return httpRequest('api/user/profile',user)
	}
};
