import UserAPI from '$lib/api/user';
const userAPI = new UserAPI();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function post({ request }) {
	return await userAPI.updateProfile(await request.formData());
}

// not needed atm
// export async function get({ params }) {
// 	return await userAPI.getProfile(await params.email);
// }
