import type { User } from './_types/user';
import { HttpCodes } from '../_HttpCodes';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

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
	async addUser(user: User): Promise<Record<string, HttpCodes>> {
		try {
			await setDoc(doc(db, 'user', genID(20)), user);
			return { status: HttpCodes.SUCCESS };
		} catch (error) {
			return { status: HttpCodes.SERVER_ERROR, message: error };
		}
	}
};
