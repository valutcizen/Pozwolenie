import type { IndexedQuestion } from "@/model/indexedQuestion";
import type Question from "@/model/question";
import type QuestionsData from "@/model/questionData";
import type QuestionRange from "@/model/questionRange";
import type StatsData from "@/model/statsData";
import StatsService from "./statsService";

export default class RandomizedQuestionList {
    private questions: Question[];
    private questionRange: number[];
    public stats: StatsService;

    constructor(questionData: QuestionsData, 
            questionRangeDefinition: QuestionRange, 
            statsData: StatsData | null = null,
            public currentIndex: number = 0) {
        this.questions = questionData.questions;
        this.stats = new StatsService(statsData ?? this.questions.length);
        this.questionRange = questionRangeDefinition.getQuestionIndexes(this.questions.length);
        this.shuffleQuestions();
    }

    private shuffleQuestions(): void {
        const range = this.questionRange;
        for (let i = range.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [range[i], range[j]] = [range[j], range[i]];
        }
        this.stats.shuffleQuestions(range);
    }

    public getNextQuestion(): IndexedQuestion | null {
        if (this.currentIndex >= this.questions.length) 
            return null;

        const questionIndex = this.questionRange[this.currentIndex];
        const question = this.questions[questionIndex];
        const indexedQuestion: IndexedQuestion = { ...question, 
            index: questionIndex, 
            is_last: this.currentIndex === this.questions.length - 1 
        };
        this.currentIndex++;
        return indexedQuestion;
    }

    public reset(): void {
        this.currentIndex = 0;
        this.shuffleQuestions();
    }

    public answered(correct: boolean): void {
        this.stats.recordAnswer(this.currentIndex - 1, correct);
    }

    public getStats(): StatsData {
        return this.stats.getStats();
    }
}