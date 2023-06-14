// Import required packages
var AWS = require('aws-sdk');
const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');

// AWS access details
AWS.config.update({
    accessKeyId: 'AKIAZWBYDAILKLJD4LMZ',
    secretAccessKey: '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',
    region: 'ap-northeast-2'
});


// Input parameters
var params = {
    Image: {
        S3Object: {
            Bucket: 'projecttest2-1',
            Name: 'project_sample6.jpg'
        }
    },
    MaxLabels: 5,
    MinConfidence: 80
};

// Call AWS Rekognition Class
const rekognition = new AWS.Rekognition();

// Detect labels
rekognition.detectLabels(params, function(err, data) {
    if (err) {
        console.log(err, err.stack); // an error occurred
    } else {
        console.log(data); // successful response
        const labels = data.Labels; // Assign the detected labels to the 'labels' array

        // Load Arial font
        registerFont('arial.ttf', { family: 'Sans' });

        // Create a canvas
        const canvas = createCanvas();
        const context = canvas.getContext('2d');

        // Load and draw the image
        loadImage('project_sample6.jpg').then((image) => {
            // Get the original image dimensions
            const imageWidth = image.width;
            const imageHeight = image.height;

            // Resize the canvas to match the original image size
            canvas.width = imageWidth;
            canvas.height = imageHeight;

            context.drawImage(image, 0, 0);

            // Set font properties
            const fontSize = 40;
            const fontFamily = 'Arial';
            context.font = `${fontSize}px ${fontFamily}`;

            // Draw circles and rectangles around objects
            labels.forEach((label) => {
                const name = label.Name;
                label.Instances.forEach((instance, index) => {
                    if (instance.BoundingBox && instance.BoundingBox.Left) {
                        const { Left, Top, Width, Height } = instance.BoundingBox;

                        // Calculate the bounding box coordinates relative to the original image size
                        const x = Left * imageWidth;
                        const y = Top * imageHeight;
                        const width = Width * imageWidth;
                        const height = Height * imageHeight;

                        // Draw the shape based on the object's index
                        if (index === 0) {
                            // Draw a circle
                            const centerX = x + width / 2;
                            const centerY = y + height / 2;
                            const radius = Math.max(width, height) / 2;

                            context.beginPath();
                            context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                            context.lineWidth = 5;
                            context.strokeStyle = 'blue';
                            context.fillStyle = 'transparent';
                            context.stroke();

                            // Draw a rectangle
                            context.beginPath();
                            context.rect(x, y, width, height);
                            context.lineWidth = 5;
                            context.strokeStyle = 'red';
                            context.fillStyle = 'transparent';
                            context.stroke();

                        } else {
                            // Draw a rectangle
                            context.beginPath();
                            context.rect(x, y, width, height);
                            context.lineWidth = 5;
                            context.strokeStyle = 'red';
                            context.fillStyle = 'transparent';
                            context.stroke();
                        }

                        // Draw the label text
                        context.fillStyle = 'white';
                        context.fillText(name, x, y - 5);
                    }
                });
            });

            // Save the image
            const out = fs.createWriteStream('labeled_image6.jpg');
            const stream = canvas.createJPEGStream();
            stream.pipe(out);
            out.on('finish', () => {
                console.log('Image saved: labeled_image6.jpg');
            });
        });
    }
});