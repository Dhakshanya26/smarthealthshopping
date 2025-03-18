const AWS = require("aws-sdk");
const DDB = new AWS.DynamoDB.DocumentClient();
const {randomUUID} = require('crypto')

const { ORDER_TABLE, CUSTOMER_TABLE, LOCATION_TABLE } = process.env

// Submit order to DDB table
const submitOrder = async (orderDetails) => {
    const {productName, productSize, customerName, storeName, orderTotal} = orderDetails
    const order = {orderId: randomUUID()}
    const d = new Date()

    const params = {
        TableName: ORDER_TABLE,
        Item: {
            id: order.orderId,
            name: customerName,
            product: productName,
            size: productSize,
            store: storeName,
            total: orderTotal,
            orderStatus: 'in-process',
            timestamp: d.toISOString()
        }
    }
    const res = await DDB.put(params).promise()
    console.log('DDB RES:', res)
    return order;
}

// Build Response for Bedrock
const buildRes = async (event, data, status) => {
    const {actionGroup, apiPath, httpMethod, sessionAttributes, promptSessionAttributes} = event

    const resBody = {
        'application/json': {
            'body': JSON.stringify(data)
        }
    }
    
    const api_res = {
        'messageVersion': '1.0',
        'response': {
            'actionGroup': actionGroup,
            'apiPath': apiPath,
            'httpMethod': httpMethod,
            'httpStatusCode': status,
            'responseBody': resBody
        }
    }

    console.log('FULL RES:', api_res)
    return api_res
}

// Parse Bedrock Body and transform to JSON object
const parseBody = (event) => {
    const {requestBody: {content}} = event
    const arr = content['application/json'].properties

    let json = {}
    arr.forEach(el => json[el.name] = el.value)

    console.log('BODY PARSE:', json)
    return json
}

// Parse Parameters for Bedrock Get
const parseParameters = (event) => {
    const {parameters} = event

    let json = {}
    parameters.forEach(el => json[el.name] = el.value)

    console.log('PARAMETER PARSE:', json)
    return json
}

// Static Values for DEMO
// Wire up Database and return JSON
const getCustomer = async (params) => {
    const {CustomerName} = params
    if (CustomerName === 'Jacob') {
        return {
            customerId: 'jacob-123',
            name: 'Jacob',
            city: 'seattle',
            likes: 'caramel hot coffee'
        }
    }
    else return {}
}

// Static Values for DEMO
// Wire up Database and return JSON
const getLocation = async (params) => {
    const {CityName} = params
    return [
        {
            locationId: 'sea-7',
            address: '1515 7th Street',
            city: 'seattle',
            storeName: '7th & Westlake',
            hours: '6am - 5pm'
        },
        {
            locationId: 'sea-11',
            address: '999 SW Elm',
            city: 'seattle',
            storeName: 'SW Elm',
            hours: '6am - 5pm'
        }
    ]
}

exports.handler = async (event) => {
    try {
        console.log('EVENT:', JSON.stringify(event))
        const {apiPath}= event

        let res = 'SUCCESS'

        // Route to Get Customer
        if (apiPath ==='/customer/{CustomerName}') {
            const params = parseParameters(event)
            res = await getCustomer(params)
        }

        // Rout to Get Locations
        if(apiPath === '/location') {
            const params = parseParameters(event)
            res = await getLocation(params)
        }

        // Route to Submit Order Logic
        if (apiPath === '/submitOrder') {
            const orderDetails = parseBody(event)
            res = await submitOrder(orderDetails)
        }


        return await buildRes(event, res, 200); 
    }
    catch (err) {
        console.error(err)
        return await buildRes(event, err, 400)
    }       
};