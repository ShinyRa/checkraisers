import { HttpCode } from '../../utils/HttpStatusCode';
import BaseAPI, { Response } from './../BaseAPI';
import { User } from './../../entities/user/User';
import * as crypto from 'crypto';
import { Collection } from 'mongodb';
import formidable from 'formidable';

class UserAPI extends BaseAPI {
	private db: Collection;

	constructor() {
		super();
		this.getCollection('users').then((res) => {
			this.db = res;
		});
	}
	//TODO formidable -> incomingform

	private hash = (password): string => {
		return crypto.createHash('sha256').update(password).digest('hex');
	};

	public getProfile = async (email: User['email']): Promise<Response> => {
		try {
			const user = await this.db.findOne({ email: email }).then((result) => {
				return result ? result : false;
			});
			return user
				? this.httpResponse(HttpCode.SUCCESS, user)
				: this.httpResponse(HttpCode.NOT_FOUND, { error: 'No user found with: ' + email });
		} catch (err) {
			console.log('try catch error:\n', err);
			return this.httpResponse(HttpCode.SERVER_ERROR, { error: 'could not get user profile' });
		}
	};

	public updateProfile = async (req: Request, user: Partial<User>): Promise<Response> => {
		try {
			const userPresent = await this.db.findOne({ email: user.email }).then((result) => {
				return result ? true : false;
			});
			if (userPresent) {
				//middleware

				const res = await this.db.findOneAndUpdate(
					{ email: user.email },
					{ $set: user },
					{ upsert: false, returnDocument: 'after', projection: { _id: 0, password: 0 } }
				);
				return res
					? this.httpResponse(HttpCode.SUCCESS, res)
					: this.httpResponse(HttpCode.BAD_REQUEST, { error: 'could not update user' });
			} else {
				return this.httpResponse(HttpCode.NOT_FOUND, {
					error: 'No user found with: ' + user.email
				});
			}
		} catch (err) {
			console.log('try catch error:\n', err);
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
				user.profilePicture = './static/logo.png';
				const res = await this.db.insertOne(user);
				return res.acknowledged
					? this.httpResponse(HttpCode.SUCCESS, { success: 'Created new user' })
					: this.httpResponse(HttpCode.BAD_REQUEST, { error: 'Could not create User' });
			} else {
				return this.httpResponse(HttpCode.BAD_REQUEST, { error: 'This email already exists' });
			}
		} catch (err) {
			console.log('try catch error:\n', err);
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
			return profile
				? this.httpResponse(HttpCode.SUCCESS, profile)
				: this.httpResponse(HttpCode.NOT_FOUND, { error: 'Wrong credentials' });
		} catch (err) {
			console.log('try catch error:\n', err);
			return this.httpResponse(HttpCode.SERVER_ERROR, { error: 'Could not login' });
		}
	};
}

export default UserAPI;
