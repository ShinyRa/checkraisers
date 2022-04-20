import 'regenerator-runtime/runtime';
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
import UserAPI from '../../dao/user';
import { type User } from '../../../logic/user/User';

let user: User;
let userAPI: UserAPI;

beforeEach(() => {
	const testUser: User = {
		email: 'testuser@email.nl',
		username: 'username',
		password: 'password'
	};

	user = testUser;

	userAPI = new UserAPI();
});

afterEach(() => {
	userAPI = null;
});

describe('Test user operations on database', () => {
	it('should register a new user', (done) => {
		const expectedResult = { success: 'Created new user' };
		userAPI.register(user).then((result) => {
			expect(result.body).toEqual(expectedResult);
			done();
		});
	});

	it('should login a user', (done) => {
		userAPI.login({ email: user.email, password: user.password }).then((result) => {
			expect(result.body['email']).toEqual(user.email);
			done();
		});
	});

	it('should get a user profile', (done) => {
		userAPI.getProfile(user.email).then((result) => {
			expect(result.body['email']).toEqual(user.email);
			done();
		});
	});

	it('should update a user profile', (done) => {
		user.username = 'updatedUserName';
		user.chips = 1234567;
		const fd = new FormData();
		fd.append('email', user.email);
		fd.append('username', user.username);
		fd.append('chips', user.chips.toString());
		userAPI.updateProfile(fd).then((result) => {
			expect(result.body['value']['chips']).toEqual(user.chips.toString());
			done();
		});
	});

	it('should delete a user', () => {
		const expectedResult = { success: 'Deleted the user' };
		userAPI.removeUser(user.email).then((result) => {
			expect(result.body).toEqual(expectedResult);
		});
	});
});
