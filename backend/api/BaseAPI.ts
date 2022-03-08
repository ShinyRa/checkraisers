import { HttpStatusCode } from "../utils/HttpStatusCode";

export type response = {
    status: HttpStatusCode,
    message: string,
    body: unknown
}

class BaseAPI {
    protected httpResponse( status: HttpStatusCode, message: string, body?: unknown): response{
        return{
            status: status,
            message: message,
            body: body
        }
    }

}
export default BaseAPI