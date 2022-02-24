import schema from './schema';
import { handlerPath } from '@common/utils';
import { FunctionAWS } from '@common/types';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'hello',
        request: {
          schemas: {
            'application/json': {
              schema,
              name: 'PostHelloDto'
            }
          }
        },
        cors: true
      }
    }
  ]
} as FunctionAWS;
