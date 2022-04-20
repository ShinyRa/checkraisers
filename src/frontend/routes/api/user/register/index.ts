import UserAPI from '$lib/backend/user/UserDAOrDAO';

const userAPI = new UserAPI();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function post({ request }) {
	return await userAPI.register(await request.json());
}
