import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const trackingService: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  console.log('input:', {
    event,
    body: event.body,
    env: process.env
  });

  return formatJSONResponse({
    message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
    event
  });
};

export const main = middyfy(trackingService);
