import { handlerPath } from '@common/utils';
import { FunctionAWS } from '@common/types';
import schemaUserDto from './dto/user.dto';

const resource = 'test-users';

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	events: [
		{
			http: {
				method: 'post',
				path: resource,
				cors: true,
				request: {
					schemas: {
						'application/json': {
							schema: schemaUserDto,
							name: 'PostTestUserDto'
						}
					}
				}
			}
		},
		{
			http: {
				method: 'get',
				path: `${resource}/{id}`,
				cors: true
			}
		}
	]
} as FunctionAWS;
