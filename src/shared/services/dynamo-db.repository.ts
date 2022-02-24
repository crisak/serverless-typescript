import { BadRequest } from '@common/utils';
import { TestUsers } from '@shared/entities/test-users.entity';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Entity, Table } from 'dynamodb-toolbox';

const userDefault = {
	id: 'id' + Date.now().toString(),
	username: 'cristian' + Date.now().toString(),
	name: 'camilo',
	image: 'data'
};
export class DynamoDbRepository {
	private dynamoDb = new DocumentClient();

	private table = new Table({
		name: process.env.DYNAMODB_TABLE_USERS,
		partitionKey: 'id',
		DocumentClient: this.dynamoDb,
		entityField: false
	});

	private entity = new Entity({
		name: process.env.DYNAMODB_TABLE_USERS,
		attributes: {
			id: { partitionKey: true },
			username: 'string',
			name: 'string',
			image: 'string'
		},
		table: this.table
	});

	async add(user: TestUsers = userDefault): Promise<TestUsers> {
		try {
			console.log('->', process.env.DYNAMODB_TABLE_USERS);
			await this.entity.put(user);
			return user;
		} catch (error) {
			throw new BadRequest({
				type: 'dynamodb',
				message: error.message,
				data: error
			});
		}
	}

	async get(id: string): Promise<TestUsers> {
		try {
			console.log('->', id);
			const user = await this.entity.get({
				id
			});
			console.log('response', user);
			return user;
		} catch (error) {
			throw new BadRequest({
				type: 'dynamodb',
				message: error.message,
				data: error
			});
		}
	}

	async put(id: string, user: Partial<TestUsers>): Promise<Partial<TestUsers>> {
		const userUpdate = { id, ...user };
		await this.entity.update(userUpdate);
		return userUpdate;
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
