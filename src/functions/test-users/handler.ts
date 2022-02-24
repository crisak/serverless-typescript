import 'source-map-support/register';

import schema from './schema';
import { httpJsonBodyParser } from '@common/middlewares';
import { Response } from '@common/utils';
import { ValidatedEventAPIGatewayProxyEvent } from '@common/types';
import { DynamoDbRepository } from '@shared/services';

const trackingService: ValidatedEventAPIGatewayProxyEvent<
	typeof schema
> = async (event) => {
	try {
		const dynamoDBService = new DynamoDbRepository();
		let response = null;
		console.log('event.soruce', event.resource);

		switch (event.resource) {
			case '/users':
				if (event.httpMethod === 'POST') {
					response = await dynamoDBService.add(event.body as any);
				}
				break;

			case '/users/{id}':
				response = await dynamoDBService.get(event.pathParameters.id);
				break;
		}

		return Response.success({ data: response });
	} catch (error) {
		return Response.error(error, event);
	}
};

export const main = httpJsonBodyParser(trackingService);
