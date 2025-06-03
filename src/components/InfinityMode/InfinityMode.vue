<template>
  <v-container class="fill-height" max-width="900">
    <div>
      <v-row>
        <v-col cols="12">
          <h1 class="text-center">{{ data.version }}</h1>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
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

</script>
