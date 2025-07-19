<template>
  <QuestionCard
    :question="question"
    :answer-selected="answerSelected"
    :infinite="options.infinite"
    :exam-mode="false"
    :card-title="cardTitle"
    :show-source="showSource"
    @answer="onAnswerSelected"
    @next="next"
  />
  <StatsCard 
    :stats="stats"
    :clickable="false"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import QuestionCard from './QuestionCard.vue';
import StatsCard from './StatsCard.vue';
import type QuestionList from '../services/questionList';
import type { IndexedQuestion } from '../model/indexedQuestion';
import type StatsData from '../model/statsData';
import type { LearnOptions } from '../model/learnOptions';

const props = defineProps<{
  questionList: QuestionList;
  options: LearnOptions;
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

let question = ref<IndexedQuestion>(props.questionList.getNextQuestion() || errorQuestion);
let answerSelected = ref<undefined|number>(undefined);
let stats = ref<StatsData>(props.questionList.getStats());

function onAnswerSelected(value: number) {
  if (value !== undefined) {
    props.questionList.answered(question.value.correct === value);
  }
  answerSelected.value = value;
  stats.value = props.questionList.getStats();
  emit('answered', stats.value);
}

function next() {
  if (answerSelected.value !== undefined) {
    if (props.options.infinite && question.value.is_last) {
      props.questionList.reset();
    }
    question.value = props.questionList.getNextQuestion() || errorQuestion;
    answerSelected.value = undefined;
  }
}

const showSource = computed(() => {
  return props.options.showSource === 'always' || (props.options.showSource === 'after' && answerSelected.value !== undefined);
});

const cardTitle = computed(() => {
  return props.options.showQuestionNumber === 'always' || (props.options.showQuestionNumber === 'after' && answerSelected.value !== undefined)
    ? `Pytanie ${question.value.index + 1}`
    : 'Pytanie';
});
</script>