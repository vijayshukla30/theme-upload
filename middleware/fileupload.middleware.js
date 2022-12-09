import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import path from 'path';
const { AWS_S3_BUCKET, S3_BUCKET_URL, AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, BUCKET_PERMISSION } = process.env

aws.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION,
    bucket: AWS_S3_BUCKET,
    ACL: BUCKET_PERMISSION
})

const FileUpload = (req, res, next) => {
    req.document_upload = {}
    upload(req, res, async function (err) {
        if (err) {
            console.log(err);
            return res.status(400).json({ msg: 'file not uploaded'})
        } else {
            next()
        }
    })
}

const storage = multerS3({
    s3: new aws.S3(),
    bucket: AWS_S3_BUCKET,
    ACL: BUCKET_PERMISSION,
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        if(req.document_upload[file.fieldname] == undefined){
            req.document_upload[file.fieldname] = []
        }
        let folder = `/${req.params.projectId}/zip/${file.originalname}`;
        req.document_upload[file.fieldname].push(S3_BUCKET_URL+folder)
        cb(null, folder);
    }
})

const upload = multer({
    storage: storage
}).any();

export default FileUpload;
