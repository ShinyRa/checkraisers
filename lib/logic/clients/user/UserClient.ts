import { type User } from '$lib/entities/user/User';
import BaseClient from '../../../../../.svelte-kit/types/frontend/routes/api/BaseClientt';

class UserClient extends BaseDto {

	public static async login(user: Partial<User>): Promise<unknown> {
		return this.httpRequest('api/user/login', user);
	}

	public static async register(user: Partial<User>): Promise<unknown> {
		return this.httpRequest('api/user/register', user);
	}

	public static async update(user: FormData): Promise<unknown> {
		return this.httpRequest('api/user/profile', user);
	}
}
export default UserClient;
