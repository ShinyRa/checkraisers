import { Collection } from 'mongodb';
import { HttpCode } from '../utils/HttpStatusCode';
import { mongoDB_client } from '../utils/mongodb';

export type Response = {
	headers: Record<string, string>;
	status: HttpCode;
	body: unknown;
};
class BaseAPI {
	protected httpResponse(status: Response['status'], body?: Response['body']): Response {
		const repsonse = {
			headers: { 'content-type': 'application/json' },
			status: status,
			body: body
		};
		return repsonse;
	}

	protected getCollection = async (collection: string): Promise<Collection> => {
		const client = await mongoDB_client;
		return client.collection(collection);
	};
	//../../../images/profile-pictures
}
export default BaseAPI;
