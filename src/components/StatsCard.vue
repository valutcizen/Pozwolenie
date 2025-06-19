<template>
  <v-card class="mt-8">
    <v-card-title class="text-center">Statystyki</v-card-title>
    <v-card-text class="text-center">
      <p>Czas zapisany: {{ stats.sessionsTime }}</p>
      <p>Odpowiedzi: {{ stats.totalQuestions }}</p>
      <p>Odpowiedzi poprawne: {{ stats.correctAnswers }}</p>
      <p>Odpowiedzi błędne: {{ stats.incorrectAnswers }}</p>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type StatsData from '../../model/statsData';
defineProps<{ stats: StatsData }>();
</script>