import 'source-map-support/register';

import schema from './schema';
import { httpJsonBodyParser } from '@common/middlewares';
import { Response } from '@common/utils';
import { ValidatedEventAPIGatewayProxyEvent } from '@common/types';

const trackingService: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  try {
    return Response.success({ message: `All ok`, data: event.body });
  } catch (error) {
    return Response.error(error, event);
  }
};

export const main = httpJsonBodyParser(trackingService);
