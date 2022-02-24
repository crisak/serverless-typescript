import { handlerPath } from '@common/utils';
import { FunctionAWS } from '@common/types';
import schemaUserDto from './dto/user.dto';

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	environment: {
		DYNAMODB_TABLE_USERS: 'Test-users-${self:custom.stage}'
	},
	events: [
		{
			http: {
				method: 'post',
				path: 'users',
				cors: true,
				request: {
					schemas: {
						'application/json': {
							schema: schemaUserDto,
							name: 'PostUserDto'
						}
					}
				}
			}
		},
		{
			http: {
				method: 'get',
				path: 'users/{id}',
				cors: true
			}
		}
	]
} as FunctionAWS;
