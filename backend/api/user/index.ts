import type { User } from '../../entities/user/User';
import { HttpStatusCode } from '../../utils/HttpStatusCode';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../utils/Firebase';

const getUsername = async(user: User["username"]) => {
	const ref = doc(db, 'user', user);
	return await getDoc(ref);
}

const usernameExist = async(user: User["username"]): Promise<boolean> => {
	const docUsername = await getUsername(user);
	if (docUsername.exists()) {
		return true;
	} else {
		return false;
	}
}

export const userAPI = {
    async addUser(user: User): Promise<Record<string, HttpStatusCode | string>> {
        try {
            if (await usernameExist(user.username)) {
                return { status: HttpStatusCode.SERVER_ERROR, message: 'Username already exists' };
            } else {
                await setDoc(doc(db, 'user', user.username), user);
				return { status: HttpStatusCode.SUCCESS };
            }
        } catch (error) {
            return { status: HttpStatusCode.SERVER_ERROR, message: error };
        }
    },
	async removeUser(username: User["username"]): Promise<Record<string, HttpStatusCode | string>> {
		if (await usernameExist(username)) {
			await deleteDoc(doc(db, "user", username));
			return { status: HttpStatusCode.SUCCESS };
		} else {
			return { status: HttpStatusCode.SERVER_ERROR, message: 'Username does not exist' };
		}
	}
};