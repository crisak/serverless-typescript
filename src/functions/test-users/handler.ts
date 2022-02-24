import 'source-map-support/register';

import { httpJsonBodyParser } from '@common/middlewares';
import { Response } from '@common/utils';
import { ValidatedEventAPIGatewayProxyEvent } from '@common/types';
import { DynamoDbRepository } from '@shared/services';
import TestUserDto from './dto/user.dto';

const trackingService: ValidatedEventAPIGatewayProxyEvent<
	typeof TestUserDto
> = async (event) => {
	try {
		const dynamoDBService = new DynamoDbRepository();
		let response = null;

		switch (event.resource) {
			case '/test-users':
				if (event.httpMethod === 'POST') {
					response = await dynamoDBService.add(event.body as any);
				}
				break;

			case '/test-users/{id}':
				response = await dynamoDBService.get(event.pathParameters.id);
				break;
		}

		return Response.success({
			data: response
		});
	} catch (error) {
		return Response.error(error, event);
	}
};

export const main = httpJsonBodyParser(trackingService);
