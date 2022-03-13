import UserAPI from '$lib/api/user';

const userAPI = new UserAPI();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function get({ params }) {
    return await userAPI.getUser(params.user)
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function post({ params, request }) {
    console.log(params.user)
    return await userAPI.updateUser(params.user, await request.json())
} 

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function post({ params, request }) {
    console.log(params.user)
    return await userAPI.updateUser(params.user, await request.json())
} 
