const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = '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'; 

app.post('/api/openai', async (req, res) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify(req.body),
    };

    try {
        const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', requestOptions);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
