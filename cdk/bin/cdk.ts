#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { MyBedrockProjectStack } from '../lib/bedrock-agent';

const app = new cdk.App();
new MyBedrockProjectStack(app, 'MyBedrockProjectStack', {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT || process.env.AWS_ACCOUNT_ID, 
    region: process.env.CDK_DEFAULT_REGION || 'us-west-2'
  },
});
