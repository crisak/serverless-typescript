import { BadRequest } from './bad-request.util';
import { StatusCodes } from '@common/enums';
import { APIGatewayProxyResult } from 'aws-lambda';

export class Response {
	static success({
		statusCode = StatusCodes.OK,
		message = 'Success',
		data
	}): APIGatewayProxyResult {
		return {
			statusCode,
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

		let { statusCode, ...responseData } = new BadRequest({
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
			body: JSON.stringify(responseData)
		};
	}
}
