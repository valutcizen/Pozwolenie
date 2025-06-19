
<template>
  <v-container class="pt-8" max-width="900">
    <div>
      <v-img
        class="mb-4"
        height="120"
        src="@/assets/logo.png"
      />

      <div class="mb-8 text-center">
        <h4>Twoje Logo - Twój Nagłówek</h4>
        <h3>Aplikacja pomagająca w nauce do egzaminu WPA na pozwolenie na broń</h3>
      </div>
    </div>

    <main-menu v-if="mode===Mode.Menu"
      @learn="setLearn"
      @exam="setExam"
    />
    <learn-view v-else-if="mode===Mode.Learn" 
      :question-list="questionList"
      :infinite="infinity"
      @reset="mode=Mode.Menu"
      @answered="stats = $event"
    />
    <exam-view v-else-if="mode===Mode.Exam"
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

import QuestionRange from "@/model/questionRange";
import RandomizedQuestionList from "@/services/randomizedQuestionList";
import OrderedQuestionList from "@/services/orderedQuestionList";
import type StatsData from "@/model/statsData";
import type QuestionsData from "@/model/questionData";
import type QuestionList from "@/services/questionList";
import { createEmptyStatsData } from "@/model/statsData";

enum Mode {
  Menu, Learn, Exam
}

const mode = ref<Mode>(Mode.Menu);
const questionRange = new QuestionRange(0, 199);
const questionsData = QuestionsDataJson as QuestionsData;

const infinity = ref<boolean>(false);
const questionList = ref<QuestionList|null>(null);
const stats = ref<StatsData>(createEmptyStatsData(200));

function setLearn(args: {infinite: boolean, randomized: boolean}) {
  infinity.value = args.infinite;
  if (args.randomized) {
    questionList.value = new RandomizedQuestionList(questionsData, questionRange);
  } else {
    questionList.value = new OrderedQuestionList(questionsData, questionRange);
  }
  stats.value = createEmptyStatsData(200);
  mode.value = Mode.Learn;
}

function setExam() {
  mode.value = Mode.Exam;
  questionList.value = new RandomizedQuestionList(questionsData, questionRange);
}
</script>
