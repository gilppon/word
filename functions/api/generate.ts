export const onRequestPost: PagesFunction<{ GEMINI_API_KEY: string }> = async (context) => {
  try {
    const { language } = await context.request.json() as { language: string };
    const API_KEY = context.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return new Response(JSON.stringify({ error: 'API Key not configured' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API Error: ${error}`);
    }

    const data = await response.json() as any;
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Extract JSON from the response
    const jsonMatch = aiText.match(/\[.*\]/s);
    if (!jsonMatch) throw new Error('Invalid AI response format');
    
    const parsedWords = JSON.parse(jsonMatch[0]);
    
    return new Response(JSON.stringify(parsedWords), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
