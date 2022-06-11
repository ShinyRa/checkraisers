import { HttpCode } from '../../entities/HttpCode';
import BaseDAO, { type Response } from '../BaseDAO';
import { type User } from '../../entities/user/User';
import * as jwt from 'jsonwebtoken';

class UserDAO extends BaseDAO {
	private DEFAULT_AVATARS = [
		'default/default_1.png',
		'default/default_2.png',
		'default/default_3.png',
		'default/default_4.png',
		'default/default_5.png',
		'default/default_6.png',
		'default/default_7.png',
		'default/default_8.png',
		'default/default_9.png',
		'default/default_10.png',
		'default/default_11.png',
		'default/default_12.png'
	];
	private ASSET_PATH = './static/avatars/';
	private DEFAULT_CHIP_AMOUNT = 1000;

	constructor() {
		super();
	}

	public getProfile = async (email: string): Promise<unknown> => {
		await this.openDbConnection();
		const db = await this.getCollection('users');
		const user = await db
			.findOne({ email: email }, { projection: { _id: 0, password: 0 } })
			.then((result) => {
				return result ? result : false;
			});
		await this.closeDbConnection();
		return user;
	};

	private updateAvatar = async (oldAvatar: string, user: Partial<User>): Promise<string> => {
		const timePreset = Date.now();
		const oldAvatarPath = `${this.ASSET_PATH}${oldAvatar}`;
		const newAvatarPath = `${this.ASSET_PATH}${user.email}_${timePreset}.png`;

		await this.writeToDisk(
			user.profilePicture as File,
			!this.DEFAULT_AVATARS.includes(oldAvatar) ? oldAvatarPath : newAvatarPath
		);
		if (!this.DEFAULT_AVATARS.includes(oldAvatar)) this.renameFile(oldAvatarPath, newAvatarPath);
		return `${user.email}_${timePreset}.png`;
	};

	public removeUser = async (email: User['email'], token: string): Promise<Response> => {
		try {
			if (this.verifyJWT(token, email)) {
				await this.openDbConnection();
				const db = await this.getCollection('users');
				const res = await db.deleteOne({ email: email });
				await this.closeDbConnection();
				return res.deletedCount > 0
					? this.httpResponse(HttpCode.SUCCESS, { success: 'Deleted the user' })
					: this.httpResponse(HttpCode.BAD_REQUEST, {
							error: 'Something went wrong with deleting a user'
					  });
			} else {
				this.httpResponse(HttpCode.UNAUTHORIZED, { error: 'session compromised.' });
			}
		} catch (err) {
			console.log('try catch error Register:\n', err);
			return this.httpResponse(HttpCode.SERVER_ERROR, { error: 'User could not be deleted' });
		}
	};

	public updateProfile = async (data: FormData, token: string): Promise<Response> => {
		try {
			let user: User;
			for (const pair of data.entries()) {
				user = { ...user, ...{ [pair[0]]: pair[1] } };
			}
			if (this.verifyJWT(token, user.email)) {
				await this.openDbConnection();
				const db = await this.getCollection('users');
				const currentUser = await db.findOne({ email: user.email }).then((result) => {
					return result ? result : false;
				});

				if (currentUser) {
					if (user.profilePicture) {
						user.profilePicture = await this.updateAvatar(currentUser['profilePicture'], user);
					}
					const res = await db.findOneAndUpdate(
						{ email: user.email },
						{ $set: user },
						{ upsert: false, returnDocument: 'after', projection: { _id: 0, password: 0 } }
					);
					await this.closeDbConnection();
					return res
						? this.httpResponse(HttpCode.SUCCESS, res)
						: this.httpResponse(HttpCode.BAD_REQUEST, { error: 'could not update user' });
				} else {
					return this.httpResponse(HttpCode.NOT_FOUND, {
						error: 'No user found with: ' + user.email
					});
				}
			} else {
				this.httpResponse(HttpCode.UNAUTHORIZED, { error: 'session compromised.' });
			}
		} catch (err) {
			console.log('try catch error updateProfile:\n', err);
			return this.httpResponse(HttpCode.SERVER_ERROR, { error: 'could not update user' });
		}
	};

	public register = async (user: User): Promise<Response> => {
		try {
			await this.openDbConnection();
			const db = await this.getCollection('users');
			const userPresent = await db.findOne({ email: user.email }).then((result) => {
				return result ? true : false;
			});
			if (!userPresent) {
				user.password = this.hash(user.password);
				user.chips = this.DEFAULT_CHIP_AMOUNT;
				user.profilePicture = this.DEFAULT_AVATARS[Math.floor(Math.random() * 11) + 1];
				const res = await db.insertOne(user);
				await this.closeDbConnection();
				return res.acknowledged
					? this.httpResponse(HttpCode.SUCCESS, { success: 'Created new user' })
					: this.httpResponse(HttpCode.BAD_REQUEST, { error: 'Could not create User' });
			} else {
				return this.httpResponse(HttpCode.BAD_REQUEST, { error: 'This email already exists' });
			}
		} catch (err) {
			console.log('try catch error Register:\n', err);
			return this.httpResponse(HttpCode.SERVER_ERROR, { error: 'Could not register user' });
		}
	};

	public login = async (user: Record<User['email'], User['password']>): Promise<Response> => {
		try {
			await this.openDbConnection();
			const db = await this.getCollection('users');
			user.password = this.hash(user.password);
			const token = jwt.sign({ email: user.email }, 'my-key', { expiresIn: '7d' });
			const profile = await db
				.findOne(
					{ email: user.email, password: user.password },
					{ projection: { _id: 0, password: 0 } }
				)
				.then((result) => {
					return result ? result : false;
				});
			await this.closeDbConnection();

			const today = new Date();
			const expire = new Date();
			expire.setTime(today.getTime() + 3600000 * 24 * 7);
			const cookieHeader = { 'set-cookie': `token=${token}; Path=/; expires=${expire} ;HttpOnly` };

			return profile
				? this.httpResponse(HttpCode.SUCCESS, profile, cookieHeader)
				: this.httpResponse(HttpCode.NOT_FOUND, { error: 'Wrong credentials' });
		} catch (err) {
			console.log('try catch error Login:\n', err);
			return this.httpResponse(HttpCode.SERVER_ERROR, { error: 'Could not login' });
		}
	};

	public logout = async (): Promise<Response> => {
		try {
			const cookieHeader = {
				'set-cookie': `token=deleted; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
			};
			return this.httpResponse(HttpCode.SUCCESS, {}, cookieHeader);
		} catch (err) {
			console.log('try catch error Logout:\n', err);
			return this.httpResponse(HttpCode.SERVER_ERROR, { error: 'Could not logout' });
		}
	};
}

export default UserDAO;
