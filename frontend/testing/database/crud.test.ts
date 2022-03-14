import 'regenerator-runtime/runtime';
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import UserAPI from '$lib/api/user';
import { User } from '$lib/entities/user/User';

let user: User;
let TestAPI: UserAPI;

const testUser = {
	email: 'testuser@email.nl',
	username: 'testUser',
	chips: 1000,
	password: 'testUser'
};

beforeAll(() => {
	TestAPI = new UserAPI('users');
	user = testUser;
});

describe('CRUD operations on database', () => {
	it('should register a new user', async () => {
		const returnedProfile = testUser;
		delete returnedProfile.password;
		const result = await TestAPI.register(user);
		expect(result.body).toEqual(returnedProfile);
	});
});
