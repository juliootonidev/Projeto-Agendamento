const AWS = require('aws-sdk');

module.exports = {
    IAM_USER_KEY: 'AKIAXEPQFPUCZD4RX7PL',
    IAM_USER_SECRET: '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',
    BUCKET_NAME: 'salao-fatec-dev',
    AWS_REGION: 'us-east-1',
    uploadToS3: function(file, filename, acl = 'public-read'){
        return new Promise((resolve, reject)=>{
            let IAM_USER_KEY = this.IAM_USER_KEY;
            let IAM_USER_SECRET = this.IAM_USER_SECRET;
            let BUCKET_NAME = this.BUCKET_NAME;

            let s3bucket = new AWS.S3({
                accessKeyId: IAM_USER_KEY,
                secretAccessKey: IAM_USER_SECRET,
                Bucket: BUCKET_NAME,
            });

            s3bucket.createBucket(function(){
                var params = {
                    Bucket: BUCKET_NAME,
                    key: filename,
                    Body: file.data,
                    ACL: acl,
                };

                s3bucket.upload(params, function(err, data){
                    if(err){
                        console.log(err);
                        return resolved({error: true, message: err.message});
                    }
                    consle.log(data);
                    return resolved({error: false, message: data});
                });
            });
        });
    },
    deleteFileS3: function(key){
        return new Promise((resolve, reject)=>{
            let IAM_USER_KEY = this.IAM_USER_KEY;
            let IAM_USER_SECRET = this.IAM_USER_SECRET;
            let BUCKET_NAME = this.BUCKET_NAME;

            let s3bucket = new AWS.S3({
                accessKeyId: IAM_USER_KEY,
                secretAccessKey: IAM_USER_SECRET,
                Bucket: BUCKET_NAME,
            });

            s3bucket.createBucket(function(){
                s3bucket.deleteBucket(
                    {
                        Bucket: BUCKET_NAME,
                        Key: key,
                    },
                    function(err, data){
                        if(err){
                            console.log(err);
                            return resolved({error: true, message: err});
                        }
                        consle.log(data);
                        return resolved({error: false, message: data});
                    }
                );
            });
        });
    },
}
