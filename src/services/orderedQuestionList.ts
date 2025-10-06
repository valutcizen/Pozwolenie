import type QuestionList from './questionList'
import type { IndexedQuestion } from '@/model/indexedQuestion'
import type { LearnOptions } from '@/model/learnOptions'
import type Question from '@/model/question'
import type QuestionsData from '@/model/questionData'
import type StatsData from '@/model/statsData'
import QuestionRange from '@/model/questionRange'
import StatsService from './statsService'

export default class OrderedQuestionList implements QuestionList {
  public questionRange: number[]

  private questions: Question[]
  private stats: StatsService
  private currentIndex = 0

  constructor (questionData: QuestionsData,
    learnOptions: LearnOptions,
                statsData: StatsData | null = null,
                questionOrder: number[] | undefined = undefined) {
    this.questions = questionData.questions
    if (questionOrder) {
      this.questionRange = questionOrder
    } else if (learnOptions.questionRange) {
      this.questionRange = QuestionRange.fromString(learnOptions.questionRange).getQuestionIndexes(this.questions.length)
    } else {
      this.questionRange = Array.from(Array.from({ length: this.questions.length }).keys())
    }
    this.stats = new StatsService(statsData ?? this.questions.length, this.questionRange)
    this.currentIndex = this.stats.getStats().totalQuestions % this.questionRange.length
  }

  public getNextQuestion (): IndexedQuestion | null {
    if (this.currentIndex >= this.questionRange.length) {
      return null
    }

    const questionIndex = this.questionRange[this.currentIndex]
    const question = this.questions[questionIndex]
    const indexedQuestion: IndexedQuestion = { ...question,
      index: questionIndex,
      is_last: this.currentIndex === this.questionRange.length - 1,
    }
    this.currentIndex++
    return indexedQuestion
  }

  public reset (): void {
    this.currentIndex = 0
  }

  public answered (correct: boolean): void {
    this.stats.recordAnswer(this.currentIndex - 1, correct)
  }

  public getStats (): StatsData {
    return this.stats.getStats()
  }
}
