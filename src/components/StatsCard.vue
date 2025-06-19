<template>
  <v-card
    class="mt-8"
    style="min-width: 200px; max-width: 800px; margin: 0 auto;"
    variant="tonal"
  >
    <v-expansion-panels variant="accordion">
      <v-expansion-panel>
        <v-expansion-panel-title>
          <div class="w-100 d-flex flex-column flex-md-row justify-space-between align-center">
            <span>Statystyki</span>
            <span>
              ✅ {{ goodSum }}
              &nbsp;❌ {{ badSum }}
              &nbsp;({{ percentGood }}%)
              &nbsp;⏱️ {{ time }}
            </span>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-table density="compact">
            <thead>
              <tr>
                <th>Pytanie</th>
                <th>✅</th>
                <th>❌</th>
                <th>% poprawnych</th>
              </tr>
            </thead>
              <tbody>
                <tr
                  v-for="item in filteredStats"
                  :key="item.idx"
                  :style="props.clickable ? 'cursor:pointer' : ''"
                  @click="emit('rowClick', item.idx)"
                >
                  <td>{{ item.questionIdx + 1 }}</td>
                  <td>
                    <span v-if="item.correct > 0">✅</span>
                    <span v-if="item.correct > 1">({{ item.correct }})</span>
                  </td>
                  <td>
                    <span v-if="item.incorrect > 0">❌</span>
                    <span v-if="item.incorrect > 1">({{ item.incorrect }})</span>
                  </td>
                  <td>
                    <span v-if="item.correct + item.incorrect > 0">
                      {{ Math.round((item.correct / (item.correct + item.incorrect)) * 100) }}%
                    </span>
                    <span v-else>-</span>
                  </td>
                </tr>
              </tbody>
          </v-table>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import type StatsData from '../model/statsData';

const props = defineProps<{
  stats: StatsData,
  clickable: boolean,
  timeOverride?: number
}>();
const emit = defineEmits<{
  (e: 'rowClick', idx: number): void;
}>();

const now = ref(Date.now());

onMounted(() => {
  const interval = setInterval(() => {
    now.value = Date.now();
  }, 1000);
  onUnmounted(() => clearInterval(interval));
});

const goodSum = computed(() =>
  props.stats.correctAnswers.reduce((sum, q) => sum + q, 0)
);

const badSum = computed(() =>
  props.stats.incorrectAnswers.reduce((sum, q) => sum + q, 0)
);

const percentGood = computed(() =>
  goodSum.value + badSum.value > 0
    ? Math.round((goodSum.value / (goodSum.value + badSum.value)) * 100)
    : 0
);

const time = computed(() => {
  let totalTime = props.stats.sessionsTime || 0;
  if (props.stats.currentSessionStartTime && props.stats.currentSessionStartTime > 0) {
    totalTime += now.value - props.stats.currentSessionStartTime;
  }
  if (props.timeOverride) {
    totalTime = props.timeOverride;
  }
  const minutes = Math.floor(totalTime / 60000);
  const seconds = Math.floor((totalTime % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
});

const filteredStats = computed(() =>
  props.stats.correctAnswers
    .map((c, idx) => ({
      idx,
      questionIdx: props.stats.questionIdx[idx],
      correct: c,
      incorrect: props.stats.incorrectAnswers[idx]
    }))
    .filter(item => item.correct > 0 || item.incorrect > 0)
);
</script>
