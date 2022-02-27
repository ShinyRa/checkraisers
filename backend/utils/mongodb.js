import { MongoClient } from 'mongodb';
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
 
const connect = async () => {
    try {
        const client = await MongoClient.connect('mongodb://127.0.0.1:27017/');
        return client.db('local');
    } catch (err) {
       console.log(err);
    }
};

export let mongoDB_client = await connect();