/** @type {import('@sveltejs/kit').GetSession} */
export const handle = async({ event, resolve }) => {
    const response = await resolve(event);
    return response;
}