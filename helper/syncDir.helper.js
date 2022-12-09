import fs from "fs";
import path from "path";
import AWS from "aws-sdk";
import mime from 'mime';
const {
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    S3_BUCKET_URL,
    AWS_S3_BUCKET,
    BUCKET_PERMISSION
} = process.env

const syncDirectory = async (dir, projectId) => {
    let css = [], js = [], img = [], doc = [];
    
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

        let fileExtention = path.extname(filePath);
        let fileType = validateFileType(fileExtention)
        if(fileType === 'css'){
            css.push({ filePath: basePath, key: bucketPath, url: s3_url, systemPath: filePath })
        } else if(fileType === 'js'){
            js.push({ filePath: basePath, key: bucketPath, url: s3_url, systemPath: filePath })   
        } else if(fileType === 'img'){
            img.push({ filePath: basePath, key: bucketPath, url: s3_url, systemPath: filePath })
        } else if(fileType === 'doc'){
            doc.push({ filePath: basePath, key: bucketPath, url: s3_url, systemPath: filePath })
        }

        let bucketName = AWS_S3_BUCKET
        let params = {
            Bucket: bucketName,
            Key: bucketPath,
            Body: fs.readFileSync(filePath),
            ContentType: mime.getType(filePath),
            ContentDisposition: 'inline',
            ACL: BUCKET_PERMISSION
        };
        s3.putObject(params, function (err) {
            if (err) {
                console.log(err);
            } else {
                // console.log( "Successfully uploaded " + s3_url);
            }
        });
    });

    return { css, js, img, doc };
};

const validateFileType = (extention) => {
    extention = extention.split('.')[1] || extention
    let image = ['png', 'jpg', 'jpeg', 'svg', 'PNG', 'JPG', 'JPEG', 'SVG']
    let css = ['css']
    let js = ['js']

    if(image.includes(extention)){
        return 'img'
    } else if(css.includes(extention)){
        return 'css'
    } else if(js.includes(extention)){
        return 'js'
    } else {
        return 'doc'
    }
}

export default syncDirectory;