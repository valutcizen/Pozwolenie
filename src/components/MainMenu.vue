<template>
  <v-row class="justify-center">
    <v-col cols="12" md="6" lg="4">
      <v-card class="mb-6">
        <v-card-title class="text-center">Nauka</v-card-title>
        <v-card-text>
          <v-btn
            class="mb-3"
            color="primary"
            block
            @click="emitLearn(false, false)"
          >
            Pojedyńczy po kolei
          </v-btn>
          <v-btn
            class="mb-3"
            color="primary"
            block
            @click="emitLearn(false, true)"
          >
            Pojedyńczy losowo
          </v-btn>
          <v-btn
            class="mb-3"
            color="primary"
            block
            @click="emitLearn(true, false)"
          >
            Nieskończony po kolei
          </v-btn>
          <v-btn
            color="primary"
            block
            @click="emitLearn(true, true)"
          >
            Nieskończony losowo
          </v-btn>
        </v-card-text>
      </v-card>
      <v-card>
        <v-card-title class="text-center">Egzamin</v-card-title>
        <v-card-text>
          <v-btn
            color="secondary"
            block
            @click="emitExam"
          >
            Rozpocznij egzamin
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';

const emit = defineEmits<{
  (e: 'learn', params: { infinite: boolean; randomized: boolean }): void;
  (e: 'exam'): void;
}>();

function emitLearn(infinite: boolean, randomized: boolean) {
  emit('learn', { infinite, randomized });
}

function emitExam() {
  emit('exam');
}
</script>