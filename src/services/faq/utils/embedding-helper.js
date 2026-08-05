const embeddingModel = process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001';
const outputDimensionality = 768;


const normalizeEmbedding = (values) => {
  const magnitude = Math.sqrt(values.reduce((sum, value) => sum + (value * value), 0));

  if (magnitude === 0) {
    return values;
  }

  return values.map((value) => value / magnitude);
};

export const generateFaqEmbeddings = async (question, answer, taskType = 'RETRIEVAL_DOCUMENT') => {
  const getApiKey = () => process.env.GEMINI_API_KEY?.trim();
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY belum dikonfigurasi');
  }

  const textToEmbed = `Pertanyaan: ${question}\nJawaban: ${answer}`;
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${embeddingModel}:embedContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task_type: taskType,
        content: {
          parts: [{ text: textToEmbed }],
        },
        outputDimensionality,
      }),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gagal membuat embedding Gemini: ${response.status} ${errorBody}`);
  }

  const result = await response.json();
  const embeddingValues = result.embedding?.values || [];

  return embeddingModel === 'gemini-embedding-001'
    ? normalizeEmbedding(embeddingValues)
    : embeddingValues;
};