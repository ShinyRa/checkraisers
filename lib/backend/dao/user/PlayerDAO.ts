import BaseDAO from '../BaseDAO';

class PlayerDAO extends BaseDAO {
	constructor() {
		super();
	}

	public updateChipAmount = async (chips: number, email: string) => {
		await this.openDbConnection();
		const db = await this.getCollection('users');

		const res = await db.findOneAndUpdate(
			{ email: email },
			{ $set: { chips: chips } },
			{
				upsert: false,
				returnDocument: 'after',
				projection: { _id: 0, password: 0, username: 0, email: 0, profilePicture: 0 }
			}
		);
		await this.closeDbConnection();
		return res;
	};

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
}
export default PlayerDAO;
