import { Nullable } from '@common/types';
import { TestUsers } from '@shared/entities';
import { DynamoDbRepository } from '@shared/services';
import { DynamoDBRecord, StreamRecord } from 'aws-lambda';
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import deepEqual from 'deep-equal';
import { AnimeResultDto, AnimeService } from '../services';

export class StreamTestUsersController {
	constructor(
		private animeService: AnimeService,
		private testUsersDynamoDBService: DynamoDbRepository
	) {}

	async run(record: DynamoDBRecord) {
		const { oldRecord, newRecord } = this.clearRecord(record.dynamodb);
		if (deepEqual(oldRecord, newRecord)) {
			return 'Ok';
		}

		if (newRecord.hasHobby && newRecord.hobbies?.length > 0) {
			return 'Ok';
		}

		let hobby: Nullable<AnimeResultDto> = null;
		if (newRecord.hasHobby) {
			hobby = await this.animeService.getRandom();
		}

		await this.testUsersDynamoDBService.update(newRecord.id, {
			hobbies: newRecord.hasHobby ? [JSON.stringify(hobby)] : []
		});
		return 'Ok';
	}

	private clearRecord(recordDynamoDB: StreamRecord): {
		oldRecord: TestUsers;
		newRecord: TestUsers;
	} {
		const oldRecord = DynamoDB.Converter.unmarshall(
			recordDynamoDB.OldImage
		) as TestUsers;

		delete oldRecord['_ct'];
		delete oldRecord['_md'];

		const newRecord = DynamoDB.Converter.unmarshall(
			recordDynamoDB.NewImage
		) as TestUsers;

		delete newRecord['_ct'];
		delete newRecord['_md'];

		return {
			oldRecord,
			newRecord
		};
	}
}
