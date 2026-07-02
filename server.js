const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

const FILE_DATABASE = {
    "KEY_MGT": { title: "Performance Appraisal System", filepath: "Performance Appraisal System.docx", downloadName: "Performance Appraisal System.docx" },
    "KEY_MG2": { title: "PAYROLL Management", filepath: "PAYROLL Management.docx", downloadName: "PAYROLL Management.docx" },
    "KEY_HR1": { title: "Recruitment & Selection", filepath: "RECRUITMENT & SELECTION.docx", downloadName: "RECRUITMENT & SELECTION.docx" }
};

app.post('/api/fetch-files', (req, res) => {
    const { key } = req.body;
    const fileRecord = FILE_DATABASE[key];
    res.json(fileRecord ? { success: true, data: { title: fileRecord.title, filename: fileRecord.downloadName } } : { success: false });
});

app.get('/download/:key', async (req, res) => {
    const fileRecord = FILE_DATABASE[req.params.key];
    if (!fileRecord) return res.status(403).send("Invalid Key");

    const githubUrl = `https://api.github.com/repos/projectverse3759/projectverse/contents/Project%20Directory/HRM%20Projects/${encodeURIComponent(fileRecord.filepath)}`;
    
    try {
        const response = await axios.get(githubUrl, {
            headers: { 
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`, 
                'Accept': 'application/vnd.github.v3.raw' 
            },
            responseType: 'stream'
        });
        res.setHeader('Content-Disposition', `attachment; filename="${fileRecord.downloadName}"`);
        response.data.pipe(res);
    } catch (error) {
        console.error("GitHub Fetch Error:", error.response?.status || error.message);
        res.status(500).send("Failed to retrieve file from repository.");
    }
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
