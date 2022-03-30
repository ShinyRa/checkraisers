import { User } from '$lib/entities/user/User';

const requestOptions = (user: Partial<User>) => {
	return {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
		body: JSON.stringify(user)
	};
};

export const userClient = {
	login: async (user: Partial<User>): Promise<unknown> => {
		return await fetch(`api/user/login`, requestOptions(user))
			.then((resp) => {
				return resp.json();
			})
			.then((json) => {
				return json;
			});
	},
	register: async (user: User): Promise<unknown> => {
		return await fetch(`api/user/register`, requestOptions(user))
			.then((resp) => {
				return resp.json();
			})
			.then((json) => {
				return json;
			});
	},
	update: async (user: Partial<User>): Promise<unknown> => {
		return await fetch(`api/user/profile`, requestOptions(user))
			.then((resp) => {
				return resp.json();
			})
			.then((json) => {
				return json;
			});
	}
};
