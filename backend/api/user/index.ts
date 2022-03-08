
import { HttpStatusCode } from "../../utils/HttpStatusCode";
import { mongoDB_client } from '../../utils/mongodb';
import BaseAPI, { response } from './../BaseAPI';

class UserAPI extends BaseAPI {
    public getUsers = async(): Promise<response> => {
        try {
            const collection = mongoDB_client.collection("users").find({}).toArray().then(result => {
                if (result) {
                    return this.httpResponse(HttpStatusCode.SUCCESS, "users found" , result);
                }
                else {
                    return this.httpResponse(HttpStatusCode.NOT_FOUND, "No users found");
                }
            });
            return collection;
        } catch (err) {
            return this.httpResponse(HttpStatusCode.SERVER_ERROR, "Could not contact DB" );
        }

    }
}

export default UserAPI;