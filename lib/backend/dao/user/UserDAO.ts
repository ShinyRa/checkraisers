import { HttpCode } from '../../entities/server/database/HttpStatusCodeode';
import BaseDAO, { type Response } from '../BaseDAO';
import { type User } from '../../../logic/user/User';

class UserDAO extends BaseDAO {
	private PROFILE_PICTURE_PATH = './../images/profile_pictures/';

	constructor() {
		super();
	}

	public getProfile = async (email: User['email']): Promise<Response> => {
		try {
			await this.openDbConnection();
			const db = await this.getCollection('users');
			const user = await db.findOne({ email: email }).then((result) => {
				return result ? result : false;
			});
			await this.closeDbConnection();

			return user
				? this.httpResponse(HttpCode.SUCCESS, user)
				: this.httpResponse(HttpCode.NOT_FOUND, { error: 'No user found with: ' + email });
		} catch (err) {
			console.log('try catch error GetProfile:\n', err);
			return this.httpResponse(HttpCode.SERVER_ERROR, { error: 'could not get user profile' });
		}
	};

	public removeUser = async (email: User['email']): Promise<Response> => {
		try {
			await this.openDbConnection();
			const db = await this.getCollection('users');
			const res = await db.deleteOne({ email: email });
			await this.closeDbConnection();
			return res.deletedCount > 0
				? this.httpResponse(HttpCode.SUCCESS, { success: 'Deleted the user' })
				: this.httpResponse(HttpCode.BAD_REQUEST, {
						error: 'Something went wrong with deleting a user'
				  });
		} catch (err) {
			console.log('try catch error Register:\n', err);
			return this.httpResponse(HttpCode.SERVER_ERROR, { error: 'User could not be deleted' });
		}
	};

	public updateProfile = async (data: FormData): Promise<Response> => {
		try {
			let user: User;
			for (const pair of data.entries()) {
				user = { ...user, ...{ [pair[0]]: pair[1] } };
			}

			await this.openDbConnection();
			const db = await this.getCollection('users');
			const userPresent = await db.findOne({ email: user.email }).then((result) => {
				return result ? true : false;
			});

			if (userPresent) {
				if (user.profilePicture) {
					const path = await this.writeToDisk(
						user.profilePicture as File,
						this.PROFILE_PICTURE_PATH + `${user.email}.png`
					);
					user.profilePicture = path;
				}

				const res = await db.findOneAndUpdate(
					{ email: user.email },
					{ $set: user },
					{ upsert: false, returnDocument: 'after', projection: { _id: 0, password: 0 } }
				);
				await this.closeDbConnection();

				if (user.profilePicture)
					res.value['profilePicture'] = this.readFromDisk(res.value['profilePicture']);
				return res
					? this.httpResponse(HttpCode.SUCCESS, res)
					: this.httpResponse(HttpCode.BAD_REQUEST, { error: 'could not update user' });
			} else {
				return this.httpResponse(HttpCode.NOT_FOUND, {
					error: 'No user found with: ' + user.email
				});
			}
		} catch (err) {
			console.log('try catch error updateProfile:\n', err);
			return this.httpResponse(HttpCode.SERVER_ERROR, { error: 'could not update user' });
		}
	};

	public register = async (user: User): Promise<Response> => {
		const DEFAULT_CHIP_AMOUNT = 1000;
		try {
			await this.openDbConnection();
			const db = await this.getCollection('users');
			const userPresent = await db.findOne({ email: user.email }).then((result) => {
				return result ? true : false;
			});
			if (!userPresent) {
				user.password = this.hash(user.password);
				user.chips = DEFAULT_CHIP_AMOUNT;
				user.profilePicture = `${this.PROFILE_PICTURE_PATH}default.png`;
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
			const profile = await db
				.findOne(
					{ email: user.email, password: this.hash(user.password) },
					{ projection: { _id: 0, password: 0 } }
				)
				.then((result) => {
					return result ? result : false;
				});
			await this.closeDbConnection();
			if (profile) profile['profilePicture'] = this.readFromDisk(profile['profilePicture']);
			return profile
				? this.httpResponse(HttpCode.SUCCESS, profile)
				: this.httpResponse(HttpCode.NOT_FOUND, { error: 'Wrong credentials' });
		} catch (err) {
			console.log('try catch error Login:\n', err);
			return this.httpResponse(HttpCode.SERVER_ERROR, { error: 'Could not login' });
		}
	};
}

export default UserDAO;
