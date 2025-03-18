import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { MyBedrockProjectStack } from './bedrock-agent';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    new MyBedrockProjectStack(this, 'MyBedrockProjectStack', {
      env: { 
        account: process.env.CDK_DEFAULT_ACCOUNT, 
        region: process.env.CDK_DEFAULT_REGION 
      },
    });
    // example resource
    // const queue = new sqs.Queue(this, 'CdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
