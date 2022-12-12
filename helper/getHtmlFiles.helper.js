import fs from "fs";
import path from "path";
const { S3_BUCKET_URL, BUCKET_PATH } = process.env

const getHtmlFiles = async (dir, projectId) => {
    let syncFiles = [];

    async function dirSync(currentDirPath, callback) {
        fs.readdirSync(currentDirPath).forEach((name) => {
            var filePath = path.join(currentDirPath, name);
            var stat = fs.statSync(filePath);
            if (stat.isFile()) {
                if(filePath.includes('html')){
                    callback(filePath, stat);
                }
            } else if (stat.isDirectory()) {
                dirSync(filePath, callback);
            }
        });
    }

    await dirSync(dir, async function (filePath) {
        let basePath = filePath.substring(dir.length);
        let bucketPath = BUCKET_PATH.replace('projectId', projectId).replace('basePath', basePath)
        let s3_url = `${S3_BUCKET_URL}/${bucketPath}`
        
        syncFiles.push({ filePath: basePath, key: bucketPath, url: s3_url, systemPath: filePath });
    });

    return syncFiles
}

export default getHtmlFiles