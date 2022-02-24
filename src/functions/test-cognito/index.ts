import { handlerPath } from '@common/utils';
import { FunctionAWS } from '@common/types';

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	events: [
		{
			stream: {
				arn: {
					'Fn::GetAtt': [
						'Test-users-${self:custom.stage}',
						'arn:aws:dynamodb:us-east-1:122155166549:table/Test-users-${self:custom.stage}'
					]
				}
			}
		}
	]
} as FunctionAWS;
