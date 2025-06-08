import 'dotenv/config';
import { ChatOpenAI } from '@langchain/openai';
// Extracts clean text from AI responses
const extractText = (message) => {
    const content = message.content;
    if (typeof content === 'string')
        return content;
    return content
        .filter((part) => part.type === 'text')
        .map((part) => part.text)
        .join(' ');
};
// Model config (GROQ + LLaMA 3)
const model = new ChatOpenAI({
    modelName: 'llama3-70b-8192',
    openAIApiKey: process.env.GROQ_API_KEY,
    configuration: {
        baseURL: 'https://api.groq.com/openai/v1',
    },
});
// Pipeline steps as individual functions
const generateHeadline = async (topic) => {
    const raw = await model.invoke(`Generate a catchy headline for: ${topic}`);
    const text = extractText(raw);
    const match = text.match(/["“](.*?)["”]/);
    return match?.[1] || text.split('\n')[0];
};
const generateIntro = async (headline) => extractText(await model.invoke(`Write an engaging introduction for: "${headline}"`));
const generateBody = async (intro) => extractText(await model.invoke(`Write a detailed body expanding on: ${intro}`));
const generateConclusion = async (body) => extractText(await model.invoke(`Write a conclusion for this: ${body}`));
// Run all steps in a single function
const generateArticle = async (topic) => {
    const headline = await generateHeadline(topic);
    const intro = await generateIntro(headline);
    const body = await generateBody(intro);
    const conclusion = await generateConclusion(body);
    return { headline, intro, body, conclusion };
};
export { generateArticle };
