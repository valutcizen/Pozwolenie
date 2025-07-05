<template>
  <v-row class="justify-center">
    <v-col cols="12" md="6" lg="4">
      <v-card class="mb-6">
        <v-card-title class="text-center">Nauka</v-card-title>
        <v-card-text>
          <v-switch
            v-model="learnOptions.infinite"
            :label="learnOptions.infinite ? 'Nieskończony' : 'Pojedyńczy'"
            color="primary"
            hide-details
          />
          <v-switch
            v-model="learnOptions.randomized"
            :label="learnOptions.randomized ? 'Losowo' : 'Po kolei'"
            color="primary"
            hide-details
          />
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-title>Opcje dodatkowe</v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="mb-2">
                  <div class="text-subtitle-2 mb-1">Numer pytania</div>
                  <v-radio-group v-model="learnOptions.showQuestionNumber" density="compact">
                    <v-radio label="Zawsze" value="always" />
                    <v-radio label="Po odpowiedzi" value="after" />
                    <v-radio label="Nigdy" value="never" />
                  </v-radio-group>
                </div>
                <div>
                  <div class="text-subtitle-2 mb-1">Źródło pytania</div>
                  <v-radio-group v-model="learnOptions.showSource" density="compact">
                    <v-radio label="Zawsze" value="always" />
                    <v-radio label="Po odpowiedzi" value="after" />
                    <v-radio label="Nigdy" value="never" />
                  </v-radio-group>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-btn
            class="mt-4"
            color="primary"
            block
            @click="emitLearnOptions"
          >
            Rozpocznij naukę
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
import { ref } from 'vue';
import { defineEmits } from 'vue';
import type { LearnOptions } from '../model/learnOptions';

const emit = defineEmits<{
  (e: 'learn', params: LearnOptions): void;
  (e: 'exam'): void;
}>();

const LEARN_OPTIONS_KEY = 'learnOptions';
const defaultLearnOptions: LearnOptions = {
  infinite: false,
  randomized: false,
  showQuestionNumber: 'after',
  showSource: 'after',
};
const learnOptions = ref<LearnOptions>(loadLearnOptions());

function loadLearnOptions() {
  const savedOptions = localStorage.getItem(LEARN_OPTIONS_KEY);
  let options: LearnOptions = { ...defaultLearnOptions };
  if (savedOptions) {
    Object.assign(options, JSON.parse(savedOptions));
  }
  return options;
}

function emitLearnOptions() {
  localStorage.setItem(LEARN_OPTIONS_KEY, JSON.stringify(learnOptions.value));
  emit('learn', learnOptions.value);
}

function emitExam() {
  emit('exam');
}
</script>