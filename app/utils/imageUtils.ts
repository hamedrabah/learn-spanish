import { QuizQuestion } from '../data/quizQuestions';
import { quizImagesMapping } from '../data/quizImages';
import { vocabularyImages } from '../data/vocabularyImages';

/**
 * Extract a potential vocabulary word from a quiz question.
 * This tries to identify the main subject noun in the question.
 */
export function extractVocabularyFromQuestion(question: QuizQuestion): string | null {
  // First check if the question contains specific recognizable patterns
  const questionText = question.question.toLowerCase();
  
  // For questions in the format "El/La X es _____."
  const subjectPattern = /(el|la|los|las)\s+(\w+)\s+es(?:\s+_+\.?)?/i;
  const subjectMatch = questionText.match(subjectPattern);
  
  if (subjectMatch && subjectMatch[2]) {
    return subjectMatch[2].toLowerCase();
  }
  
  // For questions in the format "_____ X es grande."
  const nounPattern = /_+\s+(\w+)\s+es\s+/i;
  const nounMatch = questionText.match(nounPattern);
  
  if (nounMatch && nounMatch[1]) {
    return nounMatch[1].toLowerCase();
  }
  
  // For "Quiero _____ X" type questions
  const objectPattern = /(?:quiero|compré|hay|necesito|tengo)\s+_+\s+(\w+)/i;
  const objectMatch = questionText.match(objectPattern);
  
  if (objectMatch && objectMatch[1]) {
    return objectMatch[1].toLowerCase();
  }
  
  // Check for colors questions
  if (questionText.includes('color') || question.category === 'colors') {
    // If it's a color question, try to get the color from the answer
    return question.correctAnswer.toLowerCase();
  }
  
  // If no patterns match, return null
  return null;
}

/**
 * Get an appropriate image for a quiz question.
 * First tries to find a direct match in the quizImagesMapping mapping.
 * If not found, tries to extract a vocabulary word and look for it in vocabularyImages.
 * Returns a default image if no matches are found.
 */
export function getQuizImage(question: QuizQuestion): {
  imageSrc: string;
  altText: string;
  width: number;
  height: number;
} {
  // First, try to find a direct match by question ID
  if (quizImagesMapping[question.id]) {
    return quizImagesMapping[question.id];
  }
  
  // If no direct match, try to extract a vocabulary word
  const vocabWord = extractVocabularyFromQuestion(question);
  
  if (vocabWord && vocabularyImages[vocabWord]) {
    // Found a matching vocabulary image
    const vocabImage = vocabularyImages[vocabWord];
    return {
      imageSrc: vocabImage.imageSrc,
      altText: vocabImage.altText,
      width: vocabImage.width,
      height: vocabImage.height
    };
  }
  
  // Check if the answer itself is a vocabulary word (like a color)
  if (vocabularyImages[question.correctAnswer.toLowerCase()]) {
    const answerImage = vocabularyImages[question.correctAnswer.toLowerCase()];
    return {
      imageSrc: answerImage.imageSrc,
      altText: answerImage.altText,
      width: answerImage.width,
      height: answerImage.height
    };
  }
  
  // If still no match, provide a default image based on the question category
  switch (question.category) {
    case 'articles':
      return {
        imageSrc: '/images/vocabulary/libro.svg', // Default for articles
        altText: 'Artículo (Article)',
        width: 100,
        height: 90
      };
    case 'colors':
      return {
        imageSrc: '/images/vocabulary/rojo.svg', // Default for colors
        altText: 'Color (Color)',
        width: 100,
        height: 100
      };
    case 'adjectives':
      return {
        imageSrc: '/images/vocabulary/casa.svg', // Default for adjectives
        altText: 'Adjetivo (Adjective)',
        width: 120,
        height: 100
      };
    default:
      // Fallback default image
      return {
        imageSrc: '/images/vocabulary/libro.svg',
        altText: 'Vocabulario (Vocabulary)',
        width: 100,
        height: 90
      };
  }
} 