import * as cookie from 'cookie';

export async function handle({ event, resolve }) {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');
	event.locals.authenticated = cookies.token != null ? true : false;
	return await resolve(event);
}

export function getSession({ locals }) {
	console.log('authenticated?: ', locals.authenticated);
	return { authenticated: locals.authenticated };
}
