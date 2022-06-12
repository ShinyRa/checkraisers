import { type User } from '../../../backend/entities/user/User';
import BaseClient from '../BaseClient';
class UserClient extends BaseClient {
	public static async login(user: Partial<User>): Promise<unknown> {
		return this.httpRequest('api/user/login', user);
	}

	public static async logout(): Promise<unknown> {
		return this.httpRequest('api/user/logout');
	}

	public static async register(user: Partial<User>): Promise<unknown> {
		return this.httpRequest('api/user/register', user);
	}

	public static async update(user: FormData): Promise<unknown> {
		return this.httpRequest('api/user/profile', user);
	}

	public static async getProfile(user: Partial<User>): Promise<unknown> {
		return this.httpRequest('/api/user/getProfile', user);
	}
}
export default UserClient;
