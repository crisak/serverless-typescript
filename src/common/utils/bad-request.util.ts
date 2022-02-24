import { StatusCodes } from '@common/enums';

export type MessageCode = `${string}${number}${'E' | 'B'}`;

/**
 * @docs https://www.ibm.com/docs/es/ibm-mq/9.1?topic=api-rest-error-handling
 */
export class BadRequest implements BadRequestProps {
	public statusCode: StatusCodes;
	public type?:
		| 'exception'
		| 'business'
		| 'sqs'
		| 'dynamodb'
		| 'elasticsearch'
		| 'cognito';
	public code?: MessageCode;
	public message?: string;
	public data?: any;
	constructor({
		type,
		code,
		message,
		data,
		statusCode
	}: Partial<BadRequestProps>) {
		this.type = type || 'exception';
		this.code = code || null;
		this.message = message || '';
		this.data = data || {};
		this.statusCode = statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
	}
}

export interface BadRequestProps {
	statusCode?: StatusCodes;
	type?:
		| 'exception'
		| 'business'
		| 'sqs'
		| 'dynamodb'
		| 'elasticsearch'
		| 'cognito';
	/**
	 * @docs
	 * code = MODnnnnX
	 *  MOD
	 *   Module prefix that shows that the message has originated in the REST API
	 *  nnnn
	 *   Exclusive number that identifies the message
	 *  X
	 *   Unique letter that indicates the severity of the message:
	 *   - E If the message is a exception.
	 * 	 - B If the message is a error business.
	 * @example
	 * TMU = tracking-mensajeros-urbanos
	 * TMU0001B
	 */
	code?: MessageCode;
	message?: string;
	data?: any;
}
