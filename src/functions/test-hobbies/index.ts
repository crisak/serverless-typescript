import { handlerPath } from '@common/utils';
import { FunctionAWS } from '@common/types';

console.log('values', process.env);

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	events: [
		{
			// stream: process.env.ARN_STREAM_DYNAMODB_TABLE_USERS
			stream: '${env:ARN_STREAM_DYNAMODB_TABLE_USERS}'
		}
	]
} as FunctionAWS;
