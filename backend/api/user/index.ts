
import { HttpStatusCode } from "../../utils/HttpStatusCode";
import BaseAPI, { Response } from './../BaseAPI';
import { User } from './../../entities/user/User'
class UserAPI extends BaseAPI {
    
    private db = this.getCollection('users');

    public getUser = async(userName: string): Promise<Response> => {
        try {
            const collection = this.db.find({username: userName}).toArray().then(result => {
                if (result.length > 0) {
                    return this.httpResponse(HttpStatusCode.SUCCESS, result);
                }
                else {
                    return this.httpResponse(HttpStatusCode.NOT_FOUND);
                }
            });
            return collection;
        } catch (err) {
            return this.httpResponse(HttpStatusCode.SERVER_ERROR );
        }
    }

    public updateUser = async(userName: string, updatedUser: Partial<User>): Promise<Response> =>{
        try {
            this.db.findOneAndUpdate({username: userName} , {$set: updatedUser})
            return this.httpResponse(HttpStatusCode.SUCCESS);
        } catch (err) {
            console.log(err)
            return this.httpResponse(HttpStatusCode.SERVER_ERROR );
        }
    }

    public login = async(user: Partial<User>): Promise<boolean> => {
        const result = await this.db.findOne({email: user.email, password: user.password})
        if(result) return true;
        
        return false;
    }
   
}

export default UserAPI;