import type { User } from './_types/user';
import { HttpCodes } from '../_HttpCodes';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

export const userAPI = {
	async addUser(user: User): Promise<any> {
		try {
			await setDoc(doc(db, 'poker', new Date().toString()), user);
			return { status: HttpCodes.SUCCESS };
		} catch (error) {
			return { status: HttpCodes.SERVER_ERROR, message: error };
		}
	}
};
