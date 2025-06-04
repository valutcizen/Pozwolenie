import type { IndexedQuestion } from "@/model/indexedQuestion";

export default interface IQuestionList {
    getNextQuestion: () => IndexedQuestion | null;
    reset: () => void;
}