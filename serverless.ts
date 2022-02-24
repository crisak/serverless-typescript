import type { AWS } from '@serverless/typescript';

import { trackingService, hello } from '@functions/index';

const serverlessConfiguration: AWS = {
	service: 'tracking-functions',
	frameworkVersion: '2',
	custom: {
		webpack: {
			webpackConfig: './webpack.config.js',
			includeModules: true
		}
	},
	plugins: ['serverless-webpack'],
	provider: {
		name: 'aws',
		runtime: 'nodejs14.x',
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true
		},
		environment: {
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1'
		},
		lambdaHashingVersion: '20201221'
	},
	// import the function via paths
	functions: { hello, 'tracking-service': trackingService }
};

module.exports = serverlessConfiguration;
