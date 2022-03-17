import type { User } from '../../entities/user/User';
import { HttpStatusCode } from '../../utils/HttpStatusCode';
import { doc, setDoc, getDoc, deleteDoc, collection,getDocs } from 'firebase/firestore';
import { db } from '../../utils/Firebase';

const getUsername = async(username: User["username"]) => {
	const ref = doc(db, 'user', username);
	return await getDoc(ref);
}

const usernameExist = async(username: User["username"]): Promise<boolean> => {
	const docUsername = await getUsername(username);
	if (docUsername.exists()) {
		return true;
	} else {
		return false;
	}
}

export const userAPI = {
	//same function can be used for updating
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
	},
	async getUsers(): Promise<Record<string, Array<any>>> {
		const userDoc = await getDocs(collection(db, 'user'));
		const userArray = [];
		userDoc.forEach((doc) => {
			userArray.push(doc.data())
		});
		return {users: userArray};
	}
};