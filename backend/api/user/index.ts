import { HttpStatusCode } from '../../utils/HttpStatusCode';
import BaseAPI, { Response } from './../BaseAPI';
import { User } from './../../entities/user/User';
import * as crypto from 'crypto';
class UserAPI extends BaseAPI {
	private db = this.getCollection('users');

	private hash = (password): string => {
		return crypto.createHash('sha256').update(password).digest('hex');
	};

	public getProfile = async (email: User['email']): Promise<Response> => {
		try {
			const user = await this.db.findOne({ email: email }).then((result) => {
				return result ? result : false;
			});
			return user
				? this.httpResponse(HttpStatusCode.SUCCESS, user)
				: this.httpResponse(HttpStatusCode.SUCCESS, { error: 'No user found with: ' + email });
		} catch (err) {
			return this.httpResponse(HttpStatusCode.SERVER_ERROR);
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
					? this.httpResponse(HttpStatusCode.SUCCESS, res)
					: this.httpResponse(HttpStatusCode.SUCCESS, { error: 'could not update user' });
			} else {
				this.httpResponse(HttpStatusCode.SUCCESS, { error: 'No user found with: ' + user.email });
			}
		} catch (err) {
			return this.httpResponse(HttpStatusCode.SERVER_ERROR);
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
					? this.httpResponse(HttpStatusCode.SUCCESS, { success: 'Created new user' })
					: this.httpResponse(HttpStatusCode.SUCCESS, { error: 'Could not create User' });
			} else {
				this.httpResponse(HttpStatusCode.SUCCESS, { error: 'This email already exists' });
			}
		} catch (err) {
			return this.httpResponse(HttpStatusCode.SERVER_ERROR);
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
				? this.httpResponse(HttpStatusCode.SUCCESS, profile)
				: this.httpResponse(HttpStatusCode.SUCCESS, { error: 'Wrong credentials' });
		} catch (err) {
			return this.httpResponse(HttpStatusCode.SERVER_ERROR);
		}
	};
}

export default UserAPI;
