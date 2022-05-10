import { Collection } from 'mongodb';
import { HttpCode } from '../entities/HttpCode';
import * as fs from 'fs';
import { MongoClient } from 'mongodb';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

export type Response = {
	headers: Record<string, string>;
	status: HttpCode;
	body: unknown;
};
class BaseDAO {
	private client: MongoClient;

	protected httpResponse(
		status: Response['status'],
		body?: Response['body'],
		additionalHeader?: Response['headers']
	): Response {
		const standardHeader = { 'content-type': 'application/json', accept: 'application/json' };
		const alterdHeader = { ...standardHeader, ...additionalHeader };
		const repsonse = {
			headers: additionalHeader ? alterdHeader : standardHeader,
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
		fs.writeFileSync(path, new Uint8Array(buffer));
		return path;
	};

	protected readFromDisk = (path: string): Buffer => {
		return fs.readFileSync(path);
	};

	protected removeFromDisk = (path: string): void => {
		fs.rm(path, (err) => {
			if (err) console.log(err);
		});
	};

	protected renameFile = (oldPath: string, newPath: string): void => {
		fs.renameSync(oldPath, newPath);
	};

	protected hash = (text: string): string => {
		return crypto.createHash('sha256').update(text).digest('hex');
	};

	protected verifyJWT = (token: string, email: string): boolean => {
		let result;
		jwt.verify(token, 'my-key', function (err, data) {
			if (err) {
				result = false;
			} else {
				if (data['email'] === email) {
					result = true;
				} else {
					result = false;
				}
			}
		});
		return result;
	};
}
export default BaseDAO;
