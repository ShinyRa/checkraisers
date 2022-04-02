import { Collection } from 'mongodb';
import { HttpCode } from '../utils/HttpStatusCode';
import { mongoDB_client } from '../utils/mongodb';
import FileSystem from 'fs';
import * as crypto from 'crypto';

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

	protected writeToDisk = async (file: File, path: string): Promise<string> => {
		const buffer = await file.arrayBuffer();
		FileSystem.writeFileSync(path, new Uint8Array(buffer));
		return path;
	};

	protected readFromDisk = (path: string): Buffer => {
		return FileSystem.readFileSync(path);
	};

	protected hash = (text: string): string => {
		return crypto.createHash('sha256').update(text).digest('hex');
	};
}
export default BaseAPI;
