import schema from './schema';
import { handlerPath } from '@common/utils';
import { FunctionAWS } from '@common/types';

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	events: [
		{
			http: {
				method: 'put',
				path: 'tracking-service',
				cors: true,
				request: {
					schemas: {
						'application/json': {
							schema,
							name: 'PutTrackingServiceDto'
						}
					}
				}
			}
		}
	]
} as FunctionAWS;
