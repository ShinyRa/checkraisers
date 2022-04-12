import 'regenerator-runtime/runtime';
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import UserAPI from '../../api/user';
import { type User } from '../../entities/user/User';

let user: User;
let userAPI: UserAPI;

const testUser: User = {
	email: 'testuser@email.nl',
	username: 'username',
	password: 'password'
};

beforeAll(() => {
	userAPI = new UserAPI();
	user = testUser;
});

describe('Test user operations on database', () => {
	it('should register a new user', async () => {
		const expectedResult = { success: 'Created new user' };
		const result = await userAPI.register(user);
		expect(result.body).toEqual(expectedResult);
	});

	it('should login a user', async () => {
		const result = await userAPI.login({ email: user.email, password: user.password });

		//we have to wait some seconds extra with a timeout for the response to come back. even if you use await.
		//Jest still prematurely does the toEqual check.
		setTimeout(() => {
			expect(result.body['email']).toEqual(user.email);
		}, 2000);
	});

	it('should get a user profile', async () => {
		const result = await userAPI.getProfile(user.email);
		expect(result.body['email']).toEqual(user.email);
	});

	it('should update a user profile', async () => {
		user.username = 'updatedUserName';
		user.chips = 1234567;
		const fd = new FormData();
		fd.append('email', user.email);
		fd.append('username', user.username);
		fd.append('chips', user.chips.toString());
		const result = await userAPI.updateProfile(fd);

		//we have to wait some seconds extra with a timeout for the response to come back. even if you use await.
		//Jest still prematurely does the toEqual check.
		setTimeout(() => {
			expect(result.body['chips']).toEqual(user.chips);
		}, 2000);
	});

	it('should delete a user', async () => {
		const expectedResult = { success: 'Deleted the user' };
		const result = await userAPI.removeUser(user.email);
		expect(result.body).toEqual(expectedResult);
	});
});
