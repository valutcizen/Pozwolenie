export default interface StatsData {
  sessionsTime: number
  currentSessionStartTime: number
  totalQuestions: number
  correctAnswers: number[]
  incorrectAnswers: number[]
  questionIdx: number[]
}

export function createEmptyStatsData (questions: number, questionIdx?: number[]): StatsData {
  const length = questionIdx ? questionIdx.length : questions
  return {
    sessionsTime: 0,
    currentSessionStartTime: Date.now(),
    totalQuestions: 0,
    correctAnswers: Array.from({ length }).fill(0) as number[],
    incorrectAnswers: Array.from({ length }).fill(0) as number[],
    questionIdx: questionIdx || Array.from({ length: questions }, (_, i) => i),
  }
}
