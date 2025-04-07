// Map of quiz question IDs to their corresponding 16-bit style images
// These images will be displayed between Guybrush and LeChuck during the quiz

interface QuizImageMapping {
  [questionId: number]: {
    imageSrc: string;
    altText: string;
    width: number;
    height: number;
  };
}

export const quizImagesMapping: QuizImageMapping = {
  // Beginner questions - Articles
  1: {
    imageSrc: '/images/quiz-images/house.svg',
    altText: 'La casa es grande (The house is big)',
    width: 120,
    height: 100
  },
  2: {
    imageSrc: '/images/quiz-images/dogs.svg',
    altText: 'Los perros son ruidosos (The dogs are noisy)',
    width: 120,
    height: 90
  },
  3: {
    imageSrc: '/images/quiz-images/teacher.svg',
    altText: 'El maestro es simpático (The teacher is nice)',
    width: 90,
    height: 130
  },
  4: {
    imageSrc: '/images/quiz-images/friends.svg',
    altText: 'Las amigas están aquí (The friends are here)',
    width: 120,
    height: 100
  },
  5: {
    imageSrc: '/images/quiz-images/book.svg',
    altText: 'El libro está en la mesa (The book is on the table)',
    width: 100,
    height: 80
  },
  6: {
    imageSrc: '/images/quiz-images/apple.svg',
    altText: 'Quiero una manzana (I want an apple)',
    width: 90,
    height: 90
  },
  7: {
    imageSrc: '/images/quiz-images/shoes.svg',
    altText: 'Compré unos zapatos nuevos (I bought some new shoes)',
    width: 140,
    height: 70
  },
  8: {
    imageSrc: '/images/quiz-images/boy.svg',
    altText: 'Hay un niño en el parque (There is a boy in the park)',
    width: 80,
    height: 120
  },
  9: {
    imageSrc: '/images/quiz-images/pen.svg',
    altText: 'Necesito una pluma azul (I need a blue pen)',
    width: 100,
    height: 50
  },
  10: {
    imageSrc: '/images/quiz-images/friends-mexico.svg',
    altText: 'Tengo unos amigos en México (I have some friends in Mexico)',
    width: 130,
    height: 100
  },
  
  // Beginner questions - Colors
  11: {
    imageSrc: '/images/quiz-images/blue-sky.svg',
    altText: 'El cielo es azul (The sky is blue)',
    width: 120,
    height: 80
  },
  12: {
    imageSrc: '/images/quiz-images/red-strawberry.svg',
    altText: 'La fresa es roja (The strawberry is red)',
    width: 90,
    height: 90
  },
  13: {
    imageSrc: '/images/quiz-images/green-grass.svg',
    altText: 'La hierba es verde (The grass is green)',
    width: 120,
    height: 60
  },
  14: {
    imageSrc: '/images/quiz-images/yellow-banana.svg',
    altText: 'El plátano es amarillo (The banana is yellow)',
    width: 100,
    height: 80
  },
  15: {
    imageSrc: '/images/quiz-images/white-cloud.svg',
    altText: 'La nube es blanca (The cloud is white)',
    width: 120,
    height: 70
  },
  16: {
    imageSrc: '/images/quiz-images/yellow-sun.svg',
    altText: 'El sol es amarillo (The sun is yellow)',
    width: 100,
    height: 100
  },
  17: {
    imageSrc: '/images/quiz-images/brown-chocolate.svg',
    altText: 'El chocolate es marrón (The chocolate is brown)',
    width: 100,
    height: 70
  },
  18: {
    imageSrc: '/images/quiz-images/black-coal.svg',
    altText: 'El carbón es negro (The coal is black)',
    width: 100,
    height: 70
  },
  19: {
    imageSrc: '/images/quiz-images/white-snow.svg',
    altText: 'La nieve es blanca (The snow is white)',
    width: 120,
    height: 80
  },
  20: {
    imageSrc: '/images/quiz-images/purple-grapes.svg',
    altText: 'Las uvas son moradas (The grapes are purple)',
    width: 90,
    height: 90
  },
  
  // Adjectives for different objects/people
  21: {
    imageSrc: '/images/vocabulary/perro.svg',
    altText: 'Un gato grande (a big cat)',
    width: 120,
    height: 100
  },
  22: {
    imageSrc: '/images/quiz-images/beautiful-flower.svg',
    altText: 'Una flor hermosa (a beautiful flower)',
    width: 100,
    height: 120
  },
  23: {
    imageSrc: '/images/vocabulary/libro.svg',
    altText: 'Un coche rápido (a fast car)',
    width: 150,
    height: 90
  },
  24: {
    imageSrc: '/images/quiz-images/boring-movie.svg',
    altText: 'Una película aburrida (a boring movie)',
    width: 130,
    height: 90
  },
  25: {
    imageSrc: '/images/quiz-images/happy-child.svg',
    altText: 'Un niño feliz (a happy child)',
    width: 80,
    height: 120
  },
  
  // Adjetivos forma correcta (correct form of adjectives)
  26: {
    imageSrc: '/images/quiz-images/white-houses.svg',
    altText: 'Casas blancas (white houses)',
    width: 160,
    height: 100
  },
  27: {
    imageSrc: '/images/quiz-images/red-car.svg',
    altText: 'Un coche rojo (a red car)',
    width: 150,
    height: 90
  },
  28: {
    imageSrc: '/images/quiz-images/smart-girl.svg',
    altText: 'Una niña inteligente (a smart girl)',
    width: 80,
    height: 120
  },
  29: {
    imageSrc: '/images/quiz-images/tall-boys.svg',
    altText: 'Chicos altos (tall boys)',
    width: 140,
    height: 140
  },
  30: {
    imageSrc: '/images/quiz-images/yellow-flowers.svg',
    altText: 'Unas flores amarillas (yellow flowers)',
    width: 140,
    height: 120
  }
}; 