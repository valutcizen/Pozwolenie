export default interface Question {
  question: string;
  source: string | undefined;
  answers: string[];
  correct: number;
}