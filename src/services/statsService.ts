import type StatsData from '../model/statsData';
import { createEmptyStatsData } from '../model/statsData';

export default class StatsService {
    private statsData: StatsData;

    constructor(statsData: StatsData | number) {
        if (typeof statsData === 'number') {
            this.statsData = createEmptyStatsData(statsData);
        } else {
            this.statsData = {...statsData, currentSessionStartTime: new Date() };
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
        this.statsData.sessionsTime += Date.now() - this.statsData.currentSessionStartTime.getTime();
        this.statsData.currentSessionStartTime = new Date();
    }
}