import 'source-map-support/register';

import { httpJsonBodyParser } from '@common/middlewares';
import { Response } from '@common/utils';
import { ValidatedEventAPIGatewayProxyEvent } from '@common/types';
import { DynamoDbRepository } from '@shared/services';
import { PostUserDto, PatchUserDto } from './dto/user.dto';

type UserSchema = typeof PostUserDto | typeof PatchUserDto;

const trackingService: ValidatedEventAPIGatewayProxyEvent<UserSchema> = async (
	event
) => {
	try {
		console.log('👇 event');
		console.log(event);
		const dynamoDBService = new DynamoDbRepository();
		let response = null;

		switch (event.resource) {
			case '/test-users':
				if (event.httpMethod === 'POST') {
					response = await dynamoDBService.add(event.body as any);
				}
				break;

			case '/test-users/{id}':
				if (event.httpMethod === 'PATCH') {
					await dynamoDBService.waitAsync(5000);
					response = await dynamoDBService.update(
						event.pathParameters.id,
						event.body
					);
				} else {
					if (event.queryStringParameters.search) {
						response = (await dynamoDBService.waitAsync(5000)) || [];
					} else {
						response = await dynamoDBService.get(event.pathParameters.id);
					}
				}
				break;
		}

		return Response.success({
			data: response || null
		});
	} catch (error) {
		return Response.error(error, event);
	}
};

export const main = httpJsonBodyParser(trackingService);
