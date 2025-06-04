export default class QuestionRange {
    private indexes: Set<number>;

    public constructor(start?: number, end?: number) {
        this.indexes = new Set<number>();
        if (start !== undefined && end !== undefined) {
            this.addRange(start, end);
        } else if (start !== undefined) {
            this.addIndex(start);
        }
    }

    public clear(): void {
        this.indexes.clear();
    }

    public addRange(start: number, end: number): void {
        for (let i = start; i <= end; i++) {
            this.indexes.add(i);
        }
    }

    public addIndex(index: number): void {
        this.indexes.add(index);
    }

    public getQuestionIndexes(max: number): number[] {
        return Array.from(this.indexes)
            .filter(i => i >= 0 && i <= max)
            .sort((a, b) => a - b);
    }
}