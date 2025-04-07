// Mapping for vocabulary words to their 16-bit style images
// These are used throughout the game to visualize Spanish vocabulary

interface VocabularyImageMapping {
  [word: string]: {
    imageSrc: string;
    altText: string;
    width: number;
    height: number;
    category: 'noun' | 'color' | 'place' | 'animal' | 'food' | 'nature';
  };
}

export const vocabularyImages: VocabularyImageMapping = {
  // Colors
  "azul": {
    imageSrc: '/images/vocabulary/azul.svg',
    altText: 'Azul (Blue)',
    width: 100,
    height: 100,
    category: 'color'
  },
  "rojo": {
    imageSrc: '/images/vocabulary/rojo.svg',
    altText: 'Rojo (Red)',
    width: 100,
    height: 100,
    category: 'color'
  },
  "verde": {
    imageSrc: '/images/vocabulary/verde.svg',
    altText: 'Verde (Green)',
    width: 100,
    height: 100,
    category: 'color'
  },
  "amarillo": {
    imageSrc: '/images/vocabulary/amarillo.svg',
    altText: 'Amarillo (Yellow)',
    width: 100,
    height: 100,
    category: 'color'
  },
  "blanco": {
    imageSrc: '/images/vocabulary/blanco.svg',
    altText: 'Blanco (White)',
    width: 100,
    height: 100,
    category: 'color'
  },
  "negro": {
    imageSrc: '/images/vocabulary/negro.svg',
    altText: 'Negro (Black)',
    width: 100,
    height: 100,
    category: 'color'
  },
  "morado": {
    imageSrc: '/images/vocabulary/morado.svg',
    altText: 'Morado (Purple)',
    width: 100,
    height: 100,
    category: 'color'
  },
  "marrón": {
    imageSrc: '/images/vocabulary/marron.svg',
    altText: 'Marrón (Brown)',
    width: 100,
    height: 100,
    category: 'color'
  },
  
  // Nouns from questions
  "casa": {
    imageSrc: '/images/vocabulary/casa.svg',
    altText: 'La casa (The house)',
    width: 120,
    height: 100,
    category: 'place'
  },
  "perro": {
    imageSrc: '/images/vocabulary/perro.svg',
    altText: 'El perro (The dog)',
    width: 120,
    height: 90,
    category: 'animal'
  },
  "maestro": {
    imageSrc: '/images/vocabulary/maestro.svg',
    altText: 'El maestro (The teacher)',
    width: 80,
    height: 130,
    category: 'noun'
  },
  "amiga": {
    imageSrc: '/images/vocabulary/amiga.svg',
    altText: 'La amiga (The friend - female)',
    width: 80,
    height: 130,
    category: 'noun'
  },
  "libro": {
    imageSrc: '/images/vocabulary/libro.svg',
    altText: 'El libro (The book)',
    width: 100,
    height: 90,
    category: 'noun'
  },
  "manzana": {
    imageSrc: '/images/vocabulary/manzana.svg',
    altText: 'La manzana (The apple)',
    width: 90,
    height: 90,
    category: 'food'
  },
  "zapato": {
    imageSrc: '/images/vocabulary/zapato.svg',
    altText: 'El zapato (The shoe)',
    width: 100,
    height: 60,
    category: 'noun'
  },
  "niño": {
    imageSrc: '/images/vocabulary/nino.svg',
    altText: 'El niño (The boy)',
    width: 80,
    height: 120,
    category: 'noun'
  },
  "pluma": {
    imageSrc: '/images/vocabulary/pluma.svg',
    altText: 'La pluma (The pen)',
    width: 100,
    height: 40,
    category: 'noun'
  },
  
  // Nature items
  "cielo": {
    imageSrc: '/images/vocabulary/cielo.svg',
    altText: 'El cielo (The sky)',
    width: 120,
    height: 80,
    category: 'nature'
  },
  "fresa": {
    imageSrc: '/images/vocabulary/fresa.svg',
    altText: 'La fresa (The strawberry)',
    width: 90,
    height: 90,
    category: 'food'
  },
  "hierba": {
    imageSrc: '/images/vocabulary/hierba.svg',
    altText: 'La hierba (The grass)',
    width: 120,
    height: 60,
    category: 'nature'
  },
  "plátano": {
    imageSrc: '/images/vocabulary/platano.svg',
    altText: 'El plátano (The banana)',
    width: 100,
    height: 80,
    category: 'food'
  },
  "nube": {
    imageSrc: '/images/vocabulary/nube.svg',
    altText: 'La nube (The cloud)',
    width: 120,
    height: 70,
    category: 'nature'
  },
  "sol": {
    imageSrc: '/images/vocabulary/sol.svg',
    altText: 'El sol (The sun)',
    width: 100,
    height: 100,
    category: 'nature'
  },
  "chocolate": {
    imageSrc: '/images/vocabulary/chocolate.svg',
    altText: 'El chocolate (The chocolate)',
    width: 100,
    height: 70,
    category: 'food'
  },
  "carbón": {
    imageSrc: '/images/vocabulary/carbon.svg',
    altText: 'El carbón (The coal)',
    width: 100,
    height: 70,
    category: 'noun'
  },
  "nieve": {
    imageSrc: '/images/vocabulary/nieve.svg',
    altText: 'La nieve (The snow)',
    width: 120,
    height: 80,
    category: 'nature'
  },
  "uva": {
    imageSrc: '/images/vocabulary/uva.svg',
    altText: 'La uva (The grape)',
    width: 90,
    height: 90,
    category: 'food'
  },
  "gato": {
    imageSrc: '/images/vocabulary/gato.svg',
    altText: 'El gato (The cat)',
    width: 100,
    height: 90,
    category: 'animal'
  },
  "flor": {
    imageSrc: '/images/vocabulary/flor.svg',
    altText: 'La flor (The flower)',
    width: 100,
    height: 120,
    category: 'nature'
  },
  "coche": {
    imageSrc: '/images/vocabulary/coche.svg',
    altText: 'El coche (The car)',
    width: 130,
    height: 80,
    category: 'noun'
  },
  "película": {
    imageSrc: '/images/vocabulary/pelicula.svg',
    altText: 'La película (The movie)',
    width: 120,
    height: 90,
    category: 'noun'
  }
}; 