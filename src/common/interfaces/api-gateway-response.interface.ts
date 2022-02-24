import { StatusCodes } from "../enums";

export interface ApiGatewayResponse {
	statusCode: StatusCodes;
	body: Record<string, unknown>
}