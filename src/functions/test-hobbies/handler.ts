import 'source-map-support/register';
import { DynamoDbRepository } from '@shared/services';
import { DynamoDBStreamHandler } from 'aws-lambda';
import { StreamTestUsersController } from './controllers/stream-test-users.controller';
import { AnimeService } from './services';
import { BadRequest } from '@common/utils';

const testCognito: DynamoDBStreamHandler = async (event) => {
	try {
		const animeService = new AnimeService();
		const testUsersDynamoDBService = new DynamoDbRepository();

		const streamTestUsersCtrl = await new StreamTestUsersController(
			animeService,
			testUsersDynamoDBService
		);

		const invokeController = {
			TestUsers: streamTestUsersCtrl
		};
		const listErrors: BadRequest[] = [];
		for (const { eventSourceARN, ...restProps } of event.Records) {
			try {
				console.log('input down:');
				const nameTable = getNameTableDynamoDB(eventSourceARN);
				console.log({ eventSourceARN, ...restProps, nameTable });

				// invokeController[].run(eve);
			} catch (error) {
				listErrors.push(handleError(error));
			}
		}

		return true;
	} catch (error) {
		console.error('🚨 Error: ', error);
		return error;
	}
};

function getNameTableDynamoDB(sourceArn: string): string {
	return sourceArn.split('/')[1].split('-')[0];
}

function handleError(error: any): BadRequest {
	if (error instanceof BadRequest) {
		return error;
	}

	return new BadRequest({
		type: 'exception',
		message: error?.message || `${this.constructor.name} exception error`,
		data: error
	});
}

export const main = testCognito;
