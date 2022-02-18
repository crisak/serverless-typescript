import schema from './schema';
import { handlerPath } from '@libs/handlerResolver';
import type { AwsLambdaEnvironment } from '@serverless/typescript';

console.log('handlerPath:', handlerPath(__dirname));
export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'put',
        path: 'tracking-service',
        request: {
          schemas: {
            'application/json': schema
          }
        }
      }
    }
  ],
  environment: {
    DYNAMODB_TABLE_SERVICE: `tracking-service-${process.env.STAGE}`
  }
} as { environment: AwsLambdaEnvironment };
