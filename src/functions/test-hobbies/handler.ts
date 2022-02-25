import 'source-map-support/register';
import { DynamoDbRepository } from '@shared/services';
import { DynamoDBRecord, DynamoDBStreamHandler } from 'aws-lambda';
import { StreamTestUsersController } from './controllers/stream-test-users.controller';
import { AnimeService } from './services';
import { BadRequest } from '@common/utils';

const testCognito: DynamoDBStreamHandler = async (event) => {
	try {
		/**
		 * Instance services
		 */
		const animeService = new AnimeService();
		const testUsersDynamoDBService = new DynamoDbRepository();

		/**
		 * Instance controllers
		 */
		const streamTestUsersCtrl = await new StreamTestUsersController(
			animeService,
			testUsersDynamoDBService
		);

		const invokeController = {
			[process.env.ARN_STREAM_DYNAMODB_TABLE_USERS]: streamTestUsersCtrl
		};

		const listErrors: BadRequest[] = [];
		for (const record of event.Records) {
			try {
				if (!invokeController[record.eventSourceARN]) {
					throw new Error(`${record.eventSourceARN} not found`);
				}

				await invokeController[record.eventSourceARN].run(record);
			} catch (error) {
				listErrors.push(handleError(error, record));
			}
		}

		return true;
	} catch (error) {
		console.error('🚨 Error: ', error);
		return error;
	}
};

function handleError(error: any, data: DynamoDBRecord): BadRequest {
	console.error('🚨 Error event record: ', { error, data });
	if (error instanceof BadRequest) {
		error.data = { error, data };
		return error;
	}

	return new BadRequest({
		type: 'exception',
		message: error?.message || `${this.constructor.name} exception error`,
		data: { error, data }
	});
}

export const main = testCognito;
