// TCS NQT Level Dynamic Question Generator Engine
// Generates realistic exam-grade questions with randomized values

export interface Question {
  id: string;
  type?: "mcq" | "coding";
  text: string;
  options: string[];
  correctIndex: number;
  section: string;
  difficulty: string;
  pattern: string;
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function buildQuestion(
  text: string,
  correct: number | string,
  distractors: (number | string)[],
  section: string,
  difficulty: string,
  pattern: string
): Question {
  const correctStr = String(correct);
  const uniqueDistractors = distractors
    .map(String)
    .filter((d) => d !== correctStr);
  while (uniqueDistractors.length < 3) {
    uniqueDistractors.push(
      String(Number(correctStr) + rand(1, 20) * (Math.random() > 0.5 ? 1 : -1))
    );
  }
  const allOptions = shuffle([correctStr, ...uniqueDistractors.slice(0, 3)]);
  return {
    id: makeId(),
    type: "mcq",
    text,
    options: allOptions,
    correctIndex: allOptions.indexOf(correctStr),
    section,
    difficulty,
    pattern,
  };
}

function buildCodingQuestion(
  text: string,
  section: string,
  difficulty: string,
  pattern: string
): Question {
  return {
    id: makeId(),
    type: "coding",
    text,
    options: [],
    correctIndex: 0,
    section,
    difficulty,
    pattern,
  };
}

// ======================================================================
// QUANTITATIVE APTITUDE — TCS NQT LEVEL
// ======================================================================

function quantCompoundInterest(d: string): Question {
  const p = rand(5, 25) * 1000;
  const r = rand(5, 15);
  const t = rand(2, 3);
  const amount = Math.round(p * Math.pow(1 + r / 100, t) * 100) / 100;
  const ci = Math.round((amount - p) * 100) / 100;
  return buildQuestion(
    `Find the compound interest on ₹${p} at ${r}% per annum for ${t} years, compounded annually.`,
    ci,
    [
      Math.round(ci * 0.9),
      Math.round((p * r * t) / 100), // Simple interest as distractor
      Math.round(ci * 1.15),
    ],
    "Quantitative Aptitude",
    d,
    "Compound Interest"
  );
}

function quantPermutation(d: string): Question {
  const n = rand(5, 8);
  const r = rand(2, 4);
  let perm = 1;
  for (let i = 0; i < r; i++) perm *= n - i;
  return buildQuestion(
    `In how many ways can ${r} letters be arranged from a set of ${n} distinct letters?`,
    perm,
    [perm + rand(10, 50), perm * 2, Math.round(perm / 2)],
    "Quantitative Aptitude",
    d,
    "Permutations & Combinations"
  );
}

function quantProbability(d: string): Question {
  const total = rand(6, 15);
  const red = rand(2, total - 2);
  const green = total - red;
  const prob = `${red}/${total}`;

  return buildQuestion(
    `A bag contains ${red} red balls and ${green} green balls. If one ball is drawn at random, what is the probability of getting a red ball?`,
    prob,
    [`${green}/${total}`, `${red}/${total + 1}`, `${red - 1}/${total}`],
    "Quantitative Aptitude",
    d,
    "Probability"
  );
}

function quantTrains(d: string): Question {
  const lenA = rand(100, 300);
  const lenB = rand(100, 300);
  const speedA = rand(40, 80);
  const speedB = rand(30, 70);
  const relSpeed = speedA + speedB;
  const totalLen = lenA + lenB;
  const timeSec = Math.round((totalLen / (relSpeed * (5 / 18))) * 100) / 100;
  return buildQuestion(
    `Two trains of length ${lenA}m and ${lenB}m are running in opposite directions at ${speedA} km/h and ${speedB} km/h respectively. In how many seconds will they completely cross each other?`,
    timeSec,
    [
      Math.round(timeSec * 1.3 * 100) / 100,
      Math.round(timeSec * 0.7 * 100) / 100,
      Math.round(((lenA + lenB) / ((speedA - speedB > 0 ? speedA - speedB : 10) * (5 / 18))) * 100) / 100,
    ],
    "Quantitative Aptitude",
    d,
    "Trains"
  );
}

function quantPipeCistern(d: string): Question {
  const a = rand(10, 30);
  const b = rand(15, 40);
  const c = rand(20, 50);
  const rateA = 1 / a;
  const rateB = 1 / b;
  const rateC = 1 / c;
  const netRate = rateA + rateB - rateC;
  const time = netRate > 0 ? Math.round((1 / netRate) * 100) / 100 : Infinity;
  if (time === Infinity || time > 200) return quantPipeCistern(d);
  return buildQuestion(
    `Pipe A can fill a tank in ${a} hours, Pipe B in ${b} hours, and Pipe C can empty it in ${c} hours. If all three are opened simultaneously, how many hours will it take to fill the tank?`,
    time,
    [
      Math.round(time * 1.2 * 100) / 100,
      Math.round(time * 0.8 * 100) / 100,
      Math.round((a + b) / 2),
    ],
    "Quantitative Aptitude",
    d,
    "Pipes & Cisterns"
  );
}

function quantMixture(d: string): Question {
  const qty1 = rand(5, 15);
  const price1 = rand(20, 50);
  const qty2 = rand(5, 15);
  const price2 = rand(60, 100);
  const avgPrice = Math.round(((qty1 * price1 + qty2 * price2) / (qty1 + qty2)) * 100) / 100;
  return buildQuestion(
    `${qty1} kg of rice at ₹${price1}/kg is mixed with ${qty2} kg of rice at ₹${price2}/kg. What is the average price per kg of the mixture?`,
    avgPrice,
    [
      Math.round((price1 + price2) / 2),
      Math.round(avgPrice * 1.1),
      Math.round(avgPrice * 0.9),
    ],
    "Quantitative Aptitude",
    d,
    "Mixtures & Alligation"
  );
}

function quantTimeWorkAdvanced(d: string): Question {
  const a = rand(10, 20);
  const b = rand(12, 25);
  const daysWorkedTogether = rand(2, 5);
  const rateA = 1 / a;
  const rateB = 1 / b;
  const doneTogether = (rateA + rateB) * daysWorkedTogether;
  const remaining = 1 - doneTogether;
  if (remaining <= 0) return quantTimeWorkAdvanced(d);
  const daysB = Math.round((remaining / rateB) * 100) / 100;
  return buildQuestion(
    `A can complete a work in ${a} days and B in ${b} days. They work together for ${daysWorkedTogether} days, then A leaves. How many more days will B take to finish the remaining work?`,
    daysB,
    [
      Math.round(daysB + rand(1, 5)),
      Math.round(daysB - rand(1, 3)),
      Math.round(b - daysWorkedTogether),
    ],
    "Quantitative Aptitude",
    d,
    "Time & Work"
  );
}

function quantAgeProblems(d: string): Question {
  const currentAge = rand(20, 40);
  const yearsAgo = rand(3, 8);
  const ratio = rand(2, 4);
  const pastAge = currentAge - yearsAgo;
  const sonCurrentAge = pastAge / ratio + yearsAgo;
  const sonAge = Math.round(sonCurrentAge * 100) / 100;
  if (sonAge < 1 || sonAge > currentAge) return quantAgeProblems(d);
  return buildQuestion(
    `${yearsAgo} years ago, a father was ${ratio} times as old as his son. If the father's present age is ${currentAge} years, what is the son's present age?`,
    sonAge,
    [sonAge + rand(1, 5), sonAge - rand(1, 3), Math.round(currentAge / ratio)],
    "Quantitative Aptitude",
    d,
    "Ages"
  );
}

function quantNumberSystem(d: string): Question {
  const a = rand(100, 999);
  const b = rand(100, 999);
  const hcf = gcd(a, b);
  return buildQuestion(
    `What is the HCF of ${a} and ${b}?`,
    hcf,
    [hcf * 2, hcf + rand(1, 10), Math.round((a * b) / hcf / 100)],
    "Quantitative Aptitude",
    d,
    "Number System"
  );
}

function quantGeometry(d: string): Question {
  const r = rand(5, 20);
  const area = Math.round(Math.PI * r * r * 100) / 100;
  return buildQuestion(
    `A circular garden has a radius of ${r} meters. A path of width 2 meters runs around it. What is the area of the garden (in sq.m, use π = 3.14)?`,
    Math.round(3.14 * r * r * 100) / 100,
    [
      Math.round(3.14 * (r + 2) * (r + 2) * 100) / 100,
      Math.round(3.14 * 2 * r * 100) / 100,
      Math.round(3.14 * r * r + 100),
    ],
    "Quantitative Aptitude",
    d,
    "Geometry"
  );
}

// ======================================================================
// REASONING ABILITY — TCS NQT LEVEL
// ======================================================================

function reasoningSyllogism(d: string): Question {
  const scenarios = [
    {
      q: `Statements:\n1. All managers are leaders.\n2. Some leaders are entrepreneurs.\n\nConclusions:\nI. Some managers are entrepreneurs.\nII. Some entrepreneurs are leaders.\n\nWhich conclusion(s) follow?`,
      a: "Only Conclusion II follows",
      d: ["Only Conclusion I follows", "Both follow", "Neither follows"],
    },
    {
      q: `Statements:\n1. All roses are flowers.\n2. No flower is a thorn.\n\nConclusions:\nI. No rose is a thorn.\nII. Some thorns are roses.\n\nWhich conclusion(s) follow?`,
      a: "Only Conclusion I follows",
      d: ["Only Conclusion II follows", "Both follow", "Neither follows"],
    },
    {
      q: `Statements:\n1. Some dogs are cats.\n2. All cats are animals.\n\nConclusions:\nI. Some dogs are animals.\nII. All animals are cats.\n\nWhich conclusion(s) follow?`,
      a: "Only Conclusion I follows",
      d: ["Only Conclusion II follows", "Both follow", "Neither follows"],
    },
    {
      q: `Statements:\n1. All pens are erasers.\n2. All erasers are sharpeners.\n\nConclusions:\nI. All pens are sharpeners.\nII. Some sharpeners are pens.\n\nWhich conclusion(s) follow?`,
      a: "Both follow",
      d: ["Only Conclusion I follows", "Only Conclusion II follows", "Neither follows"],
    },
  ];
  const s = scenarios[rand(0, scenarios.length - 1)];
  return buildQuestion(s.q, s.a, s.d, "Reasoning Ability", d, "Syllogism");
}

function reasoningSeating(d: string): Question {
  const scenarios = [
    {
      q: `Six people A, B, C, D, E, F sit in a row facing North.
• C sits third to the left of F.
• B sits immediately right of C.
• D sits at one of the extreme ends.
• E is not an immediate neighbour of F.

Who sits exactly in the middle of the row?`,
      a: "B and E",
      d: ["A and C", "C and D", "B and F"],
    },
    {
      q: `Five friends P, Q, R, S, T are sitting in a circle facing the center.
• P is to the immediate left of Q.
• R is to the immediate right of T.
• S is between Q and R.

Who is sitting to the immediate right of P?`,
      a: "T",
      d: ["Q", "R", "S"],
    },
    {
      q: `Eight people are sitting around a circular table facing the center.
• A sits opposite to E.
• B is to the immediate right of A.
• C sits between D and F.
• G is not an immediate neighbor of A.
• H sits opposite to B.

Who sits to the immediate left of E?`,
      a: "G",
      d: ["B", "D", "F"],
    },
  ];
  const s = scenarios[rand(0, scenarios.length - 1)];
  return buildQuestion(s.q, s.a, s.d, "Reasoning Ability", d, "Seating Arrangement");
}

function reasoningDirection(d: string): Question {
  const distA = rand(5, 15);
  const distB = rand(5, 15);
  const distC = rand(5, 15);
  const net = Math.round(Math.sqrt(distA * distA + (distB - distC) * (distB - distC)) * 100) / 100;
  return buildQuestion(
    `A man walks ${distA} km North, then turns right and walks ${distB} km, then turns right again and walks ${distC} km. What is his straight-line distance from the starting point (in km)?`,
    net,
    [
      Math.round(net * 1.2 * 100) / 100,
      distA + distB - distC,
      Math.round(Math.sqrt(distA * distA + distB * distB) * 100) / 100,
    ],
    "Reasoning Ability",
    d,
    "Direction Sense"
  );
}

function reasoningCodingDecoding(d: string): Question {
  const scenarios = [
    {
      q: `In a certain code language, "COMPUTER" is written as "DPNQVUFS". How will "PROGRAM" be written in that code?`,
      a: "QSPHSBN",
      d: ["QSPHSBO", "RSQITCO", "QSPGSBN"],
    },
    {
      q: `In a certain code, "CREATIVE" is written as "BDQZSHUD". How will "THINKING" be written in that code?`,
      a: "SGHMJHMF",
      d: ["SGHMJHNG", "UIJOLKOH", "SGINJHMF"],
    },
    {
      q: `In a certain code language, if "MOUSE" is coded as "PRXVH", how is "CHAIR" coded?`,
      a: "FKDLU",
      d: ["FKDMU", "EJCKT", "GLEMV"],
    },
    {
      q: `If in a code language MADRAS is coded as NBESBT, how would BOMBAY be coded?`,
      a: "CPNCBZ",
      d: ["CPNCBY", "DPODCZ", "CQODBZ"],
    },
  ];
  const s = scenarios[rand(0, scenarios.length - 1)];
  return buildQuestion(s.q, s.a, s.d, "Reasoning Ability", d, "Coding-Decoding");
}

function reasoningBloodRelation(d: string): Question {
  const scenarios = [
    {
      q: `A is the father of B. C is the daughter of B. D is the brother of B. E is the son of A. How is C related to E?`,
      a: "Niece",
      d: ["Daughter", "Sister", "Cousin"],
    },
    {
      q: `Pointing at a woman, Ravi said, "She is the daughter of the only child of my grandmother." How is the woman related to Ravi?`,
      a: "Sister",
      d: ["Mother", "Daughter", "Aunt"],
    },
    {
      q: `A + B means A is the father of B. A - B means A is the sister of B. A * B means A is the son of B. A / B means A is the mother of B.\nIf P + Q - R * S, what is the relationship of S with P?`,
      a: "Wife",
      d: ["Mother", "Daughter", "Sister"],
    },
    {
      q: `X says to Y, "Your mother's only daughter's son is my son." How is X related to Y?`,
      a: "Husband",
      d: ["Brother", "Father", "Uncle"],
    },
  ];
  const s = scenarios[rand(0, scenarios.length - 1)];
  return buildQuestion(s.q, s.a, s.d, "Reasoning Ability", d, "Blood Relations");
}

function reasoningSeriesAdvanced(d: string): Question {
  const type = rand(0, 3);
  if (type === 0) {
    // n^2 + n pattern
    const series = Array.from({ length: 5 }, (_, i) => (i + 1) * (i + 1) + (i + 1));
    const answer = 6 * 6 + 6;
    return buildQuestion(
      `What comes next in the series: ${series.join(", ")}, ?`,
      answer,
      [answer + rand(1, 5), answer - rand(1, 4), answer + 6],
      "Reasoning Ability", d, "Number Series"
    );
  } else if (type === 1) {
    // Fibonacci variant
    const a = rand(1, 5);
    const b = rand(2, 6);
    const series = [a, b];
    for (let i = 2; i < 6; i++) series.push(series[i - 1] + series[i - 2]);
    const answer = series[4] + series[5];
    return buildQuestion(
      `What comes next in the series: ${series.join(", ")}, ?`,
      answer,
      [answer + rand(1, 10), answer - rand(1, 5), series[5] * 2],
      "Reasoning Ability", d, "Number Series"
    );
  } else if (type === 2) {
    // Cube series
    const start = rand(1, 4);
    const series = Array.from({ length: 5 }, (_, i) => Math.pow(start + i, 3));
    const answer = Math.pow(start + 5, 3);
    return buildQuestion(
      `What comes next in the series: ${series.join(", ")}, ?`,
      answer,
      [answer + rand(10, 50), answer - rand(10, 50), Math.pow(start + 4, 3) + start],
      "Reasoning Ability", d, "Number Series"
    );
  } else {
    // Alternating +/× pattern
    const start = rand(2, 5);
    const series = [start];
    for (let i = 1; i < 6; i++) {
      series.push(i % 2 === 1 ? series[i - 1] * 2 : series[i - 1] + 3);
    }
    const answer = 6 % 2 === 0 ? series[5] * 2 : series[5] + 3;
    return buildQuestion(
      `What comes next in the series: ${series.join(", ")}, ?`,
      answer,
      [answer + rand(2, 8), answer - rand(1, 5), series[5] + 2],
      "Reasoning Ability", d, "Number Series"
    );
  }
}

function reasoningAnalogy(d: string): Question {
  const scenarios = [
    { q: "Clock : Time :: Thermometer : ?", a: "Temperature", d: ["Heat", "Pressure", "Speed"] },
    { q: "Pen : Writer :: Scalpel : ?", a: "Surgeon", d: ["Teacher", "Carpenter", "Painter"] },
    { q: "Eye : Myopia :: Ear : ?", a: "Deafness", d: ["Blindness", "Cataract", "Dumbness"] },
    { q: "Marathon : Race :: Hibernation : ?", a: "Sleep", d: ["Run", "Winter", "Dream"] },
    { q: "Ornithology : Birds :: Entomology : ?", a: "Insects", d: ["Plants", "Fish", "Animals"] },
    { q: "Botany : Plants :: Zoology : ?", a: "Animals", d: ["Rocks", "Stars", "Weather"] },
    { q: "Lawyer : Court :: Scientist : ?", a: "Laboratory", d: ["Hospital", "School", "Office"] },
  ];
  const s = scenarios[rand(0, scenarios.length - 1)];
  return buildQuestion(s.q, s.a, s.d, "Reasoning Ability", d, "Analogy");
}

// ======================================================================
// VERBAL ABILITY — TCS NQT LEVEL
// ======================================================================

function verbalReadingComprehension(d: string): Question {
  const passages = [
    {
      text: `Read the passage and answer the question:

"The advent of artificial intelligence has revolutionized industries ranging from healthcare to finance. Machine learning algorithms can now diagnose diseases with accuracy rivaling that of experienced physicians. However, critics argue that over-reliance on AI could lead to a dangerous erosion of human judgment and critical thinking skills. The key challenge lies in finding the right balance between leveraging AI's computational power and preserving the irreplaceable value of human intuition and ethical reasoning."

What is the main concern raised by critics of AI according to the passage?`,
      a: "Over-reliance on AI may erode human judgment and critical thinking",
      wrong: [
        "AI is not accurate enough to diagnose diseases",
        "AI will replace all healthcare workers",
        "Machine learning algorithms are too expensive",
      ],
    },
    {
      text: `Read the passage and answer the question:

"Urbanization in developing countries has created a paradox of progress. While cities generate approximately 80% of the global GDP, they also consume 75% of natural resources and produce 70% of carbon emissions. The migration from rural to urban areas has led to the mushrooming of informal settlements where basic amenities remain a distant dream. Sustainable urban planning, which integrates green infrastructure, efficient public transport, and equitable resource distribution, is no longer a luxury but an imperative."

According to the passage, what percentage of global GDP is generated by cities?`,
      a: "80%",
      wrong: ["75%", "70%", "90%"],
    },
    {
      text: `Read the passage and answer the question:

"The phenomenon of 'brain drain' — the emigration of highly trained professionals from developing to developed nations — costs source countries an estimated $2 billion annually in lost training investments. While remittances partially offset this loss, the departure of skilled workers creates critical shortages in sectors like healthcare and engineering. Some countries have adopted reverse incentive programs, offering tax breaks and research grants to attract diaspora talent back. The effectiveness of these programs, however, remains a subject of debate among policymakers."

What is the estimated annual cost of brain drain to developing countries?`,
      a: "$2 billion",
      wrong: ["$5 billion", "$1 billion", "$10 billion"],
    },
  ];
  const p = passages[rand(0, passages.length - 1)];
  return buildQuestion(p.text, p.a, p.wrong, "Verbal Ability", d, "Reading Comprehension");
}

function verbalSentenceCorrection(d: string): Question {
  const scenarios = [
    {
      q: `Choose the grammatically correct sentence:`,
      a: "Neither the manager nor the employees were aware of the policy change.",
      wrong: [
        "Neither the manager nor the employees was aware of the policy change.",
        "Neither the manager or the employees were aware of the policy change.",
        "Neither the manager nor the employees is aware of the policy change.",
      ],
    },
    {
      q: `Identify the correct sentence:`,
      a: "Each of the students has submitted their assignment on time.",
      wrong: [
        "Each of the students have submitted their assignment on time.",
        "Each of the student has submitted their assignment on time.",
        "Each of the students has submitted his or her assignments on times.",
      ],
    },
    {
      q: `Select the sentence with correct usage:`,
      a: "The committee has decided to postpone the meeting indefinitely.",
      wrong: [
        "The committee have decided to postpone the meeting indefinitely.",
        "The committee has decided to postpone the meeting for indefinite.",
        "The committee has decides to postpone the meeting indefinitely.",
      ],
    },
    {
      q: `Which of the following sentences is grammatically correct?`,
      a: "Had I known about the traffic, I would have left earlier.",
      wrong: [
        "If I would have known about the traffic, I would have left earlier.",
        "Had I knew about the traffic, I would have left earlier.",
        "If I had knew about the traffic, I would left earlier.",
      ],
    },
  ];
  const s = scenarios[rand(0, scenarios.length - 1)];
  return buildQuestion(s.q, s.a, s.wrong, "Verbal Ability", d, "Sentence Correction");
}

function verbalParaJumble(d: string): Question {
  const scenarios = [
    {
      q: `Arrange the following sentences in a logical order:

P. However, the rapid industrialization came at a heavy environmental cost.
Q. The economic reforms of 1991 opened India to global markets.
R. Today, India faces the dual challenge of sustaining growth while mitigating pollution.
S. This led to unprecedented GDP growth averaging 7% over two decades.

Choose the correct sequence:`,
      a: "QSPR",
      wrong: ["PQRS", "QPRS", "SQPR"],
    },
    {
      q: `Rearrange the sentences to form a coherent paragraph:

P. The experiment yielded unexpected results that challenged existing theories.
Q. A team of physicists set up an experiment to test quantum entanglement.
R. These findings were later published in a leading scientific journal.
S. The results showed particles communicating faster than the speed of light.

Choose the correct sequence:`,
      a: "QPSR",
      wrong: ["PQSR", "QSPR", "RQPS"],
    },
  ];
  const s = scenarios[rand(0, scenarios.length - 1)];
  return buildQuestion(s.q, s.a, s.wrong, "Verbal Ability", d, "Para Jumbles");
}

function verbalIdiom(d: string): Question {
  const idioms = [
    { q: `What does the idiom "to burn the midnight oil" mean?`, a: "To work or study late into the night", wrong: ["To waste resources", "To cook food at night", "To set fire to something"] },
    { q: `What does "a white elephant" mean?`, a: "A costly possession that is a burden to maintain", wrong: ["A rare animal", "A pure white elephant", "A symbol of good luck"] },
    { q: `What does "to hit the nail on the head" mean?`, a: "To be exactly right about something", wrong: ["To hurt oneself", "To start construction work", "To make a mistake"] },
    { q: `What does "to cry over spilt milk" mean?`, a: "To feel regret about something that cannot be changed", wrong: ["To waste food", "To be very sad", "To clean up a mess"] },
    { q: `What does the idiom "barking up the wrong tree" mean?`, a: "Pursuing a wrong or misguided line of thought", wrong: ["Being afraid of dogs", "Climbing trees in the forest", "Making loud noises"] },
    { q: `What does "the ball is in your court" mean?`, a: "It is your turn to take action or make a decision", wrong: ["You are playing a game", "You have lost the match", "You need to return something"] },
  ];
  const s = idioms[rand(0, idioms.length - 1)];
  return buildQuestion(s.q, s.a, s.wrong, "Verbal Ability", d, "Idioms & Phrases");
}

function verbalSynonymAdvanced(d: string): Question {
  const pairs = [
    { word: "Ubiquitous", correct: "Omnipresent", wrong: ["Rare", "Abstract", "Minimal"] },
    { word: "Acrimonious", correct: "Bitter", wrong: ["Sweet", "Peaceful", "Generous"] },
    { word: "Ephemeral", correct: "Short-lived", wrong: ["Eternal", "Significant", "Heavy"] },
    { word: "Surreptitious", correct: "Secretive", wrong: ["Open", "Honest", "Loud"] },
    { word: "Ameliorate", correct: "Improve", wrong: ["Worsen", "Destroy", "Ignore"] },
    { word: "Obfuscate", correct: "Confuse", wrong: ["Clarify", "Brighten", "Simplify"] },
    { word: "Pernicious", correct: "Harmful", wrong: ["Beneficial", "Neutral", "Pleasant"] },
    { word: "Recalcitrant", correct: "Defiant", wrong: ["Obedient", "Gentle", "Flexible"] },
    { word: "Acquiesce", correct: "Agree reluctantly", wrong: ["Refuse firmly", "Demand loudly", "Ignore completely"] },
    { word: "Pragmatic", correct: "Practical", wrong: ["Theoretical", "Artistic", "Emotional"] },
  ];
  const p = pairs[rand(0, pairs.length - 1)];
  return buildQuestion(
    `Choose the word closest in meaning to "${p.word}":`,
    p.correct, p.wrong, "Verbal Ability", d, "Vocabulary"
  );
}

function verbalErrorSpotting(d: string): Question {
  const scenarios = [
    {
      q: `Find the error in the sentence: "The team of engineers are working on a solution to reduce carbon emissions by 50% before the next decade."`,
      a: "Replace 'are' with 'is' (team is singular)",
      wrong: ["Replace 'to reduce' with 'reducing'", "Replace 'by 50%' with 'to 50%'", "No error in the sentence"],
    },
    {
      q: `Find the error in the sentence: "He is one of those who believes that discipline is more important than talent in achieving success."`,
      a: "Replace 'believes' with 'believe'",
      wrong: ["Replace 'is' with 'are' before 'more'", "Replace 'achieving' with 'to achieve'", "No error in the sentence"],
    },
    {
      q: `Find the error in the sentence: "The principal along with the teachers have decided to postpone the annual function."`,
      a: "Replace 'have' with 'has' (principal is the main subject)",
      wrong: ["Replace 'along with' with 'and'", "Replace 'decided' with 'deciding'", "No error in the sentence"],
    },
  ];
  const s = scenarios[rand(0, scenarios.length - 1)];
  return buildQuestion(s.q, s.a, s.wrong, "Verbal Ability", d, "Error Spotting");
}

// ======================================================================
// PROGRAMMING LOGIC — TCS NQT LEVEL
// ======================================================================

function progLinkedList(d: string): Question {
  return buildQuestion(
    `What is the output of the following C code?

struct Node {
    int data;
    struct Node* next;
};

void printList(struct Node* n) {
    while (n != NULL) {
        printf("%d ", n->data);
        n = n->next;
    }
}

int main() {
    struct Node a = {1, NULL};
    struct Node b = {2, NULL};
    struct Node c = {3, NULL};
    a.next = &b;
    b.next = &c;
    printList(&a);
    return 0;
}`,
    "1 2 3",
    ["3 2 1", "1 2", "Compilation Error"],
    "Programming Logic", d, "Linked Lists"
  );
}

function progPointers(d: string): Question {
  const a = rand(5, 20);
  const b = rand(5, 20);
  return buildQuestion(
    `What is the output?

#include <stdio.h>
void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}
int main() {
    int x = ${a}, y = ${b};
    swap(&x, &y);
    printf("%d %d", x, y);
    return 0;
}`,
    `${b} ${a}`,
    [`${a} ${b}`, `${a} ${a}`, `${b} ${b}`],
    "Programming Logic", d, "Pointers"
  );
}

function progRecursionAdvanced(d: string): Question {
  const n = rand(4, 8);
  // Fibonacci
  function fib(x: number): number {
    if (x <= 1) return x;
    return fib(x - 1) + fib(x - 2);
  }
  const answer = fib(n);
  return buildQuestion(
    `What does the function return for fib(${n})?

int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}`,
    answer,
    [answer + 1, answer - 1, n * 2],
    "Programming Logic", d, "Recursion"
  );
}

function progBitwiseOps(d: string): Question {
  const a = rand(5, 30);
  const b = rand(5, 30);
  const result = a & b;
  return buildQuestion(
    `What is the output?

int main() {
    int a = ${a}, b = ${b};
    printf("%d", a & b);
    return 0;
}

(Hint: ${a} in binary = ${a.toString(2)}, ${b} in binary = ${b.toString(2)})`,
    result,
    [a | b, a ^ b, a + b],
    "Programming Logic", d, "Bitwise Operations"
  );
}

function progStackQueue(d: string): Question {
  const scenarios = [
    {
      q: `Consider the following operations on a stack:
PUSH(10), PUSH(20), POP(), PUSH(30), PUSH(40), POP(), POP()

What element is at the top of the stack after all operations?`,
      a: "10",
      d: ["30", "20", "40"],
    },
    {
      q: `Consider a queue with the following operations:
ENQUEUE(5), ENQUEUE(10), DEQUEUE(), ENQUEUE(15), ENQUEUE(20), DEQUEUE()

What is the front element of the queue after all operations?`,
      a: "15",
      d: ["5", "10", "20"],
    },
    {
      q: `A stack is used to evaluate the postfix expression: 2 3 * 5 4 * + 9 -

What is the final result?`,
      a: "17",
      d: ["26", "20", "15"],
    },
  ];
  const s = scenarios[rand(0, scenarios.length - 1)];
  return buildQuestion(s.q, s.a, s.d, "Programming Logic", d, "Stacks & Queues");
}

function progComplexity(d: string): Question {
  const scenarios = [
    {
      q: `What is the time complexity of the following code?

for (int i = 0; i < n; i++) {
    for (int j = i; j < n; j++) {
        printf("%d", i + j);
    }
}`,
      a: "O(n²)",
      d: ["O(n)", "O(n log n)", "O(n³)"],
    },
    {
      q: `What is the time complexity of binary search on a sorted array of n elements?`,
      a: "O(log n)",
      d: ["O(n)", "O(n log n)", "O(1)"],
    },
    {
      q: `What is the time complexity of the following code?

int i = 1;
while (i < n) {
    printf("%d", i);
    i = i * 2;
}`,
      a: "O(log n)",
      d: ["O(n)", "O(n²)", "O(√n)"],
    },
    {
      q: `What is the time complexity of merge sort?`,
      a: "O(n log n)",
      d: ["O(n²)", "O(n)", "O(log n)"],
    },
  ];
  const s = scenarios[rand(0, scenarios.length - 1)];
  return buildQuestion(s.q, s.a, s.d, "Programming Logic", d, "Time Complexity");
}

function progOutputTracing(d: string): Question {
  const n = rand(3, 6);
  let result = "";
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= i; j++) {
      result += "*";
    }
    if (i < n) result += "\\n";
  }
  const totalStars = (n * (n + 1)) / 2;
  return buildQuestion(
    `How many '*' characters are printed by this code?

for (int i = 1; i <= ${n}; i++) {
    for (int j = 1; j <= i; j++) {
        printf("*");
    }
    printf("\\n");
}`,
    totalStars,
    [totalStars + n, n * n, totalStars - 1],
    "Programming Logic", d, "Output Tracing"
  );
}

