import AWS from "aws-sdk";
const { AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env

const deleteS3Folder = async (prefix) => {
    try {
        const bucketName = AWS_S3_BUCKET
        const s3 = new AWS.S3({
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
        });

        async function emptyBucket(callback){
          try {
            var params = {
              Bucket: bucketName,
              Prefix: prefix
            };
          
            const data = await s3.listObjects(params).promise()
            if (data.Contents.length == 0) return callback();
        
            params = { Bucket: bucketName };
            params.Delete = {Objects:[]};
            
            data.Contents.forEach(async function(content) {
              params.Delete.Objects.push({Key: content.Key});
            });

            const deletedData = await s3.deleteObjects(params).promise()
            if(deletedData.IsTruncated){
              await emptyBucket(callback);
            } else {
              callback();
            }
          } catch (e) {
            callback(e)
          }
      }

      await emptyBucket((data) => {
          // console.log(data)
      })
      return 
    } catch (e) {
        console.log(e)
        return 
    }
}


export default deleteS3Folder;