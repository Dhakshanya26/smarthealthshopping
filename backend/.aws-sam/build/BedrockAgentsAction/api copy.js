// Function that handles proxy from ApiGateway
const { BedrockAgentRuntimeClient, InvokeAgentCommand } = require("@aws-sdk/client-bedrock-agent-runtime");
const { DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const ddb = new DynamoDBClient();
const ddbDocClient = DynamoDBDocumentClient.from(ddb)
const client = new BedrockAgentRuntimeClient();

const {BEDROCK_AGENT_ID, AGENT_ALIAS, ORDER_TABLE} = process.env

const buildRes = async (data, status) => {
    return {
        statusCode: status,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type, X-Api-Key",
            "Access-Control-Allow-Origin": "*", // Allow from anywhere 
            "Access-Control-Allow-Methods": "*" // Allow all request methods
        },
        body: JSON.stringify(data)
    }

}

const getDDB = async () => {
    const input = {
        TableName: ORDER_TABLE
    }
    const command = new ScanCommand(input)
    const res = await ddbDocClient.send(command)
    console.log('DDB: ', res)
    return res.Items
}

const handleUserMsg = async (body, session) => {
    // USER MSG
    console.log('USER MSG: ', body)

    const input = {
        agentId: BEDROCK_AGENT_ID, //required
        agentAliasId: AGENT_ALIAS, //required
        sessionId: session, //required
        inputText: body, //required
    }
    try {
        const response = await invokeAgent(input)

        console.log('BOT RES: ', response)

        const res = {
            bot: response.completion
        }
        console.log('RES:', res)
        return res;
    }
    catch (err) {
        console.error(err)
        return { error: err.message }
    }
}

const invokeAgent = async (input) => {
    try {
    return new Promise(async (resolve, reject) => {
        let completion = "";
        const command = new InvokeAgentCommand(input);
        const response = await client.send(command);
  
        for await (const chunkEvent of response.completion) {
          if (chunkEvent.chunk) {
            const chunk = chunkEvent.chunk;
            let decoded = new TextDecoder("utf-8").decode(chunk.bytes);
            completion += decoded;
          }
        }      
        
        resolve({response, completion}) 
     });
    }
    catch (err) {
        return Promise.reject(err);
    }
}

exports.handler = async (event) => {
    try {
        console.log('EVENT:', event)
        const {httpMethod, path, queryStringParameters, body}= event

        let res = 'SUCCESS'

        // Route to Business Logic
        if (path === '/message') res = await handleUserMsg(JSON.parse(body), queryStringParameters.session)

        if (path === '/ddb') res = await getDDB()


        return await buildRes(res, 200); 
    }
    catch (err) {
        console.error(err)
        return await buildRes(err, 400)
    }       
};