function progStringManipulation(d: string): Question {
  const scenarios = [
    {
      q: `What is the output of the following code?

char str[] = "HELLO";
int len = strlen(str);
for (int i = 0; i < len / 2; i++) {
    char temp = str[i];
    str[i] = str[len - 1 - i];
    str[len - 1 - i] = temp;
}
printf("%s", str);`,
      a: "OLLEH",
      d: ["HELLO", "OLLE", "LEHLO"],
    },
    {
      q: `What will the following code print?

char s[] = "programming";
printf("%c %c %c", s[0], s[3], s[7]);`,
      a: "p g m",
      d: ["p r a", "r o g", "p g i"],
    },
  ];
  const s = scenarios[rand(0, scenarios.length - 1)];
  return buildQuestion(s.q, s.a, s.d, "Programming Logic", d, "String Manipulation");
}

// ======================================================================
// CODING SECTION — TCS NQT LEVEL (DSA Problems)
// ======================================================================

function codingSubarraySum(d: string): Question {
  return buildCodingQuestion(
    `Given an array of N integers, find the contiguous subarray with the maximum sum (Kadane's Algorithm).

Input Format:
• First line: Integer N (1 ≤ N ≤ 10^5)
• Second line: N space-separated integers (-10^4 ≤ arr[i] ≤ 10^4)

Output Format:
• Print the maximum subarray sum.

Constraints:
• Time complexity must be O(N).

Example:
Input:
8
-2 1 -3 4 -1 2 1 -5 4
Output:
6

Explanation: The subarray [4, -1, 2, 1] has the maximum sum = 6.`,
    "Coding Section", d, "Kadane's Algorithm"
  );
}

