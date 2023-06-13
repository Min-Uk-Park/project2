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


const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");


// 이미지 상 확인하기 //




//const AWS = require('aws-sdk');
//const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

// AWS access details
AWS.config.update({
    accessKeyId: 'AKIAZWBYDAILKLJD4LMZ',
    secretAccessKey: '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',
    region: 'ap-northeast-2'
});




// Detect labels
rekognition.detectLabels(params, async function (err, data) {
  if (err) {
    console.log(err, err.stack); // An error occurred
  } else {
    console.log(data); // Successful response
    // Process the result and display the image
    await displayResultImage(data);
  }
});

// Function to display the result image
async function displayResultImage(data) {
  // Load the original image
  const originalImage = await loadImage('C:\Users\LG\Desktop\O.S project\newjins.jpg');
  
  // Create a canvas
  const canvas = createCanvas(originalImage.width, originalImage.height);
  const ctx = canvas.getContext('2d');
  
  // Draw the original image on the canvas
  ctx.drawImage(originalImage, 0, 0, originalImage.width, originalImage.height);
  
  // Draw the labels on the canvas
  data.Labels.forEach(label => {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText(label.Name, 10, label.Confidence);
  });
  
  // Convert the canvas to a buffer
  const buffer = canvas.toBuffer('image/jpeg');
  
  // Save the result image
  fs.writeFileSync('result.jpg', buffer);
  
  // Display a message
  console.log('Result image saved as result.jpg');
}