import fs from "fs";
import AWS from "aws-sdk";
import * as cheerio from 'cheerio';
import mime from 'mime';
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET, BUCKET_PERMISSION } = process.env

const replaceURL = async (htmlFiles, s3Urls) => {
    let syncFiles = [];
    const s3 = new AWS.S3({
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    });

    for(let i = 0; i < htmlFiles.length; i++){
        let _doc = htmlFiles[i]
        
        let data = await fs.readFileSync(_doc.systemPath, 'utf8')
        let $ = cheerio.load(data)
        let ancherTagObjects = $('a')
        let scriptObjects = $('script')
        let linkObjects = $('link')
        let imgObjects = $('img')

        scriptObjects.each((index, element) => {
            let href = $(element).attr('src')
            let s3link = getUploadedS3Url(href, s3Urls)
            $ = cheerio.load($.html().replace(href, s3link));
        });

        ancherTagObjects.each((index, element) => {
            let href = $(element).attr('href')
            let s3link = getUploadedS3Url(href, s3Urls)
            $ = cheerio.load($.html().replace(href, s3link));
        });

        linkObjects.each((index, element) => {
            let href = $(element).attr('href')
            let s3link = getUploadedS3Url(href, s3Urls)
            $ = cheerio.load($.html().replace(href, s3link));
        });
        
        imgObjects.each((index, element) => {
            let href = $(element).attr('src')
            let s3link = getUploadedS3Url(href, s3Urls)
            $ = cheerio.load($.html().replace(href, s3link));
        });

        await fs.writeFileSync(_doc.systemPath, $.html(), 'utf-8');

        let bucketName = AWS_S3_BUCKET
        let params = {
            Bucket: bucketName,
            Key: _doc.key,
            Body: fs.readFileSync(_doc.systemPath),
            ContentType: mime.getType(_doc.systemPath),
            ContentDisposition: 'inline',
            ACL: BUCKET_PERMISSION
        };
        await s3.putObject(params, function (err) {
            if (err) {
                console.log(err);
            } else {
                // console.log("Successfully uploaded " + _doc.s3_url);
            }
        });
    }

    return syncFiles
}

const getUploadedS3Url = (localPath, s3Urls) => {
    let find = s3Urls.find(_doc => _doc.filePath === localPath)
    return find?.url || localPath
}

export default replaceURL