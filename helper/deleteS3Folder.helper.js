
import fs from "fs";
import path from "path";
var AWS = require("aws-sdk");

const deleteS3Folder = async (projectId) => {
    try {
        const bucketName = process.env.AWS_S3_BUCKET
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });

        function emptyBucket(callback){
            var params = {
              Bucket: bucketName,
              Prefix: `${projectId}/theme/`
            };
          
            s3.listObjects(params, function(err, data) {
              if (err) return callback(err);
          
              if (data.Contents.length == 0) callback();
          
              params = { Bucket: bucketName };
              params.Delete = {Objects:[]};
              
              data.Contents.forEach(function(content) {
                console.log(content, 111)
                params.Delete.Objects.push({Key: content.Key});
              });
          
              s3.deleteObjects(params, function(err, data) {
                if (err) return callback(err);
                if (data.IsTruncated) {
                  emptyBucket(callback);
                } else {
                  callback();
                }
              });
            });
        }

        emptyBucket((data) => {
            console.log(data)
        })

        return 
    } catch (e) {
        console.log(e)
        return 
    }
}


export default deleteS3Folder;