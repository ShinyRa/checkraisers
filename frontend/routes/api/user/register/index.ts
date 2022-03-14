import UserAPI from '$lib/api/user';

const userAPI = new UserAPI('users');

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function post({ request }) {
	return await userAPI.register(await request.json());
}
