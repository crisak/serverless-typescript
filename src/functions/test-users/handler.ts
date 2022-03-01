import 'source-map-support/register';

import { BadRequest, ResponseProxy, ValidObject } from '@common/utils';
import { ValidatedEventAPIGatewayProxyEvent } from '@common/types';
import { DynamoDbRepository } from '@shared/services';
import { PostUserDto, PatchUserDto } from './dto/user.dto';
import {
	APIGatewayEventRequestContext,
	APIGatewayProxyEvent
} from 'aws-lambda';
import { StatusCodes } from '@common/enums';

type UserSchema = typeof PostUserDto | typeof PatchUserDto;

const router: ValidatedEventAPIGatewayProxyEvent<UserSchema> | any = async (
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

					if (event.body.name === '1.throwErrorCustom-400') {
						throw new BadRequest({
							statusCode: StatusCodes.BAD_REQUEST,
							type: 'business',
							data: 'Hello',
							message: 'This error internal of server'
						}).toString();
					}

					if (event.body.name === '2.throwErrorCustom-404') {
						throw new BadRequest({
							statusCode: StatusCodes.NOT_FOUND,
							type: 'business',
							data: 'Hello',
							message: 'This error internal of server'
						}).toString();
					}

					if (event.body.name === '3.throwErrorCustom-500') {
						throw new BadRequest({
							statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
							type: 'business',
							data: 'Hello',
							message: 'This error internal of server'
						}).toString();
					}

					if (event.body.name === '4.throwErrorCustom-504') {
						throw new BadRequest({
							statusCode: StatusCodes.TIME_OUT,
							type: 'business',
							data: 'Hello',
							message: 'This error internal of server'
						}).toString();
					}

					if (event.body.name === '5.throwErrorCustom-504') {
						throw new BadRequest({
							statusCode: StatusCodes.UNAUTHORIZED,
							type: 'business',
							data: 'Hello',
							message: 'Task timed out after 1000.1000 seconds'
						}).toString();
					}

					if (event.body.name === '6.throwErrorCustom-504') {
						throw new BadRequest({
							statusCode: StatusCodes.BAD_REQUEST,
							type: 'business',
							data: 'Hello',
							message: 'Task timed out after 1000.1000 seconds'
						}).toString();
					}

					if (event.body.name === 'invokeError-400') {
						throw new Error('[400] This is error of bad request');
					}

					if (event.body.name === 'invokeError-500') {
						throw new Error('[500] This is a error "internal server"');
					}

					const userData = await dynamoDBService.get(event.pathParameters.id);
					if (userData.username === 'errorInternalTest') {
						await dynamoDBService.update(event.pathParameters.id, {
							...event.body,
							username: ''
						});
						throw new Error('[400] Error username has "errorInternalTest"');
					}

					response = await dynamoDBService.update(event.pathParameters.id, {
						...event.body,
						username: 'errorInternalTest'
					});

					return {
						message: 'Ok 🙃',
						data: response || 'Without data'
					};
				}

				if (event.httpMethod === 'GET') {
					if (event.queryStringParameters?.search) {
						response = (await dynamoDBService.waitAsync(5000)) || [];
					} else {
						if (event.pathParameters.id === 'invokeError-customError') {
							throw new BadRequest({
								type: 'business',
								message: 'Error internal, no save in cache'
							});
						}

						if (event.pathParameters.id === 'invokeError-error') {
							throw new Error('Error internal, handle error native');
						}

						await dynamoDBService.waitAsync(4000);
						response = await dynamoDBService.get(event.pathParameters.id);
					}
				}
				break;
			default:
				throw new BadRequest({
					message: 'Resource not found',
					statusCode: StatusCodes.BAD_REQUEST
				});
		}

		/* @ts-ignore */
		if (configLambda.isProxy) {
			return ResponseProxy.success({
				data: response || null
			});
		}
		return { message: 'ok', data: response || null };
	} catch (error) {
		/* @ts-ignore */
		if (configLambda.isProxy) {
			return ResponseProxy.error(error, event);
		}

		console.error('🚨 Error lambda custom: ', error);
		throw error;
	}
};

export const main = (event, context: APIGatewayEventRequestContext) => {
	console.log('context:', context);

	global['configLambda'] = {
		isProxy: Boolean(event?.resource && event?.httpMethod),
		requestId: context.requestId || ''
	};

	/** @ts-ignore */
	if (configLambda.isProxy) {
		console.log('IS_PROXY');
		event.body = JSON.parse(event.body);
		return router(event);
	}

	const isValid = ValidObject.isValid;

	const formatEvent: APIGatewayProxyEvent = {
		...event,
		httpMethod: event.httpMethod || event.method,
		resource: event.resource || event.requestPath,
		pathParameters: isValid(event.pathParameters)
			? event.pathParameters
			: event.path,
		queryStringParameters: isValid(event.queryStringParameters)
			? event.queryStringParameters
			: event.query
	};
	return router(formatEvent);
};
