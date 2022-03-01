import { BadRequest } from './bad-request.util';
import { StatusCodes } from '@common/enums';
import { APIGatewayProxyResult } from 'aws-lambda';

export class ResponseProxy {
	static success({
		statusCode = StatusCodes.OK,
		message = 'Success',
		data
	}): APIGatewayProxyResult {
		return {
			/**
			 * Fix error
			 * "set the request's mode to 'no-cors' to fetch the resource with cors disabled"
			 * Resolve:
			 * ```js
			 * headers: {
			 * 	'Access-Control-Allow-Origin': '*'
			 * },
			 * ```
			 */
			statusCode,
			headers: {
				'Access-Control-Allow-Origin': '*'
			},
			body: JSON.stringify({
				message,
				data: data || null
			})
		};
	}
	static error(error: any, event?: any): APIGatewayProxyResult {
		console.error('🚨: ', error);
		if (event) {
			console.error('Event input 👇');
			console.error(event);
		}

		let { statusCode: statusCode, ...responseData } = new BadRequest({
			message: error?.message || 'Exception error',
			data: error
		});

		if (error instanceof BadRequest) {
			const { statusCode: status, ...restProps } = error;
			responseData = restProps;
			statusCode = status;
		}

		return {
			statusCode,
			headers: {
				'Access-Control-Allow-Origin': '*'
			},
			body: JSON.stringify(responseData)
		};
	}
}
