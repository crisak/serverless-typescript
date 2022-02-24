import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';

export const httpJsonBodyParser = (handler) => {
	return middy(handler).use(middyJsonBodyParser());
};
