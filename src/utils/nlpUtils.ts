// Simple NLP utilities for text processing
export interface NLPAnalysis {
  wordFrequency: { [key: string]: number };
  sentiment: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
    confidence: number;
  };
  statistics: {
    totalWords: number;
    uniqueWords: number;
    sentences: number;
    averageWordsPerSentence: number;
    averageWordLength: number;
  };
  topWords: Array<{ word: string; count: number }>;
}

// Simple stopwords list
const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
  'my', 'your', 'his', 'her', 'its', 'our', 'their', 'this', 'that', 'these', 'those',
  'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
  'can', 'shall', 'not', 'no', 'yes', 'from', 'up', 'out', 'if', 'about', 'into',
  'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among'
]);

// Simple sentiment words
const POSITIVE_WORDS = new Set([
  'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome', 'love',
  'like', 'enjoy', 'happy', 'joy', 'pleased', 'satisfied', 'perfect', 'beautiful',
  'brilliant', 'outstanding', 'remarkable', 'superb', 'delighted', 'thrilled',
  'excited', 'grateful', 'thankful', 'blessed', 'lucky', 'successful', 'winner',
  'victory', 'triumph', 'celebrate', 'proud', 'confident', 'optimistic', 'hope'
]);

const NEGATIVE_WORDS = new Set([
  'bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'angry', 'sad',
  'disappointed', 'upset', 'frustrated', 'annoyed', 'worried', 'concerned',
  'problem', 'issue', 'trouble', 'difficulty', 'wrong', 'error', 'mistake',
  'fail', 'failure', 'lose', 'loss', 'defeat', 'reject', 'denial', 'refuse',
  'impossible', 'never', 'nothing', 'nobody', 'worthless', 'useless', 'hopeless'
]);

export function preprocessText(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 1 && !STOPWORDS.has(word));
}

export function calculateWordFrequency(words: string[]): { [key: string]: number } {
  const frequency: { [key: string]: number } = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  return frequency;
}

export function analyzeSentiment(text: string): NLPAnalysis['sentiment'] {
  const words = text.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;

  words.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '');
    if (POSITIVE_WORDS.has(cleanWord)) positiveCount++;
    if (NEGATIVE_WORDS.has(cleanWord)) negativeCount++;
  });

  const totalSentimentWords = positiveCount + negativeCount;
  
  if (totalSentimentWords === 0) {
    return { score: 0, label: 'neutral', confidence: 0.5 };
  }

  const score = (positiveCount - negativeCount) / totalSentimentWords;
  const confidence = Math.min(totalSentimentWords / words.length * 5, 1); // Normalize confidence

  let label: 'positive' | 'negative' | 'neutral';
  if (score > 0.1) label = 'positive';
  else if (score < -0.1) label = 'negative';
  else label = 'neutral';

  return { score, label, confidence };
}

export function calculateStatistics(text: string, words: string[]): NLPAnalysis['statistics'] {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const allWords = text.split(/\s+/).filter(w => w.length > 0);
  const uniqueWords = new Set(words).size;
  
  return {
    totalWords: allWords.length,
    uniqueWords,
    sentences: sentences.length,
    averageWordsPerSentence: sentences.length > 0 ? Math.round(allWords.length / sentences.length) : 0,
    averageWordLength: words.length > 0 ? Math.round(words.reduce((sum, word) => sum + word.length, 0) / words.length) : 0
  };
}

export function getTopWords(wordFrequency: { [key: string]: number }, limit: number = 10): Array<{ word: string; count: number }> {
  return Object.entries(wordFrequency)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function analyzeText(text: string): NLPAnalysis {
  if (!text.trim()) {
    return {
      wordFrequency: {},
      sentiment: { score: 0, label: 'neutral', confidence: 0 },
      statistics: { totalWords: 0, uniqueWords: 0, sentences: 0, averageWordsPerSentence: 0, averageWordLength: 0 },
      topWords: []
    };
  }

  const processedWords = preprocessText(text);
  const wordFrequency = calculateWordFrequency(processedWords);
  const sentiment = analyzeSentiment(text);
  const statistics = calculateStatistics(text, processedWords);
  const topWords = getTopWords(wordFrequency, 10);

  return {
    wordFrequency,
    sentiment,
    statistics,
    topWords
  };
}