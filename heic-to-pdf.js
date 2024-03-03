const fs = require('fs').promises;
const path = require('path');
const heicConvert = require('heic-convert');
const { PDFDocument } = require('pdf-lib');
const Jimp = require('jimp');


const heicImagesFolder = './heic-images';
const jpegImagesFolder = 'jpeg-images';
const outputPdfPath = 'output.pdf';


async function convertHeicToJpeg (inputFilePath, outputFilePath) {
    const inputBuffer = await fs.readFile(inputFilePath);
    const outputBuffer = await heicConvert({
        buffer: inputBuffer, // the HEIC file buffer
        format: 'JPEG',      // output format
        quality: 0.8         // the jpeg compression quality, between 0 and 1
    });
    await fs.writeFile(outputFilePath, outputBuffer);
};

async function recreateDirectory (directoryPath) {
    try {
        // If the directory exists, delete it recursively
        await fs.rm(directoryPath, { recursive: true, force: true });
        console.log(`Existing directory removed: ${directoryPath}`);
    } catch (error) {
        // If the directory does not exist, proceed to creation
        if (error.code !== 'ENOENT') {
            // If the error is not about the non-existence of the directory, throw it
            throw error;
        }
    }

    // Create the directory after removal or if it didn't exist
    await fs.mkdir(directoryPath, { recursive: true });
    console.log(`Directory created: ${directoryPath}`);
}

async function handleHeicToJpeg (inputFolder, outputFolder) {
    try {
        recreateDirectory(outputFolder);
        const files = await fs.readdir(inputFolder);
        for (const file of files) {
            if (path.extname(file).toLowerCase() === '.heic') {
                const inputFilePath = path.join(inputFolder, file);
                const outputFilePath = path.join(outputFolder, `${path.basename(file, '.heic')}.jpeg`);
                await convertHeicToJpeg(inputFilePath, outputFilePath);
                console.log(`Converted ${file} to JPEG.`);
            }
        }

    } catch (error) {
        console.error('Error processing images:', error);
    }
}

async function compressImage (imagePath) {
    const image = await Jimp.read(imagePath);
    // Resize the image to a maximum of 1280x1280 pixels to reduce file size
    // and adjust the quality to 60% to further reduce file size
    image.resize(1280, 1280, Jimp.RESIZE_BEZIER).quality(60);
    const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);
    return buffer;
}

async function createPdfFromJpegs (sourceFolder, outputPath) {
    const pdfDoc = await PDFDocument.create();
    const files = await fs.readdir(sourceFolder);
    const imageFiles = files.filter(file => file.toLowerCase().endsWith('.jpeg') || file.toLowerCase().endsWith('.jpg'));

    for (const fileName of imageFiles) {
        const filePath = path.join(sourceFolder, fileName);
        const compressedImageBuffer = await compressImage(filePath);
        const image = await pdfDoc.embedJpg(compressedImageBuffer);
        const page = pdfDoc.addPage([ image.width, image.height ]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    }

    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(outputPath, pdfBytes);
    console.log(`PDF created successfully at ${outputPath}`);
}


async function main () {
    try{
         await handleHeicToJpeg(heicImagesFolder, jpegImagesFolder);
         await createPdfFromJpegs(jpegImagesFolder, outputPdfPath);

    }catch (err) {
        console.error("Failed to create PDF", err);
    }
}

main()