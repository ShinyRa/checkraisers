import UserDAO from '$lib/backend/dao/user/UserDAO';

const userAPI = new UserDAO();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function post({ request }) {
	const token: string = await request.headers.get('cookie')
	const slicedToken = token.slice(6)
	return await userAPI.updateProfile(await request.formData(), slicedToken);
}