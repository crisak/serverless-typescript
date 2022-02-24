import { formatJSONResponse } from './format-json-response.util';
import { BadRequest } from './bad-request.util';
import { StatusCodes } from '@common/enums';

export class Response {
	static success({ statusCode = StatusCodes.OK, message = 'Success', data }) {
		return formatJSONResponse({
			statusCode,
			body: {
				message,
				data: data || null
			}
		});
	}
	static error(error: any, event?: any) {
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

		return formatJSONResponse({
			statusCode,
			body: responseData as any
		});
	}
}
