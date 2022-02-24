import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@common/types';
import { Response } from '@common/utils';

import schema from './schema';

const testCognito: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
	event
) => {
	try {
		console.log('Event:', event);
		return Response.success({ message: `All ok`, data: event.body });
	} catch (error) {
		return Response.error(error, event);
	}
};

export const main = testCognito;