function codingLCS(d: string): Question {
  return buildCodingQuestion(
    `Given two strings S1 and S2, find the length of the Longest Common Subsequence.

Input Format:
• First line: String S1 (1 ≤ |S1| ≤ 1000)
• Second line: String S2 (1 ≤ |S2| ≤ 1000)

Output Format:
• Print a single integer — the length of the LCS.

Example:
Input:
AGGTAB
GXTXAYB
Output:
4

Explanation: The LCS is "GTAB" with length 4.

Note: You may use Dynamic Programming for an efficient solution.`,
    "Coding Section", d, "Dynamic Programming"
  );
}

function codingPrimeFactors(d: string): Question {
  return buildCodingQuestion(
    `Given an integer N, print all its prime factors in ascending order.

Input Format:
• A single integer N (2 ≤ N ≤ 10^6)

Output Format:
• Print the prime factors of N in ascending order, separated by spaces.

Example:
Input:
315
Output:
3 3 5 7

Explanation: 315 = 3 × 3 × 5 × 7

Constraints:
• Your solution should run efficiently for N up to 10^6.`,
    "Coding Section", d, "Number Theory"
  );
}

function codingMatrixSpiral(d: string): Question {
  return buildCodingQuestion(
    `Given an M × N matrix, print all elements in spiral order (clockwise from top-left).

Input Format:
• First line: Two integers M and N (1 ≤ M, N ≤ 100)
• Next M lines: N space-separated integers each

Output Format:
• Print all elements in spiral order separated by spaces.

Example:
Input:
3 3
1 2 3
4 5 6
7 8 9
Output:
1 2 3 6 9 8 7 4 5

Constraints:
• Handle edge cases like single row, single column matrices.`,
    "Coding Section", d, "Matrix Traversal"
  );
}

