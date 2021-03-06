import type { AWS } from '@serverless/typescript';

import { testUsers, hobbies } from '@functions/index';

const serverlessConfiguration: AWS = {
	service: 'tracking-functions',
	frameworkVersion: '2',
	useDotenv: true,
	custom: {
		stage: '${opt:stage, "dev"}',
		webpack: {
			webpackConfig: './webpack.config.js',
			includeModules: true
		},
		/** @doc https://www.serverless.com/plugins/serverless-api-gateway-caching */
		apiGatewayCaching: {
			enabled: true,
			clusterSize: '0.5' /* 0.5 GB = 500 MB */
		}
	},
	plugins: [
		'serverless-webpack',
		'serverless-offline',
		'serverless-dotenv-plugin',
		'serverless-api-gateway-caching'
	],
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
	functions: { 'test-hobbies': hobbies, 'test-users': testUsers },
	resources: {
		Resources: {
			TestUsersDynamoDBTable: {
				Type: 'AWS::DynamoDB::Table',
				Properties: {
					TableName: '${env:DYNAMODB_TABLE_USERS}',
					AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
					KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
					ProvisionedThroughput: {
						ReadCapacityUnits: '1',
						WriteCapacityUnits: '1'
					},
					StreamSpecification: {
						StreamViewType: 'NEW_AND_OLD_IMAGES'
					}
				}
			}
		}
	}
};

module.exports = serverlessConfiguration;
