import { browser } from '$app/env';
import type { User } from '$lib/backend/entities/user/User';

//This class should be used inside a writebale.
class UserRepository {
	private DEFAULT_KEY = 'user';
	private user: User = browser && JSON.parse(localStorage.getItem(this.DEFAULT_KEY));

	private updateLocalStorage = (userData) => {
		browser && localStorage.setItem(this.DEFAULT_KEY, JSON.stringify(userData));
	};

	public setUserData = (userData) => {
		this.user = userData;
		this.updateLocalStorage(userData);
	};

	public clearUserData = () => {
		this.user = null;
		localStorage.removeItem(this.DEFAULT_KEY);
	};

	public getUserData = (): User => {
		return this.user;
	};
}
export default UserRepository;
