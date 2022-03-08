import UserAPI from '$lib/api/user';

const userAPI = new UserAPI();

/** @type {import('./api/user').RequestHandler} */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function get() {
    return await userAPI.getUsers()
}