import { handlerPath } from '@common/utils';
import { FunctionAWS } from '@common/types';

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	events: [
		{
			stream: '${env:ARN_STREAM_DYNAMODB_TABLE_USERS}'
		}
	]
} as FunctionAWS;
