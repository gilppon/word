import { GoogleGenerativeAI } from '@google/generative-ai';
import { Word } from '../types';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

const FALLBACK_WORDS: Record<string, Word[]> = {
  ko: [
    { id: 'f1', text: '세종대왕', category: '역사적 인물', difficulty: 'easy' },
    { id: 'f2', text: '비빔밥', category: '음식', difficulty: 'easy' },
    { id: 'f3', text: '방탄소년단', category: '연예인', difficulty: 'easy' },
    { id: 'f4', text: '양자역학', category: '과학/상식', difficulty: 'hard' },
    { id: 'f5', text: '독도', category: '장소', difficulty: 'easy' },
    { id: 'f6', text: '손흥민', category: '스포츠', difficulty: 'easy' },
    { id: 'f7', text: '이순신', category: '역사적 인물', difficulty: 'easy' },
    { id: 'f8', text: '알고리즘', category: '기술', difficulty: 'medium' },
    { id: 'f9', text: '인공지능', category: '기술', difficulty: 'medium' },
    { id: 'f10', text: '메타버스', category: '기술', difficulty: 'hard' },
  ],
  en: [
    { id: 'e1', text: 'Albert Einstein', category: 'Scientist', difficulty: 'easy' },
    { id: 'e2', text: 'Pizza', category: 'Food', difficulty: 'easy' },
    { id: 'e3', text: 'Taylor Swift', category: 'Celebrity', difficulty: 'easy' },
    { id: 'e4', text: 'Quantum Physics', category: 'Science', difficulty: 'hard' },
    { id: 'e5', text: 'Grand Canyon', category: 'Place', difficulty: 'easy' },
    { id: 'e6', text: 'Elon Musk', category: 'Job', difficulty: 'medium' },
    { id: 'e7', text: 'Abraham Lincoln', category: 'Historical Figure', difficulty: 'medium' },
    { id: 'e8', text: 'Blockchain', category: 'Trend', difficulty: 'hard' },
    { id: 'e9', text: 'Sushi', category: 'Food', difficulty: 'easy' },
    { id: 'e10', text: 'Artificial Intelligence', category: 'Tech', difficulty: 'hard' },
  ],
  ja: [
    { id: 'j1', text: '徳川家康', category: '歴史上の人物', difficulty: 'easy' },
    { id: 'j2', text: '寿司', category: '食べ物', difficulty: 'easy' },
    { id: 'j3', text: '大谷翔平', category: 'スポーツ選手', difficulty: 'medium' },
    { id: 'j4', text: '量子力学', category: '科学/常識', difficulty: 'hard' },
    { id: 'j5', text: '富士山', category: '場所', difficulty: 'easy' },
    { id: 'j6', text: 'ドラえもん', category: '架空の人物', difficulty: 'easy' },
    { id: 'j7', text: '織田信長', category: '歴史上の人物', difficulty: 'medium' },
    { id: 'j8', text: 'ブロックチェーン', category: 'トレンド', difficulty: 'hard' },
    { id: 'j9', text: 'ラーメン', category: '食べ物', difficulty: 'easy' },
    { id: 'j10', text: '人工知能', category: '技術', difficulty: 'hard' },
  ]
};

export async function generateTrendingWords(language: string): Promise<Word[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Generate 20 trending or interesting vocabulary words for a trivia game in language: ${language}. 
  Both the word "text" and the "category" MUST be written in the requested language: ${language}.
  Common categories: Historical Figure, Celebrity, Sport Star, Scientist, Virtual Character, Animal, Object, Country, Action, Food, Job.
  Return ONLY a valid JSON array of objects with the following structure. Do not include markdown formatting:
  [
    {
      "id": "unique-id",
      "text": "Word Text",
      "category": "Category Name",
      "difficulty": "easy/medium/hard"
    }
  ]`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\[.*\]/s);
    if (!jsonMatch) throw new Error('Invalid AI response format');
    
    const parsedWords = JSON.parse(jsonMatch[0]);
    
    return parsedWords.map((w: any) => ({
      ...w,
      difficulty: ['easy', 'medium', 'hard'].includes(w.difficulty) ? w.difficulty : 'medium'
    })) as Word[];
  } catch (error) {
    console.error('Error in AI word generation, falling back to static list:', error);
    // Return fallback words if AI fails (e.g., due to quota)
    const fallback = FALLBACK_WORDS[language] || FALLBACK_WORDS['en'];
    // Shuffle fallback words or just return a slice if needed
    return [...fallback].sort(() => 0.5 - Math.random());
  }
}
