import { HttpCode } from '../../utils/HttpStatusCode';
import BaseAPI, { type Response } from './../BaseAPI';
import { type User } from './../../entities/user/User';
import { Collection } from 'mongodb';

class UserAPI extends BaseAPI {
	private PROFILE_PICTURE_PATH = './../images/profile_pictures/';
	private db: Collection;

	constructor() {
		super();
		this.getCollection('users').then((res) => {
			this.db = res;
		});
	}

	public getProfile = async (email: User['email']): Promise<Response> => {
		try {
			const user = await this.db.findOne({ email: email }).then((result) => {
				return result ? result : false;
			});
			return user
				? this.httpResponse(HttpCode.SUCCESS, user)
				: this.httpResponse(HttpCode.NOT_FOUND, { error: 'No user found with: ' + email });
		} catch (err) {
			console.log('try catch error GetProfile:\n', err);
			return this.httpResponse(HttpCode.SERVER_ERROR, { error: 'could not get user profile' });
		}
	};

	public updateProfile = async (data: FormData): Promise<Response> => {
		try {
			let user: User;
			for (const pair of data.entries()) {
				user = { ...user, ...{ [pair[0]]: pair[1] } };
			}
			const userPresent = await this.db.findOne({ email: user.email }).then((result) => {
				return result ? true : false;
			});

			if (userPresent) {
				const path = await this.writeToDisk(
					user.profilePicture as File,
					this.PROFILE_PICTURE_PATH + `${user.email}.png`
				);

				user.profilePicture = path;

				const res = await this.db.findOneAndUpdate(
					{ email: user.email },
					{ $set: user },
					{ upsert: false, returnDocument: 'after', projection: { _id: 0, password: 0 } }
				);
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
			const userPresent = await this.db.findOne({ email: user.email }).then((result) => {
				return result ? true : false;
			});
			if (!userPresent) {
				user.password = this.hash(user.password);
				user.chips = DEFAULT_CHIP_AMOUNT;
				user.profilePicture = `${this.PROFILE_PICTURE_PATH}default.png`;
				const res = await this.db.insertOne(user);
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
			const profile = await this.db
				.findOne(
					{ email: user.email, password: this.hash(user.password) },
					{ projection: { _id: 0, password: 0 } }
				)
				.then((result) => {
					return result ? result : false;
				});

			profile['profilePicture'] = this.readFromDisk(profile['profilePicture']);
			return profile
				? this.httpResponse(HttpCode.SUCCESS, profile)
				: this.httpResponse(HttpCode.NOT_FOUND, { error: 'Wrong credentials' });
		} catch (err) {
			console.log('try catch error Login:\n', err);
			return this.httpResponse(HttpCode.SERVER_ERROR, { error: 'Could not login' });
		}
	};
}

export default UserAPI;
