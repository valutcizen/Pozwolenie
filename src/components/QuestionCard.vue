<template>
  <v-card
    :title="cardTitle"
    style="min-width: 200px; max-width: 800px; margin: 0 auto;"
    variant="tonal"
  >
    <v-card-text>
      <div style="font-size: 1.1em; margin-bottom: 20px;">
        {{ question.question }}
      </div>
      <v-list>
        <v-list-item
          v-for="(answer, index) in question.answers"
          :key="index"
          @click="(answerSelected === undefined || examMode) && $emit('answer', index)"
          :class="getAnswerClass(index)"
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
          :disabled="answerSelected === undefined || (!infinite && question?.is_last)"
          @click="$emit('next')"
          block
        >
          Następne
        </v-btn>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { IndexedQuestion } from '../model/indexedQuestion';

const props = defineProps<{
  question: IndexedQuestion;
  answerSelected: number | undefined;
  infinite: boolean;
  examMode: boolean;
  cardTitle: string;
}>();
defineEmits(['answer', 'next']);

function getAnswerClass(index: number) {
  if (props.answerSelected === undefined) {
    return 'grey-darken-4';
  }
  if (props.examMode) {
    return index === props.answerSelected ? 'bg-blue-lighten-3' : 'grey-darken-4';
  }
  if (index === props.question.correct) {
    return 'bg-green-lighten-3';
  }
  if (index === props.answerSelected && props.answerSelected !== props.question.correct) {
    return 'bg-red-lighten-3';
  }
  return 'grey-darken-4';
}
</script>