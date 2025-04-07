export interface DuelPhrase {
  id: number;
  insult: string;
  translation: string;
  correctResponse: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface DuelResponse {
  id: number;
  response: string;
  translation: string;
}

export const phrases: DuelPhrase[] = [
  {
    id: 1,
    insult: "¡Tu español es tan malo como tu esgrima!",
    translation: "Your Spanish is as bad as your swordsmanship!",
    correctResponse: 1,
    difficulty: 'beginner'
  },
  {
    id: 2,
    insult: "¡He visto niños con mejor vocabulario!",
    translation: "I've seen children with better vocabulary!",
    correctResponse: 2,
    difficulty: 'beginner'
  },
  {
    id: 3,
    insult: "¡Tu pronunciación hace llorar a los maestros!",
    translation: "Your pronunciation makes teachers cry!",
    correctResponse: 3,
    difficulty: 'beginner'
  },
  {
    id: 4,
    insult: "¡Hablas español como un turista perdido!",
    translation: "You speak Spanish like a lost tourist!",
    correctResponse: 4,
    difficulty: 'beginner'
  },
  {
    id: 5,
    insult: "¡Tu gramática es un desastre completo!",
    translation: "Your grammar is a complete disaster!",
    correctResponse: 5,
    difficulty: 'beginner'
  },
  {
    id: 6,
    insult: "¿Llamas a eso hablar? ¡Suena más como balbucear!",
    translation: "You call that speaking? It sounds more like babbling!",
    correctResponse: 6,
    difficulty: 'intermediate'
  },
  {
    id: 7,
    insult: "¡Mi loro tiene mejor acento que tú!",
    translation: "My parrot has a better accent than you!",
    correctResponse: 7,
    difficulty: 'intermediate'
  },
  {
    id: 8,
    insult: "¡Tu conjugación verbal es tan débil como tus ataques!",
    translation: "Your verb conjugation is as weak as your attacks!",
    correctResponse: 8,
    difficulty: 'intermediate'
  },
  {
    id: 9,
    insult: "¡Has confundido tantos géneros como enemigos has enfrentado!",
    translation: "You've confused as many genders as enemies you've faced!",
    correctResponse: 9,
    difficulty: 'advanced'
  },
  {
    id: 10,
    insult: "¡Tus palabras son tan ineficaces como tus estocadas!",
    translation: "Your words are as ineffective as your thrusts!",
    correctResponse: 10,
    difficulty: 'advanced'
  }
];

export const responses: DuelResponse[] = [
  {
    id: 1,
    response: "¡Y tu cara es tan fea como tu actitud!",
    translation: "And your face is as ugly as your attitude!"
  },
  {
    id: 2,
    response: "¡Prefiero ser un niño que un tonto como tú!",
    translation: "I'd rather be a child than a fool like you!"
  },
  {
    id: 3,
    response: "¡Y tu espada hace reír a los principiantes!",
    translation: "And your sword makes beginners laugh!"
  },
  {
    id: 4,
    response: "¡Al menos los turistas son más educados que tú!",
    translation: "At least tourists are more polite than you!"
  },
  {
    id: 5,
    response: "¡Y tu estilo de lucha es una vergüenza total!",
    translation: "And your fighting style is a total embarrassment!"
  },
  {
    id: 6,
    response: "¡Mejor balbucear que gritar tonterías como tú!",
    translation: "Better to babble than shout nonsense like you!"
  },
  {
    id: 7,
    response: "¡Y tu loro tiene mejor conversación que tú!",
    translation: "And your parrot has better conversation than you!"
  },
  {
    id: 8,
    response: "¡Al menos puedo conjugar mejor que puedo atacar!",
    translation: "At least I can conjugate better than I can attack!"
  },
  {
    id: 9,
    response: "¡Menos que los subjuntivos que tú has malentendido!",
    translation: "Fewer than the subjunctives you've misunderstood!"
  },
  {
    id: 10,
    response: "¡Mis palabras cortan más profundo que cualquier espada!",
    translation: "My words cut deeper than any sword!"
  }
]; 