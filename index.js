//import required packages
var AWS = require('aws-sdk');

//AWS access details
AWS.config.update({
    accessKeyId: 'AKIAZWBYDAILKLJD4LMZ',
    secretAccessKey: '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',
    region: 'ap-northeast-2'
});

//input parameters
var params = {
    Image: {
        S3Object: {
            Bucket: "openproject22",
            Name: "image newjins.jpg"
        }
    },
    MaxLabels: 5,
    MinConfidence: 80
};

//Call AWS Rekognition Class
const rekognition = new AWS.Rekognition();

//Detect labels
rekognition.detectLabels(params, function(err,data){
    if(err) console.log(err,err.stack); // an error occurred
    else console.log(data); // successful response
});


//Detect labels
rekognition.detectLabels(params, function(err, data){
    if(err) console.log(err,err.stack); // an error occurred
    else    console.log(data); // successful response
});


