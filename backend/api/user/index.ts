import { HttpCode } from '../../utils/HttpStatusCode';
import BaseAPI, { Response } from './../BaseAPI';
import { User } from './../../entities/user/User';
import * as crypto from 'crypto';
import { Collection } from 'mongodb';
class UserAPI extends BaseAPI {
	private db: Collection;

	constructor(collectionName: string) {
		super();
		this.getCollection(collectionName).then((res) => {
			this.db = res;
		});
	}

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
			return this.httpResponse(HttpCode.SERVER_ERROR);
		}
	};

	public updateProfile = async (user: Partial<User>): Promise<Response> => {
		try {
			const userPresent = await this.db.findOne({ email: user.email }).then((result) => {
				return result ? true : false;
			});
			if (userPresent) {
				const res = await this.db.findOneAndUpdate(
					{ email: user.email },
					{ $set: user },
					{ upsert: false, returnDocument: 'after' }
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
			return this.httpResponse(HttpCode.SERVER_ERROR);
		}
	};

	public register = async (user: User): Promise<Response> => {
		const DEFAULT_AMOUNT = 1000;
		try {
			const userPresent = await this.db.findOne({ email: user.email }).then((result) => {
				return result ? true : false;
			});
			if (!userPresent) {
				user.password = this.hash(user.password);
				user.chips = DEFAULT_AMOUNT;
				const res = await this.db.insertOne(user);
				return res.acknowledged
					? this.httpResponse(HttpCode.SUCCESS, { success: 'Created new user' })
					: this.httpResponse(HttpCode.BAD_REQUEST, { error: 'Could not create User' });
			} else {
				return this.httpResponse(HttpCode.BAD_REQUEST, { error: 'This email already exists' });
			}
		} catch (err) {
			console.log(err);
			return this.httpResponse(HttpCode.SERVER_ERROR);
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
			return this.httpResponse(HttpCode.SERVER_ERROR);
		}
	};
}

export default UserAPI;