function codingStringAnagram(d: string): Question {
  return buildCodingQuestion(
    `Given two strings S1 and S2, determine if S2 is an anagram of S1. If not, find the minimum number of character deletions required to make them anagrams.

Input Format:
• First line: String S1 (lowercase English letters, 1 ≤ |S1| ≤ 10^4)
• Second line: String S2 (lowercase English letters, 1 ≤ |S2| ≤ 10^4)

Output Format:
• Print a single integer — the minimum number of deletions.

Example:
Input:
abc
cde
Output:
4

Explanation: Remove 'a', 'b' from S1 and 'd', 'e' from S2 to make both "c".`,
    "Coding Section", d, "Strings & Hashing"
  );
}

function codingGraphBFS(d: string): Question {
  return buildCodingQuestion(
    `Given an undirected graph with V vertices and E edges, perform BFS traversal starting from vertex 0. Print the BFS order.

Input Format:
• First line: Two integers V and E (1 ≤ V ≤ 1000, 0 ≤ E ≤ V*(V-1)/2)
• Next E lines: Two space-separated integers u and v representing an edge (0-indexed)

Output Format:
• Print the BFS traversal order from vertex 0, separated by spaces.

Example:
Input:
5 6
0 1
0 2
1 3
2 3
3 4
2 4
Output:
0 1 2 3 4

Constraints:
• The graph may be disconnected. Only traverse the connected component of vertex 0.`,
    "Coding Section", d, "Graph BFS"
  );
}

