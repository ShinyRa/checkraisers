import UserAPI from '$lib/api/user';

const userAPI = new UserAPI('users');

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function post({ request }) {
	return await userAPI.updateProfile(await request.json());
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function get({ params }) {
	console.log(await userAPI.getProfile(await params.email));
	return await userAPI.getProfile(await params.email);
}
