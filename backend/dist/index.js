import 'dotenv/config';
import express from 'express';
import { generateArticle } from './gen.js';
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.post('/api/article', async (req, res) => {
    const { topic } = req.body;
    if (!topic)
        return res.status(400).json({ error: 'Topic is required' });
    try {
        const article = await generateArticle(topic);
        res.json(article);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Article generation failed' });
    }
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
