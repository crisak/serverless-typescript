import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@common/types';
import { Response } from '@common/utils';
import { httpJsonBodyParser } from '@common/middlewares';

import schema from './schema';

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    return Response.success({ message: `All ok`, data: event.body });
  } catch (error) {
    return Response.error(error, event);
  }
};

export const main = httpJsonBodyParser(hello);
