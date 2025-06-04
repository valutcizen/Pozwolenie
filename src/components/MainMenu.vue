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
    
    <!-- Menu: Pojedyńczy po kolei, Pojedyńczy losowo, Nieskończony po kolei, Nieskończony losowo-->
    <v-row v-if="!questionList" class="text-center">
      <v-col cols="12" sm="6" md="3">
        <v-btn
          class="mb-4"
          color="primary"
          block
          @click="infinity = false; questionList = new OrderedQuestionList(questionsData, questionRange);"
        >
          Pojedyńczy po kolei
        </v-btn>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-btn
          class="mb-4"
          color="primary"
          block
          @click="infinity = false; questionList = new RandomizedQuestionList(questionsData, questionRange);"
        >
          Pojedyńczy losowo
        </v-btn>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-btn
          class="mb-4"
          color="primary"
          block
          @click="infinity = true; questionList = new OrderedQuestionList(questionsData, questionRange);"
        >
          Nieskończony po kolei
        </v-btn>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-btn
          class="mb-4"
          color="primary"
          block
          @click="infinity = true; questionList = new RandomizedQuestionList(questionsData, questionRange);"
        >
          Nieskończony losowo
        </v-btn>
      </v-col>
    </v-row>

    <question-view
      v-if="questionList"
      :question-list="questionList"
      :infinite="infinity"
      @reset="questionList = null"></question-view>
  </v-container>
</template>

<script setup lang="ts">
import type QuestionsData from '../model/questionData';
import QuestionRange from '../model/questionRange';
import type QuestionList from '../services/questionList';
import { ref } from 'vue';
import OrderedQuestionList from '../services/orderedQuestionList';
import RandomizedQuestionList from '../services/randomizedQuestionList';
import QuestionsDataJson from '../data/questions.json';

const questionRange = new QuestionRange(0, 199);
const questionsData = QuestionsDataJson as QuestionsData;

const infinity = ref<boolean>(false);
const questionList = ref<QuestionList|null>(null);
</script>
