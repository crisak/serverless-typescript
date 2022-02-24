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
		const data = await dynamoDBService.get('My name is Cristian Camilo');
		return Response.success({ message: `All ok - ${data}`, data: event.body });
	} catch (error) {
		return Response.error(error, event);
	}
};

export const main = httpJsonBodyParser(trackingService);
