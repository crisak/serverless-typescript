import { AWS } from '@serverless/typescript';
import type {
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
	Handler
} from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

export type FunctionAWS = AWS['functions']['name-function'];

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {
	body: FromSchema<S>;
};
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
	ValidatedAPIGatewayProxyEvent<S>,
	APIGatewayProxyResult
>;
