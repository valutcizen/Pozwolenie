<template>
  <QuestionCard
    v-if="currentIndex < questions.length"
    :question="questions[currentIndex]"
    :answer-selected="answerSelected"
    :infinite="false"
    :exam-mode="true"
    :card-title="'Pytanie ' + (currentIndex + 1) + ' z ' + questions.length"
    @answer="onAnswerSelected"
    @next="next"
  />
  <StatsCard v-else :stats="stats" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import QuestionCard from './QuestionCard.vue';
import StatsCard from './StatsCard.vue';
import type QuestionList from '../../services/questionList';
import type { IndexedQuestion } from '../../model/indexedQuestion';
import type StatsData from '../../model/statsData';

const props = defineProps<{
  questionList: QuestionList;
}>();

const emit = defineEmits<{
  (e: 'answered', stats: StatsData): void;
  (e: 'reset'): void;
}>();

const errorQuestion = {
  question: 'Błąd wczytywania pytania',
  answers: [''],
  correct: 0,
  is_last: true,
  index: 0
} as IndexedQuestion;

// Prepare first 20 questions
const questions = ref<IndexedQuestion[]>(
  Array.from({ length: 20 }, () => props.questionList.getNextQuestion() || errorQuestion)
);

let currentIndex = ref(0);
let answerSelected = ref<undefined | number>(undefined);
let stats = ref<StatsData>(props.questionList.getStats());

function onAnswerSelected(value: number) {
  if (value !== undefined) {
    props.questionList.answered(questions.value[currentIndex.value].correct === value);
  }
  answerSelected.value = value;
  stats.value = props.questionList.getStats();
  emit('answered', stats.value);
}

function next() {
  if (answerSelected.value !== undefined) {
    currentIndex.value++;
    answerSelected.value = undefined;
  }
}
</script>