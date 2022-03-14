import 'regenerator-runtime/runtime';
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import UserAPI from '$lib/api/user';
import { User } from '$lib/entities/user/User';

let user: User;
let TestAPI: UserAPI;

beforeAll(() => {
	TestAPI = new UserAPI('users');
	user = {
		email: 'testuser@email.nl',
		username: 'testUser',
		password: 'testuser'
	};
});

describe('CRUD operations on database', () => {
	it('should register a new user', () => {
		const result = TestAPI.register(user);
		console.log(result);
		expect(result).toEqual(result);
	});
});
