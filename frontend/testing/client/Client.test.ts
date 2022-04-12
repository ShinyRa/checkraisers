import type { User } from '$lib/entities/user/User';
import 'regenerator-runtime/runtime';
import { TextEncoder, TextDecoder } from 'util';
import UserClient from './../../routes/api/user/UserClient';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const testUser: User = {
	email: 'testuser@email.nl',
	username: 'username',
	password: 'password'
};
describe('Test userclient handling of user data', () => {
	it('should register a new user', async () => {
		const res = await UserClient.register({ email: testUser.email, password: testUser.password });
		expect(res).toEqual({});
	});
});
