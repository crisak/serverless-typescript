import 'source-map-support/register';

import { httpJsonBodyParser } from '@common/middlewares';
import { ResponseProxy } from '@common/utils';
import { ValidatedEventAPIGatewayProxyEvent } from '@common/types';
import { DynamoDbRepository } from '@shared/services';
import { PostUserDto, PatchUserDto } from './dto/user.dto';
import { APIGatewayProxyEvent } from 'aws-lambda';

type UserSchema = typeof PostUserDto | typeof PatchUserDto;

const testUsers: ValidatedEventAPIGatewayProxyEvent<UserSchema> | any = async (
	event
) => {
	try {
		console.log('👇 event');
		console.log(event);
		console.log(JSON.stringify(event, null, 2));

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

					return {
						message: 'Ok 🙃',
						data: response || 'Without data'
					};
				}

				if (event.httpMethod === 'GET') {
					if (event.queryStringParameters?.search) {
						response = (await dynamoDBService.waitAsync(5000)) || [];
					} else {
						response = await dynamoDBService.get(event.pathParameters.id);
					}
				}
				break;
		}

		return ResponseProxy.success({
			data: response || null
		});
	} catch (error) {
		/* @ts-ignore */
		if (configLambda.isProxy) {
			return ResponseProxy.error(error, event);
		}
		console.error('🚨 Error lambda custom: ', error);
		throw error;
	}
};

export const main = (event) => {
	global['configLambda'] = {
		isProxy: Boolean(event?.resource && event?.httpMethod)
	};

	/** @ts-ignore */
	if (configLambda.isProxy) {
		return httpJsonBodyParser(testUsers);
	}

	const formatEvent: APIGatewayProxyEvent = {
		...event,
		httpMethod: event.httpMethod || event.method,
		resource: event.resource || event.requestPath
	};
	return testUsers(formatEvent);
};
