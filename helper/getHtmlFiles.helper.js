import fs from "fs";
import path from "path";

const getHtmlFiles = async (dir, baseDirectory, urls) => {
    let syncFiles = [];

    function dirSync(currentDirPath, callback) {
        fs.readdirSync(currentDirPath).forEach((name, i) => {
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

    dirSync(dir, async function (filePath, stat) {
        let basePath = filePath.substring(baseDirectory.length);
        let bucketPath = `projectId/theme/${basePath}`
        let s3_url = `${process.env.S3_BUCKET_URL}/${bucketPath}`
        
        syncFiles.push({ filePath: basePath, key: bucketPath, url: s3_url, systemPath: filePath});
    });

    return syncFiles
}

export default getHtmlFiles