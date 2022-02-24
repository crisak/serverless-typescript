import { ApiGatewayResponse } from '../interfaces/api-gateway-response.interface';

export const formatJSONResponse = (response: ApiGatewayResponse) => {
	return {
		statusCode: response.statusCode,
		body: JSON.stringify(response)
	};
};
