import fs from "fs";
import path from "path";
var AWS = require("aws-sdk");
const {
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    S3_BUCKET_URL,
    AWS_S3_BUCKET
} = process.env

const syncDirectory = async (dir, projectId) => {
    let syncFiles = [];
    
    const s3 = new AWS.S3({
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    });

    async function dirSync(currentDirPath, callback) {
        fs.readdirSync(currentDirPath).forEach(async (name) => {
            var filePath = path.join(currentDirPath, name);
            var stat = fs.statSync(filePath);
            if (stat.isFile() && !filePath.includes('html') && !filePath.includes('txt')) {
                callback(filePath, stat);
            } else if (stat.isDirectory()) {
                await dirSync(filePath, callback);
            }
        });
    }

    await dirSync(dir, async function (filePath) {
        let basePath = filePath.substring(dir.length);
        let bucketPath = `${projectId}/theme/${basePath}`
        let s3_url = `${S3_BUCKET_URL}/${bucketPath}`

        syncFiles.push({ filePath: basePath, key: bucketPath, url: s3_url, systemPath: filePath });

        let bucketName = AWS_S3_BUCKET
        let params = {
            Bucket: bucketName,
            Key: bucketPath,
            Body: fs.readFileSync(filePath),
            ContentDisposition: 'inline',
            ACL: 'public-read'
        };
        s3.upload(params, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log( "Successfully uploaded " + s3_url);
            }
        });
    });

    return syncFiles;
};

export default syncDirectory;