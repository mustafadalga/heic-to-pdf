# HEIC to JPEG Converter and PDF Creator


Goal of the Project

The primary objectives of this project are:

* **Convert HEIC Images to JPEG:** Automatically detect and convert HEIC images stored in a specified directory to JPEG format, ensuring they are accessible on devices and platforms that do not support the HEIC format.
* **Compress JPEG Images:** Resize and compress the converted JPEG images to reduce file size without significantly compromising image quality, making them more manageable for sharing and storage.
* **Compile JPEGs into a PDF:** Gather the processed JPEG images and compile them into a single PDF document, facilitating easy sharing, viewing, and printing of the image collection.



## Installation
```
git clone https://github.com/mustafadalga/heic-to-pdf.git
cd heic-to-pdf
npm install
```

### Usage
 Follow these steps to convert HEIC images to JPEG and compile them into a PDF:

#### Prepare Your Images
 Place your HEIC images in the heic-images directory located at the root of the project. If the directory does not exist, create it.
#### Run the Conversion Script

```
node heic-to-pdf.js
```

### Check the Output

Once the script completes its execution, find the converted JPEG images in the jpeg-images folder and the final PDF document named output.pdf at the root of the project directory.
