const asyncHandler = require("express-async-handler");
const Claims = require("../Models/Claims");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// Initialize S3 client
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const fetchClaims = asyncHandler(async (req, res) => {
    try {
        const status = req.query.status;
        const user = req.session.user;

        let query = { technicianId: user._id };

        if (status) {
            query.status = status;
        }

        const claims = await Claims.find(query).populate({
            path: 'clientId',
        });

        const processedClaims = await Promise.all(claims.map(async (claim) => {
            try {
                console.log(`Processing files for claim: ${claim._id}`);
                console.log('Files array:', JSON.stringify(claim.files, null, 2));

                if (!claim.files || claim.files.length === 0) {
                    console.log(`No files found for claim ${claim._id}`);
                    return { ...claim.toObject(), files: [] };
                }

                const files = await Promise.all(claim.files.map(async fileInfo => {
                    if (!fileInfo.filename) {
                        console.log(`Missing filename for file in claim ${claim._id}`);
                        return null;
                    }

                    // Construct the key based on available information
                    let key;
                    if (fileInfo.key) {
                        key = fileInfo.key;
                    } else {
                        key = `uploads/${claim._id}/${fileInfo.filename}`;
                    }

                    console.log(`Constructed key for file: ${key}`);

                    if (!key) {
                        console.log(`Unable to construct key for file in claim ${claim._id}`);
                        return null;
                    }

                    const params = {
                        Bucket: process.env.S3_BUCKET_NAME,
                        Key: key,
                        ResponseContentDisposition: `inline; filename="${fileInfo.filename}"`,
                    };

                    try {
                        const command = new GetObjectCommand(params);
                        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

                        console.log(`Generated signed URL for file: ${fileInfo.filename}`);

                        return {
                            filename: fileInfo.filename,
                            url: signedUrl,
                        };
                    } catch (error) {
                        console.error(`Error generating signed URL for file ${fileInfo.filename}:`, error.message);
                        return null;
                    }
                }));

                const validFiles = files.filter(file => file !== null);

                console.log(`Processed ${validFiles.length} valid files for claim ${claim._id}`);

                return { ...claim.toObject(), files: validFiles };
            } catch (error) {
                console.error(`Error processing files for claim ${claim._id}:`, error.message);
                return {
                    ...claim.toObject(),
                    files: [],
                    fetchError: {
                        message: error.message
                    }
                };
            }
        }));
        res.json(processedClaims);
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Something went wrong while trying to fetch your claims",
            status: "error",
            error: err.message || err.toString()
        });
    }
});

module.exports = {
    fetchClaims
};