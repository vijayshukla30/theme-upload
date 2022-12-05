import fs from "fs";
import path from "path";
var AWS = require("aws-sdk");

const syncDirectory = async (dir, projectId) => {
    let syncFiles = [];
    
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    function dirSync(currentDirPath, callback) {
        fs.readdirSync(currentDirPath).forEach((name) => {
            var filePath = path.join(currentDirPath, name);
            var stat = fs.statSync(filePath);
            if (stat.isFile() && !filePath.includes('html') && !filePath.includes('txt')) {
                callback(filePath, stat);
            } else if (stat.isDirectory()) {
                dirSync(filePath, callback);
            }
        });
    }

    dirSync(dir, async function (filePath) {
        let basePath = filePath.substring(dir.length);
        let bucketPath = `${projectId}/theme/${basePath}`
        let s3_url = `${process.env.S3_BUCKET_URL}/${bucketPath}`

        syncFiles.push({ filePath: basePath, key: bucketPath, url: s3_url, systemPath: filePath });
        let bucketName = process.env.AWS_S3_BUCKET
        let params = {
            Bucket: bucketName,
            acl: "public-read",
            Key: bucketPath,
            Body: fs.readFileSync(filePath),
        };
        s3.upload(params, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log(
                    "Successfully uploaded " + bucketPath + " to " + bucketName
                );
            }
        });
    });

    return syncFiles;
};

export default syncDirectory;