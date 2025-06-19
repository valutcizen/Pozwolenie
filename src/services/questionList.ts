import type { IndexedQuestion } from "@/model/indexedQuestion";
import type StatsData from "@/model/statsData";

export default interface IQuestionList {
    getNextQuestion: () => IndexedQuestion | null;
    answered: (correct: boolean) => void;
    reset: () => void;
    getStats: () => StatsData;
}