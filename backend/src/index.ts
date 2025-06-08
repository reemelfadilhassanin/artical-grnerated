import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ChatOpenAI } from '@langchain/openai';

// Express setup
const app = express();
app.use(cors());
app.use(express.json());

// Type used for parsing structured responses
type TextPart = { type: 'text'; text: string };

// Extracts clean text from LangChain response
const extractText = (message: { content: any }): string => {
  const content = message.content;

  if (typeof content === 'string') return content;

  if (!Array.isArray(content)) return '';

  return content
    .filter(
      (part): part is TextPart =>
        typeof part === 'object' &&
        part !== null &&
        'type' in part &&
        (part as any).type === 'text' &&
        typeof (part as any).text === 'string'
    )
    .map((part) => part.text)
    .join(' ');
};

// LangChain model config
const model = new ChatOpenAI({
  modelName: 'llama3-70b-8192',
  openAIApiKey: process.env.GROQ_API_KEY,
  configuration: {
    baseURL: 'https://api.groq.com/openai/v1',
  },
});

// AI steps
const generateHeadline = async (topic: string): Promise<string> => {
  const raw = await model.invoke(`Generate a catchy headline for: ${topic}`);
  const text = extractText(raw);
  const match = text.match(/["“](.*?)["”]/);
  return match?.[1] || text.split('\n')[0];
};

const generateIntro = async (headline: string): Promise<string> => {
  const raw = await model.invoke(
    `Write an engaging introduction for: "${headline}"`
  );
  return extractText(raw);
};

const generateBody = async (intro: string): Promise<string> => {
  const raw = await model.invoke(
    `Write a detailed body expanding on: ${intro}`
  );
  return extractText(raw);
};

const generateConclusion = async (body: string): Promise<string> => {
  const raw = await model.invoke(`Write a conclusion for this: ${body}`);
  return extractText(raw);
};

// Orchestrate full article
const generateArticle = async (topic: string) => {
  const headline = await generateHeadline(topic);
  const intro = await generateIntro(headline);
  const body = await generateBody(intro);
  const conclusion = await generateConclusion(body);
  return { headline, intro, body, conclusion };
};

// API route
app.post('/generate-article', async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required.' });
  }

  try {
    const article = await generateArticle(topic);
    res.json(article);
  } catch (err) {
    console.error('❌ Error generating article:', err);
    res.status(500).json({ error: 'Failed to generate article.' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
