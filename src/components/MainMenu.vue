<template>
  <v-row class="justify-center">
    <v-col cols="12" lg="4" md="6">
      <v-card class="mb-6">
        <v-card-title class="text-center">
          Nauka
        </v-card-title>
        <v-card-text>
          <v-btn
            v-if="props.canLoad"
            block
            class="mb-2"
            color="primary"
            @click="emit('load')"
          >
            Kontynuuj
          </v-btn>
          <v-divider v-if="props.canLoad" class="mb-4" />
          <v-switch
            v-model="learnOptions.infinite"
            color="primary"
            hide-details
            :label="learnOptions.infinite ? 'Nieskończony' : 'Pojedyńczy'"
          />
          <v-switch
            v-model="learnOptions.randomized"
            color="primary"
            hide-details
            :label="learnOptions.randomized ? 'Losowo' : 'Po kolei'"
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
                <div>
                  <div class="text-subtitle-2 mb-1">Zakres pytań</div>
                  <QuestionRangeSelector v-model="learnOptions.questionRange" />
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-btn
            block
            class="mt-4"
            color="primary"
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
            block
            color="secondary"
            @click="emit('exam')"
          >
            Rozpocznij egzamin
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
  import type { LearnOptions } from '../model/learnOptions'

  import { defineEmits, ref } from 'vue'
  import QuestionRangeSelector from './QuestionRangeSelector.vue'

  const props = defineProps<{
    canLoad?: boolean
  }>()

  const emit = defineEmits<{
    (e: 'learn', params: LearnOptions): void
    (e: 'load' | 'exam'): void
  }>()

  const LEARN_OPTIONS_KEY = 'learnOptions'
  const defaultLearnOptions: LearnOptions = {
    infinite: false,
    randomized: false,
    showQuestionNumber: 'after',
    showSource: 'after',
    questionRange: '',
  }
  const learnOptions = ref<LearnOptions>(loadLearnOptions())

  function loadLearnOptions () {
    const savedOptions = localStorage.getItem(LEARN_OPTIONS_KEY)
    const options: LearnOptions = { ...defaultLearnOptions }
    if (savedOptions) {
      Object.assign(options, JSON.parse(savedOptions))
    }
    // Make sure questionRange is not undefined
    if (!options.questionRange) {
      options.questionRange = defaultLearnOptions.questionRange
    }
    return options
  }

  function emitLearnOptions () {
    localStorage.setItem(LEARN_OPTIONS_KEY, JSON.stringify(learnOptions.value))
    emit('learn', learnOptions.value)
  }
</script>
