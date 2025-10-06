import type { LearnOptions } from './learnOptions'
import type StatsData from './statsData'

export default interface LearnSave {
  questionBaseVersion: string
  options: LearnOptions
  questionRange: number[]
  statsData: StatsData
}