function codingSortSearch(d: string): Question {
  return buildCodingQuestion(
    `Given a sorted array that has been rotated an unknown number of times, find the index of a given target element. If not found, print -1.

Input Format:
• First line: Integer N (1 ≤ N ≤ 10^5)
• Second line: N space-separated integers (sorted then rotated)
• Third line: Integer target

Output Format:
• Print the index (0-based) of the target element, or -1 if not found.

Example:
Input:
7
4 5 6 7 0 1 2
0
Output:
4

Constraints:
• Expected time complexity: O(log N)
• All elements are unique.`,
    "Coding Section", d, "Binary Search (Rotated Array)"
  );
}

function codingDPStairs(d: string): Question {
  return buildCodingQuestion(
    `A person can climb either 1, 2, or 3 stairs at a time. Given N stairs, find the number of distinct ways to reach the top.

Input Format:
• A single integer N (1 ≤ N ≤ 30)

Output Format:
• Print the number of distinct ways to reach the Nth stair.

Example:
Input:
4
Output:
7

Explanation:
The 7 ways are: {1,1,1,1}, {1,1,2}, {1,2,1}, {2,1,1}, {2,2}, {1,3}, {3,1}

Constraints:
• Use Dynamic Programming for efficient computation.`,
    "Coding Section", d, "Dynamic Programming"
  );
}

