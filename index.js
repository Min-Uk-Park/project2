
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
            Bucket: "projecttest2-1",
            Name: "project_sample4.jpg"
        }
    },
    MaxLabels: 5,
    MinConfidence: 80
};

//Call AWS Rekognition Class
const rekognition = new AWS.Rekognition();



//Detect labels
rekognition.detectLabels(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
        console.log(data); // successful response
        const labels = data.Labels; // Assign the detected labels to the 'labels' array

        /////////////////////////////////
        const { createCanvas, loadImage, registerFont } = require('canvas');
        const fs = require('fs');

        // Load Arial font
        registerFont('arial.ttf', { family: 'Sans' });

        // Create a canvas
        const canvas = createCanvas(800, 600);
        const context = canvas.getContext('2d');

        // Load and draw the image
        loadImage('project_sample4.jpg').then((image) => {
            context.drawImage(image, 0, 0);

            // Set font properties
            const fontSize = 40;
            const fontFamily = 'Arial';
            context.font = `${fontSize}px ${fontFamily}`;
            context.lineWidth = 10;
            context.fillStyle = 'red';
            context.strokeStyle = 'red';

            // Draw labels on the image
            labels.forEach((label) => {
                const name = label.Name;
                label.Instances.forEach((instance) => {
                    if (instance.BoundingBox && instance.BoundingBox.Left) {
                        const { Left, Top, Width, Height } = instance.BoundingBox;

                        // Calculate the bounding box coordinates relative to the canvas size
                        const x = Left * canvas.width;
                        const y = Top * canvas.height;
                        const width = Width * canvas.width;
                        const height = Height * canvas.height;

                        // Draw the bounding box and label text
                        context.beginPath();
                        context.rect(x, y, width, height);
                        context.stroke();
                        context.fillText(name, x, y - 5); // Adjust the text position to be above the bounding box
                    }
                });
            });

            const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
            const fs = require("fs");

            // Save the image
            const out = fs.createWriteStream('labeled_image4.jpg');
            const stream = canvas.createJPEGStream();
            stream.pipe(out);
            out.on('finish', () => {
                console.log('Image saved: labeled_image4.jpg');
            });
        });
        /////////////////////////////////
    }
});

