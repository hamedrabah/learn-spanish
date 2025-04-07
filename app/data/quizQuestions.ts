export interface QuizQuestion {
  id: number;
  question: string;
  type: 'fillBlank' | 'match';
  options?: string[];
  correctAnswer: string;
  category: 'articles' | 'colors' | 'adjectives';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const quizQuestions: QuizQuestion[] = [
  // Artículos definidos
  {
    id: 1,
    question: "_____ casa es grande.",
    type: "fillBlank",
    options: ["el", "la", "los", "las"],
    correctAnswer: "la",
    category: "articles",
    difficulty: "beginner"
  },
  {
    id: 2,
    question: "_____ perros son ruidosos.",
    type: "fillBlank",
    options: ["el", "la", "los", "las"],
    correctAnswer: "los",
    category: "articles",
    difficulty: "beginner"
  },
  {
    id: 3,
    question: "_____ maestro es simpático.",
    type: "fillBlank",
    options: ["el", "la", "los", "las"],
    correctAnswer: "el",
    category: "articles",
    difficulty: "beginner"
  },
  {
    id: 4,
    question: "_____ amigas están aquí.",
    type: "fillBlank",
    options: ["el", "la", "los", "las"],
    correctAnswer: "las",
    category: "articles",
    difficulty: "beginner"
  },
  {
    id: 5,
    question: "_____ libro está en la mesa.",
    type: "fillBlank",
    options: ["el", "la", "los", "las"],
    correctAnswer: "el",
    category: "articles",
    difficulty: "beginner"
  },

  // Artículos indefinidos
  {
    id: 6,
    question: "Quiero _____ manzana.",
    type: "fillBlank",
    options: ["un", "una", "unos", "unas"],
    correctAnswer: "una",
    category: "articles",
    difficulty: "beginner"
  },
  {
    id: 7,
    question: "Compré _____ zapatos nuevos.",
    type: "fillBlank",
    options: ["un", "una", "unos", "unas"],
    correctAnswer: "unos",
    category: "articles",
    difficulty: "beginner"
  },
  {
    id: 8,
    question: "Hay _____ niño en el parque.",
    type: "fillBlank",
    options: ["un", "una", "unos", "unas"],
    correctAnswer: "un",
    category: "articles",
    difficulty: "beginner"
  },
  {
    id: 9,
    question: "Necesito _____ pluma azul.",
    type: "fillBlank",
    options: ["un", "una", "unos", "unas"],
    correctAnswer: "una",
    category: "articles",
    difficulty: "beginner"
  },
  {
    id: 10,
    question: "Tengo _____ amigos en México.",
    type: "fillBlank",
    options: ["un", "una", "unos", "unas"],
    correctAnswer: "unos",
    category: "articles",
    difficulty: "beginner"
  },

  // Colores
  {
    id: 11,
    question: "El cielo es _____.",
    type: "fillBlank",
    options: ["azul", "rojo", "verde", "amarillo", "blanco"],
    correctAnswer: "azul",
    category: "colors",
    difficulty: "beginner"
  },
  {
    id: 12,
    question: "La fresa es _____.",
    type: "fillBlank",
    options: ["azul", "rojo", "verde", "amarillo", "blanco"],
    correctAnswer: "rojo",
    category: "colors",
    difficulty: "beginner"
  },
  {
    id: 13,
    question: "La hierba es _____.",
    type: "fillBlank",
    options: ["azul", "rojo", "verde", "amarillo", "blanco"],
    correctAnswer: "verde",
    category: "colors",
    difficulty: "beginner"
  },
  {
    id: 14,
    question: "El plátano es _____.",
    type: "fillBlank",
    options: ["azul", "rojo", "verde", "amarillo", "blanco"],
    correctAnswer: "amarillo",
    category: "colors",
    difficulty: "beginner"
  },
  {
    id: 15,
    question: "La nube es _____.",
    type: "fillBlank",
    options: ["azul", "rojo", "verde", "amarillo", "blanco"],
    correctAnswer: "blanco",
    category: "colors",
    difficulty: "beginner"
  },

  // Match colors
  {
    id: 16,
    question: "El sol es _____",
    type: "fillBlank",
    options: ["morado", "blanco", "marrón", "negro", "amarillo"],
    correctAnswer: "amarillo",
    category: "colors",
    difficulty: "beginner"
  },
  {
    id: 17,
    question: "El chocolate es _____",
    type: "fillBlank",
    options: ["morado", "blanco", "marrón", "negro", "amarillo"],
    correctAnswer: "marrón",
    category: "colors",
    difficulty: "beginner"
  },
  {
    id: 18,
    question: "El carbón es _____",
    type: "fillBlank",
    options: ["morado", "blanco", "marrón", "negro", "amarillo"],
    correctAnswer: "negro",
    category: "colors",
    difficulty: "beginner"
  },
  {
    id: 19,
    question: "La nieve es _____",
    type: "fillBlank",
    options: ["morado", "blanco", "marrón", "negro", "amarillo"],
    correctAnswer: "blanco",
    category: "colors",
    difficulty: "beginner"
  },
  {
    id: 20,
    question: "Las uvas son _____",
    type: "fillBlank",
    options: ["morado", "blanco", "marrón", "negro", "amarillo"],
    correctAnswer: "morado",
    category: "colors",
    difficulty: "beginner"
  },

  // Adjetivos
  {
    id: 21,
    question: "El gato es _____.",
    type: "fillBlank",
    options: ["grande", "hermosa", "rápido", "aburrida", "feliz"],
    correctAnswer: "grande",
    category: "adjectives",
    difficulty: "beginner"
  },
  {
    id: 22,
    question: "La flor es _____.",
    type: "fillBlank",
    options: ["grande", "hermosa", "rápido", "aburrida", "feliz"],
    correctAnswer: "hermosa",
    category: "adjectives",
    difficulty: "beginner"
  },
  {
    id: 23,
    question: "El coche es _____.",
    type: "fillBlank",
    options: ["grande", "hermosa", "rápido", "aburrida", "feliz"],
    correctAnswer: "rápido",
    category: "adjectives",
    difficulty: "beginner"
  },
  {
    id: 24,
    question: "La película es _____.",
    type: "fillBlank",
    options: ["grande", "hermosa", "rápido", "aburrida", "feliz"],
    correctAnswer: "aburrida",
    category: "adjectives",
    difficulty: "beginner"
  },
  {
    id: 25,
    question: "El niño es _____.",
    type: "fillBlank",
    options: ["grande", "hermosa", "rápido", "aburrida", "feliz"],
    correctAnswer: "feliz",
    category: "adjectives",
    difficulty: "beginner"
  },

  // Adjetivos forma correcta
  {
    id: 26,
    question: "Las casas son _____.",
    type: "fillBlank",
    options: ["blanco", "blanca", "blancos", "blancas"],
    correctAnswer: "blancas",
    category: "adjectives",
    difficulty: "intermediate"
  },
  {
    id: 27,
    question: "Un coche es _____.",
    type: "fillBlank",
    options: ["rojo", "roja", "rojos", "rojas"],
    correctAnswer: "rojo",
    category: "adjectives",
    difficulty: "intermediate"
  },
  {
    id: 28,
    question: "La niña es _____.",
    type: "fillBlank",
    options: ["inteligente", "inteligenta", "inteligentes"],
    correctAnswer: "inteligente",
    category: "adjectives",
    difficulty: "intermediate"
  },
  {
    id: 29,
    question: "Los chicos son _____.",
    type: "fillBlank",
    options: ["alto", "alta", "altos", "altas"],
    correctAnswer: "altos",
    category: "adjectives",
    difficulty: "intermediate"
  },
  {
    id: 30,
    question: "Unas flores son _____.",
    type: "fillBlank",
    options: ["amarillo", "amarilla", "amarillos", "amarillas"],
    correctAnswer: "amarillas",
    category: "adjectives",
    difficulty: "intermediate"
  }
]; 