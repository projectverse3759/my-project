const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config(); // Ensure you have a .env file for GITHUB_TOKEN

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

// --- THE ORGANIZED DATABASE ---
const FILE_DATABASE = {
    "KEY_MGT": { 
        title: "Performance Appraisal System", 
        filepath: "Performance Appraisal System.docx", 
        downloadName: "Performance Appraisal System.docx" 
    },
    "KEY_MG2": { 
        title: "PAYROLL Management", 
        filepath: "PAYROLL Management.docx",
        downloadName: "PAYROLL Management.docx"     
    },
    "KEY_HR1": { 
        title: "Recruitment & Selection", 
        filepath: "RECRUITMENT & SELECTION.docx", 
        downloadName: "RECRUITMENT & SELECTION.docx" 
    }
};

// --- AUTHENTICATION & SECURITY ROUTES ---

// Route for file keys (Downloads)
app.post('/api/fetch-files', (req, res) => {
    const { key } = req.body;
    const fileRecord = FILE_DATABASE[key];

    if (fileRecord) {
        res.json({ success: true, data: { title: fileRecord.title, filename: fileRecord.downloadName } });
    } else {
        res.json({ success: false });
    }
});

// --- PRIVATE REPOSITORY DOWNLOAD ROUTE ---
app.get('/download/:key', async (req, res) => {
    const key = req.params.key;
    const fileRecord = FILE_DATABASE[key];

    if (!fileRecord || !fileRecord.filepath) {
        return res.status(403).send("Invalid download key or file record.");
    }

    const encodedFilename = encodeURIComponent(fileRecord.filepath);
    const githubUrl = `https://api.github.com/repos/projectverse3759/projectverse/contents/Project%20Directory/HRM%20Projects/${encodedFilename}`;
    
    try {
        const response = await axios.get(githubUrl, {
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN || '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'}`,
                'Accept': 'application/vnd.github.v3.raw'
            },
            responseType: 'stream'
        });

        res.setHeader('Content-Disposition', `attachment; filename="${fileRecord.downloadName}"`);
        response.data.pipe(res);
        
    } catch (error) {
        console.error("GitHub Fetch Error:", error.message);
        res.status(500).send("Failed to retrieve file from private repository.");
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});