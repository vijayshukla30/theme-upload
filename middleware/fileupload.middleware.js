import AWS from 'aws-sdk';
const { AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, BUCKET_PERMISSION } = process.env

const s3 = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const FileUpload = async  (req, res, next) => {
    try {
        const { projectId } = req.params
        let params = {
            Bucket: AWS_S3_BUCKET,
            Key: `${projectId}/zip/${req.files.image.name}`,
            Body: req.files.image.data,
            ContentDisposition: 'inline',
            ACL: BUCKET_PERMISSION
        };
        await s3.upload(params, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                req.s3zip = data
                next()
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(400).json({ msg: 'file not uploaded'})
    }
}

export default FileUpload;