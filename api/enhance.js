const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/api/enhance', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const inputPath = req.file.path;
        const outputPath = `uploads/enhanced-${Date.now()}.jpg`;

        // Apply sharp filters (enhance sharpness, contrast, and color boost)
        await sharp(inputPath)
            .resize(1024) // Resize for better optimization
            .sharpen({ sigma: 2 }) // Increase sharpness
            .modulate({ brightness: 1.2, saturation: 1.5 }) // Boost colors
            .toFormat('jpeg', { quality: 95 })
            .toFile(outputPath);

        // Read enhanced image
        const enhancedImage = fs.readFileSync(outputPath);
        
        // Cleanup temp files
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);

        res.setHeader('Content-Type', 'image/jpeg');
        res.send(enhancedImage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Export for Vercel
module.exports = app;
