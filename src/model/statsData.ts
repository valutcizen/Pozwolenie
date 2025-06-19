export default interface StatsData {
    sessionsTime: number;
    currentSessionStartTime: Date;
    totalQuestions: number;
    correctAnswers: number[];
    incorrectAnswers: number[];
    questionIdx: number[];
}

export function createEmptyStatsData(questions: number): StatsData {
    return {
        sessionsTime: 0,
        currentSessionStartTime: new Date(),
        totalQuestions: 0,
        correctAnswers: Array(questions).fill(0),
        incorrectAnswers: Array(questions).fill(0),
        questionIdx: Array.from({ length: questions }, (_, i) => i)
    };
}