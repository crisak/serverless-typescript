import { BadRequest } from '@common/utils';
import { TestUsers } from '@shared/entities';
import { DynamoDbRepository } from '@shared/services';
import { DynamoDBStreamEvent, StreamRecord } from 'aws-lambda';
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import deepEqual from 'deep-equal';
import { AnimeResultDto, AnimeService } from '../services';

export class StreamTestUsersController {
	constructor(
		private animeService: AnimeService,
		private testUsersDynamoDBService: DynamoDbRepository
	) {}

	async run(event: DynamoDBStreamEvent) {
		const listErrors: BadRequest[] = [];

		for (const record of event.Records || []) {
			try {
				const { oldRecord, newRecord } = this.clearRecord(record.dynamodb);
				if (deepEqual(oldRecord, newRecord)) {
					continue;
				}

				if (newRecord.hasHobby && newRecord.hobbies?.length > 0) {
					continue;
				}

				let hobby: AnimeResultDto = await this.animeService.getRandom();

				await this.testUsersDynamoDBService.update(newRecord.id, {
					hasHobby: true,
					hobbies: [JSON.stringify(hobby)]
				});
			} catch (error) {
				const errorFiltered = this.handleError(error);
				listErrors.push(errorFiltered);
			}
		}

		return listErrors;
	}

	private clearRecord(recordDynamoDB: StreamRecord): {
		oldRecord: TestUsers;
		newRecord: TestUsers;
	} {
		const oldRecord = DynamoDB.Converter.unmarshall(
			recordDynamoDB.OldImage
		) as TestUsers;

		const newRecord = DynamoDB.Converter.unmarshall(
			recordDynamoDB.NewImage
		) as TestUsers;

		return {
			oldRecord,
			newRecord
		};
	}

	private handleError(error: any): BadRequest {
		if (error instanceof BadRequest) {
			return error;
		}

		return new BadRequest({
			type: 'exception',
			message: error?.message || `${this.constructor.name} exception error`,
			data: error
		});
	}
}
