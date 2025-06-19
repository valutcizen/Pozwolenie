import type StatsData from '../model/statsData';
import { createEmptyStatsData } from '../model/statsData';

export default class StatsService {
    private statsData: StatsData;

    constructor(statsData: StatsData | number) {
        if (typeof statsData === 'number') {
            this.statsData = createEmptyStatsData(statsData);
        } else {
            this.statsData = {...statsData, currentSessionStartTime: Date.now() };
        }
    }

    public recordAnswer(index: number, correct: boolean): void {
        this.statsData.totalQuestions++;
        if (correct) {
            this.statsData.correctAnswers[index]++;
        } else {
            this.statsData.incorrectAnswers[index]++;
        }
    }

    public getStats(): StatsData {
        return this.statsData;
    }

    public finish(): void {
        this.statsData.sessionsTime += Date.now() - this.statsData.currentSessionStartTime;
        this.statsData.currentSessionStartTime = Date.now();
    }

    public shuffleQuestions(range: number[]): void {
        for (let i = range.length - 1; i > 0; i--) {
            const j = this.statsData.questionIdx
                .findIndex(idx => idx === range[i]);
            if (j !== -1) {
                [this.statsData.questionIdx[i], this.statsData.questionIdx[j]] = 
                    [this.statsData.questionIdx[j], this.statsData.questionIdx[i]];
                [this.statsData.correctAnswers[i], this.statsData.correctAnswers[j]] =
                    [this.statsData.correctAnswers[j], this.statsData.correctAnswers[i]];
                [this.statsData.incorrectAnswers[i], this.statsData.incorrectAnswers[j]] =
                    [this.statsData.incorrectAnswers[j], this.statsData.incorrectAnswers[i]];
            }
        }
    }
}