import { Collection } from "mongodb";
import { HttpStatusCode } from "../utils/HttpStatusCode";
import { mongoDB_client } from '../utils/mongodb';

export type Response = {
    status: HttpStatusCode,
    body: unknown
}

class BaseAPI {
    protected httpResponse( status: HttpStatusCode, body?: unknown): Response{
        const repsonse = {
            status: status,
            body: body
        }
        return repsonse
    }

    protected getCollection = (collection: string): Collection<Document> => {
        return mongoDB_client.collection(collection)
    }
}
export default BaseAPI