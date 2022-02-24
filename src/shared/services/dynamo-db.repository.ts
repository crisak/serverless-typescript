import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export class DynamoDbRepository {
	constructor(private dynamoDb?: DocumentClient) {}

	async get(
		params: DocumentClient.GetItemInput | any
	): Promise<DocumentClient.GetItemOutput | any> {
		return new Promise((resolve) => {
			setTimeout(() => {
				console.trace('test log');
				console.log('Hello');
				resolve('Ok perfect ' + params);
			}, 3000);
		});
		// return this.dynamoDb.get(params).promise();
	}

	async put(
		params: DocumentClient.PutItemInput
	): Promise<DocumentClient.PutItemOutput> {
		return this.dynamoDb.put(params).promise();
	}

	async update(
		params: DocumentClient.UpdateItemInput
	): Promise<DocumentClient.UpdateItemOutput> {
		return this.dynamoDb.update(params).promise();
	}

	async delete(
		params: DocumentClient.DeleteItemInput
	): Promise<DocumentClient.DeleteItemOutput> {
		return this.dynamoDb.delete(params).promise();
	}

	async query(
		params: DocumentClient.QueryInput
	): Promise<DocumentClient.QueryOutput> {
		return this.dynamoDb.query(params).promise();
	}

	async scan(
		params: DocumentClient.ScanInput
	): Promise<DocumentClient.ScanOutput> {
		return this.dynamoDb.scan(params).promise();
	}
}
