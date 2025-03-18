require('dotenv').config();
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function uploadBuild() {
    // Run Bash Command to upload React build
    const { stdout, stderr } = await exec(`aws s3 cp dist s3://${process.env.S3WebBucket} --recursive`)
    console.log(stdout, stderr)
    return stdout
}

async function invalidateCloudfront() {
    // Run Bash Command to invalidate Cloudfront Cache
    const { stdout, stderr } = await exec(`aws cloudfront create-invalidation --distribution-id ${process.env.CloudfrontID} --paths '/*'`)
    console.log(stdout, stderr)
    return stdout
}


async function main() {
    try {
        // uploadBuild
        await uploadBuild()

        // Invalidate Cloudfront
        await invalidateCloudfront()

        return 'Success'
    }
    catch (err) {
        console.error(err)
    }
}

main()