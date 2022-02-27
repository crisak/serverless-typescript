import { handlerPath } from '@common/utils';
import { FunctionAWS } from '@common/types';
import { PostUserDto } from './dto/user.dto';

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
							schema: PostUserDto,
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
				cors: true,
				integration: 'lambda',
				authorizer: {
					name: 'fulfillment-dynamic-auth-${self:custom.stage}',
					resultTtlInSeconds: 120 /* 180 = 3 minutes */,
					type: 'token',
					arn: '${env:ARN_LAMBDA_DYNAMIC_AUTH}'
				},
				response: {
					headers: {
						'Access-Control-Allow-Origin': "'*'",
						'Access-all-public-data': "'example correct'"
					}
				},
				request: {
					parameters: {
						querystrings: {
							search: false
						},
						headers: {
							'api-key-example-header': false
						}
					}
				},
				caching: {
					enabled: true,
					ttlInSeconds: 60 /* 300 = 5 minutes */,
					cacheKeyParameters: [
						{ name: 'request.path.id' },
						{ name: 'request.querystring.search' },
						{ name: 'request.header.api-key-example-header' }
					]
				}
			}
		},
		{
			http: {
				method: 'patch',
				path: `${resource}/{id}`,
				cors: true,
				/**
				 * You must use lambda integration (instead of the default
				 * proxy integration) for this to work
				 */
				integration: 'lambda',
				caching: {
					enabled: true,
					ttlInSeconds: 60 /* 300 = 5 minutes */,
					cacheKeyParameters: [
						{ name: 'request.path.id' },
						{
							name: 'integration.request.header.bodyValue',
							mappedFrom: 'method.request.body'
						}
					]
				}
			}
		}
	]
} as FunctionAWS;
