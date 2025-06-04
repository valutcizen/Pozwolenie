<template>
  <v-card
    :title="'Pytanie nr ' + (question.index + 1)"
    style="min-width: 200px; max-width: 800px; margin: 0 auto;"
    variant="tonal">
    <v-card-text>
      <div style="font-size: 1.1em; margin-bottom: 20px;">
        {{ question.question }}
      </div>
      <v-list>
        <v-list-item
          v-for="(answer, index) in question.answers"
          :key="index"
          @click="answerSelected === undefined && (answerSelected = index)"
          :class="{
            'bg-green-lighten-3': answerSelected !== undefined && index === question.correct,
            'bg-red-lighten-3': answerSelected !== undefined && index === answerSelected && answerSelected !== question.correct,
            'grey-darken-4': answerSelected === undefined || (index !== question.correct && index !== answerSelected),
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
        <v-btn 
          class="mx-2" 
          :disabled="answerSelected === undefined || (!infinite && question?.is_last)"
          @click="next"
          block
        >
          Następne
        </v-btn>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { defineProps } from 'vue';
import type QuestionList from '../../services/questionList';
import type { IndexedQuestion } from '../../model/indexedQuestion';

const props = defineProps<{
  questionList: QuestionList;
  infinite: boolean;
}>();

const errorQuestion = {
  question: 'Błąd wczytywania pytania',
  answers: [''],
  correct: 0,
  is_last: true
} as IndexedQuestion;

let question = ref<IndexedQuestion>(props.questionList.getNextQuestion() || errorQuestion);
let answerSelected = ref<undefined|number>(undefined);

function next() {
  if (answerSelected.value !== undefined) {
    if (props.infinite && question.value.is_last) {
      props.questionList.reset();
    }

    question.value = props.questionList.getNextQuestion() || errorQuestion;
    answerSelected.value = undefined;
  }
}

</script>
