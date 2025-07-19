
<template>
  <v-container class="pt-8" max-width="900">
    <div>
      <v-img
        class="mb-4"
        height="120"
        src="@/assets/logo-trzy-twierdze-2.webp"
      />

      <div class="mb-8 text-center">
        <h4>Stowarzyszenie Trzy Twierdze</h4>
        <h3>Aplikacja pomagająca w nauce do egzaminu WPA na pozwolenie na broń</h3>
      </div>
    </div>

    <main-menu v-if="mode===Mode.Menu"
      :can-load="canLoad"
      @learn="setLearn"
      @exam="setExam"
      @load="loadLearn"
    />
    <learn-view v-else-if="mode===Mode.Learn && questionList" 
      :question-list="questionList"
      :options="learnOptions"
      @reset="mode=Mode.Menu"
      @answered="stats = $event; persistentLearn.save()"
    />
    <exam-view v-else-if="mode===Mode.Exam && questionList"
      :question-list="questionList"
      :question-data="questionsData"
      @reset="mode=Mode.Menu"
      @answered="stats = $event"
    />
    
    <v-row v-if="mode !== Mode.Menu" class="mt-8" justify="center">
      <v-btn color="secondary" @click="mode = Mode.Menu">
        Powrót do menu głównego
      </v-btn>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import QuestionsDataJson from '../data/questions.json';

import MainMenu from "../components/MainMenu.vue";
import LearnView from "../components/LearnView.vue";
import ExamView from "../components/ExamView.vue";

import QuestionRange from "../model/questionRange";
import RandomizedQuestionList from "../services/randomizedQuestionList";
import OrderedQuestionList from "../services/orderedQuestionList";
import type StatsData from "../model/statsData";
import type QuestionsData from "../model/questionData";
import type QuestionList from "../services/questionList";
import { createEmptyStatsData } from "../model/statsData";
import type { LearnOptions } from "../model/learnOptions";
import PersistLearnState from "../services/persistLearnState";

enum Mode {
  Menu, Learn, Exam
}

const mode = ref<Mode>(Mode.Menu);
const canLoad = ref<boolean>(false);
const questionRange = new QuestionRange(0, 199);
const questionsData = QuestionsDataJson as QuestionsData;

const learnOptions = ref<LearnOptions>({
  infinite: false,
  randomized: false,
  showQuestionNumber: 'never',
  showSource: 'never',
});
const questionList = ref<QuestionList|null>(null);
const stats = ref<StatsData>(createEmptyStatsData(200));
const persistentLearn = new PersistLearnState(canLoad, questionsData, stats);

function setLearn(args: LearnOptions) {
  learnOptions.value = args;
  if (args.randomized) {
    questionList.value = new RandomizedQuestionList(questionsData, questionRange);
  } else {
    questionList.value = new OrderedQuestionList(questionsData, questionRange);
  }
  stats.value = createEmptyStatsData(200);
  mode.value = Mode.Learn;
  persistentLearn.init(learnOptions.value, questionList.value.questionRange);
}

function setExam() {
  mode.value = Mode.Exam;
  questionList.value = new RandomizedQuestionList(questionsData, questionRange);
}

function loadLearn() {
  if (!canLoad.value) {
    console.warn("Nie można załadować stanu nauki, brak danych.");
    return;
  }

  const loadedData = persistentLearn.load();
  learnOptions.value = loadedData.options;
  if (loadedData.options.randomized) {
    questionList.value = new RandomizedQuestionList(questionsData, loadedData.questionRange, stats.value, loadedData.questionOrder);
  } else {
    questionList.value = new OrderedQuestionList(questionsData, loadedData.questionRange, stats.value, loadedData.questionOrder);
  }
  mode.value = Mode.Learn;
} 
</script>
