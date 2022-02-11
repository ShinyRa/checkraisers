import type { User } from './_types/user';
import { HttpCode } from '../_HttpCode';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

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
	async addUser(user: User): Promise<Record<string, HttpCode>> {
		try {
			await setDoc(doc(db, 'user', genID(20)), user);
			return { status: HttpCode.SUCCESS };
		} catch (error) {
			return { status: HttpCode.SERVER_ERROR, message: error };
		}
	}
};
