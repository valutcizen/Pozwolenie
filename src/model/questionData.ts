import type Question from './question'

export default interface QuestionsData {
  version: string
  questions: Question[]
}
