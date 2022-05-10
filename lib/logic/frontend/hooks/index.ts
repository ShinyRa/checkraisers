import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';

export async function handle({ event, resolve }) {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');
	event.locals.authenticated = cookies.token != null ? true : false;
	event.locals.email = cookies.token != null ? jwt.decode(cookies.token)['email'] : null;
	return await resolve(event);
}

export function getSession({ locals }) {
	return { authenticated: locals.authenticated, email: locals.email };
}
