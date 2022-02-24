import type { AWS } from '@serverless/typescript';

import { trackingService, hello } from '@functions/index';

const serverlessConfiguration: AWS = {
	service: 'tracking-functions',
	frameworkVersion: '2',
	custom: {
		stage: '${opt:stage}',
		webpack: {
			webpackConfig: './webpack.config.js',
			includeModules: true
		}
	},
	plugins: ['serverless-webpack'],
	provider: {
		region: 'us-east-1',
		name: 'aws',
		runtime: 'nodejs14.x',
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true
		},
		environment: {
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1'
		},
		lambdaHashingVersion: '20201221',
		iamRoleStatements: [
			{
				Effect: 'Allow',
				Action: ['dynamodb:*'],
				Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/*'
			}
		]
	},
	// import the function via paths
	functions: { hello, 'test-users': trackingService },
	resources: {
		Resources: {
			TestUsersDynamoDBTable: {
				Type: 'AWS::DynamoDB::Table',
				Properties: {
					TableName: 'Test-users-${self:custom.stage}',
					AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
					KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
					ProvisionedThroughput: {
						ReadCapacityUnits: '1',
						WriteCapacityUnits: '1'
					}
				}
			}
		}
	}
};

module.exports = serverlessConfiguration;
