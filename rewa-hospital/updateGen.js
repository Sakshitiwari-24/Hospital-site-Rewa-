const fs = require('fs');

let code = fs.readFileSync('src/lib/questionGenerator.ts', 'utf8');

// 1. Update all generator functions to accept `index`
code = code.replace(/function ([a-zA-Z0-9_]+)\(d: string\): Question/g, 'function $1(d: string, index = rand(0, 1000)): Question');

// 2. Update all array random picks to use `index % length`
code = code.replace(/const ([a-zA-Z0-9_]+) = ([a-zA-Z0-9_]+)\[rand\(0, \2\.length - 1\)\];/g, 'const $1 = $2[index % $2.length];');

// 3. Update the type definition of the map
code = code.replace(/Record<string, \(\(d: string\) => Question\)\[\]>/, 'Record<string, ((d: string, index?: number) => Question)[]>');

// 4. Update generateQuestions to pass index
code = code.replace(
  'questions.push(gen(difficulty));',
  'questions.push(gen(difficulty, Math.floor(i / generators.length)));'
);

fs.writeFileSync('src/lib/questionGenerator.ts', code);
console.log("Updated questionGenerator.ts");
