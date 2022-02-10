import type { User } from "./_types/user"
import { doc, setDoc } from "firebase/firestore";
import { db } from '../../firebase/firebase';


export const userAPI = {
    async addUser(user: User): Promise<any> {
        try{
            await setDoc(doc(db, "poker", new Date().toString()), user).then(() => {
                return {
                    status: 200
                }
            });
        }catch(error){
            console.log("Something went wrong with adding a user: ",error)
        }
    }
}