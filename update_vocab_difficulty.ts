import fs from 'fs';

const vocab = JSON.parse(fs.readFileSync('./src/data/vocabulary.json', 'utf-8'));

const difficulties = ['easy', 'medium', 'hard'];

const addDifficulty = (arr: any[]) => {
  return arr.map((item, index) => {
    // Assign difficulty based on index to ensure even distribution
    const difficulty = difficulties[index % 3];
    return { ...item, difficulty };
  });
};

vocab.ko = addDifficulty(vocab.ko);
vocab.en = addDifficulty(vocab.en);
vocab.ja = addDifficulty(vocab.ja);

fs.writeFileSync('./src/data/vocabulary.json', JSON.stringify(vocab, null, 2));
console.log('Vocabulary updated with difficulty.');
