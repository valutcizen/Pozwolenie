<template>
  <v-container class="pt-8" max-width="900">
    <v-card
      :title="'Pytanie ' + (currentQuestionIndex + 1) + ' z ' + data.questions.length"
      style="width: 600px; min-width: 60px; margin: 0 auto;"
      variant="tonal">
      <v-card-text>
        <div style="font-size: 1.1em; margin-bottom: 20px;">
          {{ data.questions[currentQuestionIndex].question }}
        </div>
        <v-list>
          <v-list-item
            v-for="(answer, index) in data.questions[currentQuestionIndex].answers"
            :key="index"
            @click="answerSelected === undefined && (answerSelected = index)"
            :class="{
              'bg-green-lighten-3': answerSelected !== undefined && index === data.questions[currentQuestionIndex].correct,
              'bg-red-lighten-3': answerSelected !== undefined && index === answerSelected && answerSelected !== data.questions[currentQuestionIndex].correct,
              'grey-darken-4': answerSelected === undefined || (index !== data.questions[currentQuestionIndex].correct && index !== answerSelected),
            }"
            style="cursor: pointer;"
          >
            <v-list-item-content>
              <v-list-item-title style="white-space: normal; word-break: break-word;">
                {{ String.fromCharCode(97 + index) + '.' }} {{ answer }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-row class="mt-4" justify="center">
          <v-btn class="mx-2" @click="goToRandomQuestion">Losowe</v-btn>
          <v-btn class="mx-2" @click="goToNextQuestion">Następne</v-btn>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Question {
  question: string;
  answers: string[];
  correct: number;
}

interface QuestionsData {
  version: string;
  questions: Question[];
}

import dataJson from '../../data/questions.json';
const data = dataJson as QuestionsData;
let currentQuestionIndex = ref(0);
let answerSelected = ref<undefined|number>(undefined);

function goToRandomQuestion() {
  let random;
  do {
    random = Math.floor(Math.random() * data.questions.length);
  } while (random === currentQuestionIndex.value && data.questions.length > 1);
  currentQuestionIndex.value = random;
  answerSelected.value = undefined;
}

function goToNextQuestion() {
  currentQuestionIndex.value = (currentQuestionIndex.value + 1) % data.questions.length;
  answerSelected.value = undefined;
}

</script>
