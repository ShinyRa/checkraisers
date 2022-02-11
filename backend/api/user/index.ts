import type { User } from '../../entities/user/User';
import { HttpStatusCode } from '../../utils/HttpStatusCode';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../utils/Firebase';

const genID = (length: number) => {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

export const userAPI = {
	async addUser(user: User): Promise<Record<string, HttpStatusCode>> {
		try {
			await setDoc(doc(db, 'user', genID(20)), user);
			return { status: HttpStatusCode.SUCCESS };
		} catch (error) {
			return { status: HttpStatusCode.SERVER_ERROR, message: error };
		}
	}
};
