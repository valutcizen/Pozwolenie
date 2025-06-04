import type QuestionsData from "@/model/questionData";
import type IQuestionList from "./questionList";
import type QuestionRange from "@/model/questionRange";
import type Question from "@/model/question";
import type { IndexedQuestion } from "@/model/indexedQuestion";

export default class OrderedQuestionList implements IQuestionList {
    questionRange: number[];
    questions: Question[];

    constructor(questionData: QuestionsData, questionRangeGenerator: QuestionRange, 
                private currentIndex: number = 0) {
        this.questions = questionData.questions;
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
}