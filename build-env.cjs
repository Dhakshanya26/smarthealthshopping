const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const toml = require('toml');
const SAMFile = './backend/samconfig.toml';


function getSamConfig() {
// Get SAM toml file to get Stack Outputs
    const config = toml.parse(fs.readFileSync(SAMFile, 'utf-8'));
    // const {stack_name, region} = config['default.deploy.parameters'];
    const {stack_name, region} = config.default.deploy.parameters
    console.log('SAM CONFIG: ', stack_name, region);
    return {stack_name, region}
}

async function getStackOutputs({stack_name, region}) {
    let StackOutputs = {};

    // Run Bash Command to get outputs and build ENV FILE
    const { stdout, stderr } = await exec(`sam list stack-outputs --stack-name ${stack_name} --region ${region} --output json`)
    
    JSON.parse(stdout).forEach(i => {
        StackOutputs[i.OutputKey]= i.OutputValue
    })
    console.log('Stack Outputs: ', StackOutputs)
    // console.log(`stderr: ${stderr}`);
    return StackOutputs
}

async function buildEnvFile(stackOutputs) {
// Build the ENV file for React Vite
    let envData = ""
    Object.entries(stackOutputs).forEach( ([key, value]) => {
        if (key === 'ApiGatewayURL' || key === 'UserPoolId' || key === 'ClientId') {
            envData += `VITE_${key}=${value} \n`
        }
        else {
            envData += `${key}=${value} \n`
        }
    }) 
    fs.writeFileSync('.env', envData)
    return envData
}


async function main() {
    try {
        // Get Config from SAM toml file
        const {stack_name, region} = getSamConfig()

        // Get the Stack Outputs from Cloudformation
        const outputs = await getStackOutputs({stack_name, region})

        // Build the .env file
        const result = await buildEnvFile(outputs)
        console.log(result)
        return 'Success'
    }
    catch (err) {
        console.error(err)
    }
}

main()