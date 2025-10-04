import type QuestionsData from "@/model/questionData";
import type QuestionList from "./questionList";
import QuestionRange from "@/model/questionRange";
import type Question from "@/model/question";
import type { IndexedQuestion } from "@/model/indexedQuestion";
import type StatsData from "@/model/statsData";
import StatsService from "./statsService";
import type { LearnOptions } from "@/model/learnOptions";

export default class OrderedQuestionList implements QuestionList {
    public questionRange: number[];

    private questions: Question[];
    private stats: StatsService;
    private currentIndex: number = 0;

    constructor(questionData: QuestionsData, 
                learnOptions: LearnOptions, 
                statsData: StatsData | null = null,
                questionOrder: number[] | undefined = undefined) {
        this.questions = questionData.questions;
        this.stats = new StatsService(statsData ?? this.questions.length);
        if (questionOrder) {
            this.questionRange = questionOrder;
        } else if (learnOptions.questionRange) {
            this.questionRange = QuestionRange.fromString(learnOptions.questionRange).getQuestionIndexes(this.questions.length);
        } else {
            this.questionRange = Array.from(Array(this.questions.length).keys());
        }
        this.currentIndex = this.stats.getStats().totalQuestions % this.questionRange.length;
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