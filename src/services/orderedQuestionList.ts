import type QuestionsData from "@/model/questionData";
import type IQuestionList from "./questionList";
import type QuestionRange from "@/model/questionRange";
import type Question from "@/model/question";
import type { IndexedQuestion } from "@/model/indexedQuestion";
import type StatsData from "@/model/statsData";
import StatsService from "./statsService";

export default class OrderedQuestionList implements IQuestionList {
    private questionRange: number[];
    private questions: Question[];
    private stats: StatsService;

    constructor(questionData: QuestionsData, 
                questionRangeGenerator: QuestionRange, 
                statsData: StatsData | null = null,
                private currentIndex: number = 0) {
        this.questions = questionData.questions;
        this.stats = new StatsService(statsData ?? this.questions.length);
        this.questionRange = questionRangeGenerator.getQuestionIndexes(this.questions.length);
    }

    public getNextQuestion(): IndexedQuestion | null {
        if (this.currentIndex >= this.questionRange.length) {
            return null;
        }

        const questionIndex = this.questionRange[this.currentIndex];
        const question = this.questions[questionIndex];
        const indexedQuestion: IndexedQuestion = { ...question, 
            index: questionIndex,
            is_last: this.currentIndex === this.questionRange.length - 1
        };
        this.currentIndex++;
        return indexedQuestion;
    }

    public reset(): void {
        this.currentIndex = 0;
    }

    public answered(correct: boolean): void {
        this.stats.recordAnswer(this.currentIndex - 1, correct);
    }

    public getStats(): StatsData {
        return this.stats.getStats();
    }
}