// ======================================================================
// GENERATOR MAP
// ======================================================================

const generatorsBySection: Record<string, ((d: string) => Question)[]> = {
  "Quantitative Aptitude": [
    quantCompoundInterest, quantPermutation, quantProbability,
    quantTrains, quantPipeCistern, quantMixture, quantTimeWorkAdvanced,
    quantAgeProblems, quantNumberSystem, quantGeometry,
  ],
  "Reasoning Ability": [
    reasoningSyllogism, reasoningSeating, reasoningDirection,
    reasoningCodingDecoding, reasoningBloodRelation, reasoningSeriesAdvanced,
    reasoningAnalogy,
  ],
  "Logical Reasoning": [
    reasoningSyllogism, reasoningSeating, reasoningDirection,
    reasoningCodingDecoding, reasoningBloodRelation, reasoningSeriesAdvanced,
    reasoningAnalogy,
  ],
  "Verbal Ability": [
    verbalReadingComprehension, verbalSentenceCorrection, verbalParaJumble,
    verbalIdiom, verbalSynonymAdvanced, verbalErrorSpotting,
  ],
  "Programming Logic": [
    progLinkedList, progPointers, progRecursionAdvanced, progBitwiseOps,
    progStackQueue, progComplexity, progOutputTracing, progStringManipulation,
  ],
  "Pseudo Code": [
    progLinkedList, progPointers, progRecursionAdvanced, progBitwiseOps,
    progStackQueue, progComplexity, progOutputTracing, progStringManipulation,
  ],
  "Data Interpretation": [
    quantCompoundInterest, quantPermutation, quantTrains, quantMixture,
  ],
  "Coding Section": [
    codingSubarraySum, codingLCS, codingPrimeFactors, codingMatrixSpiral,
    codingStringAnagram, codingGraphBFS, codingSortSearch, codingDPStairs,
  ],
};

export function generateQuestions(
  section: string,
  count: number,
  difficulty: string
): Question[] {
  const generators = generatorsBySection[section];
  if (!generators) return [];

  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const gen = generators[i % generators.length];
    questions.push(gen(difficulty));
  }
  return questions;
}

export function generateMixedQuestions(
  sections: string[],
  count: number,
  difficulty: string
): Question[] {
  const perSection = Math.ceil(count / sections.length);
  const all: Question[] = [];
  for (const section of sections) {
    all.push(...generateQuestions(section, perSection, difficulty));
  }
  return shuffle(all).slice(0, count);
}
