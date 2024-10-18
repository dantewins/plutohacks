const multer = require('multer');
const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegPath);

const storage = multer.memoryStorage();

const files = multer({
    storage: storage
});

const imageMimeTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/bmp',
    'image/tiff', 'image/webp', 'image/vnd.microsoft.icon',
    'image/x-icon', 'image/vnd.wap.wbmp', 'image/svg+xml'
];

const videoMimeTypes = [
    'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv',
    'video/webm', 'video/3gpp', 'video/3gpp2', 'video/x-flv',
    'video/x-matroska'
];

async function resizeImage(buffer) {
    const resizedBuffer = await sharp(buffer)
        .resize({ width: 1024, height: 1024, fit: sharp.fit.inside, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();
    return resizedBuffer;
}

async function compressVideo(buffer, originalName) {
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    const tempInputPath = path.join(tempDir, originalName);
    const tempOutputPath = path.join(tempDir, `compressed_${originalName}.mp4`);

    // Save the buffer to a temporary file
    fs.writeFileSync(tempInputPath, buffer);

    return new Promise((resolve, reject) => {
        ffmpeg(tempInputPath)
            .outputOptions([
                '-vf scale=640:-2', // Scale the video to 640px width while maintaining aspect ratio
                '-c:v libx264',     // Use H.264 codec
                '-crf 20',          // Constant Rate Factor, lower value = higher quality
                '-preset veryfast'  // Encoding speed (can be replaced with 'slow' or 'fast' based on need)
            ])
            .on('end', () => {
                // Read the compressed video into a buffer
                const compressedBuffer = fs.readFileSync(tempOutputPath);

                // Clean up temporary files
                fs.unlinkSync(tempInputPath);
                fs.unlinkSync(tempOutputPath);

                resolve(compressedBuffer);
            })
            .on('error', (err) => {
                // Clean up temporary files on error
                fs.unlinkSync(tempInputPath);
                reject(err);
            })
            .save(tempOutputPath);
    });
}

async function resizeImages(req, res, next) {
    if (!req.files || req.files.length === 0) {
        return next();
    }

    try {
        for (const file of req.files) {
            if (imageMimeTypes.includes(file.mimetype)) {
                if (file.size > 1024 * 1024) {
                    file.buffer = await resizeImage(file.buffer);
                    file.size = file.buffer.length;
                }
            } else if (videoMimeTypes.includes(file.mimetype)) {
                if (file.size > 10 * 1024 * 1024) { // Example threshold: compress videos larger than 10MB
                    file.buffer = await compressVideo(file.buffer, file.originalname);
                    file.size = file.buffer.length;
                }
            } else {
                return res.status(400).send({
                    message: "Unsupported file type",
                    status: "error",
                    prompt: true
                });
            }
        }
        next();
    } catch (err) {
        next(err);
    }
}

function handle(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        switch (err.code) {
            case 'LIMIT_FILE_SIZE':
                res.status(400).send({ message: "File size should not exceed 1MB", status: "error" });
                break;
            default:
                res.status(400).send({ message: err.message, status: "error" });
                break;
        }
    } else if (err) {
        console.log(err);
        res.status(500).send({ message: "Failed to process request", status: "error" });
    } else {
        next();
    }
}

module.exports = { files, resizeImages, handle };
