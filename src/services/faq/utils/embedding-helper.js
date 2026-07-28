import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const generateFaqEmbeddings = async (question, answer) => {
  if (!genAI) {
    throw new Error('GEMINI_API_KEY belum dikonfigurasi');
  }

  const textToEmbed = `Pertanyaan: ${question}\nJawaban: ${answer}`;
  const model = genAI.getGenerativeModel({ model: 'models/embedding-001' });
  const result = await model.embedContent(textToEmbed);

  return result.embedding.values;
};