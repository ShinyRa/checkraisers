import { Collection } from 'mongodb';
import { HttpCode } from '../entities/server/database/HttpStatusCodeode';
import FileSystem from 'fs';
import { MongoClient } from 'mongodb';
import * as crypto from 'crypto';

export type Response = {
	headers: Record<string, string>;
	status: HttpCode;
	body: unknown;
};
class BaseAPI {
	private client: MongoClient;

	protected httpResponse(status: Response['status'], body?: Response['body']): Response {
		const repsonse = {
			headers: { 'content-type': 'application/json', Accept: 'application/json' },
			status: status,
			body: body
		};
		return repsonse;
	}

	protected openDbConnection = async (): Promise<void> => {
		try {
			this.client = await MongoClient.connect('mongodb://127.0.0.1:27017/');
		} catch (err) {
			console.log(err);
		}
	};

	protected closeDbConnection = async (): Promise<void> => {
		try {
			this.client.close();
		} catch (err) {
			console.log(err);
		}
	};

	protected getCollection = async (collection: string): Promise<Collection> => {
		return await this.client.db('local').collection(collection);
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
