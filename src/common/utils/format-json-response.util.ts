import { ApiGatewayResponse } from '@common/interfaces';

export const formatJSONResponse = (response: ApiGatewayResponse) => {
	return {
		statusCode: response.statusCode,
		body: JSON.stringify(response.body)
	};
};
