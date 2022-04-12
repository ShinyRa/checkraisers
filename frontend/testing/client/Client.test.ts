import type { User } from '$lib/entities/user/User';
import 'regenerator-runtime/runtime';
import { TextEncoder, TextDecoder } from 'util';
import UserClient from './../../routes/api/user/UserClient';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

global.fetch = jest.fn((route, request) =>
	Promise.resolve({
		json: () => Promise.resolve(request)
	})
) as jest.Mock;

let user;

const testUser: User = {
	email: 'testuser@email.nl',
	username: 'username',
	password: 'password'
};

beforeAll(() => {
	user = testUser;
});

describe('Test userclient handling of user data', () => {
	it('client should stringify body when register', async () => {
		const res = await UserClient.register(user);
		const expectedRes = JSON.stringify(user);
		expect(res['body']).toEqual(expectedRes);
	});

	it('client should  stringify body when login', async () => {
		const res = await UserClient.login(user);
		const expectedRes = JSON.stringify(user);
		expect(res['body']).toEqual(expectedRes);
	});

	it('client should use a FormData object as body when updating', async () => {
		user.chips = 1000;
		const fd = new FormData();
		fd.append('email', user.email);
		fd.append('username', user.username);
		fd.append('chips', user.chips.toString());
		const res = await UserClient.update(fd);
		expect(res['body'].get('email')).toEqual(testUser.email);
	});
});
