import UserDAO from '$lib/backend/dao/user/UserDAO';

const userAPI = new UserDAO();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function post({ request }) {
	return await userAPI.register(await request.json());
}
