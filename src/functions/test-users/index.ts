import { handlerPath } from '@common/utils';
import { FunctionAWS } from '@common/types';
import { PatchUserDto, PostUserDto } from './dto/user.dto';

const resource = 'test-users';
const defaultCorsHeaders = [
	'Content-Type',
	'X-Amz-Date',
	'Authorization',
	'X-Api-Key',
	'X-Amz-Security-Token'
];

const CUSTOM_HEADER_TEST = 'custom-value-header-api-key';
const INVALID_CACHE = 'Cache-Control';

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
							name: 'TestUserDto'
						}
					}
				}
			}
		},
		{
			http: {
				method: 'get',
				path: `${resource}/{id}`,
				cors: {
					origin: ['*'],
					methods: ['GET', 'PATCH', 'OPTIONS'] /* Ignore method POST cors */,
					headers: [...defaultCorsHeaders, CUSTOM_HEADER_TEST, INVALID_CACHE]
				},
				authorizer: {
					name: 'fulfillment-dynamic-auth-${self:custom.stage}',
					resultTtlInSeconds: 0 /* 180 = 3 minutes */,
					type: 'token',
					arn: '${env:ARN_LAMBDA_DYNAMIC_AUTH}'
				},
				request: {
					parameters: {
						querystrings: {
							search: false
						},
						headers: {
							[CUSTOM_HEADER_TEST]: true,
							[INVALID_CACHE]: false
						}
					}
				},
				caching: {
					enabled: true,
					ttlInSeconds: 60 /* 300 = 5 minutes */,
					cacheKeyParameters: [
						{ name: 'request.path.id' },
						{ name: 'request.querystring.search' },
						{ name: `request.header.${CUSTOM_HEADER_TEST}` }
					]
				}
			}
		},
		{
			http: {
				method: 'patch',
				path: `${resource}/{id}`,
				/**
				 * You must use lambda integration (instead of the default
				 * proxy integration) for this to work
				 */
				integration: 'lambda',
				request: {
					schemas: {
						'application/json': {
							schema: PatchUserDto,
							name: 'PatchTestUserDto'
						}
					}
				},
				response: {
					headers: {
						'Access-Control-Allow-Origin': "'*'",
						'custom-response-header-all-responses': "'All ok'"
					}
				},
				caching: {
					enabled: true,
					ttlInSeconds: 60 /* 300 = 5 minutes */,
					cacheKeyParameters: [
						{ name: 'request.path.id' },
						{
							name: 'integration.request.header.bodyPatchUserDto',
							mappedFrom: 'method.request.body'
						}
					]
				}
			}
		}
	]
} as FunctionAWS;
