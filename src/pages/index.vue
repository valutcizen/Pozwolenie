
<template>
  <v-container class="pt-8" max-width="900">
    <div>
      <v-img
        class="mb-4"
        height="120"
        src="@/assets/logo.png"
      />

      <div class="mb-6 text-center">
        <h4>Twoje Logo - Twój Nagłówek</h4>
        <h3>Aplikacja pomagająca w nauce do egzaminu WPA na pozwolenie na broń</h3>
      </div>
    </div>
    
    <v-row v-if="mode !== Mode.Menu" class="mb-6" justify="center">
      <v-btn color="secondary" @click="mode = Mode.Menu">
        Powrót do menu głównego
      </v-btn>
    </v-row>

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
    questionList.value = new RandomizedQuestionList(questionsData, learnOptions.value);
  } else {
    questionList.value = new OrderedQuestionList(questionsData, learnOptions.value);
  }
  stats.value = createEmptyStatsData(questionList.value.questionRange.length);
  mode.value = Mode.Learn;
  persistentLearn.init(learnOptions.value, questionList.value.questionRange);
}

function setExam() {
  mode.value = Mode.Exam;
  const examOptions: LearnOptions = {
    infinite: false,
    randomized: true,
    showQuestionNumber: 'never',
    showSource: 'never',
    questionRange: '' // all questions
  };
  questionList.value = new RandomizedQuestionList(questionsData, examOptions);
}

function loadLearn() {
  if (!canLoad.value) {
    console.warn("Nie można załadować stanu nauki, brak danych.");
    return;
  }

  const loadedData = persistentLearn.load();
  learnOptions.value = loadedData.options;
  if (loadedData.options.randomized) {
    questionList.value = new RandomizedQuestionList(questionsData, learnOptions.value, stats.value, loadedData.questionOrder);
  } else {
    questionList.value = new OrderedQuestionList(questionsData, learnOptions.value, stats.value, loadedData.questionOrder);
  }
  mode.value = Mode.Learn;
} 
</script>
