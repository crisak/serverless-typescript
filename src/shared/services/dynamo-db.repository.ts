import { BadRequest } from '@common/utils';
import { TestUsers } from '@shared/entities/test-users.entity';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Entity, Table } from 'dynamodb-toolbox';

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
			image: 'string',
			hasHobby: 'boolean',
			hobbies: 'list'
		},
		table: this.table
	});

	async add(user: TestUsers): Promise<TestUsers> {
		try {
			console.log('->', process.env.DYNAMODB_TABLE_USERS);
			await this.entity.put(user);
			return user;
		} catch (error) {
			throw DynamoDbRepository.handleError(error, user);
		}
	}

	async get(id: string): Promise<TestUsers | null> {
		try {
			const user = await this.entity.get({
				id
			});
			return user.Item || null;
		} catch (error) {
			throw DynamoDbRepository.handleError(error, id);
		}
	}

	async update(
		idUser: string,
		user: Partial<TestUsers>
	): Promise<Partial<TestUsers>> {
		const userUpdate = { ...user, id: idUser };
		try {
			await this.entity.update(userUpdate);
			return userUpdate;
		} catch (error) {
			throw DynamoDbRepository.handleError(error, userUpdate);
		}
	}

	static handleError(error: any, input = null): BadRequest {
		return new BadRequest({
			type: 'dynamodb',
			message: error.message,
			data: { error, input }
		});
	}
}
