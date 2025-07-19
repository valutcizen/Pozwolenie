import type LearnSave from "@/model/learnSave";
import type QuestionsData from "@/model/questionData";
import type StatsData from "@/model/statsData";
import { type Ref } from "vue";
import QuestionRange from "@/model/questionRange";
import type { LearnOptions } from "@/model/learnOptions";

export default class PersistLearnState {
    private version: string;
    private saveData: LearnSave | null = null;

    constructor(private canLoad: Ref<boolean>, questionData: QuestionsData, private statsDataRef: Ref<StatsData>) {
        this.version = questionData.version;
        const saveDataJson = localStorage.getItem("learnSave");
        if (saveDataJson) {
            this.saveData = JSON.parse(saveDataJson) as LearnSave;
            this.canLoad.value = this.saveData?.questionBaseVersion === this.version;
        } else {
            this.canLoad.value = false;
        }
        if (!canLoad.value)
            this.saveData = null;
    }

    public load(): { questionRange: QuestionRange, questionOrder: number[], options: LearnOptions } {
        if (!this.saveData) {
            throw new Error("No save data available");
        }
        const questionRange = new QuestionRange();
        questionRange.addIndexes(this.saveData.questionRange);
        this.statsDataRef.value = this.saveData.statsData;

        return {
            questionRange: questionRange,
            questionOrder: this.saveData.questionRange,
            options: this.saveData.options
        };
    }

    public init(options: LearnOptions, questionOrder: number[]): void {
        this.saveData = {
            questionBaseVersion: this.version,
            options: options,
            questionRange: questionOrder,
            statsData: this.statsDataRef.value
        };
        this.canLoad.value = true;
    }

    public save(): void {
        if (!this.saveData) {
            throw new Error("No save data initialized");
        }
        var currentTimestamp = Date.now();
        this.statsDataRef.value.sessionsTime += currentTimestamp - this.statsDataRef.value.currentSessionStartTime;
        this.statsDataRef.value.currentSessionStartTime = currentTimestamp;
        this.saveData.statsData = this.statsDataRef.value;
        localStorage.setItem("learnSave", JSON.stringify(this.saveData));
    }
}